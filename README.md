# FlowGrid Frontend

Multi-tenant resource booking and real-time queue management web application.

## Project Status: Foundation Complete ✅

The project foundation has been established with proper folder structure, design system, and service layer.

### Completed:
- ✅ Project folder structure according to specification
- ✅ Design system with CSS variables and global styles
- ✅ Constants (routes, booking statuses, user roles)
- ✅ Utility functions (date, currency, booking status)
- ✅ API client with interceptors for auth and error handling
- ✅ All feature service modules (auth, organisations, resources, bookings, payments, waitlist, notifications, admin)
- ✅ Environment configuration setup

### Next Steps:
1. Create AuthContext and authentication components
2. Build UI components (Button, Input, Modal, Loader, StatusBadge, EmptyState)
3. Create layout components (PublicLayout, CustomerLayout, OrganisationLayout, AdminLayout)
4. Implement authentication pages (Login, Register)
5. Implement organisation registration and dashboard
6. Implement resource browsing and booking workflow
7. Add approval queue and organisation management
8. Implement payment flows and waitlist features

## Tech Stack

- **React 19.3.1** - UI library
- **JavaScript (ES6+)** - No TypeScript
- **Vite 8.3.4** - Build tool
- **React Router DOM 7.18.4** - Routing
- **Axios 1.20.0** - HTTP client
- **date-fns 4.4.0** - Date utilities
- **CSS3** - Styling with custom design system

## Project Structure

```
flowgrid-frontend/
├── public/              # Static assets
├── src/
│   ├── app/            # Application root and providers
│   ├── assets/         # Styles and static assets
│   │   └── styles/     # Global CSS and variables
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Base UI components
│   │   └── layout/     # Layout components
│   ├── features/       # Feature modules
│   │   ├── auth/       # Authentication
│   │   ├── organisations/ # Organisation management
│   │   ├── resources/  # Resource browsing and management
│   │   ├── bookings/   # Booking requests and approvals
│   │   ├── payments/   # Payment processing
│   │   ├── waitlist/   # Waitlist management
│   │   ├── notifications/ # Notifications
│   │   └── admin/      # Platform administration
│   ├── routes/         # Routing configuration
│   ├── services/       # API client
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── constants/      # Constants and enums
│   └── main.jsx        # Application entry point
├── .env.example        # Environment variables template
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env and configure your backend URL
# VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

The development server will start at `http://localhost:5173`

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=FlowGrid
VITE_ENV=development
```

## Design System

The application uses a custom design system defined in `/src/assets/styles/`:

- **variables.css** - Design tokens (colors, typography, spacing)
- **global.css** - Global styles and utility classes

### Key Features:
- Consistent color palette
- Typography scale
- Spacing system
- Reusable button styles
- Form components
- Badge and card components
- Responsive grid system
- Utility classes

## API Integration

All API calls go through the centralized `apiClient` in `/src/services/api.js`:

- Automatic auth token injection
- Centralized error handling
- 401/403/409 error handling
- HttpOnly cookie support

Feature-specific services are organized by domain:
- `authService` - Authentication
- `organisationService` - Organisation management
- `resourceService` - Resource operations
- `bookingService` - Booking operations
- `paymentService` - Payment processing
- `waitlistService` - Waitlist operations
- `notificationService` - Notifications
- `adminService` - Platform administration

## Key Business Rules

1. Users must sign in before browsing resources
2. Every booking requires organisation approval (no auto-confirmation)
3. Resources can be free or paid
4. Pending bookings temporarily hold slots until decision deadline
5. Backend determines actual booking and payment state
6. Payment processing uses trusted payment provider (never store card details)
7. Frontend route guards improve UX but backend enforces all security

## Development Guidelines

- Keep components focused and feature-specific
- Use service modules for API calls, not direct axios in components
- Reuse UI components from `/src/components/ui/`
- Follow established folder structure
- Handle loading, error, and empty states
- Never trust client-supplied user IDs
- Let backend be source of truth for permissions and state

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid and Flexbox

## License

Proprietary - All rights reserved
