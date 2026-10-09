import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { ProductFaqItem } from '@coderium/shared-types';

export class FaqItemDto implements ProductFaqItem {
  @ApiProperty({ example: 'Apakah merge dilakukan otomatis?' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  question!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  answer!: string;
}
