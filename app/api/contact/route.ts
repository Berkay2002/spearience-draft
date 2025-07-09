import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { sendContactNotification, sendAutoResponse, testEmailConfiguration } from '@/lib/email'
import { z } from 'zod'

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Max 5 requests per window
  maxRequestsPerDay: 20 // Max 20 requests per day
}

// Spam protection keywords
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'lottery', 'winner', 'congratulations',
  'urgent', 'act now', 'limited time', 'click here', 'free money',
  'make money fast', 'work from home', 'get paid', 'earn cash',
  'no experience needed', 'guaranteed', '100%', 'risk free'
]

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('remote-addr')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIP || remoteAddr || 'unknown'
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const key = `rate_limit_${ip}`
  const dayKey = `daily_limit_${ip}`
  
  // Clean up expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
  
  // Check daily limit
  const dailyLimit = rateLimitStore.get(dayKey)
  if (dailyLimit && dailyLimit.resetTime > now && dailyLimit.count >= RATE_LIMIT.maxRequestsPerDay) {
    return { allowed: false, resetTime: dailyLimit.resetTime }
  }
  
  // Check window limit
  const windowLimit = rateLimitStore.get(key)
  if (windowLimit && windowLimit.resetTime > now && windowLimit.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, resetTime: windowLimit.resetTime }
  }
  
  // Update counters
  const windowResetTime = now + RATE_LIMIT.windowMs
  const dayResetTime = now + (24 * 60 * 60 * 1000) // 24 hours
  
  rateLimitStore.set(key, {
    count: windowLimit ? windowLimit.count + 1 : 1,
    resetTime: windowResetTime
  })
  
  rateLimitStore.set(dayKey, {
    count: dailyLimit ? dailyLimit.count + 1 : 1,
    resetTime: (dailyLimit && dailyLimit.resetTime > now) ? dailyLimit.resetTime : dayResetTime
  })
  
  return { allowed: true }
}

// Spam detection
function detectSpam(data: ContactFormData): { isSpam: boolean; reason?: string } {
  const { name, email, message } = data
  
  // Check for spam keywords
  const fullText = `${name} ${email} ${message}`.toLowerCase()
  const foundSpamKeywords = SPAM_KEYWORDS.filter(keyword => fullText.includes(keyword))
  
  if (foundSpamKeywords.length > 0) {
    return { isSpam: true, reason: `Spam keywords detected: ${foundSpamKeywords.join(', ')}` }
  }
  
  // Check for excessive links
  const linkCount = (message.match(/https?:\/\//g) || []).length
  if (linkCount > 2) {
    return { isSpam: true, reason: 'Too many links in message' }
  }
  
  // Check for repeated characters (common in spam)
  const repeatedChars = /(.)\1{10,}/.test(message)
  if (repeatedChars) {
    return { isSpam: true, reason: 'Excessive repeated characters' }
  }
  
  // Check message length ratio
  if (message.length > 2000 && name.length < 3) {
    return { isSpam: true, reason: 'Suspicious message-to-name ratio' }
  }
  
  // Check for all caps (excluding acronyms)
  const wordsInCaps = message.split(' ').filter(word => 
    word.length > 3 && word === word.toUpperCase()
  ).length
  
  const totalWords = message.split(' ').length
  if (totalWords > 10 && wordsInCaps / totalWords > 0.5) {
    return { isSpam: true, reason: 'Excessive use of capital letters' }
  }
  
  return { isSpam: false }
}

// Validate honeypot field (client should never fill this)
function validateHoneypot(body: any): boolean {
  return !body.honeypot || body.honeypot === ''
}

// Validate submission timing (too fast submissions are likely bots)
function validateSubmissionTiming(body: any): boolean {
  if (!body.startTime) return true // Allow if no timing data
  
  const submissionTime = Date.now()
  const startTime = parseInt(body.startTime, 10)
  const timeTaken = submissionTime - startTime
  
  // Must take at least 3 seconds to fill form (human behavior)
  return timeTaken >= 3000
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Content-Security-Policy', "default-src 'self'")
  
  return response
}

// POST handler for contact form submission
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    
    // Check rate limiting
    const rateLimitResult = checkRateLimit(clientIP)
    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      )
      
      if (rateLimitResult.resetTime) {
        response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString())
      }
      
      return addSecurityHeaders(response)
    }
    
    // Parse request body
    const body = await request.json()
    
    // Validate honeypot (anti-bot protection)
    if (!validateHoneypot(body)) {
      console.log(`Honeypot triggered from IP: ${clientIP}`)
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: 'Invalid submission detected.' },
          { status: 400 }
        )
      )
    }
    
    // Validate submission timing
    if (!validateSubmissionTiming(body)) {
      console.log(`Suspicious timing from IP: ${clientIP}`)
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: 'Submission too fast. Please try again.' },
          { status: 400 }
        )
      )
    }
    
    // Validate form data with Zod schema
    const validationResult = contactFormSchema.safeParse({
      name: body.name,
      email: body.email,
      message: body.message,
      preferredMethod: body.preferredMethod
    })
    
    if (!validationResult.success) {
      return addSecurityHeaders(
        NextResponse.json(
          { 
            success: false, 
            error: 'Invalid form data.',
            details: validationResult.error.errors
          },
          { status: 400 }
        )
      )
    }
    
    const formData = validationResult.data
    
    // Spam detection
    const spamCheck = detectSpam(formData)
    if (spamCheck.isSpam) {
      console.log(`Spam detected from IP ${clientIP}: ${spamCheck.reason}`)
      
      // Return success to user but don't actually process (honeypot approach)
      return addSecurityHeaders(
        NextResponse.json(
          { success: true, message: 'Message received successfully.' },
          { status: 200 }
        )
      )
    }
    
    // Log successful submission (in production, save to database)
    const submissionTime = new Date().toISOString()
    console.log('Valid contact form submission:', {
      ip: clientIP,
      name: formData.name,
      email: formData.email,
      preferredMethod: formData.preferredMethod,
      messageLength: formData.message.length,
      timestamp: submissionTime
    })
    
    // Send notification email to Chrish
    try {
      const notificationResult = await sendContactNotification(formData, {
        submissionTime,
        senderIP: clientIP
      })
      
      if (!notificationResult.success) {
        console.error('Failed to send notification email:', notificationResult.error)
        // Continue processing - don't fail the submission if email fails
      } else {
        console.log('Notification email sent successfully:', notificationResult.messageId)
      }
    } catch (error) {
      console.error('Error sending notification email:', error)
      // Continue processing - don't fail the submission if email fails
    }
    
    // Send auto-response to user (if enabled)
    try {
      const autoResponseResult = await sendAutoResponse(formData)
      
      if (!autoResponseResult.success) {
        console.error('Failed to send auto-response email:', autoResponseResult.error)
        // Continue processing - don't fail the submission if auto-response fails
      } else {
        console.log('Auto-response email sent successfully:', autoResponseResult.messageId)
      }
    } catch (error) {
      console.error('Error sending auto-response email:', error)
      // Continue processing - don't fail the submission if auto-response fails
    }
    
    return addSecurityHeaders(
      NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your message! I\'ll get back to you within 24 hours.' 
        },
        { status: 200 }
      )
    )
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    return addSecurityHeaders(
      NextResponse.json(
        { 
          success: false, 
          error: 'An unexpected error occurred. Please try again later.' 
        },
        { status: 500 }
      )
    )
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return addSecurityHeaders(
    new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
          ? 'https://yourdomain.com' 
          : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    })
  )
}

// GET handler for email configuration testing (development only)
export async function GET() {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return addSecurityHeaders(
      NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      )
    )
  }
  
  try {
    const configTest = await testEmailConfiguration()
    
    return addSecurityHeaders(
      NextResponse.json(
        {
          emailConfiguration: configTest,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        },
        { status: 200 }
      )
    )
    
  } catch (error) {
    console.error('Email configuration test error:', error)
    
    return addSecurityHeaders(
      NextResponse.json(
        { 
          error: 'Failed to test email configuration',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    )
  }
}

export async function PUT() {
  return addSecurityHeaders(
    NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  )
}

export async function DELETE() {
  return addSecurityHeaders(
    NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  )
} 