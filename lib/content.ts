import { type Locale, defaultLocale } from './i18n'

// Content type definitions
export interface HeroContent {
  title: string
  subtitle: string
  description: string
  primaryCta: string
  secondaryCta: string
  headshot: {
    src: string
    alt: string
  }
}

export interface ExpertiseContent {
  title: string
  tabs: Array<{
    id: string
    label: string
    title: string
    description: string
    features: string[]
    icon?: string
  }>
}

export interface ProcessContent {
  title: string
  subtitle: string
  steps: Array<{
    id: string
    title: string
    description: string
    image?: string
  }>
}

export interface TestimonialContent {
  title: string
  testimonials: Array<{
    id: string
    name: string
    role: string
    company: string
    content: string
    avatar?: string
    rating?: number
  }>
}

export interface ProjectContent {
  id: string
  title: string
  description: string
  category: string
  image: string
  tags: string[]
  featured: boolean
  outcomes?: string[]
  link?: string
}

export interface FeaturedWorkContent {
  title: string
  subtitle: string
  projects: ProjectContent[]
}

export interface BioContent {
  title: string
  biography: string
  mission: string
  headshot: {
    src: string
    alt: string
  }
  highlights: string[]
}

export interface CredentialsContent {
  title: string
  credentials: Array<{
    id: string
    role: string
    organization: string
    description: string
    period: string
    achievements: string[]
    image?: string
  }>
}

export interface ContactContent {
  title: string
  subtitle: string
  email: string
  location: string
  socialMedia: Array<{
    platform: string
    url: string
    icon: string
  }>
  form: {
    nameLabel: string
    emailLabel: string
    messageLabel: string
    methodLabel: string
    submitButton: string
    successMessage: string
    errorMessage: string
  }
}

export interface NavigationContent {
  logo: string
  menu: Array<{
    label: string
    href: string
  }>
  languageSwitcher: {
    label: string
  }
}

export interface FooterContent {
  copyright: string
  links: Array<{
    label: string
    href: string
  }>
  socialMedia: Array<{
    platform: string
    url: string
    icon: string
  }>
}

export interface SiteContent {
  navigation: NavigationContent
  hero: HeroContent
  expertise: ExpertiseContent
  process: ProcessContent
  testimonials: TestimonialContent
  featuredWork: FeaturedWorkContent
  bio: BioContent
  credentials: CredentialsContent
  contact: ContactContent
  footer: FooterContent
}

// Import content directly (this will be bundled by webpack)
// We'll use dynamic imports to load the content asynchronously
const contentLoaders = {
  en: () => import('@/content/en/site.json').then(m => m.default),
  sv: () => import('@/content/sv/site.json').then(m => m.default),
} as const

// Content cache
const contentCache = new Map<Locale, SiteContent>()

// Get content for a specific locale
export async function getContent(locale: Locale): Promise<SiteContent> {
  // Check cache first
  if (contentCache.has(locale)) {
    return contentCache.get(locale)!
  }
  
  try {
    // Load content using dynamic import
    const loader = contentLoaders[locale]
    if (!loader) {
      throw new Error(`No content loader for locale: ${locale}`)
    }
    
    const content = await loader()
    contentCache.set(locale, content as SiteContent)
    return content as SiteContent
  } catch (error) {
    console.warn(`Failed to load content for locale ${locale}, falling back to default`)
    
    // Fallback to default locale if current locale fails
    if (locale !== defaultLocale) {
      return getContent(defaultLocale)
    }
    
    // If even default locale fails, throw error
    throw new Error(`Failed to load content for default locale ${defaultLocale}`)
  }
}

// Get content section by key
export async function getContentSection<T extends keyof SiteContent>(
  locale: Locale,
  section: T
): Promise<SiteContent[T]> {
  const content = await getContent(locale)
  return content[section]
}

// Synchronous version for client-side usage with pre-loaded content
// This will be used by the hooks after content is loaded
let preloadedContent: Record<Locale, SiteContent> = {} as any

export function preloadContent(locale: Locale, content: SiteContent) {
  preloadedContent[locale] = content
  contentCache.set(locale, content)
}

export function getContentSync(locale: Locale): SiteContent {
  // Try cache first
  if (contentCache.has(locale)) {
    return contentCache.get(locale)!
  }
  
  // Try preloaded content
  if (preloadedContent[locale]) {
    return preloadedContent[locale]
  }
  
  // Fallback to default locale
  if (locale !== defaultLocale && preloadedContent[defaultLocale]) {
    return preloadedContent[defaultLocale]
  }
  
  // Return empty content structure if nothing is available
  console.warn(`No content available for locale ${locale}, using fallback`)
  return createFallbackContent()
}

export function getContentSectionSync<T extends keyof SiteContent>(
  locale: Locale,
  section: T
): SiteContent[T] {
  const content = getContentSync(locale)
  return content[section]
}

// Create fallback content structure
function createFallbackContent(): SiteContent {
  return {
    navigation: {
      logo: "Chrish Fernando",
      menu: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Contact", href: "/contact" }
      ],
      languageSwitcher: { label: "Language" }
    },
    hero: {
      title: "Chrish Fernando",
      subtitle: "Project Management Expert, Mentor & Sports Leadership Consultant",
      description: "Transforming teams and projects through proven leadership methodologies.",
      primaryCta: "View My Work",
      secondaryCta: "Get In Touch",
      headshot: {
        src: "/images/chrish/profile-hero.jpg",
        alt: "Chrish Fernando - Professional headshot"
      }
    },
    expertise: { title: "Areas of Expertise", tabs: [] },
    process: { title: "My Approach", subtitle: "", steps: [] },
    testimonials: { title: "What Clients Say", testimonials: [] },
    featuredWork: { title: "Featured Projects", subtitle: "", projects: [] },
    bio: { 
      title: "About", 
      biography: "", 
      mission: "", 
      headshot: { src: "", alt: "" }, 
      highlights: [] 
    },
    credentials: { title: "Credentials", credentials: [] },
    contact: { 
      title: "Contact", 
      subtitle: "", 
      email: "", 
      location: "", 
      socialMedia: [],
      form: {
        nameLabel: "Name",
        emailLabel: "Email", 
        messageLabel: "Message",
        methodLabel: "Preferred Contact Method",
        submitButton: "Send Message",
        successMessage: "Message sent successfully!",
        errorMessage: "Failed to send message."
      }
    },
    footer: { copyright: "", links: [], socialMedia: [] }
  }
}

// Clear content cache (useful for development)
export function clearContentCache(): void {
  contentCache.clear()
  preloadedContent = {} as any
}

// Get available locales
export function getAvailableLocales(): Locale[] {
  return Object.keys(contentLoaders) as Locale[]
} 