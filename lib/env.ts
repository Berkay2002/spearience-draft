import { z } from 'zod'

// Define the environment schema with validation
const envSchema = z.object({
  // Website Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Chrish Fernando'),
  
  // Email Service (SendGrid)
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email().optional(),
  SENDGRID_FROM_NAME: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email(),
  
  // Alternative Email Service (AWS SES)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SES_FROM_EMAIL: z.string().email().optional(),
  
  // Google Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  
  // Form Security
  CONTACT_FORM_SECRET: z.string().min(32),
  RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/).transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/).transform(Number).default('5'),
  
  // Cookie Configuration
  NEXT_PUBLIC_COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECRET: z.string().min(32),
  
  // Development
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_DEBUG: z.string().transform(val => val === 'true').default('false'),
  
  // Optional: reCAPTCHA
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
  
  // Optional: Database
  DATABASE_URL: z.string().optional(),
  
  // Optional: Redis
  REDIS_URL: z.string().optional(),
})

// Parse and validate environment variables
function parseEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      )
      throw new Error(
        `Environment validation failed:\n${errorMessages.join('\n')}`
      )
    }
    throw error
  }
}

// Export validated environment variables
export const env = parseEnv()

// Type for environment variables
export type Env = z.infer<typeof envSchema>

// Helper functions for specific configurations
export const emailConfig = {
  // SendGrid configuration
  sendgrid: {
    apiKey: env.SENDGRID_API_KEY,
    fromEmail: env.SENDGRID_FROM_EMAIL,
    fromName: env.SENDGRID_FROM_NAME,
    isConfigured: Boolean(env.SENDGRID_API_KEY && env.SENDGRID_FROM_EMAIL),
  },
  
  // AWS SES configuration
  aws: {
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    fromEmail: env.AWS_SES_FROM_EMAIL,
    isConfigured: Boolean(
      env.AWS_REGION && 
      env.AWS_ACCESS_KEY_ID && 
      env.AWS_SECRET_ACCESS_KEY && 
      env.AWS_SES_FROM_EMAIL
    ),
  },
  
  // Contact email settings
  contact: {
    toEmail: env.CONTACT_TO_EMAIL,
  },
}

export const analyticsConfig = {
  ga: {
    measurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    isConfigured: Boolean(env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  },
}

export const securityConfig = {
  contactForm: {
    secret: env.CONTACT_FORM_SECRET,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  cookies: {
    domain: env.NEXT_PUBLIC_COOKIE_DOMAIN,
    secret: env.COOKIE_SECRET,
  },
  recaptcha: {
    siteKey: env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    secretKey: env.RECAPTCHA_SECRET_KEY,
    isConfigured: Boolean(
      env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && 
      env.RECAPTCHA_SECRET_KEY
    ),
  },
}

export const siteConfig = {
  url: env.NEXT_PUBLIC_SITE_URL,
  name: env.NEXT_PUBLIC_SITE_NAME,
  debug: env.NEXT_PUBLIC_DEBUG,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
}

// Utility function to check if required email service is configured
export function getConfiguredEmailService(): 'sendgrid' | 'aws' | null {
  if (emailConfig.sendgrid.isConfigured) {
    return 'sendgrid'
  }
  if (emailConfig.aws.isConfigured) {
    return 'aws'
  }
  return null
}

// Validation helper for runtime checks
export function validateEmailConfiguration(): boolean {
  const service = getConfiguredEmailService()
  if (!service) {
    console.warn('No email service configured. Email functionality will be disabled.')
    return false
  }
  
  console.log(`Email service configured: ${service}`)
  return true
}

export function validateAnalyticsConfiguration(): boolean {
  if (!analyticsConfig.ga.isConfigured) {
    console.warn('Google Analytics not configured. Analytics will be disabled.')
    return false
  }
  
  console.log('Google Analytics configured')
  return true
} 