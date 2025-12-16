import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { MoviesService } from './movies/movies.service';

const demoMovies = [
  {
    title: 'The Matrix',
    publishingYear: 1999,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Inception',
    publishingYear: 2010,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Dark Knight',
    publishingYear: 2008,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Pulp Fiction',
    publishingYear: 1994,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Shawshank Redemption',
    publishingYear: 1994,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Forrest Gump',
    publishingYear: 1994,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Godfather',
    publishingYear: 1972,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Interstellar',
    publishingYear: 2014,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    publishingYear: 2001,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Fight Club',
    publishingYear: 1999,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Avengers',
    publishingYear: 2012,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Titanic',
    publishingYear: 1997,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Avatar',
    publishingYear: 2009,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Lion King',
    publishingYear: 1994,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Gladiator',
    publishingYear: 2000,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Departed',
    publishingYear: 2006,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Prestige',
    publishingYear: 2006,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Django Unchained',
    publishingYear: 2012,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'The Revenant',
    publishingYear: 2015,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Mad Max: Fury Road',
    publishingYear: 2015,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Blade Runner 2049',
    publishingYear: 2017,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Parasite',
    publishingYear: 2019,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Joker',
    publishingYear: 2019,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Dune',
    publishingYear: 2021,
    poster: 'https://picsum.photos/450/500',
  },
  {
    title: 'Everything Everywhere All at Once',
    publishingYear: 2022,
    poster: 'https://picsum.photos/450/500',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const moviesService = app.get(MoviesService);

  // Seed default user
  await usersService.seedDefaultUser();

  // Get or create default user
  const user = await usersService.findByEmail('user@example.com');
  if (!user) {
    console.error('Failed to create or find default user');
    await app.close();
    return;
  }

  // Seed movies
  console.log('Seeding movies...');
  let seededCount = 0;
  for (const movieData of demoMovies) {
    try {
      await moviesService.create(movieData, user.id);
      seededCount++;
      console.log(`✓ Seeded: ${movieData.title}`);
    } catch (error) {
      console.error(`✗ Failed to seed ${movieData.title}:`, error.message);
    }
  }
  console.log(`\nSeeded ${seededCount} out of ${demoMovies.length} movies.`);

  await app.close();
}

bootstrap();
