"use client"

import * as React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react"
import { SocialShare } from '@/components/social-share'
import { useContent } from '@/hooks/useContent'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Mail, MapPin } from 'lucide-react'

export function FooterSection() {
  const { content } = useContent()
  
  if (!content) {
    return null
  }

  const year = new Date().getFullYear()
  
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CF</span>
              </div>
              <span className="font-semibold text-foreground">Chrish Fernando</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {content.footer.description}
            </p>
            
            {/* Social sharing */}
            <div className="pt-2">
              <SocialShare 
                variant="minimal" 
                platforms={['linkedin', 'twitter', 'facebook']}
                showCopyLink={false}
                className="justify-start"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{content.footer.sections.quickLinks.title}</h3>
            <ul className="space-y-2">
              {content.footer.sections.quickLinks.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{content.footer.sections.services.title}</h3>
            <ul className="space-y-2">
              {content.footer.sections.services.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{content.footer.sections.contact.title}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{content.footer.sections.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{content.footer.sections.contact.location}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {year} Chrish Fernando. {content.footer.copyright}
          </p>
          <div className="flex space-x-6">
            {content.footer.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}