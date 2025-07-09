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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Globe, Menu, ChevronDown } from 'lucide-react'
import { useNavigationContent } from '@/hooks/use-content'
import { useCurrentLocale } from '@/hooks/use-current-locale'
import { type Locale } from '@/middleware'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const navigationContent = useNavigationContent()
  
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

  // Navigation menu items with proper locale routing
  const navigationItems = navigationContent?.menu?.map(item => ({
    ...item,
    href: `/${currentLocale}${item.href === '/' ? '' : item.href}`
  })) || []

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm" 
          : "bg-transparent",
        className
      )}
    >
      <nav className="container-professional flex items-center justify-between py-4">
        {/* Logo */}
        <Link 
          href={`/${currentLocale}`}
          className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
        >
          {navigationContent?.logo || 'Chrish Fernando'}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Theme Switcher, Language Switcher & CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle className="w-12 h-6" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentLocale === 'en' ? 'EN' : 'SV'}
                </span>
                <ChevronDown className="w-4 h-4" />
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
                  🇺🇸 English
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
                  🇸🇪 Svenska
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild size="sm">
            <Link href={`/${currentLocale}/contact`}>
              Get In Touch
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Theme Switcher */}
          <ThemeToggle className="w-10 h-5" />
          
          {/* Mobile Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
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
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => switchLanguage('sv')}
                className={cn(
                  "cursor-pointer",
                  currentLocale === 'sv' && "bg-accent"
                )}
              >
                🇸🇪 Svenska
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between pb-6 border-b">
                  <span className="text-lg font-semibold">
                    {navigationContent?.logo || 'Chrish Fernando'}
                  </span>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-6 py-6 flex-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary",
                        pathname === item.href 
                          ? "text-primary" 
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="pt-6 border-t">
                  <Button asChild className="w-full">
                    <Link href={`/${currentLocale}/contact`} onClick={handleLinkClick}>
                      Get In Touch
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