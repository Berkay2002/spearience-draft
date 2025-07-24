# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Next.js dev server with hot reload
- **Production build**: `npm run build` - Creates optimized production build
- **Production start**: `npm run start` - Starts production server (requires build first)
- **Linting**: `npm run lint` - Runs Next.js ESLint configuration

## Project Architecture

This is a **Next.js 14 App Router** application featuring a multilingual professional website with robust internationalization.

### Internationalization System

The project implements a comprehensive i18n system supporting English (`en`) and Swedish (`sv`):

- **Locale routing**: `/[locale]/` directory structure with middleware-driven locale detection
- **Middleware**: `middleware.ts` handles locale detection via cookies, Accept-Language headers, and URL prefixes
- **Configuration**: `i18nConfig.js` centralizes all i18n settings
- **Content management**: JSON files in `content/en/` and `content/sv/` with build-time embedding
- **Hooks**: `useCurrentLocale()` and `useContent()` for consistent locale and content access

### Key Components Architecture

- **Layout system**: Root layout in `app/layout.tsx` with provider hierarchy (Theme → Accessibility → Content → Performance)
- **Navigation**: Complex multilingual navigation with dropdown menus and mobile responsiveness
- **Content system**: Typed content interfaces with embedded JSON for optimal performance
- **Theme system**: Dark/light mode support with `next-themes` and CSS custom properties

### Library Structure

- **`lib/content.ts`**: Content management with TypeScript interfaces and caching
- **`lib/i18n.ts`**: Internationalization utilities and type definitions  
- **`lib/utils.ts`**: Utility functions including `cn()` for class name merging
- **`lib/seo.ts`**: SEO configuration and metadata management
- **`lib/accessibility.ts`**: ARIA labels, roles, and accessibility utilities

### Component Organization

- **`components/ui/`**: Reusable UI components (Shadcn/ui based)
- **`components/sections/`**: Page-specific sections (hero, bio, testimonials, etc.)
- **`components/accessibility/`**: Accessibility-focused components (skip links, providers)
- **`components/forms/`**: Form components with validation

### Styling System

- **Tailwind CSS**: Extensive custom configuration with professional design tokens
- **CSS Variables**: Theme-aware color system with HSL values
- **Custom utilities**: Professional spacing, typography, and animation classes
- **Responsive design**: Mobile-first approach with container utilities

### Performance Optimizations

- **Image optimization**: Next.js Image component with AVIF/WebP support
- **Font optimization**: Inter and Crimson Text with `display: swap`
- **Bundle optimization**: Package imports optimization for Lucide and Radix UI
- **Caching**: Long-term caching for static assets and images

### Development Workflow

The project includes Cursor rules for AI-assisted development:

- **PRD generation**: `/create-prd` rule for creating structured Product Requirements Documents
- **Task management**: Rules for generating and processing development task lists
- **No existing test framework**: Verify testing approach by checking README or searching codebase

### Content Management

Content is fully embedded at build time from JSON files:
- All content interfaces are strongly typed in `lib/content.ts`
- Content is cached and accessible via hooks throughout the application
- Fallback content is provided for graceful degradation

### Important Notes

- **Locale consistency**: Always use `useCurrentLocale()` hook instead of direct pathname parsing
- **Content access**: Use `useContent()` and `useNavigationContent()` hooks for type-safe content access
- **Route construction**: All internal links must include locale prefix: `/${currentLocale}/path`
- **Accessibility**: ARIA labels and roles are centralized in `lib/accessibility.ts`
- **Performance monitoring**: Providers are set up for performance tracking and optimization