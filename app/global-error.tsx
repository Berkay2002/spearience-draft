'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-muted-foreground mb-4">500</h1>
            <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
            <p className="text-muted-foreground mb-8">
              An error occurred while loading this page.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 