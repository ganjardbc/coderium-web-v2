import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database';
import { StorageService } from '../shared/storage';
import { ListMediaDto, UpdateMediaDto } from './dto';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async upload(file: Express.Multer.File, userId: string | null) {
    const result = await this.storageService.upload(file);

    return this.prisma.media.create({
      data: {
        ...result,
        userId: userId || null,
      },
    });
  }

  async uploadMultiple(files: Express.Multer.File[], userId: string | null) {
    const results = [];
    for (const file of files) {
      const result = await this.storageService.upload(file);
      const media = await this.prisma.media.create({
        data: {
          ...result,
          userId: userId || null,
        },
      });
      results.push(media);
    }
    return results;
  }

  async findAll(query: ListMediaDto, userId: string, userRoles: Record<string, unknown>[]) {
    const { page = 1, limit = 20, mimeType } = query;
    const skip = (page - 1) * limit;

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );

    const where: Record<string, unknown> = {};
    if (!isAdmin) {
      where.userId = userId;
    }
    if (mimeType) {
      where.mimeType = { startsWith: mimeType };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      success: true,
      message: 'Media retrieved',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(id: string, dto: UpdateMediaDto, userId: string, userRoles: Record<string, unknown>[]) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && media.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.media.update({
      where: { id },
      data: {
        originalName: dto.alt !== undefined ? dto.alt : media.originalName,
      },
    });
  }

  async remove(id: string, userId: string, userRoles: Record<string, unknown>[]) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    const isAdmin = userRoles?.some(
      (ur: Record<string, unknown>) => (ur.role as Record<string, unknown>)?.slug === 'admin',
    );
    if (!isAdmin && media.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.storageService.delete(media.filename);
    await this.prisma.media.delete({ where: { id } });

    return { success: true, message: 'Media deleted' };
  }
}
