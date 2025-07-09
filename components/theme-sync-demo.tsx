'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { ThemeToggle } from './theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ThemeSyncDemo() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Theme Sync Demo</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🎨 Theme Sync Demo</CardTitle>
        <CardDescription>
          All theme toggles are synchronized using next-themes global state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Theme:</span>
          <Badge variant={currentTheme === 'dark' ? 'default' : 'secondary'}>
            {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Toggle 1 (Navbar style):</span>
            <ThemeToggle className="w-12 h-6" />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Toggle 2 (Footer style):</span>
            <ThemeToggle className="w-10 h-5" />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Toggle 3 (Custom):</span>
            <ThemeToggle className="w-14 h-7" />
          </div>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <strong>How it works:</strong> All toggles use the same <code>useTheme()</code> hook from next-themes,
          ensuring perfect synchronization across the entire app.
        </div>
      </CardContent>
    </Card>
  )
} 