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
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, ListPostsDto } from './dto';
import { Public, CurrentUser, Permissions } from '../auth/decorators';

@ApiTags('Posts')
@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ─── Public endpoints ─────────────────────────────────────────

  @Public()
  @Get('posts')
  @ApiOperation({ summary: 'List published posts (public)' })
  async findAllPublic(@Query() query: ListPostsDto) {
    return this.postsService.findAllPublic(query);
  }

  @Public()
  @Get('posts/recent')
  @ApiOperation({ summary: 'Get recent published posts' })
  async findRecentPublic() {
    return this.postsService.findRecentPublic();
  }

  @Public()
  @Get('posts/popular')
  @ApiOperation({ summary: 'Get popular published posts' })
  async findPopularPublic() {
    return this.postsService.findPopularPublic();
  }

  @Public()
  @Get('posts/:slug')
  @ApiOperation({ summary: 'Get post detail by slug (public)' })
  async findBySlugPublic(@Param('slug') slug: string) {
    return this.postsService.findBySlugPublic(slug);
  }

  // ─── Admin endpoints ──────────────────────────────────────────

  @ApiBearerAuth()
  @Get('admin/posts')
  @ApiOperation({ summary: 'List all posts (admin)' })
  async findAdminAll(
    @Query() query: ListPostsDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.postsService.findAdminAll(
      query,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }

  @ApiBearerAuth()
  @Get('admin/posts/:slug')
  @ApiOperation({ summary: 'Get post by slug (admin) — used by edit page' })
  async findAdminBySlug(
    @Param('slug') slug: string,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.postsService.findAdminBySlug(
      slug,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }

  @ApiBearerAuth()
  @Permissions('manage_own_posts', 'manage_all_posts')
  @Post('admin/posts')
  @ApiOperation({ summary: 'Create post' })
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: { id: string },
  ) {
    const post = await this.postsService.create(dto, user.id);
    return { success: true, message: 'Post created', data: post };
  }

  @ApiBearerAuth()
  @Permissions('manage_own_posts', 'manage_all_posts')
  @Put('admin/posts/:slug')
  @ApiOperation({ summary: 'Update post' })
  async update(
    @Param('slug') slug: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    const post = await this.postsService.update(
      slug,
      dto,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
    return { success: true, message: 'Post updated', data: post };
  }

  @ApiBearerAuth()
  @Permissions('manage_own_posts', 'manage_all_posts')
  @Delete('admin/posts/:slug')
  @ApiOperation({ summary: 'Delete post (soft delete)' })
  async remove(
    @Param('slug') slug: string,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    await this.postsService.remove(
      slug,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
    return { success: true, message: 'Post deleted' };
  }

  @ApiBearerAuth()
  @Permissions('manage_own_posts', 'manage_all_posts')
  @Post('admin/posts/:slug/publish')
  @ApiOperation({ summary: 'Publish post' })
  async publish(
    @Param('slug') slug: string,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    const post = await this.postsService.publish(
      slug,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
    return { success: true, message: 'Post published', data: post };
  }

  @ApiBearerAuth()
  @Permissions('manage_own_posts', 'manage_all_posts')
  @Post('admin/posts/:slug/unpublish')
  @ApiOperation({ summary: 'Unpublish post' })
  async unpublish(
    @Param('slug') slug: string,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    const post = await this.postsService.unpublish(
      slug,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
    return { success: true, message: 'Post unpublished', data: post };
  }
}
