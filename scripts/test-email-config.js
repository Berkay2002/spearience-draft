#!/usr/bin/env node

/**
 * Email Configuration Test Script
 * Tests the email service configuration for auto-response functionality
 * 
 * Usage: node scripts/test-email-config.js
 */

async function testEmailConfig() {
  console.log('🧪 Testing Email Configuration...\n')
  
  try {
    // Test the GET endpoint for email configuration
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error(`❌ Request failed with status: ${response.status}`)
      const error = await response.text()
      console.error('Error details:', error)
      return
    }
    
    const result = await response.json()
    
    console.log('📧 Email Configuration Status:')
    console.log('├─ Provider:', result.emailConfiguration.provider)
    console.log('├─ Configured:', result.emailConfiguration.isConfigured ? '✅' : '❌')
    console.log('├─ Environment:', result.environment)
    console.log('└─ Timestamp:', result.timestamp)
    
    if (!result.emailConfiguration.isConfigured) {
      console.log('\n⚠️  Configuration Issues:')
      result.emailConfiguration.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
      
      console.log('\n📋 Setup Instructions:')
      console.log('   1. Copy .env.example to .env.local')
      console.log('   2. Set EMAIL_PROVIDER=sendgrid')
      console.log('   3. Add your SENDGRID_API_KEY')
      console.log('   4. Set SENDGRID_FROM_EMAIL and SENDGRID_FROM_NAME')
      console.log('   5. Set CONTACT_RECIPIENT_EMAIL')
      console.log('   6. Set SEND_AUTO_RESPONSE=true')
    } else {
      console.log('\n✅ Email configuration looks good!')
      console.log('   Auto-response emails should work properly.')
    }
    
  } catch (error) {
    console.error('❌ Failed to test email configuration:', error.message)
    console.log('\n💡 Make sure the development server is running:')
    console.log('   npm run dev')
  }
}

// Run the test
testEmailConfig() 