'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import DayNightSwitch from './day-night-switch'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder that matches the expected size to prevent layout shift
    return <div className={`w-12 h-6 ${className}`} />
  }

  const handleToggle = (checked: boolean) => {
    // DayNightSwitch: checked = day mode (light), !checked = night mode (dark)
    setTheme(checked ? 'light' : 'dark')
  }

  return (
    <DayNightSwitch
      checked={theme === 'light'}
      onToggle={handleToggle}
      className={className}
    />
  )
} 