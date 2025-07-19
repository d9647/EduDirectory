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

**Complete Admin Edit Form Restructure (Latest Update - January 15, 2025)**
- Completely rebuilt all Admin Edit forms to exactly match their corresponding submission form structures
- Implemented proper checkbox selections for categories, subjects, tags, job types, schedules, and duration across all forms
- Added visual badge display for selected options with removal functionality
- Enhanced Tutoring Provider edit form with checkbox-based category and subject selection matching submission form
- Rebuilt Summer Camps edit form with proper checkbox selections for categories, program tags, and selectivity level dropdown
- Restructured Internships edit form with organized sections: Categories, Internship Details, Important Dates, Additional Information
- Rebuilt Jobs edit form with structured sections: Categories, Job Details (job types, schedule, salary range), Important Dates, Additional Information
- Added proper dropdown selections for compensation types, selectivity levels, cost ranges, and salary types
- Implemented checkbox controls for boolean fields: scholarship, mentorship, training, ongoing position
- Enhanced form organization with clear section headers and consistent layout across all business types
- All admin edit forms now provide identical user experience to submission forms with matching styling and functionality

**Internship Selectivity Level Implementation (Latest Update - January 17, 2025)**
- Added selectivity level field to internship database schema using same structure as summer camps
- Enhanced internship business submission form with selectivity level dropdown featuring color-coded visual indicators
- Updated admin edit modal to include selectivity level field for internships with proper form validation
- Added selectivity level filtering to internships API routes and frontend page with checkbox interface
- Enhanced internships listing table with new selectivity level column displaying color-coded badges
- Extended filter sidebar to support selectivity level filtering for both camps and internships
- Updated storage layer to include selectivity level in internship queries and display methods
- Complete feature parity: internships now support same selectivity level functionality as summer camps
- All selectivity levels (Open Enrollment, Application-Based, Competitive, Very Competitive) work across forms, filters, and displays

**Delivery Mode Multiple Selection Implementation (Latest Update - January 17, 2025)**
- Successfully converted delivery mode field from single dropdown to multiple checkbox selection across all business types
- Updated database schema from varchar to text[] for delivery_mode field with safe data migration preserving existing values
- Implemented comprehensive checkbox interface in business submission forms with visual badge display for selected modes
- Updated admin edit modal to match submission form with same checkbox interface for delivery mode selection
- Enhanced listing detail modal and listing table to properly display delivery mode arrays with comma separation
- Fixed location display logic to handle delivery mode arrays when checking for remote delivery
- Resolved delivery mode display formatting by ensuring consistent use of formatArrayField utility function
- Complete delivery mode functionality: users can now select multiple modes (In-person, Remote, Hybrid) for enhanced flexibility
- All forms, displays, and admin tools now consistently support multiple delivery mode selection with proper comma-separated display

**Comprehensive Zipcode Field Implementation (Latest Update - January 17, 2025)**
- Added zipcode field to database schema for all business types: tutoring providers, summer camps, internships, and jobs
- Updated storage layer queries to include zipcode field selection across all listing retrieval methods
- Enhanced business submission forms with zipcode input fields using 3-column grid layout (city, state, zipcode)
- Updated admin edit modal to include zipcode fields for all business types with proper form validation
- Enhanced listing detail modal to display zipcode as part of complete address information
- Updated listing tables to show zipcode in location columns alongside city and state
- Improved bookmarks page to display zipcode with location data for comprehensive address visibility
- Complete address information now includes street address, city, state, and zipcode across all forms and displays

**Admin Review Management Enhancement (Latest Update - January 17, 2025)**
- Extended admin permissions to edit and delete all reviews, not just their own
- Updated review display to show edit buttons for admin users on any review
- Enhanced backend authorization to check admin role for review operations
- Fixed review editor form to properly load existing data when editing
- Improved delete functionality to allow admin deletion of any review
- Added getReviewById method for secure permission validation
- Maintained user restrictions - regular users can only edit/delete their own reviews

**Mobile Responsive Design Implementation (Latest Update - January 17, 2025)**
- Implemented comprehensive mobile-first responsive design across all components
- Added extra-small breakpoint (xs: 475px) to Tailwind configuration for better mobile support
- Optimized header navigation with responsive text sizing and mobile-friendly button layouts
- Enhanced listing table with mobile card layout - tables convert to stacked cards on mobile screens
- Improved filter sidebar with responsive spacing, smaller text, and mobile-optimized controls
- Updated all page layouts (tutoring, camps, internships, jobs) with mobile padding and spacing
- Enhanced listing detail modal with responsive sizing, mobile-friendly layout, and touch-optimized buttons
- Optimized landing page with responsive typography, mobile-friendly hero section, and adaptive grid layouts
- Improved pagination controls with responsive text sizing and mobile-friendly button spacing
- Enhanced form layouts and controls for better mobile usability and touch interaction
- Added mobile-specific navigation improvements with proper spacing and sizing for touch devices

**One Review Per User Per Listing System (Latest Update - January 17, 2025)**
- Implemented comprehensive duplicate review prevention system
- Added hasUserReviewed method to storage layer for checking existing reviews by user
- Enhanced createReview method with duplicate review validation before insertion
- Updated review creation API route with proper error handling for duplicate attempts
- Added user-reviewed status check API endpoint for frontend validation
- Enhanced review modal with real-time duplicate review detection and warning messages
- Disabled submit button when user has already reviewed a listing
- Added visual warning alert with clear messaging about one-review-per-listing policy
- Implemented proper error handling with user-friendly messages for duplicate review attempts
- System now prevents multiple reviews from same user on same listing at both frontend and backend levels

**Forum Implementation Removal (Latest Update - January 19, 2025)**
- Completely removed forum feature from the platform as per user request
- Removed all forum-related components, pages, and navigation elements
- Cleaned up database schema by dropping forum_posts and forum_replies tables
- Removed all forum-related API routes and storage methods
- Updated application to focus purely on core yellow pages functionality
- Streamlined navigation header and application routing without forum links

**Complete Mobile UI Rollback (Latest Update - January 19, 2025)**
- Completely rolled back all mobile responsive improvements per user request
- Removed mobile collapsible filter sidebar and simplified card layouts 
- Restored original desktop-only filter sidebar without mobile components
- Removed mobile card layout from listing tables, restored table-only display
- Reverted page layouts to original desktop-focused design without responsive classes
- Restored original filter value handling with empty strings and undefined values
- Removed mobile-specific imports and components (filter-sidebar-mobile.tsx)
- Platform now focuses on desktop experience as originally designed
- Maintained accessibility improvements (DialogDescription components) where applicable

**Debounced Search Implementation with Tag Support (Latest Update - January 19, 2025)**
- Implemented debounced search functionality to prevent immediate API calls on every keystroke
- Search now waits 500ms after user stops typing before making API requests
- Enhanced search functionality to include categories, subjects, and tags across all listing types
- Updated tutoring providers search to include categories and subjects in search results
- Enhanced summer camps search to include categories and tags in search query
- Improved internships search to include types/categories in search functionality
- Updated jobs search to include categories in search results
- Fixed search input focus issue that caused input to lose focus after typing one character
- Search input now allows continuous typing without interruption
- Complete search enhancement with proper debouncing provides smooth user experience

**Mobile Responsive Design Implementation (Latest Update - January 19, 2025)**
- Implemented comprehensive mobile-first responsive design across all listing components
- Created dual display system: mobile card view for screens below lg breakpoint, desktop table view for larger screens
- Enhanced listing table with mobile card component featuring compact layout and essential information display
- Optimized filter sidebar with responsive spacing, smaller text sizing, and mobile-friendly controls
- Added responsive breakpoints (xs: 475px) and updated all page layouts with mobile padding and spacing
- Improved pagination controls with responsive text sizing and mobile-friendly button layouts
- Enhanced header navigation with responsive spacing and mobile-optimized dropdown navigation
- Updated all listing pages (tutoring, camps, internships, jobs) with mobile-responsive layouts
- Mobile card view includes: listing name, description preview, location, rating, thumbs up count, category badges, and view button
- Desktop table view maintains full functionality with sortable columns and comprehensive data display
- Loading states and empty states optimized for both mobile and desktop viewing experiences

**Admin Dashboard Search Fix (Latest Update - January 19, 2025)**
- Fixed critical admin dashboard search functionality in "Edit Live Listings" tab
- Added missing searchListings method to storage layer with comprehensive search capabilities
- Implemented database search across name, description, location, and city fields for all listing types
- Enhanced search to work with tutoring providers, summer camps, internships, and jobs
- Search functionality now returns up to 20 results ordered by creation date
- Admin can now successfully search and edit live published listings through the dashboard
- Resolved TypeError: storage.searchListings is not a function that was breaking admin search

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