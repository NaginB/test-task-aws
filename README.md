# Movie Management Application

Full-stack movie management application built with Next.js (frontend) and NestJS (backend).

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

1. **Backend Setup:**

```bash
cd backend
npm install
```

2. **Frontend Setup:**

```bash
cd frontend
npm install
```

### Environment Variables

**Backend** - Create `backend/.env`:

```
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Start Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run start:dev
```

Backend runs on `http://localhost:3001`
API docs: `http://localhost:3001/api`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

### Default Login

- Email: `user@example.com`
- Password: `password123`

## Database Management

### Reset Database

```bash
cd backend
npm run reset
```

Drops all tables and recreates schema (clean slate).

### Seed Database

```bash
cd backend
npm run seed
```

Populates database with 25 sample movies.

### Reset & Seed (Fresh Start)

```bash
cd backend
npm run reset && npm run seed
```

## Important Commands

### Backend

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run reset` - Reset database
- `npm run seed` - Seed database

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Project Structure

```
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/     # Authentication
│   │   ├── movies/    # Movie CRUD
│   │   ├── users/    # User management
│   │   ├── seed.ts   # Database seeding
│   │   └── reset.ts  # Database reset
│   └── package.json
├── frontend/         # Next.js App
│   ├── app/          # Pages & routes
│   ├── components/   # React components
│   ├── store/        # State management
│   └── package.json
└── README.md
```

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeORM, SQLite, JWT Auth
- **State:** Zustand
- **Forms:** React Hook Form

## API Endpoints

- `POST /auth/login` - Login
- `GET /movies` - List movies (paginated)
- `POST /movies` - Create movie
- `GET /movies/:id` - Get movie
- `PATCH /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

All movie endpoints require JWT authentication.
