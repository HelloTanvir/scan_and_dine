# Scan and Dine - Restaurant Management System

A modern restaurant management system built with Next.js 15, TypeScript, and Tailwind CSS, featuring QR code ordering and real-time kitchen management.

## 🏗️ Architecture

This project follows a **Feature-Based Architecture** with **Clean Architecture principles**, ensuring modularity, reusability, and maintainability.

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── kitchen/           # Kitchen management page
│   ├── qr-codes/          # QR code management page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to dashboard)
├── components/            # Shared UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   └── common/           # Common reusable components
├── features/             # Feature-based modules
│   ├── dashboard/        # Dashboard feature
│   ├── kitchen/          # Kitchen management feature
│   └── qr-codes/         # QR code management feature
├── lib/                  # Shared utilities and services
│   ├── api/             # API clients
│   ├── hooks/           # Custom hooks
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── constants/       # Application constants
│   └── utils/           # Utility functions
└── providers/           # Context providers
```

### Feature Structure

Each feature follows a consistent structure:

```
features/[feature-name]/
├── components/          # Feature-specific components
├── hooks/              # Feature-specific hooks
├── services/           # Feature business logic
├── types/              # Feature-specific types (if needed)
└── utils/              # Feature-specific utilities (if needed)
```

## 🎯 Design Principles

### SOLID Principles
- **Single Responsibility**: Each module has one reason to change
- **Open/Closed**: Easy to extend without modifying existing code
- **Liskov Substitution**: Components can be replaced with their subtypes
- **Interface Segregation**: Clients depend only on interfaces they use
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### DRY (Don't Repeat Yourself)
- Shared logic in reusable modules
- Common components and hooks
- Centralized constants and types

### KISS (Keep It Simple, Stupid)
- Simple, focused modules
- Clear naming conventions
- Minimal complexity

## 🚀 Performance Optimizations

### React Optimizations
- **React.memo**: Used for expensive components to prevent unnecessary re-renders
- **useCallback**: Memoized callbacks to prevent child re-renders
- **useMemo**: Memoized expensive calculations
- **Suspense**: Loading states for better UX

### Next.js Optimizations
- **App Router**: Latest Next.js routing system
- **Server Components**: Default server-side rendering
- **Font Optimization**: Google Fonts with `display: swap`
- **Metadata API**: Proper SEO optimization
- **Link Component**: Optimized navigation

### Bundle Optimizations
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Feature-based lazy loading
- **Dynamic Imports**: Load components when needed

## 🛠️ Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Package Manager**: Yarn

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd scan-and-dine-frontend

# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 🔧 Development Guidelines

### Component Guidelines
1. Use functional components with hooks
2. Implement proper TypeScript types
3. Use React.memo for performance-critical components
4. Follow the component naming convention: PascalCase
5. Export components as named exports when possible

### Hook Guidelines
1. Prefix custom hooks with "use"
2. Return objects with named properties
3. Use useCallback for functions passed as props
4. Implement proper error handling

### Service Guidelines
1. Use classes for services with multiple methods
2. Implement proper error handling
3. Use async/await for asynchronous operations
4. Mock data for development, prepare for real API integration

### Styling Guidelines
1. Use Tailwind CSS utility classes
2. Create reusable component variants with `cn()` utility
3. Follow mobile-first responsive design
4. Use semantic color names from the design system

## 🎨 Design System

### Colors
- **Primary**: Green (`#16a34a`)
- **Secondary**: Light Green (`#22c55e`)
- **Success**: Green variants
- **Warning**: Amber/Yellow
- **Error**: Red
- **Neutral**: Gray variants

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Font Sizes**: Tailwind's default scale
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 📱 Features

### Dashboard
- Revenue and order statistics
- Interactive charts (daily orders, menu categories)
- Recent orders table
- Real-time data updates

### Kitchen Management
- Order status tracking (pending, preparing, ready, completed)
- Priority-based order management
- Real-time order updates
- Tabbed interface for different order states

### QR Code Management
- Table management
- QR code generation
- Print and download functionality
- Table status tracking

## 🔄 State Management

### Local State
- React hooks (`useState`, `useReducer`)
- Custom hooks for complex state logic

### Server State
- Custom `useApi` hook for API calls
- Loading and error states
- Automatic refetching capabilities

### Global State
- Context API for app-wide state (when needed)
- Provider pattern for state distribution

## 🧪 Testing Strategy

### Unit Testing
- Test individual components and hooks
- Mock external dependencies
- Focus on business logic

### Integration Testing
- Test feature workflows
- Test API integrations
- Test user interactions

### E2E Testing
- Test complete user journeys
- Test across different devices
- Test performance metrics

## 🚀 Deployment

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Process
1. Type checking with TypeScript
2. Linting with ESLint
3. Building with Next.js
4. Static analysis and optimization

## 📈 Performance Monitoring

### Core Web Vitals
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift

### Monitoring Tools
- Next.js Analytics
- Web Vitals reporting
- Error boundary logging

## 🤝 Contributing

1. Follow the established architecture patterns
2. Write TypeScript types for all new code
3. Add proper error handling
4. Test your changes thoroughly
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.
