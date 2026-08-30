import { ApiProperty } from '@nestjs/swagger';

export class CommitCoverResponseDto {
  @ApiProperty({ description: 'URL internal hasil upload ({APP_URL}/uploads/{filename})' })
  url!: string;

  @ApiProperty({ description: 'UUID Media record yang baru dibuat' })
  mediaId!: string;
}
