import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommitCoverDto {
  // Pakai @IsUrl() (bukan @IsString()) karena field ini selalu berasal dari
  // `coverUrl` hasil POST /admin/ai-content/generate (URL eksternal http/https),
  // bukan input bebas dari user — validasi format URL di layer DTO membantu
  // menolak payload jelas-jelas salah sebelum request fetch server-side dilakukan.
  @ApiProperty({
    description:
      'URL cover eksternal kandidat (nilai coverUrl dari response POST /admin/ai-content/generate)',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl({ require_protocol: true })
  imageUrl!: string;
}
