import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database';
import { CreatePostDto, UpdatePostDto, ListPostsDto } from './dto';
import { slugify } from '@coderium/shared-utils';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: string) {
    let slug = slugify(dto.title);

    const existing = await this.prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    return this.prisma.post.create({
      data: {
        ...dto,
        slug,
        userId,
      },
    });
  }

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

    return { success: true, message: 'Post retrieved', data: post };
  }

  async findAdminAll(query: ListPostsDto, userId: string, userRoles: Record<string, unknown>[]) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );

    const where: Record<string, unknown> = { deletedAt: null };
    if (!isAdmin) {
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

  async update(slug: string, dto: UpdatePostDto, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.post.update({
      where: { id: post.id },
      data: dto,
    });
  }

  async remove(slug: string, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.post.update({
      where: { id: post.id },
      data: { deletedAt: new Date() },
    });
  }

  async publish(slug: string, userId: string, userRoles: Record<string, unknown>[]) {
    const post = await this.prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && post.userId !== userId) {
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

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && post.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.post.update({
      where: { id: post.id },
      data: { isPublished: false },
    });
  }
}
