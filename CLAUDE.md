# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production (includes sitemap generation)
npm run start        # Start production server
npm run preview      # Build and preview production locally
```

### Code Quality
```bash
npm run lint         # Run ESLint checks
npm run lint:fix     # Auto-fix linting issues
npm run typecheck    # TypeScript type checking (no emit)
npm run format:write # Format code with Prettier
npm run format:check # Check code formatting
```

### Maintenance
```bash
npm run npm:update   # Update all dependencies interactively
```

## Architecture Overview

This is a Next.js 15+ application using App Router with the following key architectural decisions:

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router and React 19
- **Styling**: Tailwind CSS v4 (PostCSS-based config in `app/globals.css`)
- **UI Components**: Radix UI primitives with shadcn patterns in `components/ui/`
- **State Management**: Zustand stores in `stores/`
- **Data Fetching**: TanStack Query with server state management
- **Authentication**: Better Auth library (email/password + Google OAuth)
- **Database**: MongoDB via native driver
- **Validation**: Zod schemas throughout
- **File Storage**: AWS S3 integration via presigned URLs

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `(app)/` - Main app routes (auth, blog, dashboard, etc.)
  - `api/` - API routes (currently S3 integration)
- `components/` - React components (prefer RSC, minimize client components)
- `lib/` - Utilities, integrations, and shared functions
- `stores/` - Zustand state management
- `config/` - App configuration and constants
- `types/` - TypeScript type definitions

### Key Patterns
1. **Server Components by Default**: Use client components only when necessary
2. **Mobile-First Design**: All components should be responsive
3. **Error Handling**: Use guard clauses and proper error boundaries
4. **Data Validation**: Always validate with Zod schemas
5. **Environment Variables**: Validated with T3 Env in `lib/env.js`

### Authentication Flow
- Better Auth setup in `lib/auth.ts`
- Auth provider wrapped around app in root layout
- Protected routes use middleware or route-level checks
- Sign-in/sign-up pages in `app/(app)/auth/`

### Development Guidelines
- Follow functional and declarative programming patterns
- Use async/await over promises
- Implement comprehensive error handling
- Write self-documenting code with clear naming
- Use TypeScript strictly (no `any` types)
- Follow the established component patterns in the codebase

### Environment Setup
Copy `.env.example` to `.env.local` and configure:
- MongoDB connection string
- AWS credentials for S3
- Authentication secrets
- Analytics IDs

### Testing
Currently no test framework is configured. When adding tests, update this section with the testing approach and commands.
- remember to put the plan doc always inside the /plan directory
- remember to use api client whenever making any api request. /Users/rfnmac/projects/next-template/lib/api