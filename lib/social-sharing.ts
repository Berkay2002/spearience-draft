/**
 * Social media sharing utilities
 * Provides functions for sharing content across different social platforms
 */

export interface ShareData {
  url: string
  title: string
  description?: string
  image?: string
  hashtags?: string[]
  via?: string
}

export interface SocialPlatform {
  name: string
  icon: string
  color: string
  shareUrl: (data: ShareData) => string
}

/**
 * Generate share URL for Twitter/X
 */
function getTwitterShareUrl(data: ShareData): string {
  const params = new URLSearchParams()
  
  let text = data.title
  if (data.description) {
    text += ` - ${data.description}`
  }
  
  params.append('text', text)
  params.append('url', data.url)
  
  if (data.hashtags?.length) {
    params.append('hashtags', data.hashtags.join(','))
  }
  
  if (data.via) {
    params.append('via', data.via)
  }
  
  return `https://twitter.com/intent/tweet?${params.toString()}`
}

/**
 * Generate share URL for Facebook
 */
function getFacebookShareUrl(data: ShareData): string {
  const params = new URLSearchParams()
  params.append('u', data.url)
  
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
}

/**
 * Generate share URL for LinkedIn
 */
function getLinkedInShareUrl(data: ShareData): string {
  const params = new URLSearchParams()
  params.append('url', data.url)
  params.append('title', data.title)
  
  if (data.description) {
    params.append('summary', data.description)
  }
  
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
}

/**
 * Generate share URL for WhatsApp
 */
function getWhatsAppShareUrl(data: ShareData): string {
  const text = `${data.title}${data.description ? ` - ${data.description}` : ''} ${data.url}`
  const params = new URLSearchParams()
  params.append('text', text)
  
  return `https://wa.me/?${params.toString()}`
}

/**
 * Generate share URL for Telegram
 */
function getTelegramShareUrl(data: ShareData): string {
  const params = new URLSearchParams()
  params.append('url', data.url)
  params.append('text', data.title)
  
  return `https://t.me/share/url?${params.toString()}`
}

/**
 * Generate share URL for Reddit
 */
function getRedditShareUrl(data: ShareData): string {
  const params = new URLSearchParams()
  params.append('url', data.url)
  params.append('title', data.title)
  
  return `https://reddit.com/submit?${params.toString()}`
}

/**
 * Generate email share URL
 */
function getEmailShareUrl(data: ShareData): string {
  const params = new URLSearchParams()
  params.append('subject', data.title)
  
  let body = data.title
  if (data.description) {
    body += `\n\n${data.description}`
  }
  body += `\n\n${data.url}`
  
  params.append('body', body)
  
  return `mailto:?${params.toString()}`
}

/**
 * Supported social media platforms
 */
export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  twitter: {
    name: 'Twitter',
    icon: 'Twitter',
    color: '#1DA1F2',
    shareUrl: getTwitterShareUrl,
  },
  facebook: {
    name: 'Facebook',
    icon: 'Facebook',
    color: '#1877F2',
    shareUrl: getFacebookShareUrl,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'Linkedin',
    color: '#0A66C2',
    shareUrl: getLinkedInShareUrl,
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: 'MessageCircle',
    color: '#25D366',
    shareUrl: getWhatsAppShareUrl,
  },
  telegram: {
    name: 'Telegram',
    icon: 'Send',
    color: '#0088CC',
    shareUrl: getTelegramShareUrl,
  },
  reddit: {
    name: 'Reddit',
    icon: 'MessageSquare',
    color: '#FF4500',
    shareUrl: getRedditShareUrl,
  },
  email: {
    name: 'Email',
    icon: 'Mail',
    color: '#6B7280',
    shareUrl: getEmailShareUrl,
  },
}

/**
 * Open share popup window
 */
export function openSharePopup(url: string, title: string = 'Share') {
  const popup = window.open(
    url,
    'share-popup',
    'width=600,height=400,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
  )
  
  if (popup) {
    popup.focus()
  }
  
  return popup
}

/**
 * Share content using Web Share API (if available) or fallback to social platform
 */
export async function shareContent(data: ShareData, platform?: string): Promise<boolean> {
  // Try Web Share API first (mobile devices)
  if (!platform && navigator.share && isMobileDevice()) {
    try {
      await navigator.share({
        title: data.title,
        text: data.description,
        url: data.url,
      })
      return true
    } catch (error) {
      // User cancelled or API not available, fall through to platform sharing
      console.log('Web Share API cancelled or failed:', error)
    }
  }
  
  // Use specific platform or default to Twitter
  const targetPlatform = platform || 'twitter'
  const socialPlatform = SOCIAL_PLATFORMS[targetPlatform]
  
  if (!socialPlatform) {
    console.error(`Unknown social platform: ${targetPlatform}`)
    return false
  }
  
  const shareUrl = socialPlatform.shareUrl(data)
  
  // Open email client directly for email sharing
  if (targetPlatform === 'email') {
    window.location.href = shareUrl
    return true
  }
  
  // Open popup for other platforms
  openSharePopup(shareUrl, `Share on ${socialPlatform.name}`)
  return true
}

/**
 * Copy URL to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Detect if user is on mobile device
 */
function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Generate Open Graph image URL for dynamic content
 */
export function generateOGImageUrl(options: {
  title: string
  description?: string
  image?: string
  locale?: string
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chrish-fernando.com'
  const params = new URLSearchParams()
  
  params.append('title', options.title)
  if (options.description) {
    params.append('description', options.description)
  }
  if (options.image) {
    params.append('image', options.image)
  }
  if (options.locale) {
    params.append('locale', options.locale)
  }
  
  return `${baseUrl}/api/og?${params.toString()}`
}

/**
 * Get current page share data
 */
export function getCurrentPageShareData(
  customData?: Partial<ShareData>
): ShareData {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chrish-fernando.com'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : baseUrl
  
  const defaultData: ShareData = {
    url: currentUrl,
    title: typeof document !== 'undefined' ? document.title : 'Chrish Fernando - Leadership & Mentorship',
    description: 'Professional project manager, mentor, and sports consultant helping organizations and individuals achieve their goals through strategic leadership and personalized guidance.',
    image: `${baseUrl}/images/chrish/profile-hero.jpg`,
    hashtags: ['leadership', 'mentorship', 'projectmanagement'],
    via: 'ChrishFernando',
  }
  
  return { ...defaultData, ...customData }
}

/**
 * Track sharing events for analytics
 */
export function trackShare(platform: string, url: string) {
  // Dispatch custom event for analytics
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('social-share', {
      detail: {
        platform,
        url,
        timestamp: Date.now(),
      }
    }))
  }
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Social Share] ${platform}: ${url}`)
  }
}

/**
 * Utility to get share counts (placeholder - requires external API)
 */
export async function getShareCounts(url: string): Promise<Record<string, number>> {
  // This would typically require a backend service or third-party API
  // For now, return placeholder data
  return {
    facebook: 0,
    twitter: 0,
    linkedin: 0,
    total: 0,
  }
}

/**
 * Default share configurations for different page types
 */
export const SHARE_CONFIGS = {
  homepage: {
    title: 'Chrish Fernando - Leadership & Mentorship Expert',
    description: 'Professional project manager, mentor, and sports consultant based in Stockholm. Helping organizations and individuals achieve excellence through strategic leadership.',
    hashtags: ['leadership', 'mentorship', 'projectmanagement', 'stockholm'],
  },
  about: {
    title: 'About Chrish Fernando - Professional Background & Experience',
    description: 'Learn about Chrish Fernando\'s professional journey in project management, mentorship, and sports consulting. Based in Stockholm, Sweden.',
    hashtags: ['about', 'leadership', 'experience', 'stockholm'],
  },
  projects: {
    title: 'Projects by Chrish Fernando - Leadership & Consulting Work',
    description: 'Explore successful projects and case studies by Chrish Fernando, including digital transformation, leadership programs, and sports consulting.',
    hashtags: ['projects', 'casestudies', 'leadership', 'consulting'],
  },
  contact: {
    title: 'Contact Chrish Fernando - Leadership & Mentorship Services',
    description: 'Get in touch with Chrish Fernando for leadership coaching, project management consulting, or mentorship services in Stockholm.',
    hashtags: ['contact', 'consulting', 'mentorship', 'stockholm'],
  },
} as const 