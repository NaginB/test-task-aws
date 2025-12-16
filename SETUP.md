# Setup Instructions

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Or manually create `backend/.env`:
```
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run start:dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Or manually create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

### 4. Default Login Credentials

- Email: `user@example.com`
- Password: `password123`

## Docker Setup

```bash
docker-compose up --build
```

This will start both services with default environment variables.

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `3001` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-change-in-production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

**Important:** Change `JWT_SECRET` to a strong random string in production!





