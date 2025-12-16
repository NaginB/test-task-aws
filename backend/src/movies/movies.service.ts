import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) { }

  async create(createMovieDto: CreateMovieDto, userId: number): Promise<Movie> {
    console.log('wokring till here...')
    const movie = this.moviesRepository.create({
      ...createMovieDto,
      userId,
    });
    return this.moviesRepository.save(movie);
  }

  async findAll(userId: number, page: number = 1, limit: number = 8): Promise<{ movies: Movie[]; total: number; page: number; totalPages: number }> {
    const [movies, total] = await this.moviesRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      movies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, userId: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    if (movie.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto, userId: number): Promise<Movie> {
    const movie = await this.findOne(id, userId);
    Object.assign(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }

  async remove(id: number, userId: number): Promise<void> {
    const movie = await this.findOne(id, userId);
    await this.moviesRepository.remove(movie);
  }
}

