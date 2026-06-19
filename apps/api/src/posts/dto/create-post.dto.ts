import { IsString, IsOptional, IsEnum, IsArray, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PostTypeEnum {
  article = 'article',
  carousel = 'carousel',
  video = 'video',
  stack_gallery = 'stack_gallery',
}

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ enum: PostTypeEnum, default: 'article' })
  @IsEnum(PostTypeEnum)
  type!: PostTypeEnum;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cover?: string;
}
