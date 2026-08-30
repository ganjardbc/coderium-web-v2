import { ApiProperty } from '@nestjs/swagger';

export class GenerateArticleResponseDto {
  @ApiProperty({ description: 'Judul artikel hasil generate (Bahasa Indonesia)' })
  title!: string;

  @ApiProperty({
    description:
      'Isi artikel dalam format HTML (konsisten dengan RichTextEditor apps/admin: <h2>, <h3>, <p>, <ul>, <ol>, <blockquote>, <a>, <strong>, <em>)',
  })
  content!: string;

  @ApiProperty({
    description:
      'URL cover eksternal (kandidat, BELUM diupload) — jangan dipakai langsung sebagai cover final, commit dulu lewat POST /admin/ai-content/cover',
  })
  coverUrl!: string;

  @ApiProperty({ description: 'URL artikel sumber untuk atribusi' })
  sourceUrl!: string;
}
