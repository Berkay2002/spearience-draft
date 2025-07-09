# Chrish Fernando Professional Website

A modern, bilingual professional website built with Next.js 14, featuring internationalization support for English and Swedish.

## 🌍 Internationalization (i18n)

This project implements a robust internationalization system following [Next.js App Router best practices](https://nextjs.org/docs/app/guides/internationalization) and patterns inspired by [next-i18n-router](https://github.com/i18nexus/next-i18n-router).

### Features

- **🚀 App Router Support** - Full i18n support for Next.js 14 App Router
- **🔍 Smart Locale Detection** - Uses `@formatjs/intl-localematcher` and `negotiator` for proper locale matching
- **🍪 Cookie Persistence** - Remembers user language preferences across sessions
- **⚡ Embedded Content** - Fast content loading with embedded JSON files
- **📱 Responsive Language Switcher** - Easy language switching on all devices

### Supported Locales

- **English (en)** - Default locale
- **Swedish (sv)** - Secondary locale

### How It Works

#### URL Structure
```
/en/about    → English About page
/sv/about    → Swedish About page
/about       → Redirects to /en/about (default locale)
```

#### Locale Detection Priority
1. **Cookie preference** (`NEXT_LOCALE` cookie)
2. **Accept-Language header** (browser preference)
3. **Default locale** (English)

#### Configuration

The i18n configuration is centralized in `i18nConfig.js`:

```javascript
const i18nConfig = {
  locales: ['en', 'sv'],
  defaultLocale: 'en',
  prefixDefault: false,
  localeCookie: 'NEXT_LOCALE',
  serverSetCookie: 'always',
  cookieOptions: {
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/'
  }
};
```

### Usage in Components

#### Server Components
Access locale from params:
```tsx
export default function Page({ 
  params 
}: { 
  params: { locale: string } 
}) {
  const { locale } = params;
  // Use locale...
}
```

#### Client Components
Use the `useCurrentLocale` hook:
```tsx
'use client';
import { useCurrentLocale } from '@/hooks/use-current-locale';

function MyComponent() {
  const locale = useCurrentLocale();
  // Use locale...
}
```

#### Language Switching
The navigation component includes automatic language switching with cookie persistence:
```tsx
const switchLanguage = (newLocale: Locale) => {
  // Sets cookie and navigates
  // Includes router.refresh() for proper middleware execution
}
```

### Content Management

Content is stored in JSON files for each locale:
- `content/en/site.json` - English content
- `content/sv/site.json` - Swedish content

Content is embedded at build time for optimal performance and SEO.

### Middleware

The middleware (`middleware.ts`) handles:
- Locale detection and redirection
- Cookie management
- URL rewriting for proper routing

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd spearience-draft
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
spearience-draft/
├── app/                     # Next.js App Router
│   └── [locale]/           # Locale-based routing
│       ├── layout.tsx      # Root layout
│       ├── page.tsx        # Homepage
│       └── about/          # About page
├── components/             # React components
│   ├── sections/          # Page sections
│   └── ui/                # UI components
├── content/               # Internationalized content
│   ├── en/               # English content
│   └── sv/               # Swedish content
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── middleware.ts         # i18n middleware
├── i18nConfig.js        # i18n configuration
└── package.json
```

## 🛠 Built With

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **@formatjs/intl-localematcher** - Locale matching
- **negotiator** - Accept-Language parsing

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 