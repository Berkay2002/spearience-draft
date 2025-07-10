'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  getStoredMetrics, 
  getPerformanceSummary, 
  performanceDebug,
  PERFORMANCE_THRESHOLDS,
  type PerformanceMetric 
} from '@/lib/performance'
import { cn } from '@/lib/utils'
import { 
  Activity, 
  Zap, 
  Eye, 
  Clock, 
  Gauge, 
  TrendingUp,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react'

interface PerformanceDashboardProps {
  isVisible?: boolean
  onToggle?: () => void
}

const METRIC_ICONS = {
  LCP: Eye,
  FID: Zap,
  CLS: Activity,
  FCP: Clock,
  TTFB: TrendingUp,
  INP: Gauge,
  LONG_TASK: Activity,
} as const

const METRIC_LABELS = {
  LCP: 'Largest Contentful Paint',
  FID: 'First Input Delay',
  CLS: 'Cumulative Layout Shift',
  FCP: 'First Contentful Paint',
  TTFB: 'Time to First Byte',
  INP: 'Interaction to Next Paint',
  LONG_TASK: 'Long Tasks',
} as const

function formatMetricValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3)
  }
  return `${Math.round(value)}ms`
}

function getRatingColor(rating: string): string {
  switch (rating) {
    case 'good':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'needs-improvement':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'poor':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

function getProgressValue(metricName: string, value: number): number {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS]
  if (!thresholds) return 0
  
  const maxValue = thresholds.NEEDS_IMPROVEMENT * 1.5 // Show up to 150% of needs improvement threshold
  return Math.min((value / maxValue) * 100, 100)
}

function MetricCard({ metric }: { metric: PerformanceMetric }) {
  const Icon = METRIC_ICONS[metric.name as keyof typeof METRIC_ICONS] || Activity
  const label = METRIC_LABELS[metric.name as keyof typeof METRIC_LABELS] || metric.name
  const progressValue = getProgressValue(metric.name, metric.value)
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={cn('text-xs', getRatingColor(metric.rating))}
          >
            {metric.rating.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {formatMetricValue(metric.name, metric.value)}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(metric.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className={cn(
            'h-2',
            metric.rating === 'good' && 'bg-green-100 [&>div]:bg-green-500',
            metric.rating === 'needs-improvement' && 'bg-yellow-100 [&>div]:bg-yellow-500',
            metric.rating === 'poor' && 'bg-red-100 [&>div]:bg-red-500'
          )}
        />
      </CardContent>
    </Card>
  )
}

function SummaryCard({ summary }: { summary: ReturnType<typeof getPerformanceSummary> }) {
  const totalMetrics = summary.totalMetrics
  const goodPercentage = totalMetrics > 0 ? (summary.good / totalMetrics) * 100 : 0
  const needsImprovementPercentage = totalMetrics > 0 ? (summary.needsImprovement / totalMetrics) * 100 : 0
  const poorPercentage = totalMetrics > 0 ? (summary.poor / totalMetrics) * 100 : 0
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{totalMetrics}</div>
            <div className="text-xs text-muted-foreground">Total Metrics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{summary.good}</div>
            <div className="text-xs text-muted-foreground">Good</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{summary.needsImprovement}</div>
            <div className="text-xs text-muted-foreground">Needs Work</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{summary.poor}</div>
            <div className="text-xs text-muted-foreground">Poor</div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Performance Score</span>
            <span className="font-medium">{goodPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
            <div 
              className="bg-green-500 transition-all duration-300" 
              style={{ width: `${goodPercentage}%` }}
            />
            <div 
              className="bg-yellow-500 transition-all duration-300" 
              style={{ width: `${needsImprovementPercentage}%` }}
            />
            <div 
              className="bg-red-500 transition-all duration-300" 
              style={{ width: `${poorPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceDashboard({ isVisible = false, onToggle }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const summary = useMemo(() => getPerformanceSummary(), [metrics])
  
  const latestMetrics = useMemo(() => {
    const latest = new Map<string, PerformanceMetric>()
    
    metrics
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach(metric => {
        if (!latest.has(metric.name)) {
          latest.set(metric.name, metric)
        }
      })
    
    return Array.from(latest.values())
      .sort((a, b) => {
        const order = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP', 'LONG_TASK']
        return order.indexOf(a.name) - order.indexOf(b.name)
      })
  }, [metrics])
  
  const refreshMetrics = () => {
    setIsRefreshing(true)
    setMetrics(getStoredMetrics())
    setTimeout(() => setIsRefreshing(false), 300)
  }
  
  const clearMetrics = () => {
    performanceDebug.clearMetrics()
    refreshMetrics()
  }
  
  const exportMetrics = () => {
    performanceDebug.exportMetrics()
  }
  
  useEffect(() => {
    // Initial load
    refreshMetrics()
    
    // Listen for new performance metrics
    const handlePerformanceMetric = (event: CustomEvent) => {
      refreshMetrics()
    }
    
    window.addEventListener('performance-metric', handlePerformanceMetric as EventListener)
    
    // Refresh every 5 seconds
    const interval = setInterval(refreshMetrics, 5000)
    
    return () => {
      window.removeEventListener('performance-metric', handlePerformanceMetric as EventListener)
      clearInterval(interval)
    }
  }, [])
  
  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <Gauge className="h-4 w-4 mr-2" />
        Performance
      </Button>
    )
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full max-h-[80vh] overflow-auto bg-background border rounded-lg shadow-xl">
      <div className="sticky top-0 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Performance Monitor
          </h3>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshMetrics}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={exportMetrics}
              disabled={metrics.length === 0}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearMetrics}
              disabled={metrics.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggle}
            >
              ×
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <SummaryCard summary={summary} />
        
        {latestMetrics.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Latest Metrics</h4>
            <div className="grid gap-3">
              {latestMetrics.map((metric) => (
                <MetricCard key={metric.name} metric={metric} />
              ))}
            </div>
          </div>
        )}
        
        {metrics.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Gauge className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No performance metrics yet. 
                <br />
                Navigate around to collect data.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export function PerformanceDashboardProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }
  
  return (
    <>
      {children}
      <PerformanceDashboard 
        isVisible={isVisible} 
        onToggle={() => setIsVisible(!isVisible)} 
      />
    </>
  )
} 