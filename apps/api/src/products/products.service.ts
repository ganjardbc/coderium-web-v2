import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { isURL } from 'class-validator';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../database';
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductsDto,
  ListPublicProductsDto,
} from './dto';
import { slugify } from '@coderium/shared-utils';

interface PublishCandidate {
  cover?: string | null;
  ctaUrl?: string | null;
  pipelineSteps?: unknown;
  features?: unknown;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ─── Helpers ──────────────────────────────────────────────────

  /**
   * Validates the fields required for a product to be publishable.
   * Throws BadRequestException with a structured `fields` list when invalid.
   */
  private assertPublishable(candidate: PublishCandidate) {
    const failed: string[] = [];

    if (!candidate.cover) failed.push('cover');
    if (!candidate.ctaUrl || !isURL(candidate.ctaUrl)) failed.push('ctaUrl');
    if (
      !Array.isArray(candidate.pipelineSteps) ||
      candidate.pipelineSteps.length < 1
    ) {
      failed.push('pipelineSteps');
    }
    if (!Array.isArray(candidate.features) || candidate.features.length < 1) {
      failed.push('features');
    }

    if (failed.length > 0) {
      throw new BadRequestException({
        message: 'Validasi publish gagal',
        fields: failed,
      });
    }
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Slug already in use');
    }
  }

  // ─── Create ───────────────────────────────────────────────────

  async create(dto: CreateProductDto) {
    let slug: string;

    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug);
      slug = dto.slug;
    } else {
      slug = slugify(dto.name);
      const existing = await this.prisma.product.findUnique({
        where: { slug },
      });
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const status = dto.status ?? 'draft';

    if (status === 'published') {
      this.assertPublishable(dto);
    }

    const { slug: _slug, ...rest } = dto;

    return this.prisma.product.create({
      data: {
        ...rest,
        slug,
        status,
      } as Prisma.ProductCreateInput,
    });
  }

  // ─── Public reads ────────────────────────────────────────────

  async findAllPublic(query: ListPublicProductsDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { status: 'published' as const };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy: { order: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      success: true,
      message: 'Products retrieved',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlugPublic(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'published' },
    });

    if (!product) throw new NotFoundException('Product not found');

    return { success: true, message: 'Product retrieved', data: product };
  }

  // ─── Admin reads ─────────────────────────────────────────────

  async findAdminAll(query: ListProductsDto) {
    const { page = 1, limit = 10, sort = 'order', dir } = query;
    const skip = (page - 1) * limit;
    const orderBy = { [sort]: dir ?? (sort === 'updatedAt' ? 'desc' : 'asc') };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count(),
    ]);

    return {
      success: true,
      message: 'Products retrieved',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAdminById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    return { success: true, message: 'Product retrieved', data: product };
  }

  // ─── Update ───────────────────────────────────────────────────

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    if (dto.slug && dto.slug !== existing.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }

    const resultingStatus = dto.status ?? existing.status;

    if (resultingStatus === 'published') {
      this.assertPublishable({ ...existing, ...dto });
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: { ...dto } as Prisma.ProductUpdateInput,
    });

    return { success: true, message: 'Product updated', data: updated };
  }

  // ─── Publish / Unpublish / Archive / Restore ──────────────────

  async publish(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    this.assertPublishable(existing);

    const updated = await this.prisma.product.update({
      where: { id },
      data: { status: 'published' },
    });

    return { success: true, message: 'Product published', data: updated };
  }

  async unpublish(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const updated = await this.prisma.product.update({
      where: { id },
      data: { status: 'draft' },
    });

    return { success: true, message: 'Product unpublished', data: updated };
  }

  async archive(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const updated = await this.prisma.product.update({
      where: { id },
      data: { status: 'archived' },
    });

    return { success: true, message: 'Product archived', data: updated };
  }

  async restore(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const updated = await this.prisma.product.update({
      where: { id },
      data: { status: 'draft' },
    });

    return { success: true, message: 'Product restored', data: updated };
  }
}
