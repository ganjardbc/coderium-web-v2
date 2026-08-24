import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PipelineStepDto {
  @ApiProperty({ example: 'Discovery' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
