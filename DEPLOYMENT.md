# Deployment Guide

## AWS Deployment

### Backend Deployment (EC2/ECS)

#### Option 1: EC2 with Docker

1. Launch an EC2 instance (Ubuntu 22.04 LTS)
2. Install Docker:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

3. Clone repository and build:
```bash
git clone <repository-url>
cd test-task/backend
docker build -t movie-backend .
```

4. Run container:
```bash
docker run -d \
  -p 3001:3001 \
  -e JWT_SECRET=<your-secret-key> \
  -e FRONTEND_URL=<your-frontend-url> \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/movies.db:/app/movies.db \
  movie-backend
```

#### Option 2: ECS Fargate

1. Build and push to ECR:
```bash
aws ecr create-repository --repository-name movie-backend
docker build -t movie-backend .
docker tag movie-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/movie-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/movie-backend:latest
```

2. Create ECS task definition and service
3. Configure environment variables and volumes

### Frontend Deployment

#### Option 1: AWS Amplify

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Output directory: `frontend/.next`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

#### Option 2: EC2 with Docker

1. Build frontend Docker image:
```bash
cd frontend
docker build -t movie-frontend .
```

2. Run container:
```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=<your-backend-url> \
  movie-frontend
```

#### Option 3: Vercel/Netlify

1. Connect repository
2. Set environment variables
3. Deploy

### Database (Production)

For production, replace SQLite with PostgreSQL:

1. Update `backend/src/app.module.ts`:
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
}),
```

2. Use RDS PostgreSQL instance

### Environment Variables

#### Backend (.env)
```
PORT=3001
JWT_SECRET=<strong-secret-key>
FRONTEND_URL=https://your-frontend-domain.com
DB_HOST=<rds-endpoint>
DB_PORT=5432
DB_USERNAME=<db-user>
DB_PASSWORD=<db-password>
DB_NAME=movies
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Security Best Practices

1. Use AWS Secrets Manager for sensitive data
2. Enable HTTPS with SSL certificates (AWS Certificate Manager)
3. Configure security groups to restrict access
4. Use IAM roles for EC2/ECS permissions
5. Enable CloudWatch logging
6. Set up auto-scaling for high availability
7. Use AWS WAF for API protection
8. Regular security updates

### Monitoring

1. CloudWatch for logs and metrics
2. Set up alarms for errors and high latency
3. Use AWS X-Ray for distributed tracing

