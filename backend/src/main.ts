import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const usersService = app.get(UsersService);
  await usersService.seedDefaultUser();

  const config = new DocumentBuilder()
    .setTitle('Movie Management API')
    .setDescription('API for managing movies')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  // Log server start
  // Explicitly mention 3001 as the default port for clarity
  // even if PORT env is customized.
  // This helps when running locally or in containers.
  // Example output: "Backend started on port 3001"
  // or "Backend started on port 4000" if PORT=4000.
  // Keep this log simple for deployment logs.
  console.log(`Backend started on port ${port}`);
}
bootstrap();
