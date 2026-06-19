import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database';

@Injectable()
export class EngagementService {
  constructor(private prisma: PrismaService) {}

  async trackView(slug: string, ipAddress: string, userAgent?: string, referer?: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.$transaction([
      this.prisma.postView.create({
        data: {
          postId: post.id,
          ipAddress,
          userAgent,
          referer,
          viewedAt: new Date(),
        },
      }),
      this.prisma.post.update({
        where: { id: post.id },
        data: { viewsCount: { increment: 1 } },
      }),
    ]);

    return { success: true, message: 'View tracked' };
  }

  async toggleLike(slug: string, ipAddress: string, userId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.postLike.findFirst({
      where: { postId: post.id, ipAddress },
    });

    if (existing) {
      await this.prisma.$transaction([
        this.prisma.postLike.delete({ where: { id: existing.id } }),
        this.prisma.post.update({
          where: { id: post.id },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      return { success: true, message: 'Like removed', data: { liked: false } };
    }

    await this.prisma.$transaction([
      this.prisma.postLike.create({
        data: { postId: post.id, ipAddress, userId: userId || null },
      }),
      this.prisma.post.update({
        where: { id: post.id },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return { success: true, message: 'Post liked', data: { liked: true } };
  }
}
