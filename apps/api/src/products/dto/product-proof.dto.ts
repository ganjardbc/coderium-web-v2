import {
  IsString,
  IsOptional,
  IsArray,
  ArrayMaxSize,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ProductProof, ProductProofMetric } from '@coderium/shared-types';

export class ProofMetricDto implements ProductProofMetric {
  @ApiProperty({ example: 'Tiket dikerjakan' })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  label!: string;

  @ApiProperty({ example: '24' })
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  value!: string;
}

export class ProductProofDto implements ProductProof {
  @ApiProperty({ type: [ProofMetricDto] })
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => ProofMetricDto)
  metrics!: ProofMetricDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
