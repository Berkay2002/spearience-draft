# Environment Configuration Guide

This guide explains how to configure environment variables for Chrish Fernando's professional website.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your actual configuration values
3. Restart your development server

## Required Environment Variables

### Website Configuration
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Chrish Fernando"
```

### Contact Form (Required)
```env
CONTACT_TO_EMAIL=chrish@yourdomain.com
CONTACT_FORM_SECRET=your_32_character_minimum_secret_here
COOKIE_SECRET=your_32_character_minimum_cookie_secret_here
```

## Email Service Configuration

Choose **one** of the following email services:

### Option 1: SendGrid (Recommended)
```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=chrish@yourdomain.com
SENDGRID_FROM_NAME="Chrish Fernando"
```

**Setup Steps:**
1. Create a [SendGrid](https://sendgrid.com) account
2. Generate an API key with "Mail Send" permissions
3. Verify your sender email address
4. Add the API key to your environment

### Option 2: AWS SES
```env
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_SES_FROM_EMAIL=chrish@yourdomain.com
```

**Setup Steps:**
1. Configure AWS SES in your region
2. Verify your email domain
3. Create IAM user with SES permissions
4. Add credentials to environment

## Analytics Configuration

### Google Analytics 4 (Optional)
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Setup Steps:**
1. Create a [Google Analytics](https://analytics.google.com) account
2. Set up a GA4 property for your website
3. Copy the Measurement ID (starts with "G-")
4. Add to environment variables

## Security Configuration

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=5      # Max requests per window
```

### Cookie Settings
```env
NEXT_PUBLIC_COOKIE_DOMAIN=.yourdomain.com  # For production
NEXT_PUBLIC_COOKIE_DOMAIN=localhost        # For development
```

## Optional Configuration

### reCAPTCHA (Spam Protection)
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### Development Settings
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## Environment Files

- `.env.example` - Template with all available options
- `.env.local` - Your local development configuration (not in git)
- `.env.production` - Production configuration (deploy to hosting platform)

## Validation

The application will validate all environment variables on startup. If required variables are missing or invalid, you'll see helpful error messages.

## Security Notes

1. **Never commit `.env.local` or production environment files to git**
2. **Use strong, unique secrets** for `CONTACT_FORM_SECRET` and `COOKIE_SECRET`
3. **Rotate API keys** regularly
4. **Use environment-specific configurations** for different deployment stages

## Hosting Platform Configuration

### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with appropriate values
4. Redeploy your application

### Netlify
1. Go to Site settings > Environment variables
2. Add each variable
3. Trigger a new build

### Other Platforms
Consult your hosting platform's documentation for environment variable configuration.

## Troubleshooting

### Email Not Sending
1. Check that email service credentials are correct
2. Verify sender email is authenticated
3. Check spam folders
4. Review API rate limits

### Analytics Not Working
1. Verify GA4 Measurement ID format (starts with "G-")
2. Check that cookies are accepted
3. Ensure domain is configured in GA4
4. Test in incognito mode

### Build Errors
1. Check all required environment variables are set
2. Verify secret keys meet minimum length requirements
3. Ensure URL format is valid for `NEXT_PUBLIC_SITE_URL`

## Support

For issues with environment configuration, check:
1. The console for validation error messages
2. Network tab for failed API requests
3. Browser developer tools for client-side errors 