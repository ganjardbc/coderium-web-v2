import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import OpenAI from 'openai';
import { MediaService } from '../media/media.service';
import { AI_CONTENT_SYSTEM_PROMPT } from './ai-content.constants';

interface GeneratedArticle {
  title: string;
  content: string;
  coverUrl: string;
  sourceUrl: string;
}

const MAX_COVER_SIZE_BYTES = 10 * 1024 * 1024; // 10MB, konsisten dengan MediaController.uploadImage
const FETCH_TIMEOUT_MS = 15_000;

@Injectable()
export class AiContentService {
  private readonly logger = new Logger(AiContentService.name);
  private client: OpenAI | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly mediaService: MediaService,
  ) {}

  private getClient(): OpenAI {
    if (this.client) return this.client;

    const apiKey = this.configService.get<string>('AI_CONTENT_LLM_API_KEY');
    const baseURL = this.configService.get<string>('AI_CONTENT_LLM_BASE_URL');

    if (!apiKey || !baseURL) {
      // Belum diprovision — bukan crash tak jelas, tapi error eksplisit yang
      // dilog + dilempar sebagai response HTTP yang jelas ke client.
      throw new InternalServerErrorException(
        'AI content generation is not configured (missing LLM credentials)',
      );
    }

    this.client = new OpenAI({ apiKey, baseURL });
    return this.client;
  }

  async generateArticle(): Promise<GeneratedArticle> {
    const startedAt = Date.now();
    const model = this.configService.get<string>('AI_CONTENT_LLM_MODEL');

    try {
      if (!model) {
        throw new InternalServerErrorException(
          'AI content generation is not configured (missing LLM model)',
        );
      }

      const client = this.getClient();

      const response = await client.responses.create({
        model,
        tools: [{ type: 'web_search' }],
        input: [
          { role: 'developer', content: AI_CONTENT_SYSTEM_PROMPT },
          {
            role: 'user',
            content:
              'Cari 1 artikel trending sekarang sesuai instruksi, lalu tulis ulang sesuai style guide. Balas hanya dengan JSON sesuai format.',
          },
        ],
      });

      const parsed = this.parseArticleResponse(response.output_text);

      const durationMs = Date.now() - startedAt;
      this.logger.log({
        event: 'ai_content_generate',
        durationMs,
        success: true,
      });

      return parsed;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      this.logger.error({
        event: 'ai_content_generate',
        durationMs,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });

      if (
        error instanceof InternalServerErrorException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }

      throw new BadGatewayException(
        'Failed to generate article from AI content provider',
      );
    }
  }

  private parseArticleResponse(outputText: string | undefined): GeneratedArticle {
    if (!outputText) {
      throw new BadGatewayException('AI content provider returned an empty response');
    }

    let raw: unknown;
    try {
      // LLM diminta balas JSON murni, tapi tetap jaga-jaga kalau provider
      // membungkus dengan markdown code fence.
      const cleaned = outputText
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/i, '');
      raw = JSON.parse(cleaned);
    } catch {
      throw new BadGatewayException('AI content provider returned a malformed response');
    }

    if (
      typeof raw !== 'object' ||
      raw === null ||
      typeof (raw as Record<string, unknown>).title !== 'string' ||
      typeof (raw as Record<string, unknown>).content !== 'string' ||
      typeof (raw as Record<string, unknown>).sourceUrl !== 'string'
    ) {
      throw new BadGatewayException('AI content provider returned an unexpected response shape');
    }

    const data = raw as Record<string, unknown>;

    return {
      title: data.title as string,
      content: data.content as string,
      coverUrl: typeof data.coverUrl === 'string' ? data.coverUrl : '',
      sourceUrl: data.sourceUrl as string,
    };
  }

  async commitCover(
    imageUrl: string,
    userId: string | null = null,
  ): Promise<{ url: string; mediaId: string }> {
    const buffer = await this.fetchImage(imageUrl);

    const ext = this.guessExtension(imageUrl, buffer.contentType);
    const fakeFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: `cover-${crypto.randomUUID()}${ext}`,
      encoding: '7bit',
      mimetype: buffer.contentType,
      size: buffer.data.length,
      buffer: buffer.data,
      destination: '',
      filename: '',
      path: '',
      stream: undefined as unknown as import('stream').Readable,
    };

    let media;
    try {
      media = await this.mediaService.upload(fakeFile, userId);
    } catch (error) {
      this.logger.error({
        event: 'ai_content_cover_upload_failed',
        error: error instanceof Error ? error.message : String(error),
      });
      throw new InternalServerErrorException('Failed to store cover image');
    }

    return { url: media.url, mediaId: media.id };
  }

  private async fetchImage(
    imageUrl: string,
  ): Promise<{ data: Buffer; contentType: string }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(imageUrl, { signal: controller.signal });
    } catch (error) {
      this.logger.error({
        event: 'ai_content_cover_fetch_failed',
        imageUrl,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new BadGatewayException('Failed to fetch cover image from source');
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new BadGatewayException(
        `Failed to fetch cover image from source (status ${response.status})`,
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      throw new BadRequestException('URL does not point to a valid image');
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && Number(contentLength) > MAX_COVER_SIZE_BYTES) {
      throw new BadRequestException('Cover image exceeds maximum allowed size (10MB)');
    }

    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer);

    if (data.length > MAX_COVER_SIZE_BYTES) {
      throw new BadRequestException('Cover image exceeds maximum allowed size (10MB)');
    }

    return { data, contentType };
  }

  private guessExtension(imageUrl: string, contentType: string): string {
    const mimeExtMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
    };
    if (mimeExtMap[contentType]) return mimeExtMap[contentType];

    try {
      const url = new URL(imageUrl);
      const match = /\.[a-zA-Z0-9]+$/.exec(url.pathname);
      if (match) return match[0];
    } catch {
      // ignore, fall back below
    }

    return '.jpg';
  }
}
