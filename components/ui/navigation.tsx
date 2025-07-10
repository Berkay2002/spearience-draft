'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { Globe, Menu, ChevronDown } from 'lucide-react'
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
  const pathname = usePathname()
  const router = useRouter()
  const navigationContent = useNavigationContent()
  const content = useContent()
  
  // Use our new useCurrentLocale hook for consistency
  const currentLocale = useCurrentLocale()

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
          className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
        >
          {navigationContent?.logo || 'Spearience'}
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
                          "text-sm font-medium transition-colors hover:text-primary focus-ring bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent h-auto px-0 py-2",
                          pathname.includes('/projects') 
                            ? "text-primary" 
                            : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[500px] grid-cols-2">
                          {/* Main Projects Section */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium leading-none mb-2">
                                {currentLocale === 'sv' ? 'Projekt' : 'Projects'}
                              </h4>
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
                                      ? 'Utforska vårt fulla utbud av ungdomsfokuserade projekt och initiativ.'
                                      : 'Explore our full range of youth-focused projects and initiatives.'}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </div>
                            
                            {/* Featured Projects */}
                            {featuredProjects.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium leading-none mb-2">
                                  {currentLocale === 'sv' ? 'Utvalda projekt' : 'Featured Projects'}
                                </h4>
                                <div className="space-y-1">
                                  {featuredProjects.slice(0, 2).map((project) => (
                                    <NavigationMenuLink key={project.id} asChild>
                                      <Link
                                        href={`/${currentLocale}/projects/${project.id}`}
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      >
                                        <div className="text-sm font-medium leading-none">
                                          {project.title}
                                        </div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                          {project.category}
                                        </p>
                                      </Link>
                                    </NavigationMenuLink>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Categories & Other Projects */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium leading-none mb-2">
                                {currentLocale === 'sv' ? 'Kategorier' : 'Categories'}
                              </h4>
                              <div className="space-y-1">
                                {['Concept Development', 'Project Management', 'Mentorship'].map((category) => (
                                  <NavigationMenuLink key={category} asChild>
                                    <Link
                                      href={`/${currentLocale}/projects?category=${encodeURIComponent(category)}`}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      <div className="text-sm font-medium leading-none">
                                        {currentLocale === 'sv' 
                                          ? (category === 'Concept Development' ? 'Konceptutveckling' 
                                             : category === 'Project Management' ? 'Projektledning' 
                                             : 'Mentorskap')
                                          : category}
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>

                            {/* More Projects */}
                            {allProjects.length > featuredProjects.length && (
                              <div>
                                <h4 className="text-sm font-medium leading-none mb-2">
                                  {currentLocale === 'sv' ? 'Övriga projekt' : 'More Projects'}
                                </h4>
                                <div className="space-y-1">
                                  {allProjects.filter(project => !project.featured).slice(0, 2).map((project) => (
                                    <NavigationMenuLink key={project.id} asChild>
                                      <Link
                                        href={`/${currentLocale}/projects/${project.id}`}
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      >
                                        <div className="text-sm font-medium leading-none">
                                          {project.title}
                                        </div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                          {project.category}
                                        </p>
                                      </Link>
                                    </NavigationMenuLink>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
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
                        "text-sm font-medium transition-colors hover:text-primary focus-ring px-0 py-2",
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
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle className="w-12 h-6" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                aria-label={navigationContent?.languageSwitcher?.changeLanguageLabel || "Change language"}
                aria-haspopup="menu"
                aria-expanded="false"
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">
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

          <Button asChild size="sm">
            <Link href={`/${currentLocale}/contact`}>
              {navigationContent?.cta?.text || 'Get In Touch'}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-1">
          {/* Mobile Theme Switcher */}
          <ThemeToggle className="w-10 h-5" />
          
          {/* Mobile Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 min-h-[44px] min-w-[44px]">
                <Globe className="w-4 h-4" />
                <span className="text-xs">
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

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 min-h-[44px] min-w-[44px]"
                aria-label={isOpen ? ariaLabels.closeMenu : ariaLabels.openMenu}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">{isOpen ? ariaLabels.closeMenu : ariaLabels.openMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[400px]"
              aria-labelledby="mobile-menu-heading"
            >
              <div className="flex flex-col h-full" id="mobile-menu">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between pb-6 border-b">
                  <h2 id="mobile-menu-heading" className="text-lg font-semibold">
                    {navigationContent?.logo || 'Spearience'}
                  </h2>
                </div>

                {/* Mobile Navigation Links */}
                <nav 
                  role={ariaRoles.navigation}
                  aria-label="Mobile navigation"
                  className="flex flex-col space-y-2 py-6 flex-1"
                >
                  {navigationItems.map((item, index) => {
                    // Special handling for Projects in mobile menu
                    if (item.href.endsWith('/projects')) {
                      return (
                        <div key={item.href} className="space-y-1">
                          <Link
                            href={item.href}
                            onClick={handleLinkClick}
                            className={cn(
                              "text-base font-medium transition-colors hover:text-primary p-3 rounded-lg min-h-[44px] flex items-center",
                              pathname === item.href 
                                ? "text-primary bg-primary/10" 
                                : "text-muted-foreground hover:bg-accent"
                            )}
                            aria-current={pathname === item.href ? 'page' : undefined}
                            tabIndex={isOpen ? 0 : -1}
                          >
                            {item.label}
                          </Link>
                          
                          {/* Featured Projects in Mobile */}
                          {featuredProjects.length > 0 && (
                            <div className="ml-4 space-y-1">
                              {featuredProjects.map((project) => (
                                <Link
                                  key={project.id}
                                  href={`/${currentLocale}/projects/${project.id}`}
                                  onClick={handleLinkClick}
                                  className="block text-sm text-muted-foreground hover:text-primary p-2 rounded transition-colors"
                                  tabIndex={isOpen ? 0 : -1}
                                >
                                  {project.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    }
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "text-base font-medium transition-colors hover:text-primary p-3 rounded-lg min-h-[44px] flex items-center",
                          pathname === item.href 
                            ? "text-primary bg-primary/10" 
                            : "text-muted-foreground hover:bg-accent"
                        )}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        tabIndex={isOpen ? 0 : -1}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile CTA */}
                <div className="pt-6 border-t">
                  <Button asChild className="w-full">
                    <Link href={`/${currentLocale}/contact`} onClick={handleLinkClick}>
                      {navigationContent?.cta?.text || 'Get In Touch'}
                    </Link>
                  </Button>
                </div>
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