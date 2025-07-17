# Educational Yellow Pages Application

## Overview

This is a full-stack web application for an educational yellow pages platform that connects users with tutoring providers, summer camps, internships, and job opportunities. The application features a clean, minimalist design with comprehensive filtering, search, and listing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred UI design style: Clean, minimal layouts without redundant headers.

## Recent Changes

**January 14, 2025**
- Updated tutoring provider categories and subjects structure:
  - Changed "Other Languages" to "Languages" with specific language options
  - Changed "Counselors" to "Counseling" with specific counseling types
  - Added new Humanities subjects: Drama, Philosophy, Ethics, Religious Studies
  - Expanded Languages: Chinese, Japanese, Korean, Spanish, French, American Sign Language, German, Latin, Greek
  - Expanded Music & Arts: Piano, Strings, Brass, Percussion, Woodwinds, Painting, Drawing, Sculpture
  - Added specific Counseling types: Academic, College, Mental Health, Career, Family Counseling
- Updated Google Sheets template to reflect new categories and subjects structure
- Fixed thumbs up counter bug: resolved SQL query issues in Drizzle ORM by changing from table objects to raw table names
- Enhanced internship business submission form with 7 new fields:
  - Street address (optional field for location details)
  - Minimum age requirement (14-25 range with input validation)
  - Duration selection (multiple checkboxes: Summer, Academic Year, Semester, Part-time, Full-time, Remote, In-Office, Hybrid)
  - Application open date (date picker field)
  - Application deadline date (date picker field)
  - Prerequisites (textarea for requirements and qualifications)
  - Tuition field (text input for cost information)
- Updated database schema and form validation to support new internship fields
- Implemented comprehensive form enhancements across all business types:
  - Added delivery mode field (In-person, Remote, Hybrid) to tutoring, camps, internships, and jobs
  - Updated internship form: changed "Duration (Multiple selections allowed)" to "Duration", removed location-based duration options (Remote, In-Office, Hybrid), changed "Types" to "Categories"
  - Enhanced job form: added street address, salary range with hourly/monthly/yearly options, job type selection, opening/closing dates, ongoing position option, removed remote position checkbox
  - Removed remote position checkbox from internship and job forms
- Fixed page consistency across all business types:
  - Changed "Types" to "Categories" for internships throughout all components (forms, filters, listing modals)
  - Fixed thumbs up counter display by ensuring integer values in listing tables
  - Added rating, reviews, and thumbs up functionality to Internships and Jobs pages (previously only on Tutoring)
  - Enhanced column visibility in Internships and Jobs pages with additional fields (duration, job type, rating, thumbs up count)
  - Added rating and thumbs up columns to Summer Camps page, positioned after selectivity column for better visibility

**Job Form Enhancement (Latest Update)**
- Successfully converted job type field from single dropdown to multiple checkboxes, allowing users to select both part-time and full-time simultaneously
- Added new "Schedule" field with multiple checkbox options: Night shift, Day shift, Monday to Friday, Weekends
- Updated database schema to support array fields for job types and schedule using PostgreSQL text[] columns
- Fixed controlled input warnings by providing proper default values for all form fields
- Enhanced text formatting system with comprehensive description parsing:
  - Support for bold text formatting (**text** becomes bold)
  - Paragraph separation for better readability
  - Created formatDescription utility for consistent text display across all listing modals
- Improved listing display with comprehensive information visibility:
  - All submitted fields now display properly in listing detail modals
  - Enhanced job listings show job types, schedule, salary information, and delivery mode
  - Added proper formatting for array fields, dates, salary ranges, and boolean values
  - Implemented consistent badge display for categories, types, subjects, job types, and schedules
- Completely rebuilt listing detail modal with comprehensive field display:
  - Fixed missing field display issues across all listing types (tutoring, camps, internships, jobs)
  - Added dedicated sections for Important Dates, Prerequisites, Job Details, and Program Information
  - Proper display of all form fields including delivery mode, minimum age, selectivity level, scholarships, mentorship, training
  - Enhanced layout with organized sections and proper visual hierarchy
  - Fixed "Due" date display issue for internships and comprehensive field visibility for jobs

**Admin Edit Functionality (Latest Update - January 14, 2025)**
- Implemented comprehensive admin editing capabilities for all business listing types
- Added update methods to storage layer: updateTutoringProvider, updateSummerCamp, updateInternship, updateJob
- Created new API endpoint: PUT /api/admin/edit/:type/:id for updating listings
- Built AdminEditModal component with type-specific form fields for each listing category
- Enhanced admin dashboard with edit buttons alongside approve buttons for pending listings
- Admin can now correct errors in business submissions before approval
- Modal includes comprehensive form fields: name/title, description, location, contact info, categories/subjects/tags, and type-specific fields
- Proper form validation and error handling with toast notifications
- Edit functionality helps prevent approval delays due to initial entry errors

**Live Listing Edit Capability (Latest Update - January 14, 2025)**
- Extended admin edit functionality to include already published/approved listings
- Added "Edit Live Listings" tab to admin dashboard for managing approved content
- Created getLiveListings storage method and API endpoint: GET /api/admin/live-listings
- Admin can now edit published listings to fix errors discovered after approval
- Displays up to 50 recent listings per category with edit buttons
- Cache invalidation ensures listing changes appear immediately across all pages
- Comprehensive edit coverage: pending submissions, approved listings, and live content
- Resolves post-publication error correction without requiring new submissions

**Enhanced Admin Edit Modal with Form Structure Matching (Latest Update - January 15, 2025)**
- Completely rebuilt AdminEditModal to match submission form structure exactly with organized sections
- Added proper checkbox selections for categories, subjects, tags, and other multi-select fields with visual badges
- Implemented photo upload/replace functionality with preview, file validation, and existing image display
- Enhanced form organization with structured sections: Basic Information, Location, Contact Information, Categories & Subjects
- Updated Tutoring Provider edit form with checkbox-based category and subject selection matching submission form
- Rebuilt Summer Camps edit form with proper checkbox selections for categories and program tags
- Added visual selectivity level selector with colored indicators for summer camps
- Enhanced cost range selection with proper dropdown options for summer camps
- Improved date field organization with separate sections for Important Dates and Additional Information
- All edit modals now provide the same user experience as submission forms with consistent styling and functionality

**Comprehensive Admin Edit Fixes (Latest Update - January 14, 2025)**
- Fixed date conversion issues in admin edit routes: properly convert HTML date input strings to Date objects for database compatibility
- Removed redundant address and photoUrl fields from tutoring provider edit section to eliminate field duplication
- Enhanced data processing with comprehensive field type conversion: boolean fields, numeric fields, decimal fields for salary ranges
- Added complete boolean field editing support: hasScholarship, applicationAvailable, isRemote, hasMentorship, hasTraining, isOngoing
- Improved location display logic to prioritize location field over city/state when available across all listing pages
- Enhanced admin edit modal with salary range fields for jobs: salaryMin, salaryMax, salaryType with proper number input validation
- Fixed array field handling for categories, subjects, types, tags, duration, jobType, and schedule fields
- Added protected field filtering to prevent editing of id, timestamps, and approval status through admin interface
- Comprehensive error handling and debugging for admin edit functionality with detailed logging

**Migration to Replit Environment (Latest Update - January 15, 2025)**
- Successfully migrated project from Replit Agent to Replit environment
- Created PostgreSQL database with all required tables and proper schema
- Configured session management with secure session secrets using dotenv
- Fixed database table creation issues and pushed complete schema using Drizzle
- Verified all database tables match schema definitions perfectly
- Created comprehensive Google Sheets import template (google-sheets-template.html)
- Template includes exact column headers for all business types with proper field documentation
- All array fields, boolean fields, and data type requirements clearly documented
- Migration completed successfully with application running on port 5000

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theming and CSS variables
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit Auth integration with OpenID Connect

## Key Components

### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts`
- **Migration Strategy**: Drizzle Kit for database migrations
- **Connection**: Neon serverless PostgreSQL with WebSocket support

### Authentication System
- **Provider**: Replit Auth with OIDC
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTPOnly cookies with secure session handling

### Data Models
The application manages four main entity types:
1. **Tutoring Providers**: Educational service providers with categorized subjects
2. **Summer Camps**: Camps with difficulty levels and specialized categories
3. **Internships**: Professional opportunities with compensation and mentorship details
4. **Jobs**: Employment opportunities with age requirements and training programs

### UI Components
- **Layout**: Header with navigation, responsive sidebar filtering
- **Tables**: Sortable data tables with pagination and column sorting
- **Forms**: Dynamic submission forms with validation
- **Modals**: Detail views and review submission dialogs
- **Filtering**: Advanced filtering with multiple criteria and search

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints under `/api/` prefix
2. **Query Management**: TanStack Query handles caching, background updates, and error states
3. **Form Submission**: React Hook Form with Zod validation before API calls
4. **Real-time Features**: Session-based authentication state management

### Search and Filtering
1. **Frontend**: Filter sidebar collects user criteria
2. **Query Building**: URLSearchParams construction for API requests
3. **Backend Processing**: SQL query building with Drizzle ORM
4. **Results**: Paginated responses with total counts

### User Interactions
1. **Bookmarking**: Users can save listings for later viewing
2. **Reviews**: Rating and review system with CRUD operations
3. **Thumbs Up**: Simple approval mechanism for listings
4. **Reporting**: Content moderation through user reports

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Replit Auth service
- **Build System**: Vite with React plugin
- **Development**: Replit-specific tooling and runtime error handling

### Key Libraries
- **UI Framework**: React 18 with TypeScript
- **Database**: Drizzle ORM with Neon adapter
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with resolver integration

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js with tsx for TypeScript execution
- **Hot Reload**: Vite dev server with HMR
- **Database**: Development database with migration support
- **Authentication**: Replit Auth with development configuration

### Production Build
- **Frontend**: Vite build to static assets in `dist/public`
- **Backend**: ESBuild bundling to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: Production PostgreSQL with connection pooling

### Key Configuration
- **Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`, `REPLIT_DOMAINS`
- **Build Process**: Parallel frontend and backend compilation
- **Asset Management**: Vite handles asset optimization and bundling
- **Session Management**: PostgreSQL-backed sessions for scalability

The application is designed for deployment on Replit with integrated authentication and database provisioning, but can be adapted for other platforms with minimal configuration changes.