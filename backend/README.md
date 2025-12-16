# Movie Management Backend API

NestJS backend for movie management application.

## Installation

```bash
npm install
```

## Running the app

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`
Swagger documentation at `http://localhost:3001/api`

## Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - JWT secret key (default: 'your-secret-key')
- `FRONTEND_URL` - Frontend URL for CORS (default: 'http://localhost:3000')

## Database

Uses SQLite database (`movies.db`) for simplicity. In production, use PostgreSQL or MySQL.

