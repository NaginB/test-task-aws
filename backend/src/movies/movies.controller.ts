import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileUploadDto } from './dto/file-upload.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

@ApiTags('movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {
    if (!existsSync('./uploads')) {
      mkdirSync('./uploads', { recursive: true });
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  async create(@Body() createMovieDto: CreateMovieDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createMovieDto.poster = `/uploads/${file.filename}`;
    }
    return this.moviesService.create(createMovieDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies with pagination' })
  @ApiResponse({ status: 200, description: 'Movies retrieved successfully' })
  findAll(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 8;
    return this.moviesService.findAll(req.user.userId, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.moviesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Update a movie' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateMovieDto.poster = `/uploads/${file.filename}`;
    }
    return this.moviesService.update(id, updateMovieDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.moviesService.remove(id, req.user.userId);
  }
}

