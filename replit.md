# Overview

CalcMaster is a full-stack calculator website that provides professional-grade online calculators for finance, health, math, and more. It features a content-rich architecture with calculator pages, blog posts, FAQ sections, SEO optimization (sitemap, meta tags, schema markup), and categorized browsing. The app is designed as an SEO-focused content site where each calculator has its own page with rich text content, structured data, and related FAQs.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend (React SPA)
- **Framework**: React with TypeScript, built with Vite
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, using Inter (body) and Outfit (headings) fonts
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Charts**: Recharts for data visualization in calculator results
- **SEO**: react-helmet for managing document head meta tags
- **Structure**: Pages are in `client/src/pages/`, reusable components in `client/src/components/`, custom hooks in `client/src/hooks/`

## Backend (Express API)
- **Framework**: Express 5 on Node.js with TypeScript (run via tsx)
- **Architecture**: Monolithic server serving both API routes and the static SPA
- **API Pattern**: RESTful JSON API under `/api/` prefix. Route definitions are shared between client and server via `shared/routes.ts`
- **Dev Server**: Vite dev server middleware is injected in development mode for HMR
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

## Calculator System
- Calculators are database-driven for metadata (name, slug, description, SEO content, FAQs) but the actual calculator UI logic is implemented as individual React components
- `CalculatorWrapper` component maps slugs to calculator components via a switch statement
- Currently implemented: MortgageCalculator, BMICalculator. Others show a "coming soon" placeholder
- Each calculator page includes: the interactive calculator, rich text content, FAQ accordion, breadcrumbs, and SEO meta

## Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **Schema**: Defined in `shared/schema.ts` with four tables:
  - `categories` - Calculator categories (name, slug, description)
  - `calculators` - Calculator entries (name, slug, description, content, SEO fields, schema markup as JSONB)
  - `faqs` - FAQ entries linked to calculators
  - `blog_posts` - Blog articles (title, slug, excerpt, content, SEO fields)
- **Relations**: Categories have many calculators, calculators have many FAQs
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Validation**: Drizzle-Zod for generating Zod schemas from database tables

## Shared Code
- `shared/schema.ts` - Database schema, types, and relations used by both client and server
- `shared/routes.ts` - API route definitions with paths and Zod response schemas, ensuring type-safe API contracts

## SEO Features
- Dynamic sitemap.xml generation from database content
- Per-page meta tags via react-helmet
- Schema markup (JSON-LD structured data) stored per calculator
- SEO-friendly slugs for all content

## Build System
- Development: `tsx server/index.ts` with Vite middleware for HMR
- Production build: Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- Build script selectively bundles server dependencies (allowlist in `script/build.ts`) to optimize cold start times

# External Dependencies

- **PostgreSQL** - Primary database, connected via `DATABASE_URL` environment variable. Required for the app to start.
- **Google Fonts** - Inter, Outfit, DM Sans, Fira Code, Geist Mono, and Architects Daughter fonts loaded via Google Fonts CDN
- **Unsplash** - Blog post cover images use Unsplash URLs as placeholders
- **Replit Plugins** - `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner` for development experience on Replit (conditionally loaded)
- **connect-pg-simple** - PostgreSQL session store (included in dependencies, may be used for session management)