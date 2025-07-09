'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { type Locale } from '@/lib/i18n'
import { type SiteContent, getContent, preloadContent } from '@/lib/content'

// Import content directly to ensure it's available synchronously
import enContent from '@/content/en/site.json'
import svContent from '@/content/sv/site.json'

interface ContentContextValue {
  isLoaded: boolean
  error: string | null
}

const ContentContext = createContext<ContentContextValue>({
  isLoaded: false,
  error: null,
})

export function useContentProvider() {
  return useContext(ContentContext)
}

interface ContentProviderProps {
  children: ReactNode
}

export function ContentProvider({ children }: ContentProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Preload both locales with imported content
      preloadContent('en', enContent as SiteContent)
      preloadContent('sv', svContent as SiteContent)
      
      setIsLoaded(true)
      setError(null)
    } catch (err) {
      console.error('Failed to preload content:', err)
      setError(err instanceof Error ? err.message : 'Failed to load content')
      setIsLoaded(true) // Still set to true so components render with fallback
    }
  }, [])

  return (
    <ContentContext.Provider value={{ isLoaded, error }}>
      {children}
    </ContentContext.Provider>
  )
} 