import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database';
import {
  CreatePlaylistDto,
  UpdatePlaylistDto,
  ListPlaylistsDto,
  PlaylistPostsDto,
} from './dto';
import { slugify } from '@coderium/shared-utils';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlaylistDto, userId: string) {
    let slug = slugify(dto.title);

    const existing = await this.prisma.playlist.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    return this.prisma.playlist.create({
      data: { ...dto, slug, userId },
    });
  }

  async findAllPublic(query: ListPlaylistsDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { isPublished: true, deletedAt: null };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.playlist.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { posts: true } },
        },
      }),
      this.prisma.playlist.count({ where }),
    ]);

    return {
      success: true,
      message: 'Playlists retrieved',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlugPublic(slug: string) {
    const playlist = await this.prisma.playlist.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        posts: {
          orderBy: { order: 'asc' },
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
                type: true,
                cover: true,
                isPublished: true,
              },
            },
          },
        },
      },
    });

    if (!playlist) throw new NotFoundException('Playlist not found');

    return { success: true, message: 'Playlist retrieved', data: playlist };
  }

  async findAdminAll(query: ListPlaylistsDto, userId: string, userRoles: Record<string, unknown>[]) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );

    const where: Record<string, unknown> = { deletedAt: null };
    if (!isAdmin) where.userId = userId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.playlist.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { posts: true } },
        },
      }),
      this.prisma.playlist.count({ where }),
    ]);

    return {
      success: true,
      message: 'Playlists retrieved',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(slug: string, dto: UpdatePlaylistDto, userId: string, userRoles: Record<string, unknown>[]) {
    const playlist = await this.prisma.playlist.findFirst({ where: { slug, deletedAt: null } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && playlist.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.playlist.update({ where: { id: playlist.id }, data: dto });
  }

  async remove(slug: string, userId: string, userRoles: Record<string, unknown>[]) {
    const playlist = await this.prisma.playlist.findFirst({ where: { slug, deletedAt: null } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && playlist.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.playlist.update({
      where: { id: playlist.id },
      data: { deletedAt: new Date() },
    });
  }

  async attachPosts(slug: string, dto: PlaylistPostsDto, userId: string, userRoles: Record<string, unknown>[]) {
    const playlist = await this.prisma.playlist.findFirst({ where: { slug, deletedAt: null } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && playlist.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const maxOrder = await this.prisma.playlistPost.aggregate({
      where: { playlistId: playlist.id },
      _max: { order: true },
    });
    let nextOrder = (maxOrder._max.order || 0) + 1;

    const records = dto.postIds.map((postId) => ({
      playlistId: playlist.id,
      postId,
      userId,
      order: nextOrder++,
    }));

    await this.prisma.playlistPost.createMany({
      data: records,
      skipDuplicates: true,
    });

    return { success: true, message: `${dto.postIds.length} post(s) attached` };
  }

  async detachPosts(slug: string, dto: PlaylistPostsDto, userId: string, userRoles: Record<string, unknown>[]) {
    const playlist = await this.prisma.playlist.findFirst({ where: { slug, deletedAt: null } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && playlist.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.playlistPost.deleteMany({
      where: {
        playlistId: playlist.id,
        postId: { in: dto.postIds },
      },
    });

    return { success: true, message: `${dto.postIds.length} post(s) detached` };
  }
}
