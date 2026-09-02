import { NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../database';

function createPrismaMock() {
  return {
    post: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    media: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  } as unknown as PrismaService;
}

describe('PostsService', () => {
  let service: PostsService;
  let prisma: any;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new PostsService(prisma);
  });

  describe('findBySlugPublic', () => {
    it('should throw NotFoundException if post not found', async () => {
      prisma.post.findFirst.mockResolvedValue(null);

      await expect(service.findBySlugPublic('non-existent')).rejects.toThrow(NotFoundException);
      expect(prisma.post.findFirst).toHaveBeenCalledWith({
        where: { slug: 'non-existent', isPublished: true, deletedAt: null },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      });
      expect(prisma.post.update).not.toHaveBeenCalled();
    });

    it('should return post and NOT increment viewsCount', async () => {
      const mockPost = {
        id: 'post-1',
        slug: 'test-post',
        title: 'Test Post',
        viewsCount: 10,
        isPublished: true,
        deletedAt: null,
        user: { id: 'user-1', name: 'Author', avatarUrl: null },
      };

      prisma.post.findFirst.mockResolvedValue(mockPost);
      prisma.media.findMany.mockResolvedValue([]);

      const result = await service.findBySlugPublic('test-post');

      expect(prisma.post.findFirst).toHaveBeenCalledWith({
        where: { slug: 'test-post', isPublished: true, deletedAt: null },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      });
      expect(prisma.post.update).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
