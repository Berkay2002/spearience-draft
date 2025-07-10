'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { 
  shareContent, 
  copyToClipboard, 
  trackShare,
  getCurrentPageShareData,
  SOCIAL_PLATFORMS,
  type ShareData 
} from '@/lib/social-sharing'
import { cn } from '@/lib/utils'
import { 
  Share2, 
  Copy, 
  Check,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  MessageSquare,
  Mail,
  ExternalLink
} from 'lucide-react'

const ICON_MAP = {
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  MessageSquare,
  Mail,
} as const

interface SocialShareProps {
  data?: Partial<ShareData>
  platforms?: string[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'buttons' | 'dropdown' | 'minimal'
  showCopyLink?: boolean
  className?: string
  label?: string
}

interface ShareButtonProps {
  platform: string
  data: ShareData
  size: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'full'
  onClick?: () => void
}

function ShareButton({ platform, data, size, variant = 'icon', onClick }: ShareButtonProps) {
  const socialPlatform = SOCIAL_PLATFORMS[platform]
  const IconComponent = ICON_MAP[socialPlatform.icon as keyof typeof ICON_MAP]
  const { toast } = useToast()
  
  if (!socialPlatform || !IconComponent) {
    return null
  }
  
  const handleShare = async () => {
    try {
      await shareContent(data, platform)
      trackShare(platform, data.url)
      
      toast({
        title: "Shared successfully",
        description: `Content shared on ${socialPlatform.name}`,
      })
      
      onClick?.()
    } catch (error) {
      console.error('Share failed:', error)
      toast({
        title: "Share failed",
        description: "Unable to share content. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const buttonSizes = {
    sm: variant === 'full' ? 'h-8 px-3 text-xs' : 'h-8 w-8',
    md: variant === 'full' ? 'h-10 px-4 text-sm' : 'h-10 w-10',
    lg: variant === 'full' ? 'h-12 px-6' : 'h-12 w-12',
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className={cn(
              buttonSizes[size],
              variant === 'icon' && 'p-0',
              'transition-all duration-200 hover:scale-105'
            )}
            style={{
              borderColor: `${socialPlatform.color}20`,
              color: socialPlatform.color,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${socialPlatform.color}10`
              e.currentTarget.style.borderColor = socialPlatform.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = `${socialPlatform.color}20`
            }}
          >
            <IconComponent className={iconSizes[size]} />
            {variant === 'full' && (
              <span className="ml-2">{socialPlatform.name}</span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share on {socialPlatform.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function CopyLinkButton({ data, size }: { data: ShareData; size: 'sm' | 'md' | 'lg' }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  
  const handleCopy = async () => {
    try {
      const success = await copyToClipboard(data.url)
      
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        
        toast({
          title: "Link copied",
          description: "URL copied to clipboard",
        })
        
        trackShare('copy-link', data.url)
      } else {
        throw new Error('Copy failed')
      }
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const buttonSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className={cn(
              buttonSizes[size],
              'p-0 transition-all duration-200',
              copied && 'bg-green-50 border-green-200 text-green-600'
            )}
          >
            {copied ? (
              <Check className={iconSizes[size]} />
            ) : (
              <Copy className={iconSizes[size]} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : 'Copy link'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function SocialShare({
  data,
  platforms = ['twitter', 'facebook', 'linkedin', 'whatsapp'],
  size = 'md',
  variant = 'buttons',
  showCopyLink = true,
  className,
  label = 'Share',
}: SocialShareProps) {
  const shareData = getCurrentPageShareData(data)
  
  if (variant === 'dropdown') {
    const buttonSize = size === 'md' ? 'default' : size
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size={buttonSize} className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="end">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground px-2">
              Share this page
            </div>
            <Separator />
            <div className="space-y-1">
              {platforms.map((platform) => (
                <ShareButton
                  key={platform}
                  platform={platform}
                  data={shareData}
                  size="sm"
                  variant="full"
                />
              ))}
            </div>
            {showCopyLink && (
              <>
                <Separator />
                <div className="flex items-center gap-2 px-2 py-1">
                  <CopyLinkButton data={shareData} size="sm" />
                  <span className="text-sm">Copy link</span>
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }
  
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {platforms.slice(0, 3).map((platform) => (
          <ShareButton
            key={platform}
            platform={platform}
            data={shareData}
            size="sm"
            variant="icon"
          />
        ))}
        {platforms.length > 3 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="grid grid-cols-2 gap-1">
                {platforms.slice(3).map((platform) => (
                  <ShareButton
                    key={platform}
                    platform={platform}
                    data={shareData}
                    size="sm"
                    variant="icon"
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        {showCopyLink && <CopyLinkButton data={shareData} size="sm" />}
      </div>
    )
  }
  
  // Default buttons variant
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <ShareButton
                key={platform}
                platform={platform}
                data={shareData}
                size={size}
                variant="icon"
              />
            ))}
            {showCopyLink && <CopyLinkButton data={shareData} size={size} />}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Share this page with others
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Floating share button for mobile
export function FloatingShareButton({
  data,
  platforms = ['twitter', 'facebook', 'linkedin'],
  className,
}: Omit<SocialShareProps, 'variant' | 'size'>) {
  const shareData = getCurrentPageShareData(data)
  const { toast } = useToast()
  
  const handleNativeShare = async () => {
    try {
      const success = await shareContent(shareData)
      if (success) {
        trackShare('native-share', shareData.url)
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share content. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  return (
    <Button
      onClick={handleNativeShare}
      size="lg"
      className={cn(
        'fixed bottom-20 right-4 z-40 rounded-full h-14 w-14 shadow-lg',
        'bg-primary hover:bg-primary/90 text-primary-foreground',
        'transition-all duration-200 hover:scale-110',
        className
      )}
    >
      <Share2 className="h-6 w-6" />
    </Button>
  )
}

// Quick share for specific content
export function QuickShare({
  title,
  url,
  description,
  platforms = ['twitter', 'linkedin'],
  className,
}: {
  title: string
  url: string
  description?: string
  platforms?: string[]
  className?: string
}) {
  const baseData = getCurrentPageShareData()
  const shareData: ShareData = {
    ...baseData,
    title,
    url,
    description: description || baseData.description,
  }
  
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {platforms.map((platform) => (
        <ShareButton
          key={platform}
          platform={platform}
          data={shareData}
          size="sm"
          variant="icon"
        />
      ))}
    </div>
  )
} 