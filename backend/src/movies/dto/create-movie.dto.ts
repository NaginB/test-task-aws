import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix' })
  @IsString()
  title: string;

  @ApiProperty({ example: 1999 })
  @Type(() => Number)
  @IsNumber()
  @Min(1888)
  @Max(new Date().getFullYear() + 10)
  publishingYear: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  poster?: string;
}

