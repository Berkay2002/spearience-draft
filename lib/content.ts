import { type Locale, defaultLocale } from './i18n'

// Import content directly for build-time availability
import enSiteContent from '@/content/en/site.json'
import svSiteContent from '@/content/sv/site.json'

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

export interface ImpactContent {
  title: string
  subtitle: string
  statement: string
  cta: {
    text: string
    href: string
  }
  featuredTestimonial: {
    name: string
    role: string
    company: string
    content: string
    rating: number
    highlight: string
  }
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
  impact?: ImpactContent
  contact: ContactContent
  footer: FooterContent
}

// Embedded content that's available at build time
const embeddedContent: Record<Locale, SiteContent> = {
  en: enSiteContent as SiteContent,
  sv: svSiteContent as SiteContent,
}

// Content cache
const contentCache = new Map<Locale, SiteContent>()

// Initialize cache with embedded content
contentCache.set('en', embeddedContent.en)
contentCache.set('sv', embeddedContent.sv)

// Get content for a specific locale
export async function getContent(locale: Locale): Promise<SiteContent> {
  // Return from embedded content (always available)
  return embeddedContent[locale] || embeddedContent[defaultLocale]
}

// Get content section by key
export async function getContentSection<T extends keyof SiteContent>(
  locale: Locale,
  section: T
): Promise<SiteContent[T]> {
  const content = await getContent(locale)
  return content[section]
}

// Synchronous version - now reliably returns embedded content
export function getContentSync(locale: Locale): SiteContent {
  return embeddedContent[locale] || embeddedContent[defaultLocale]
}

export function getContentSectionSync<T extends keyof SiteContent>(
  locale: Locale,
  section: T
): SiteContent[T] {
  const content = getContentSync(locale)
  return content[section]
}

// Preload function (now just updates cache, content is already available)
export function preloadContent(locale: Locale, content: SiteContent) {
  contentCache.set(locale, content)
}

// Create fallback content structure (now only used as absolute fallback)
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
  // Re-initialize with embedded content
  contentCache.set('en', embeddedContent.en)
  contentCache.set('sv', embeddedContent.sv)
}

// Get available locales
export function getAvailableLocales(): Locale[] {
  return Object.keys(embeddedContent) as Locale[]
} 