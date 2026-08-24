import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../database';

/**
 * NOTE: this suite documents the expected behavior of ProductsService per
 * `.caf/tasks/12/requirements.md` (task 7) and `.caf/tasks/12/design.md` (§6,§8).
 * At the time of writing, `apps/api` has no test runner configured (no `jest`
 * dependency, no jest config, no `test` script in `apps/api/package.json`) —
 * see verify-report.md for details. This file is written so the suite is
 * ready to run as soon as test infrastructure is added to `apps/api`.
 */

const baseProduct = {
  id: 'product-1',
  slug: 'my-product',
  name: 'My Product',
  tagline: null,
  description: null,
  status: 'draft',
  cover: 'https://example.com/cover.png',
  pipelineSteps: [{ title: 'Step 1' }],
  features: [{ title: 'Feature 1' }],
  ctaLabel: null,
  ctaUrl: 'https://example.com',
  order: 0,
  featured: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createPrismaMock() {
  return {
    product: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  } as unknown as PrismaService;
}

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  describe('publish validation', () => {
    it('rejects publish when cover is missing', async () => {
      const existing = { ...baseProduct, cover: null };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(existing);

      await expect(service.publish('product-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects publish when ctaUrl is missing or invalid', async () => {
      const existing = { ...baseProduct, ctaUrl: 'not-a-url' };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(existing);

      await expect(service.publish('product-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects publish when pipelineSteps is empty', async () => {
      const existing = { ...baseProduct, pipelineSteps: [] };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(existing);

      await expect(service.publish('product-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects publish when features is empty', async () => {
      const existing = { ...baseProduct, features: [] };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(existing);

      await expect(service.publish('product-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('publishes successfully when all required fields are present', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(baseProduct);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...baseProduct,
        status: 'published',
      });

      const result = await service.publish('product-1');

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: { status: 'published' },
      });
      expect(result.data.status).toBe('published');
    });

    it('validates against merged existing + body data on update() PATCH', async () => {
      // Existing row already has all required fields; PATCH body only sends
      // `status: published` without repeating cover/ctaUrl/etc. Must NOT
      // wrongly reject due to validating only the (mostly empty) body.
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(baseProduct);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...baseProduct,
        status: 'published',
      });

      const result = await service.update('product-1', {
        status: 'published' as never,
      });

      expect(result.data.status).toBe('published');
    });
  });

  describe('archive / restore', () => {
    it('archive sets status to archived without deleting data', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(baseProduct);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...baseProduct,
        status: 'archived',
      });

      const result = await service.archive('product-1');

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: { status: 'archived' },
      });
      expect(result.data.status).toBe('archived');
    });

    it('restore sets status back to draft', async () => {
      const archived = { ...baseProduct, status: 'archived' };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(archived);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...archived,
        status: 'draft',
      });

      const result = await service.restore('product-1');

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: { status: 'draft' },
      });
      expect(result.data.status).toBe('draft');
    });

    it('throws NotFoundException when archiving a non-existent product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.archive('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySlugPublic', () => {
    it('throws NotFoundException (not a different error) for draft/archived/missing slug', async () => {
      (prisma.product.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.findBySlugPublic('anything')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { slug: 'anything', status: 'published' },
      });
    });
  });
});
