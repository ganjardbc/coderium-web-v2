import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlaylistsService } from './playlists.service';
import {
  CreatePlaylistDto,
  UpdatePlaylistDto,
  ListPlaylistsDto,
  PlaylistPostsDto,
} from './dto';
import { Public, CurrentUser, Permissions } from '../auth/decorators';

@ApiTags('Playlists')
@Controller()
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  // ─── Public endpoints ─────────────────────────────────────────

  @Public()
  @Get('playlists')
  @ApiOperation({ summary: 'List published playlists (public)' })
  async findAllPublic(@Query() query: ListPlaylistsDto) {
    return this.playlistsService.findAllPublic(query);
  }

  @Public()
  @Get('playlists/:slug')
  @ApiOperation({ summary: 'Get playlist detail by slug (public)' })
  async findBySlugPublic(@Param('slug') slug: string) {
    return this.playlistsService.findBySlugPublic(slug);
  }

  // ─── Admin endpoints ──────────────────────────────────────────

  @ApiBearerAuth()
  @Get('admin/playlists')
  @ApiOperation({ summary: 'List all playlists (admin)' })
  async findAdminAll(
    @Query() query: ListPlaylistsDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.playlistsService.findAdminAll(
      query,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }

  @ApiBearerAuth()
  @Permissions('manage_own_playlists', 'manage_all_playlists')
  @Post('admin/playlists')
  @ApiOperation({ summary: 'Create playlist' })
  async create(
    @Body() dto: CreatePlaylistDto,
    @CurrentUser() user: { id: string },
  ) {
    const playlist = await this.playlistsService.create(dto, user.id);
    return { success: true, message: 'Playlist created', data: playlist };
  }

  @ApiBearerAuth()
  @Permissions('manage_own_playlists', 'manage_all_playlists')
  @Put('admin/playlists/:slug')
  @ApiOperation({ summary: 'Update playlist' })
  async update(
    @Param('slug') slug: string,
    @Body() dto: UpdatePlaylistDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    const playlist = await this.playlistsService.update(
      slug,
      dto,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
    return { success: true, message: 'Playlist updated', data: playlist };
  }

  @ApiBearerAuth()
  @Permissions('manage_own_playlists', 'manage_all_playlists')
  @Delete('admin/playlists/:slug')
  @ApiOperation({ summary: 'Delete playlist (soft delete)' })
  async remove(
    @Param('slug') slug: string,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    await this.playlistsService.remove(
      slug,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
    return { success: true, message: 'Playlist deleted' };
  }

  @ApiBearerAuth()
  @Permissions('manage_own_playlists', 'manage_all_playlists')
  @Post('admin/playlists/:slug/posts')
  @ApiOperation({ summary: 'Attach posts to playlist' })
  async attachPosts(
    @Param('slug') slug: string,
    @Body() dto: PlaylistPostsDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.playlistsService.attachPosts(
      slug,
      dto,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }

  @ApiBearerAuth()
  @Permissions('manage_own_playlists', 'manage_all_playlists')
  @Delete('admin/playlists/:slug/posts')
  @ApiOperation({ summary: 'Detach posts from playlist' })
  async detachPosts(
    @Param('slug') slug: string,
    @Body() dto: PlaylistPostsDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.playlistsService.detachPosts(
      slug,
      dto,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }
}
