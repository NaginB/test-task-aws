import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  poster?: any;

  @ApiProperty({ example: 'The Matrix' })
  title: string;

  @ApiProperty({ example: 1999 })
  publishingYear: number;
}

