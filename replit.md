# AI-Powered Learning Community

## Overview

This is a web application that connects students and tutors in a learning community. Students can post learning requests with subject details and skill levels, while tutors can browse these requests and connect with students. The platform features role-based access control, secure authentication, and a modern, responsive user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **Vite + React with TypeScript**: Modern build tooling providing fast development experience and type safety
- **Wouter**: Lightweight client-side routing library used instead of React Router
- **TanStack Query**: Handles data fetching, caching, and server state management

**UI Component Strategy**
- **Shadcn UI + Radix UI**: Accessible, unstyled component primitives customized with Tailwind
- **Design System**: Material Design-inspired approach with Inter font family, drawing from LinkedIn Learning and Udemy patterns
- **Styling**: Tailwind CSS utility-first approach with custom theme tokens defined in CSS variables

**State Management**
- Context API for authentication state (`AuthContext`)
- TanStack Query for server state
- Local component state for UI interactions

### Backend Architecture

**Framework & Database**
- **Express.js**: Minimalist web framework handling API routes
- **MongoDB with Mongoose**: Document-based database for flexible data modeling
- **Database Schema Duality**: Project contains both PostgreSQL schema definitions (Drizzle ORM in `shared/schema.ts`) and MongoDB models (Mongoose in `server/models/`), indicating a transition or dual-database approach

**Authentication & Security**
- JWT (JSON Web Tokens) for stateless authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests
- Auth middleware validates tokens on protected routes

**API Structure**
- RESTful endpoints under `/api` prefix
- Auth routes: `/api/auth/register`, `/api/auth/login`
- Protected post routes: `/api/posts` (GET, POST, PUT, DELETE)
- Role-based access enforced through JWT payload

**Data Models**
- **Users**: Stores name, email, hashed password, role (student/tutor), timestamps
- **Posts**: Learning requests with title, subject, description, skill level, student reference

### Key Architectural Decisions

**Database Transition Strategy**
- **Problem**: Project needs to migrate from MongoDB to PostgreSQL
- **Solution**: Drizzle ORM schema defined alongside existing Mongoose models
- **Rationale**: Allows gradual migration while maintaining backward compatibility
- **Note**: `drizzle.config.ts` expects `DATABASE_URL` environment variable for PostgreSQL connection

**Authentication Approach**
- **Problem**: Need secure, stateless authentication
- **Solution**: JWT tokens stored in localStorage, sent via Authorization header
- **Trade-offs**: LocalStorage vulnerable to XSS but simpler than httpOnly cookies; tokens require explicit logout mechanism

**Client-Side Routing**
- **Problem**: Need lightweight routing without heavy dependencies
- **Solution**: Wouter instead of React Router DOM
- **Rationale**: Smaller bundle size, hooks-based API, sufficient for SPA needs

**Protected Routes Pattern**
- **Implementation**: `ProtectedRoute` wrapper component checks authentication state
- **Behavior**: Redirects unauthenticated users to login page
- **Auth state**: Persisted in localStorage, loaded on app mount

**Component Organization**
- Shared UI components in `client/src/components/ui/` (Shadcn convention)
- Feature components (Navbar, Footer, PostCard) at `client/src/components/`
- Page components in `client/src/pages/`
- Shared types/schemas in `shared/` directory

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight routing
- **express**: Backend web framework
- **vite**: Frontend build tool and dev server

### Database & ORM
- **mongoose**: MongoDB object modeling (current implementation)
- **drizzle-orm**: PostgreSQL ORM toolkit (planned migration)
- **@neondatabase/serverless**: Neon serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store (configured but unused)

### Authentication
- **jsonwebtoken**: JWT creation and verification
- **bcryptjs**: Password hashing

### UI Component Libraries
- **@radix-ui/***: 20+ primitive component packages for accessible UI
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date formatting utilities

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Validation resolvers
- **zod**: Schema validation (via drizzle-zod)

### Development Tools
- **typescript**: Type safety
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling
- **@replit/vite-plugin-***: Replit-specific development plugins

### Environment Requirements
- Node.js 20 or higher
- MongoDB connection (via `MONGO_URI` environment variable)
- PostgreSQL database (via `DATABASE_URL` for future migration)
- JWT secret (via `JWT_SECRET` environment variable)