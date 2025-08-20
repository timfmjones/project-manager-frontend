// frontend/claude.md
```markdown
# Frontend - Project Management UI

## Overview
React/TypeScript single-page application for project management with AI-powered insights, featuring voice/text input, Kanban boards, and real-time insight generation.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand with persistence
- **Styling**: TailwindCSS
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT tokens in localStorage

## Project Structure
frontend/
├── src/
│   ├── main.tsx           # React app entry point
│   ├── App.tsx           # Root component with routing
│   ├── routes.tsx        # Route definitions and guards
│   ├── lib/
│   │   ├── api.ts        # Axios instance and interceptors
│   │   ├── auth.ts       # Authentication functions
│   │   ├── store.ts      # Zustand global state
│   │   ├── types.ts      # TypeScript interfaces
│   │   └── utils.ts      # Utility functions
│   ├── components/
│   │   ├── layout/       # App-wide layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── ProjectGrid.tsx
│   │   ├── projects/     # Project-specific components
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── CreateProjectModal.tsx
│   │   │   ├── SummaryBanner.tsx
│   │   │   ├── SummarySuggestDialog.tsx
│   │   │   ├── RecordThoughts.tsx
│   │   │   ├── InsightsFeed.tsx
│   │   │   ├── InsightItem.tsx
│   │   │   ├── PinToggle.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── Column.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── NewTaskForm.tsx
│   │   │   ├── MilestonesPanel.tsx
│   │   │   ├── MilestoneItem.tsx
│   │   │   └── NewMilestoneForm.tsx
│   │   └── auth/         # Authentication components
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       └── GuestCTA.tsx
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── ProjectPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useProjects.ts
│   │   ├── useProject.ts
│   │   ├── useTasks.ts
│   │   ├── useInsights.ts
│   │   └── useMilestones.ts
│   └── styles/
│       └── index.css     # Global styles and Tailwind imports

## Component Architecture

### Page Components
- **HomePage**: Displays project grid with create button
- **ProjectPage**: Main workspace with all project features
- **LoginPage**: Email/password authentication
- **RegisterPage**: New account creation

### Feature Components

#### Project Management
- **ProjectCard**: Clickable card showing project summary
- **CreateProjectModal**: Form for new project creation
- **SummaryBanner**: Editable project description with AI suggestions
- **SummarySuggestDialog**: Prompt to accept AI-generated summaries

#### Idea Capture
- **RecordThoughts**: Text input and audio file upload interface
- **InsightsFeed**: Chronological display of AI insights
- **InsightItem**: Individual insight with summary, recommendations, and tasks
- **PinToggle**: Button to pin important insights

#### Task Management
- **KanbanBoard**: Three-column drag-and-drop task board
- **Column**: Individual Kanban column (To Do, In Progress, Done)
- **TaskCard**: Draggable task with title and description
- **NewTaskForm**: Modal for creating new tasks

#### Milestones
- **MilestonesPanel**: List of project milestones with due dates
- **MilestoneItem**: Individual milestone display
- **NewMilestoneForm**: Modal for creating milestones

### Custom Hooks
- **useProjects**: Fetches and manages project list
- **useProject**: Single project data and updates
- **useTasks**: Task CRUD operations and reordering
- **useInsights**: Insight fetching and pinning
- **useMilestones**: Milestone management

## State Management

### Global State (Zustand)
```typescript
{
  token: string | null,       // JWT authentication token
  user: {                     // Current user info
    id: string,
    email: string,
    isGuest?: boolean
  } | null,
  setAuth: (token, user) => void,
  logout: () => void
}
Local Component State

Form inputs use useState
Loading states managed locally
Modal visibility controlled by parent components
Drag-and-drop handled by HTML5 drag events

Routing Strategy

Protected routes redirect to login if no token
Authenticated users redirected from auth pages to home
Project pages require valid project ID
404 handling for invalid routes

API Integration
Axios Configuration

Base URL from environment variable
Authorization header automatically added
401 responses trigger logout and redirect
Request/response interceptors for error handling

Error Handling

Network errors displayed to user
Form validation errors shown inline
Global error boundary for unexpected errors
Loading states during async operations

Styling Approach
TailwindCSS Classes

Utility-first approach for all styling
Custom component classes in index.css
Responsive design with Tailwind breakpoints
Dark mode ready (future enhancement)

Design Patterns

Card-based layouts for content
Modal overlays for forms
Hover effects for interactive elements
Consistent spacing and typography

User Flows
First-Time User

Land on login page
Click "Continue as Guest" or register
Create first project
Record first thought (text/audio)
View AI-generated insights
Manage tasks on Kanban board

Returning User

Login with credentials
View project grid
Select existing project
Continue adding ideas and managing tasks
Track milestones and progress

Performance Optimizations

Lazy loading for route components
Memoization for expensive computations
Debounced API calls for updates
Optimistic UI updates for better UX
Virtual scrolling for long lists (future)

Accessibility Features

Semantic HTML elements
ARIA labels for interactive elements
Keyboard navigation support
Focus management in modals
Color contrast compliance

Development Commands
bashpnpm dev       # Start development server
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm lint      # Run ESLint
pnpm format    # Format with Prettier
Environment Variables
envVITE_API_BASE_URL=http://localhost:3001
Browser Support

Chrome 90+
Firefox 88+
Safari 14+
Edge 90+

Mobile Responsiveness

Responsive grid layouts
Touch-friendly interaction targets
Mobile-optimized Kanban board
Collapsible navigation (future)

Testing Strategy

Component testing with React Testing Library
Integration tests for user flows
Mock API responses for isolated testing
E2E tests with Playwright (future)

Common Patterns
Modal Management
typescriptconst [showModal, setShowModal] = useState(false);
// Open: setShowModal(true)
// Close: setShowModal(false)
// Submit: handleSubmit then close
Form Handling
typescriptconst [formData, setFormData] = useState(initialState);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
// Submit: validate, setLoading, API call, handle response
Data Fetching
typescriptuseEffect(() => {
  fetchData();
}, [dependencies]);
// Loading states, error handling, data setting
Security Considerations

JWT tokens stored in localStorage
XSS protection via React's default escaping
HTTPS enforced in production
Sensitive data never stored in frontend
Input sanitization before API calls

Deployment Checklist

Build optimization with Vite
Environment variables configured
API endpoint updated for production
Static asset optimization
CDN configuration
Error tracking setup
Analytics integration

Future Enhancements
Features

Real-time collaboration with WebSockets
Offline mode with service workers
Advanced search and filtering
Bulk operations for tasks
Keyboard shortcuts
Theme customization
Export functionality
Mobile app with React Native

Technical Improvements

Code splitting for large components
Virtualization for long lists
State persistence across sessions
Optimistic updates for all mutations
Progressive Web App features
Internationalization support
Advanced caching strategies

Troubleshooting
Common Issues

Blank page: Check console for errors, verify API URL
Auth loop: Clear localStorage, check token expiry
Drag-drop not working: Verify event handlers attached
Styles not loading: Check Tailwind configuration
API errors: Verify backend is running, check network tab

Debug Tips

Use React DevTools for component inspection
Check Network tab for API calls
Console.log for state debugging
React Query DevTools (if migrated)
Performance profiling for slowness

Code Style Guidelines

Functional components with hooks
TypeScript for all files
Props interfaces defined
Consistent naming conventions
Small, focused components
Custom hooks for logic reuse
Comments for complex logic