'use client'

import { createContext, useContext, ReactNode } from 'react'
import { type Locale } from '@/lib/i18n'
import { type SiteContent } from '@/lib/content'

interface ContentContextValue {
  isLoaded: boolean
  error: string | null
}

const ContentContext = createContext<ContentContextValue>({
  isLoaded: true, // Content is now always loaded (embedded)
  error: null,
})

export function useContentProvider() {
  return useContext(ContentContext)
}

interface ContentProviderProps {
  children: ReactNode
}

export function ContentProvider({ children }: ContentProviderProps) {
  // Content is now embedded and always available - no async loading needed
  return (
    <ContentContext.Provider value={{ isLoaded: true, error: null }}>
      {children}
    </ContentContext.Provider>
  )
} 