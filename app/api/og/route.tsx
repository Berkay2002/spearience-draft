import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

/**
 * Generate dynamic Open Graph images for social media sharing
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'Chrish Fernando'
    const description = searchParams.get('description') || 'Leadership & Mentorship Expert'
    const locale = searchParams.get('locale') || 'en'
    const image = searchParams.get('image')
    
    const isSwedish = locale === 'sv'
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          {/* Header */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: '#1976D2',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              CF
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                }}
              >
                Chrish Fernando
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: '#666',
                }}
              >
                {isSwedish ? 'Ledarskap & Mentorskap' : 'Leadership & Mentorship'}
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '80%',
              textAlign: 'center',
              gap: 24,
            }}
          >
            {/* Profile image if provided */}
            {image && (
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid #1976D2',
                }}
              >
                <img
                  src={image}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
            
            {/* Title */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#1a1a1a',
                maxWidth: '100%',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            
            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 24,
                  color: '#666',
                  maxWidth: '100%',
                  lineHeight: 1.4,
                }}
              >
                {description}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              color: '#666',
              fontSize: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#1976D2',
                  borderRadius: '50%',
                }}
              />
              <span>Stockholm, Sweden</span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 100,
              height: 100,
              background: 'linear-gradient(45deg, #1976D2, #42A5F5)',
              borderRadius: '50%',
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              left: 100,
              width: 80,
              height: 80,
              background: 'linear-gradient(45deg, #42A5F5, #1976D2)',
              borderRadius: '50%',
              opacity: 0.1,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Failed to generate OG image:', error)
    
    return new Response('Failed to generate image', {
      status: 500,
    })
  }
} 