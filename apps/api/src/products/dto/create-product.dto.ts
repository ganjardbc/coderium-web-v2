import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsUrl,
  IsNumber,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PipelineStepDto } from './pipeline-step.dto';
import { FeatureItemDto } from './feature-item.dto';

export enum ProductStatusEnum {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

export class CreateProductDto {
  @ApiProperty({ example: 'My Product' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ description: 'Auto-generated from name if omitted' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ProductStatusEnum, default: 'draft' })
  @IsEnum(ProductStatusEnum)
  @IsOptional()
  status?: ProductStatusEnum;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiPropertyOptional({ type: [PipelineStepDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PipelineStepDto)
  pipelineSteps?: PipelineStepDto[];

  @ApiPropertyOptional({ type: [FeatureItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FeatureItemDto)
  features?: FeatureItemDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ctaLabel?: string;

  @ApiPropertyOptional({ description: 'Must be a valid URL' })
  @IsOptional()
  @IsUrl()
  ctaUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  order?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
