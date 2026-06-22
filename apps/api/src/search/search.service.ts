import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database';
import { SearchDto } from './search.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(dto: SearchDto) {
    const { q, type, tags, page = 1, limit = 10 } = dto;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {
      isPublished: true,
      deletedAt: null,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { subtitle: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagList.length > 0) {
        if (where.OR) {
          where.AND = tagList.map((tag) => ({
            tags: { array_contains: tag },
          }));
        } else {
          where.AND = tagList.map((tag) => ({
            tags: { array_contains: tag },
          }));
        }
      }
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take: limitNum,
        where,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          type: true,
          tags: true,
          cover: true,
          isPublished: true,
          publishedAt: true,
          viewsCount: true,
          likesCount: true,
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      success: true,
      message: 'Search results',
      data,
      meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    };
  }
}
