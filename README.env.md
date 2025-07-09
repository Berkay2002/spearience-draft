# Environment Configuration Guide

This document provides a comprehensive guide for configuring environment variables for the Chrish Fernando website.

## Quick Setup

1. Copy `.env.example` to `.env.local`
2. Configure your email service provider
3. Set your contact recipient email
4. Test the contact form

## Email Service Configuration

### Email Provider Selection

Set the email service provider using:
```bash
EMAIL_PROVIDER=sendgrid  # or aws-ses, smtp
```

### Recipient Configuration

```bash
# Where contact form submissions are sent
CONTACT_RECIPIENT_EMAIL=chrish@example.com

# Fallback sender configuration
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME="Chrish Fernando - Website"
```

## SendGrid Setup (Recommended)

SendGrid offers reliable email delivery with generous free tier limits.

### 1. Account Setup
1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your email address
3. Complete sender authentication

### 2. API Key Creation
1. Go to Settings → API Keys
2. Create a new API key with **Mail Send** permissions
3. Copy the API key securely

### 3. Environment Variables
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME="Chrish Fernando - Website"
CONTACT_RECIPIENT_EMAIL=chrish@example.com
```

### 4. Domain Authentication (Production)
1. In SendGrid, go to Settings → Sender Authentication
2. Authenticate your domain
3. Add DNS records as instructed
4. Use your authenticated domain in `SENDGRID_FROM_EMAIL`

## AWS SES Setup

AWS SES provides enterprise-grade email delivery integrated with AWS services.

### 1. AWS Account Setup
1. Ensure you have an AWS account
2. Navigate to AWS SES console
3. Verify your email address or domain

### 2. IAM Permissions
Create an IAM user with `AmazonSESFullAccess` policy or custom permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

### 3. Environment Variables
```bash
EMAIL_PROVIDER=aws-ses
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
AWS_SES_FROM_NAME="Chrish Fernando - Website"
CONTACT_RECIPIENT_EMAIL=chrish@example.com
```

### 4. Production Configuration
1. Request production access (removes sending limits)
2. Set up dedicated IP (optional)
3. Configure bounce and complaint handling

## SMTP Setup

Use any SMTP provider (Gmail, Outlook, custom mail server).

### Gmail Example

1. **Enable 2-Factor Authentication**
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Environment Variables:**
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME="Chrish Fernando - Website"
CONTACT_RECIPIENT_EMAIL=chrish@example.com
```

### Other SMTP Providers

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Custom SMTP Server
```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587  # or 465 for SSL
SMTP_SECURE=true  # for port 465
```

## Auto-Response Configuration

Control whether users receive automatic confirmation emails:

```bash
# Enable/disable auto-response emails
SEND_AUTO_RESPONSE=true
```

When enabled, users receive a professional confirmation email after submitting the contact form.

## Email Templates

The system includes two professional email templates:

### 1. Notification Email (to you)
- **Subject:** `🔔 New Contact: [Name] ([Preferred Method])`
- **Content:** Full form submission with metadata
- **Reply-To:** Set to sender's email for easy replies

### 2. Auto-Response Email (to user)
- **Subject:** `✅ Thank you for reaching out, [Name]!`
- **Content:** Professional acknowledgment with next steps
- **From:** Your configured sender email

## Testing Email Configuration

### 1. Configuration Test
The system includes a configuration validator. Check server logs for:
```
Email configuration test: { isConfigured: true, provider: 'sendgrid', errors: [] }
```

### 2. Test Email Delivery
1. Start the development server
2. Submit a test contact form
3. Check server logs for email delivery status
4. Verify email delivery to `CONTACT_RECIPIENT_EMAIL`

### 3. Common Issues

#### SendGrid Issues
- **API Key Invalid:** Ensure key has Mail Send permissions
- **From Email Rejected:** Verify sender authentication
- **Rate Limited:** Check SendGrid usage dashboard

#### AWS SES Issues
- **Access Denied:** Verify IAM permissions
- **Email Not Verified:** Verify sender email in SES console
- **Sandbox Mode:** Request production access for unrestricted sending

#### SMTP Issues
- **Authentication Failed:** Check username/password
- **Connection Timeout:** Verify host and port
- **SSL/TLS Errors:** Check SMTP_SECURE setting

## Security Best Practices

### 1. Environment Variables Security
- Never commit `.env.local` to version control
- Use different credentials for development/production
- Rotate API keys regularly
- Use least-privilege access policies

### 2. Email Security
- Always use verified sender domains
- Implement DKIM, SPF, and DMARC records
- Monitor bounce and complaint rates
- Use HTTPS for all email-related callbacks

### 3. Rate Limiting
The contact form includes built-in rate limiting:
- 5 submissions per 15 minutes per IP
- 20 submissions per day per IP
- Automatic spam detection and filtering

## Search Engine Verification

Configure search engine verification for Google Search Console, Bing Webmaster Tools, and Yandex Webmaster:

```bash
# Google Search Console verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_verification_code

# Bing Webmaster Tools verification  
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_bing_verification_code

# Yandex Webmaster verification
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=your_yandex_verification_code
```

### Getting Verification Codes

#### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (website)
3. Choose "HTML tag" verification method
4. Copy the `content` value from the meta tag
5. Add to `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

#### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Choose "Meta tag" verification
4. Copy the `content` value
5. Add to `NEXT_PUBLIC_BING_SITE_VERIFICATION`

#### Yandex Webmaster
1. Go to [Yandex Webmaster](https://webmaster.yandex.com/)
2. Add your site
3. Choose "Meta tag" verification
4. Copy the `content` value  
5. Add to `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION`

## Production Deployment

### Environment Variables Checklist
```bash
# ✅ Required Variables
NODE_ENV=production
EMAIL_PROVIDER=sendgrid
CONTACT_RECIPIENT_EMAIL=chrish@example.com
SENDGRID_API_KEY=SG.production_key_here
SENDGRID_FROM_EMAIL=noreply@chrishfernando.com
NEXT_PUBLIC_APP_URL=https://chrishfernando.com

# ✅ Optional but Recommended
SEND_AUTO_RESPONSE=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_verification_code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_bing_verification_code
```

### DNS Configuration
For production email delivery, configure these DNS records:

#### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:sendgrid.net ~all
```

#### DKIM Records
Add the DKIM records provided by your email service provider.

#### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

## Monitoring and Maintenance

### 1. Email Delivery Monitoring
- Monitor bounce rates (keep < 5%)
- Track delivery rates (aim for > 95%)
- Set up alerts for delivery failures

### 2. Error Tracking
- Monitor server logs for email errors
- Set up application monitoring (Sentry, etc.)
- Configure health checks for email services

### 3. Regular Maintenance
- Update API keys before expiration
- Review and update email templates
- Monitor spam complaint rates
- Update security configurations

## Support and Troubleshooting

### Common Error Messages

#### "Email provider not configured"
- Check `EMAIL_PROVIDER` environment variable
- Ensure provider-specific variables are set

#### "Recipient email not configured" 
- Set `CONTACT_RECIPIENT_EMAIL` environment variable

#### "Rate limit exceeded"
- User has exceeded submission limits
- Check IP-based rate limiting logs

#### "Spam detected"
- Submission triggered spam filters
- Review spam detection rules in `lib/email.ts`

### Getting Help

1. Check server logs for detailed error messages
2. Verify environment variable configuration
3. Test with email provider's API directly
4. Review email provider documentation
5. Check DNS configuration for domain authentication

For additional support, consult the documentation for your chosen email service provider.

---

## Previous Configuration Sections

[Previous sections about Google Analytics, i18n configuration, etc. remain unchanged] 