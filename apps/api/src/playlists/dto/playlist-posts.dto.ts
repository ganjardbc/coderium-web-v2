import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistPostsDto {
  @ApiProperty({ type: [String], example: ['post-id-1', 'post-id-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  postIds!: string[];
}
