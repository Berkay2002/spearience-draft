import { type ContactFormData } from '@/lib/validations'

// Email service configuration
interface EmailConfig {
  provider: 'sendgrid' | 'aws-ses' | 'smtp'
  sendgrid?: {
    apiKey: string
    fromEmail: string
    fromName: string
  }
  awsSes?: {
    region: string
    accessKeyId: string
    secretAccessKey: string
    fromEmail: string
    fromName: string
  }
  smtp?: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
    fromEmail: string
    fromName: string
  }
}

// Email template data
interface EmailTemplateData {
  recipientName: string
  senderName: string
  senderEmail: string
  message: string
  preferredMethod: string
  submissionTime: string
  senderIP?: string
}

// Email service response
interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// Get email configuration from environment variables
function getEmailConfig(): EmailConfig {
  const provider = (process.env.EMAIL_PROVIDER || 'sendgrid') as 'sendgrid' | 'aws-ses' | 'smtp'
  
  const config: EmailConfig = { provider }
  
  switch (provider) {
    case 'sendgrid':
      config.sendgrid = {
        apiKey: process.env.SENDGRID_API_KEY || '',
        fromEmail: process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || '',
        fromName: process.env.SENDGRID_FROM_NAME || process.env.FROM_NAME || 'Website Contact Form'
      }
      break
    
    case 'aws-ses':
      config.awsSes = {
        region: process.env.AWS_SES_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        fromEmail: process.env.AWS_SES_FROM_EMAIL || process.env.FROM_EMAIL || '',
        fromName: process.env.AWS_SES_FROM_NAME || process.env.FROM_NAME || 'Website Contact Form'
      }
      break
    
    case 'smtp':
      config.smtp = {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        },
        fromEmail: process.env.SMTP_FROM_EMAIL || process.env.FROM_EMAIL || '',
        fromName: process.env.SMTP_FROM_NAME || process.env.FROM_NAME || 'Website Contact Form'
      }
      break
  }
  
  return config
}

// Generate professional email templates
function generateNotificationEmailHTML(data: EmailTemplateData): string {
  const { senderName, senderEmail, message, preferredMethod, submissionTime, senderIP } = data
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #555; margin-bottom: 5px; display: block; }
        .value { background: #f8f9fa; padding: 12px; border-radius: 4px; border-left: 4px solid #667eea; }
        .message-content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; white-space: pre-wrap; }
        .metadata { background: #e9ecef; padding: 15px; border-radius: 4px; font-size: 14px; color: #666; margin-top: 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #e9ecef; }
        .priority { background: #d4edda; border-left-color: #28a745; color: #155724; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 New Contact Form Submission</h1>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">👤 Name:</span>
                <div class="value">${senderName}</div>
            </div>
            
            <div class="field">
                <span class="label">📧 Email:</span>
                <div class="value"><a href="mailto:${senderEmail}">${senderEmail}</a></div>
            </div>
            
            <div class="field">
                <span class="label">📞 Preferred Contact Method:</span>
                <div class="value priority">${getContactMethodDisplay(preferredMethod)}</div>
            </div>
            
            <div class="field">
                <span class="label">💬 Message:</span>
                <div class="message-content">${message}</div>
            </div>
            
            <div class="metadata">
                <strong>📊 Submission Details:</strong><br>
                🕒 Time: ${submissionTime}<br>
                🌐 IP Address: ${senderIP || 'Unknown'}<br>
                📝 Message Length: ${message.length} characters
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent via the contact form on your website.</p>
            <p><strong>Reply directly to this email to respond to ${senderName}</strong></p>
        </div>
    </div>
</body>
</html>
  `
}

function generateNotificationEmailText(data: EmailTemplateData): string {
  const { senderName, senderEmail, message, preferredMethod, submissionTime, senderIP } = data
  
  return `
NEW CONTACT FORM SUBMISSION

Name: ${senderName}
Email: ${senderEmail}
Preferred Contact Method: ${getContactMethodDisplay(preferredMethod)}

Message:
${message}

---
Submission Details:
Time: ${submissionTime}
IP Address: ${senderIP || 'Unknown'}
Message Length: ${message.length} characters

Reply directly to this email to respond to ${senderName}.
  `.trim()
}

function generateAutoResponseEmailHTML(data: EmailTemplateData): string {
  const { recipientName } = data
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Message</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .highlight { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #e9ecef; }
        .contact-info { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Message Received</h1>
        </div>
        
        <div class="content">
            <h2>Hello ${recipientName},</h2>
            
            <p>Thank you for reaching out! I've received your message and wanted to confirm it arrived safely.</p>
            
            <div class="highlight">
                <strong>📅 What happens next?</strong><br>
                I personally review every message and will respond within 24 hours. For urgent matters, feel free to connect with me directly on LinkedIn.
            </div>
            
            <p>In the meantime, you might be interested in:</p>
            <ul>
                <li>📖 Reading about my <a href="#">recent projects</a></li>
                <li>🎯 Learning more about my <a href="#">methodology</a></li>
                <li>🔗 Connecting on <a href="#">LinkedIn</a></li>
            </ul>
            
            <div class="contact-info">
                <strong>📞 Direct Contact:</strong><br>
                📧 Email: chrish@example.com<br>
                📍 Location: Stockholm, Sweden<br>
                🔗 LinkedIn: linkedin.com/in/chrish-fernando
            </div>
            
            <p>Looking forward to our conversation!</p>
            
            <p>Best regards,<br>
            <strong>Chrish Fernando</strong><br>
            <em>Project Management & Leadership Consultant</em></p>
        </div>
        
        <div class="footer">
            <p>This is an automated response. Please don't reply to this email.</p>
        </div>
    </div>
</body>
</html>
  `
}

function generateAutoResponseEmailText(data: EmailTemplateData): string {
  const { recipientName } = data
  
  return `
Hello ${recipientName},

Thank you for reaching out! I've received your message and wanted to confirm it arrived safely.

What happens next?
I personally review every message and will respond within 24 hours. For urgent matters, feel free to connect with me directly on LinkedIn.

In the meantime, you might be interested in:
- Reading about my recent projects
- Learning more about my methodology  
- Connecting on LinkedIn

Direct Contact:
Email: chrish@example.com
Location: Stockholm, Sweden
LinkedIn: linkedin.com/in/chrish-fernando

Looking forward to our conversation!

Best regards,
Chrish Fernando
Project Management & Leadership Consultant

---
This is an automated response. Please don't reply to this email.
  `.trim()
}

function getContactMethodDisplay(method: string): string {
  const methods: Record<string, string> = {
    email: '📧 Email',
    phone: '📞 Phone Call',
    meeting: '🎥 Video Meeting',
    linkedin: '🔗 LinkedIn Message'
  }
  return methods[method] || method
}

// SendGrid email sending
async function sendEmailWithSendGrid(
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  replyTo?: string
): Promise<EmailResult> {
  const config = getEmailConfig()
  
  if (!config.sendgrid?.apiKey) {
    return { success: false, error: 'SendGrid API key not configured' }
  }
  
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.sendgrid.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: {
          email: config.sendgrid.fromEmail,
          name: config.sendgrid.fromName
        },
        reply_to: replyTo ? { email: replyTo } : undefined,
        content: [
          {
            type: 'text/plain',
            value: textContent
          },
          {
            type: 'text/html',
            value: htmlContent
          }
        ]
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `SendGrid error: ${error}` }
    }
    
    return { success: true, messageId: response.headers.get('x-message-id') || undefined }
    
  } catch (error) {
    return { success: false, error: `SendGrid request failed: ${error}` }
  }
}

// AWS SES email sending (using AWS SDK would be better, but this is a fetch-based approach)
async function sendEmailWithAWSSES(
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  replyTo?: string
): Promise<EmailResult> {
  // Note: In production, use AWS SDK for better integration
  // This is a simplified implementation for demonstration
  return { 
    success: false, 
    error: 'AWS SES integration requires AWS SDK setup. Please use SendGrid or SMTP for now.' 
  }
}

// SMTP email sending (using nodemailer would be ideal, but this is a simplified version)
async function sendEmailWithSMTP(
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  replyTo?: string
): Promise<EmailResult> {
  // Note: In production, use nodemailer for proper SMTP support
  // This is a placeholder for SMTP integration
  return { 
    success: false, 
    error: 'SMTP integration requires nodemailer setup. Please use SendGrid for now.' 
  }
}

// Main email sending function
export async function sendContactNotification(
  formData: ContactFormData,
  submissionDetails: {
    submissionTime: string
    senderIP?: string
  }
): Promise<EmailResult> {
  const config = getEmailConfig()
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || process.env.FROM_EMAIL || ''
  
  if (!recipientEmail) {
    return { success: false, error: 'Recipient email not configured' }
  }
  
  const templateData: EmailTemplateData = {
    recipientName: 'Chrish',
    senderName: formData.name,
    senderEmail: formData.email,
    message: formData.message,
    preferredMethod: formData.preferredMethod,
    submissionTime: submissionDetails.submissionTime,
    senderIP: submissionDetails.senderIP
  }
  
  const subject = `🔔 New Contact: ${formData.name} (${getContactMethodDisplay(formData.preferredMethod)})`
  const htmlContent = generateNotificationEmailHTML(templateData)
  const textContent = generateNotificationEmailText(templateData)
  
  // Send notification email with reply-to set to the sender
  switch (config.provider) {
    case 'sendgrid':
      return sendEmailWithSendGrid(recipientEmail, subject, htmlContent, textContent, formData.email)
    
    case 'aws-ses':
      return sendEmailWithAWSSES(recipientEmail, subject, htmlContent, textContent, formData.email)
    
    case 'smtp':
      return sendEmailWithSMTP(recipientEmail, subject, htmlContent, textContent, formData.email)
    
    default:
      return { success: false, error: 'Invalid email provider configuration' }
  }
}

// Send auto-response to the user
export async function sendAutoResponse(
  formData: ContactFormData
): Promise<EmailResult> {
  const config = getEmailConfig()
  
  // Only send auto-response if enabled
  if (process.env.SEND_AUTO_RESPONSE !== 'true') {
    return { success: true, messageId: 'auto-response-disabled' }
  }
  
  const templateData: EmailTemplateData = {
    recipientName: formData.name,
    senderName: formData.name,
    senderEmail: formData.email,
    message: formData.message,
    preferredMethod: formData.preferredMethod,
    submissionTime: new Date().toISOString()
  }
  
  const subject = `✅ Thank you for reaching out, ${formData.name}!`
  const htmlContent = generateAutoResponseEmailHTML(templateData)
  const textContent = generateAutoResponseEmailText(templateData)
  
  // Send auto-response to the form submitter
  switch (config.provider) {
    case 'sendgrid':
      return sendEmailWithSendGrid(formData.email, subject, htmlContent, textContent)
    
    case 'aws-ses':
      return sendEmailWithAWSSES(formData.email, subject, htmlContent, textContent)
    
    case 'smtp':
      return sendEmailWithSMTP(formData.email, subject, htmlContent, textContent)
    
    default:
      return { success: true, messageId: 'provider-not-configured' }
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{
  isConfigured: boolean
  provider: string
  errors: string[]
}> {
  const config = getEmailConfig()
  const errors: string[] = []
  
  // Check environment variables
  if (!process.env.CONTACT_RECIPIENT_EMAIL && !process.env.FROM_EMAIL) {
    errors.push('CONTACT_RECIPIENT_EMAIL or FROM_EMAIL not set')
  }
  
  // Check provider-specific configuration
  switch (config.provider) {
    case 'sendgrid':
      if (!config.sendgrid?.apiKey) errors.push('SENDGRID_API_KEY not set')
      if (!config.sendgrid?.fromEmail) errors.push('SENDGRID_FROM_EMAIL or FROM_EMAIL not set')
      break
    
    case 'aws-ses':
      if (!config.awsSes?.accessKeyId) errors.push('AWS_ACCESS_KEY_ID not set')
      if (!config.awsSes?.secretAccessKey) errors.push('AWS_SECRET_ACCESS_KEY not set')
      if (!config.awsSes?.fromEmail) errors.push('AWS_SES_FROM_EMAIL or FROM_EMAIL not set')
      break
    
    case 'smtp':
      if (!config.smtp?.host) errors.push('SMTP_HOST not set')
      if (!config.smtp?.auth.user) errors.push('SMTP_USER not set')
      if (!config.smtp?.auth.pass) errors.push('SMTP_PASS not set')
      if (!config.smtp?.fromEmail) errors.push('SMTP_FROM_EMAIL or FROM_EMAIL not set')
      break
  }
  
  return {
    isConfigured: errors.length === 0,
    provider: config.provider,
    errors
  }
} 