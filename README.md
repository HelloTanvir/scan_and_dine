# Scan and Dine

A modern restaurant QR code ordering system with real-time kitchen management, table service, and dashboard analytics.

## 🏗️ Architecture

This is a full-stack application with a **microservices-oriented** architecture:

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Spring Boot 3.5 with Java 24, PostgreSQL, and WebSocket support
- **Database**: PostgreSQL with Docker Compose
- **Package Management**: Yarn for frontend, Maven for backend

## 📁 Project Structure

```
scan_and_dine/
├── frontend/                    # Next.js React application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── dashboard/       # Admin dashboard
│   │   │   ├── kitchen/         # Kitchen management
│   │   │   ├── login/           # Authentication
│   │   │   └── tables/          # Table management
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Shared components
│   │   │   ├── layout/          # Layout components
│   │   │   └── ui/              # UI primitives
│   │   ├── features/            # Feature-based modules
│   │   │   ├── dashboard/       # Dashboard feature
│   │   │   ├── kitchen/         # Kitchen feature
│   │   │   └── tables/          # Tables feature
│   │   ├── lib/                 # Utilities and configurations
│   │   │   ├── api/             # API clients
│   │   │   ├── constants/       # App constants
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── services/        # Business logic services
│   │   │   ├── types/           # TypeScript definitions
│   │   │   └── utils/           # Helper functions
│   │   └── providers/           # Context providers
│   └── public/                  # Static assets
│
├── backend/                     # Spring Boot application
│   └── src/
│       ├── main/java/com/scan_and_dine/backend/
│       │   ├── common/          # Shared utilities
│       │   ├── config/          # Configuration classes
│       │   ├── exception/       # Exception handling
│       │   ├── modules/         # Feature modules
│       │   │   └── user/        # User management module
│       │   │       ├── controller/   # REST controllers
│       │   │       ├── dto/          # Data Transfer Objects
│       │   │       ├── entity/       # JPA entities
│       │   │       ├── mapper/       # MapStruct mappers
│       │   │       ├── repository/   # Data repositories
│       │   │       └── service/      # Business logic
│       │   ├── security/        # Security configuration
│       │   └── util/            # Utility classes
│       └── test/                # Test classes
│
└── Makefile                     # Development commands
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS, Radix UI
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts
- **QR Code**: qrcode library
- **Date Handling**: date-fns

### Backend
- **Framework**: Spring Boot 3.5
- **Language**: Java 24
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Validation**: Spring Boot Validation
- **WebSocket**: Spring WebSocket
- **Security**: BCrypt for password hashing
- **Mapping**: MapStruct
- **Build Tool**: Maven
- **Development**: Spring Boot DevTools

## 🛠️ Development Setup

### Prerequisites
- **Java 24** or higher
- **Node.js 18+** and **Yarn**
- **Docker** and **Docker Compose**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scan_and_dine
   ```

2. **Start the database**
   ```bash
   make db
   ```

3. **Start the backend**
   ```bash
   make backend
   ```

4. **Start the frontend** (in a new terminal)
   ```bash
   make frontend
   ```

5. **Start all services** (alternative)
   ```bash
   make all
   ```

### Individual Service Commands

- **Database only**: `make db`
- **Backend only**: `make backend`
- **Frontend only**: `make frontend`
- **Stop services**: `make stop`
- **Clean database**: `make clean`

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 📋 Features

- **QR Code Ordering**: Customers scan QR codes to access digital menus
- **Real-time Kitchen Management**: Live order updates and status tracking
- **Table Management**: Table assignment and service tracking
- **Dashboard Analytics**: Sales reports and restaurant insights
- **User Authentication**: Secure login for staff and administrators
- **WebSocket Integration**: Real-time communication between frontend and backend

## 🏗️ Development Guidelines

- **Modularity**: Features are organized in separate modules/directories
- **Reusability**: Components and services are designed for reuse
- **Type Safety**: Full TypeScript implementation with strict typing
- **Performance**: Optimized database queries and React components
- **Code Quality**: Following SOLID, DRY, and KISS principles

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Ensure all components are reusable and well-documented
3. Write optimized database queries (avoid N+1 problems)
4. Use Yarn for frontend package management
5. Follow the established module structure for new features

## 📝 Notes

- The project uses modular architecture for easy maintenance and scalability
- Frontend components are built with Tailwind CSS for consistent styling
- Backend follows Spring Boot best practices with clear separation of concerns
- Database operations are optimized for performance with bulk operations where applicable 