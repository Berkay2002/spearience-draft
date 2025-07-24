'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Globe, Menu, ChevronDown, ChevronRight, X } from 'lucide-react'
import { useNavigationContent, useContent } from '@/hooks/use-content'
import { useCurrentLocale } from '@/hooks/use-current-locale'
import { type Locale } from '@/middleware'
import { ThemeToggle } from '@/components/theme-toggle'
import { ariaLabels, ariaRoles, useKeyboardNavigation, announceToScreenReader } from '@/lib/accessibility'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const navigationContent = useNavigationContent()
  const content = useContent()
  const { resolvedTheme } = useTheme()
  
  // Use our new useCurrentLocale hook for consistency
  const currentLocale = useCurrentLocale()

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const switchLanguage = (newLocale: Locale) => {
    const currentPath = pathname.replace(`/${currentLocale}`, '')
    const newPath = `/${newLocale}${currentPath}`
    
    // Set the locale preference cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Strict`
    
    // Announce language change to screen readers
    const languageChangedText = navigationContent?.languageSwitcher?.languageChangedTo || 'Language changed to'
    const languageName = newLocale === 'en' 
      ? (navigationContent?.languageSwitcher?.english || 'English')
      : (navigationContent?.languageSwitcher?.swedish || 'Swedish')
    
    announceToScreenReader(
      `${languageChangedText} ${languageName}`,
      'polite'
    )
    
    // Navigate to new locale
    router.push(newPath)
    
    // Refresh to ensure middleware runs and cookie is properly set
    // This is important for locale persistence as recommended by next-i18n-router
    router.refresh()
  }

  // Close mobile menu when clicking on links
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Get projects from content
  const projects = content?.featuredWork?.projects || []
  const featuredProjects = projects.filter(project => project.featured)
  const allProjects = projects

  // Navigation menu items with proper locale routing
  const navigationItems = navigationContent?.menu?.map(item => ({
    ...item,
    href: `/${currentLocale}${item.href === '/' ? '' : item.href}`
  })) || []

  return (
    <header 
      role={ariaRoles.banner}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm" 
          : "bg-transparent",
        className
      )}
      style={{ zIndex: 60 }}
    >
      <nav 
        id="main-navigation"
        role={ariaRoles.navigation}
        aria-label={ariaLabels.mainNavigation}
        className="container-professional flex items-center justify-between py-3 sm:py-4"
      >
        {/* Logo */}
        <Link 
          href={`/${currentLocale}`}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          {mounted && resolvedTheme === 'light' ? (
            <Image
              src="/images/logo/spearience.png"
              alt="Spearience"
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
          ) : (
            <span className="text-3xl font-bold text-foreground hover:text-primary transition-colors">
              {navigationContent?.logo || 'Spearience'}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center" role={ariaRoles.navigation} aria-label="Desktop navigation">
          <NavigationMenu>
            <NavigationMenuList className="gap-6 items-center">
              {navigationItems.map((item) => {
                // Special handling for Projects menu item
                if (item.href.endsWith('/projects')) {
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuTrigger 
                        className={cn(
                          "text-base font-medium transition-colors hover:text-primary focus-ring bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent h-auto px-0 py-2",
                          pathname.includes('/projects') 
                            ? "text-primary" 
                            : "text-muted-foreground"
                        )}
                        onClick={() => router.push(item.href)}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-2 p-4 w-[280px]">
                          {/* Simplified Menu - Only Essentials */}
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {currentLocale === 'sv' ? 'Visa alla projekt' : 'View All Projects'}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {currentLocale === 'sv' 
                                  ? 'Se alla våra projekt och initiativ'
                                  : 'View all our projects and initiatives'}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/${currentLocale}/projects?featured=true`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {currentLocale === 'sv' ? 'Utvalda projekt' : 'Featured Projects'}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {currentLocale === 'sv' 
                                  ? 'Våra mest framstående projekt'
                                  : 'Our most prominent projects'}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }
                
                return (
                  <NavigationMenuItem key={item.href}>
            <Link
              href={item.href}
              className={cn(
                        "text-base font-medium transition-colors hover:text-primary focus-ring px-0 py-2",
                pathname === item.href 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Theme Switcher, Language Switcher & CTA */}
        <div className="hidden md:flex items-center space-x-5">
          <ThemeToggle className="w-14 h-7" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="default" 
                className="gap-2 px-3 py-2"
                aria-label={navigationContent?.languageSwitcher?.changeLanguageLabel || "Change language"}
                aria-haspopup="menu"
                aria-expanded="false"
              >
                <Globe className="w-5 h-5" aria-hidden="true" />
                <span className="text-base font-medium">
                  {currentLocale === 'en' ? 'EN' : 'SV'}
                </span>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem 
                onClick={() => switchLanguage('en')}
                className={cn(
                  "cursor-pointer",
                  currentLocale === 'en' && "bg-accent"
                )}
              >
                <span className="flex items-center gap-2">
                  🇺🇸 {navigationContent?.languageSwitcher?.english || 'English'}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => switchLanguage('sv')}
                className={cn(
                  "cursor-pointer",
                  currentLocale === 'sv' && "bg-accent"
                )}
              >
                <span className="flex items-center gap-2">
                  🇸🇪 {navigationContent?.languageSwitcher?.swedish || 'Svenska'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild size="default" className="px-6 py-2 text-base">
            <Link href={`/${currentLocale}/contact`}>
              {navigationContent?.cta?.text || 'Get In Touch'}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Theme Switcher */}
          <ThemeToggle className="w-12 h-6" />
          
          {/* Mobile Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="default" className="gap-1 min-h-[48px] min-w-[48px] px-3">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {currentLocale === 'en' ? 'EN' : 'SV'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => switchLanguage('en')}
                className={cn(
                  "cursor-pointer",
                  currentLocale === 'en' && "bg-accent"
                )}
              >
                🇺🇸 {navigationContent?.languageSwitcher?.english || 'English'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => switchLanguage('sv')}
                className={cn(
                  "cursor-pointer",
                  currentLocale === 'sv' && "bg-accent"
                )}
              >
                🇸🇪 {navigationContent?.languageSwitcher?.swedish || 'Svenska'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Premium Full-Screen Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 min-h-[44px] min-w-[44px] md:hidden"
                aria-label={isOpen ? ariaLabels.closeMenu : ariaLabels.openMenu}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300" />
                )}
                <span className="sr-only">{isOpen ? ariaLabels.closeMenu : ariaLabels.openMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-screen p-0 border-none mt-16 sm:mt-20"
              style={{ zIndex: 40 }}
              aria-labelledby="mobile-menu-heading"
            >
              <div className="bg-background min-h-screen" id="mobile-menu">
                {/* Premium Navigation Links */}
                <nav 
                  role={ariaRoles.navigation}
                  aria-label="Mobile navigation"
                  className="px-6 py-8"
                >
                  {navigationItems.map((item, index) => {
                    const hasSubpages = item.href.endsWith('/projects')
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className="flex items-center justify-between border-b border-border py-6 text-2xl font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <span>{item.label}</span>
                        {hasSubpages && (
                          <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

// Loading skeleton for navigation
export function NavigationSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <nav className="container-professional flex items-center justify-between py-4">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        
        <div className="hidden md:flex items-center space-x-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <div className="h-8 w-12 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
      </nav>
    </header>
  )
} 