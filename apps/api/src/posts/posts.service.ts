import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database';
import { CreatePostDto, UpdatePostDto, ListPostsDto } from './dto';
import { slugify } from '@coderium/shared-utils';

const MEDIABLE_TYPE_POST = 'Post';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // ─── Helpers ──────────────────────────────────────────────────

  private isAdmin(userRoles: Record<string, unknown>[]) {
    return userRoles?.some(
      (ur: Record<string, unknown>) =>
        (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
  }

  /** Sync mediables for a post: delete old ones, create new ones in order. */
  private async syncMediables(
    postId: string,
    mediaIds: string[],
    tx: Omit<PrismaService, '$on' | '$connect' | '$disconnect' | '$use' | '$transaction'>,
  ) {
    await tx.mediable.deleteMany({
      where: { mediableType: MEDIABLE_TYPE_POST, mediableId: postId },
    });

    if (mediaIds.length > 0) {
      await tx.mediable.createMany({
        data: mediaIds.map((mediaId, index) => ({
          mediaId,
          mediableType: MEDIABLE_TYPE_POST,
          mediableId: postId,
          tag: 'default',
          order: index,
        })),
      });
    }
  }

  /** Append associated media items to a post object. */
  private async attachMedia(post: Record<string, unknown>) {
    const mediables = await this.prisma.mediable.findMany({
      where: { mediableType: MEDIABLE_TYPE_POST, mediableId: post.id as string },
      include: { media: true },
      orderBy: { order: 'asc' },
    });

    return {
      ...post,
      attachedMedia: mediables.map((m) => m.media),
    };
  }

  // ─── Create ───────────────────────────────────────────────────

  async create(dto: CreatePostDto, userId: string) {
    const { mediaIds, ...postData } = dto;

    let slug = slugify(dto.title);
    const existing = await this.prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const post = await this.prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          ...postData,
          slug,
          userId,
        },
      });

      if (mediaIds && mediaIds.length > 0) {
        await this.syncMediables(created.id, mediaIds, tx as unknown as Omit<PrismaService, '$on' | '$connect' | '$disconnect' | '$use' | '$transaction'>);
      }

      return created;
    });

    return this.attachMedia(post as unknown as Record<string, unknown>);
  }

  // ─── Public reads ────────────────────────────────────────────

  async findAllPublic(query: ListPostsDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { isPublished: true, deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take: limit,
        where,
        orderBy: { publishedAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      success: true,
      message: 'Posts retrieved',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findRecentPublic(limit = 5) {
    const data = await this.prisma.post.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    return { success: true, message: 'Recent posts retrieved', data };
  }

  async findPopularPublic(limit = 5) {
    const data = await this.prisma.post.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: { viewsCount: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    return { success: true, message: 'Popular posts retrieved', data };
  }

  async findBySlugPublic(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewsCount: { increment: 1 } },
    });

    const withMedia = await this.attachMedia(post as unknown as Record<string, unknown>);
    return { success: true, message: 'Post retrieved', data: withMedia };
  }

  // ─── Admin reads ─────────────────────────────────────────────

  async findAdminAll(query: ListPostsDto, userId: string, userRoles: Record<string, unknown>[]) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };
    if (!this.isAdmin(userRoles)) {
      where.userId = userId;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      success: true,
      message: 'Posts retrieved',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAdminBySlug(slug: string, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!this.isAdmin(userRoles) && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const withMedia = await this.attachMedia(post as unknown as Record<string, unknown>);
    return { success: true, message: 'Post retrieved', data: withMedia };
  }

  // ─── Update ───────────────────────────────────────────────────

  async update(slug: string, dto: UpdatePostDto, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!this.isAdmin(userRoles) && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { mediaIds, ...postData } = dto;

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.post.update({
        where: { id: post.id },
        data: postData,
      });

      if (mediaIds !== undefined) {
        await this.syncMediables(post.id, mediaIds, tx as unknown as Omit<PrismaService, '$on' | '$connect' | '$disconnect' | '$use' | '$transaction'>);
      }

      return result;
    });

    return this.attachMedia(updated as unknown as Record<string, unknown>);
  }

  // ─── Soft delete ──────────────────────────────────────────────

  async remove(slug: string, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!this.isAdmin(userRoles) && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.post.update({
      where: { id: post.id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Publish / Unpublish ──────────────────────────────────────

  async publish(slug: string, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!this.isAdmin(userRoles) && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.post.update({
      where: { id: post.id },
      data: { isPublished: true, publishedAt: new Date() },
    });
  }

  async unpublish(slug: string, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!this.isAdmin(userRoles) && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.post.update({
      where: { id: post.id },
      data: { isPublished: false },
    });
  }
}
