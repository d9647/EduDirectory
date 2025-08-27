# Educational Yellow Pages Application

## Overview

This is a full-stack web application designed as an educational yellow pages platform. Its primary purpose is to connect users with various educational and career opportunities, including tutoring providers, summer camps, internships, and job opportunities. The platform aims to be a comprehensive ecosystem for students' educational journeys, providing detailed listings, community reviews, and planning guides. Key capabilities include advanced filtering, search functionality, and a robust system for submitting and managing listings.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred UI design style: Clean, minimal layouts without redundant headers.

## System Architecture

The application employs a modern full-stack architecture, ensuring clear separation between the frontend and backend.

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite for building.
- **UI/UX**: Clean, minimalist design. UI components are built using Shadcn/ui (on Radix UI primitives) and styled with Tailwind CSS, including custom theming. The homepage features a redesigned hero section ("Your complete educational journey") and an enhanced feature grid covering six sections: Tutoring & Learning, Camps & Programs, Internships & Jobs, Community Events, Planning Guides, and Reviews & Community.
- **State Management**: TanStack Query manages server-side state, while React hooks handle local state.
- **Routing**: Wouter is used for client-side routing.
- **Form Handling**: React Hook Form with Zod for validation.
- **Mobile Responsiveness**: Implemented a dual display system for listings, showing a mobile card view below the `lg` breakpoint and a desktop table view for larger screens. All components are designed with a mobile-first approach, including responsive layouts for admin dashboards and forms.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database**: PostgreSQL, managed with Drizzle ORM for type-safe operations.
- **Session Management**: Express sessions with a PostgreSQL store.
- **Authentication**: Replit Auth integration via OpenID Connect.

### Technical Implementations & Feature Specifications
- **Data Models**: Manages Tutoring Providers, Summer Camps, Internships, and Jobs, each with specific fields like categories, subjects, selectivity levels, durations, and compensation details.
- **Listing Management**: Comprehensive submission forms with validation. Admin users have full edit and delete capabilities for both pending and live listings, with forms mirroring user submission forms.
- **Search & Filtering**: Debounced search functionality (500ms delay) across names, descriptions, locations, and categories/subjects/tags. Advanced filtering with multiple criteria and pagination for all listing types.
- **User Interaction**: Features include a one-review-per-user-per-listing system, a "thumbs up" approval mechanism, and user bookmarking.
- **Guides**: An "Admin-only" section for educational guides, such as a 4-Year High School Planning Guide with an interactive timeline, providing college preparation guidance.
- **User Management**: Admin dashboard includes user management with pagination, search, and detailed user profile views (including avatars, contact, and education info).
- **CSV Import**: Robust CSV import functionality for all business types with proper field mapping and error handling.
- **Contributor System**: Contributor information (name, badges) is displayed on individual listing detail modals, with badges indicating user activity levels (New, Contributor, Active Member, Top Contributor) based on contributions.

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL (serverless).
- **Authentication**: Replit Auth service.
- **Build System**: Vite.
- **Development Environment**: Replit-specific tooling.

### Key Libraries
- **UI Framework**: React 18.
- **ORM**: Drizzle ORM (with Neon adapter).
- **Validation**: Zod.
- **Styling**: Tailwind CSS, Radix UI components.
- **State Management**: TanStack Query.
- **Forms**: React Hook Form.