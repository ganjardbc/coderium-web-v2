import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { AiContentService } from './ai-content.service';
import { MediaService } from '../media/media.service';

// NOTE: repo ini belum punya jest terpasang/dikonfigurasi (tidak ada script
// `test` di apps/api/package.json, tidak ada jest.config, tidak ada devDependency
// `jest`). File ini ditulis mengikuti kontrak Jest/@nestjs/testing standar
// (sesuai task 5 & 6 tasks.md) supaya siap jalan begitu infra test disiapkan,
// tapi BELUM bisa dieksekusi/diverifikasi otomatis di lingkungan ini — dicatat
// sebagai gap eksplisit di verify-report.md.

describe('AiContentService', () => {
  let service: AiContentService;
  let mediaService: { upload: jest.Mock };
  let configValues: Record<string, string>;

  beforeEach(async () => {
    configValues = {
      AI_CONTENT_LLM_API_KEY: 'test-key',
      AI_CONTENT_LLM_BASE_URL: 'https://example-llm.test/v1',
      AI_CONTENT_LLM_MODEL: 'test-model',
    };

    mediaService = { upload: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiContentService,
        {
          provide: ConfigService,
          useValue: { get: (key: string) => configValues[key] },
        },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();

    service = module.get(AiContentService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generateArticle', () => {
    function mockOpenAiResponse(outputText: string) {
      const create = jest.fn().mockResolvedValue({ output_text: outputText });
      // @ts-expect-error accessing private field for test setup
      service['client'] = { responses: { create } };
      return create;
    }

    it('parses a successful, well-formed LLM response', async () => {
      mockOpenAiResponse(
        JSON.stringify({
          title: 'Judul Artikel',
          content: '<p>Isi artikel</p>',
          coverUrl: 'https://example.com/cover.jpg',
          sourceUrl: 'https://example.com/source',
        }),
      );

      const result = await service.generateArticle();

      expect(result).toEqual({
        title: 'Judul Artikel',
        content: '<p>Isi artikel</p>',
        coverUrl: 'https://example.com/cover.jpg',
        sourceUrl: 'https://example.com/source',
      });
    });

    it('throws BadGatewayException when LLM response is malformed JSON', async () => {
      mockOpenAiResponse('not-json-at-all');

      await expect(service.generateArticle()).rejects.toBeInstanceOf(BadGatewayException);
    });

    it('throws BadGatewayException when required fields are missing', async () => {
      mockOpenAiResponse(JSON.stringify({ title: 'Only title' }));

      await expect(service.generateArticle()).rejects.toBeInstanceOf(BadGatewayException);
    });

    it('logs latency (durationMs) on both success and failure', async () => {
      const logSpy = jest.spyOn(service['logger'], 'log');
      mockOpenAiResponse(
        JSON.stringify({
          title: 'T',
          content: 'C',
          coverUrl: '',
          sourceUrl: 'https://example.com',
        }),
      );

      await service.generateArticle();

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'ai_content_generate', success: true }),
      );

      const errorSpy = jest.spyOn(service['logger'], 'error');
      mockOpenAiResponse('not-json');
      await expect(service.generateArticle()).rejects.toThrow();
      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'ai_content_generate', success: false }),
      );
    });
  });

  describe('commitCover', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('fetches the image and calls MediaService.upload with the buffer', async () => {
      const buffer = Buffer.from('fake-image-bytes');
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: {
          get: (key: string) =>
            key === 'content-type' ? 'image/png' : key === 'content-length' ? String(buffer.length) : null,
        },
        arrayBuffer: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
      }) as unknown as typeof fetch;

      mediaService.upload.mockResolvedValue({ id: 'media-uuid', url: 'http://api/uploads/x.png' });

      const result = await service.commitCover('https://example.com/cover.png', 'user-1');

      expect(mediaService.upload).toHaveBeenCalledTimes(1);
      const [fileArg, userIdArg] = mediaService.upload.mock.calls[0];
      expect(fileArg.mimetype).toBe('image/png');
      expect(Buffer.isBuffer(fileArg.buffer)).toBe(true);
      expect(userIdArg).toBe('user-1');
      expect(result).toEqual({ url: 'http://api/uploads/x.png', mediaId: 'media-uuid' });
    });

    it('throws BadRequestException and does not call upload when response is not an image', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: (key: string) => (key === 'content-type' ? 'text/html' : null) },
        arrayBuffer: async () => new ArrayBuffer(0),
      }) as unknown as typeof fetch;

      await expect(
        service.commitCover('https://example.com/not-an-image', 'user-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(mediaService.upload).not.toHaveBeenCalled();
    });

    it('throws BadGatewayException and does not call upload when fetch fails', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

      await expect(
        service.commitCover('https://example.com/cover.png', 'user-1'),
      ).rejects.toBeInstanceOf(BadGatewayException);
      expect(mediaService.upload).not.toHaveBeenCalled();
    });
  });
});
