import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string, userRoles: Record<string, unknown>[]) {
    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );

    const userFilter = isAdmin ? {} : { userId };

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes,
      totalMedia,
      totalPlaylists,
    ] = await Promise.all([
      this.prisma.post.count({ where: { ...userFilter, deletedAt: null } }),
      this.prisma.post.count({ where: { ...userFilter, deletedAt: null, isPublished: true } }),
      this.prisma.post.count({ where: { ...userFilter, deletedAt: null, isPublished: false } }),
      this.prisma.post.aggregate({ where: { ...userFilter, deletedAt: null }, _sum: { viewsCount: true } }),
      this.prisma.post.aggregate({ where: { ...userFilter, deletedAt: null }, _sum: { likesCount: true } }),
      this.prisma.media.count({ where: isAdmin ? {} : { userId } }),
      this.prisma.playlist.count({ where: { ...userFilter, deletedAt: null } }),
    ]);

    const recentPosts = await this.prisma.post.findMany({
      where: { ...userFilter, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, type: true, viewsCount: true, likesCount: true, createdAt: true },
    });

    return {
      success: true,
      message: 'Analytics overview',
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews._sum.viewsCount || 0,
        totalLikes: totalLikes._sum.likesCount || 0,
        totalMedia,
        totalPlaylists,
        recentPosts,
      },
    };
  }

  async getTopPosts(sort: string, userId: string, userRoles: Record<string, unknown>[], limit = 10) {
    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );

    const userFilter = isAdmin ? {} : { userId };
    const orderBy = sort === 'likes' ? { likesCount: 'desc' as const } : { viewsCount: 'desc' as const };

    const data = await this.prisma.post.findMany({
      where: { ...userFilter, deletedAt: null, isPublished: true },
      orderBy,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        cover: true,
        viewsCount: true,
        likesCount: true,
        publishedAt: true,
      },
    });

    return { success: true, message: `Top posts by ${sort}`, data };
  }
}
