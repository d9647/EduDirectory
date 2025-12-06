# Educational Yellow Pages

A comprehensive educational platform connecting users with tutoring providers, summer camps, internships, jobs, community events, and educational resources.

## Features

### Core Functionality
- **Tutoring Providers** - Browse and discover tutoring services with detailed profiles, subjects, and pricing
- **Summer Camps** - Explore summer camp programs with filters for age groups, activities, and dates
- **Internships** - Find internship opportunities filtered by field, duration, and compensation
- **Jobs** - Search job listings with industry and experience level filters
- **Community Events** - Discover local educational events with registration tracking
- **Planning Guides** - Access educational planning resources (admin-curated content)

### User Features
- **Advanced Search & Filtering** - Debounced search across names, descriptions, locations, and categories
- **Reviews & Ratings** - One review per user per listing with thumbs-up approval system
- **Bookmarking** - Save listings for later reference
- **User Profiles** - Customizable profiles with avatars and education information
- **Contribution Badges** - Earn badges (New, Contributor, Active Member, Top Contributor) based on platform activity

### Admin Features
- **Listing Management** - Full CRUD operations for all listing types
- **User Management** - View and manage platform users with search and pagination
- **CSV Import** - Bulk import listings via CSV files
- **Content Moderation** - Approve pending submissions and manage reviews
- **Guides Editor** - Create and manage educational planning guides

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** (Radix UI) for accessible components
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for client-side routing

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** (Neon serverless)
- **Express Sessions** with PostgreSQL store

### Authentication
- **Replit Auth** via OpenID Connect

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/educational-yellow-pages.git
cd educational-yellow-pages
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_id (for Replit Auth)
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Shared components (badges, cards, etc.)
│   │   │   ├── layout/     # Header, footer, navigation
│   │   │   └── ui/         # Shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and query client
│   │   ├── pages/          # Route pages
│   │   └── App.tsx         # Main app with routing
│   └── index.html
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations interface
│   ├── auth.ts             # Authentication middleware
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle ORM schemas and Zod types
└── package.json
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Log out user
- `GET /api/auth/contribution-stats` - Get user contribution statistics

### Listings
- `GET /api/tutoring-providers` - List tutoring providers
- `GET /api/summer-camps` - List summer camps
- `GET /api/internships` - List internships
- `GET /api/jobs` - List jobs
- `GET /api/events` - List community events

### Reviews
- `GET /api/reviews/:type/:id` - Get reviews for a listing
- `POST /api/reviews` - Submit a review
- `POST /api/reviews/:id/approve` - Approve a review

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/import/:type` - Import listings via CSV
- `DELETE /api/admin/:type/:id` - Delete a listing

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session encryption |
| `REPL_ID` | Replit app ID (for Replit Auth) |
| `BYPASS_AUTH` | Set to `true` for development testing |

## Development

### Testing Without Authentication

For development testing, set `BYPASS_AUTH=true` in your environment to skip the authentication flow and use a test user.

### Database Migrations

This project uses Drizzle ORM. To push schema changes:
```bash
npm run db:push
```

### Code Style

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations
