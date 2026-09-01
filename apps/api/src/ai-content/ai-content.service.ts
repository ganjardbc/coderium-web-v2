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
import { AI_CONTENT_SYSTEM_PROMPT, AI_CONTENT_TOPICS } from './ai-content.constants';

interface GeneratedArticle {
  title: string;
  content: string;
  coverUrl: string;
  sourceUrl: string;
}

interface SearchedSource {
  title: string;
  url: string;
  content: string;
}

const MAX_COVER_SIZE_BYTES = 10 * 1024 * 1024; // 10MB, konsisten dengan MediaController.uploadImage
const FETCH_TIMEOUT_MS = 15_000;
const ANYSEARCH_BASE_URL = 'https://api.anysearch.com';
const MAX_SOURCE_CONTENT_CHARS = 6_000; // dibatasi kecil — payload besar bikin provider LLM lambat/kadang di-block WAF

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

      // Provider LLM yang dipakai tidak mengeksekusi built-in `web_search`
      // tool (cuma echo/hallucinate syntax tool-call) — jadi pencarian +
      // ekstraksi artikel sumber dilakukan sendiri lewat AnySearch, baru
      // hasilnya disuapkan ke LLM untuk ditulis ulang.
      const source = await this.searchTrendingSource();

      const client = this.getClient();
      const input = [
        { role: 'developer' as const, content: AI_CONTENT_SYSTEM_PROMPT },
        {
          role: 'user' as const,
          content: `Judul sumber: ${source.title}\nURL sumber: ${source.url}\n\nKonten sumber:\n${source.content}\n\nTulis ulang artikel di atas sesuai instruksi & style guide. Balas hanya dengan JSON sesuai format.`,
        },
      ];

      // Provider (di balik Cloudflare) kadang blokir/lambat secara acak untuk
      // request besar — retry sekali sebelum menyerah.
      let response;
      try {
        response = await client.responses.create({ model, input });
      } catch (error) {
        this.logger.warn({
          event: 'ai_content_generate_retry',
          error: error instanceof Error ? error.message : String(error),
        });
        response = await client.responses.create({ model, input });
      }

      const parsed = this.parseArticleResponse(response.output_text);
      parsed.content = `${parsed.content}\n<p><em>Sumber: <a href="${this.escapeHtml(source.url)}">${this.escapeHtml(source.title)}</a></em></p>`;

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

  private async searchTrendingSource(): Promise<SearchedSource> {
    const apiKey = this.configService.get<string>('ANYSEARCH_API_KEY');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const topic = AI_CONTENT_TOPICS[Math.floor(Math.random() * AI_CONTENT_TOPICS.length)];

    let searchData: {
      code: number;
      data?: { results?: { title: string; url: string }[] };
    };
    try {
      const searchRes = await this.fetchWithTimeout(`${ANYSEARCH_BASE_URL}/v1/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: `${topic} trending artikel`,
          max_results: 5,
          language: 'id',
        }),
      });
      searchData = (await searchRes.json()) as typeof searchData;
    } catch (error) {
      throw new BadGatewayException(
        `Failed to search trending source: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const candidates = searchData.data?.results?.filter((r) => r.url) ?? [];
    if (searchData.code !== 0 || candidates.length === 0) {
      throw new BadGatewayException('No trending source article found');
    }

    // Beberapa hasil search (mis. halaman listing) gagal diekstrak — coba
    // tiap kandidat berurutan sampai ada yang berhasil.
    for (const candidate of candidates) {
      let extractData: { code: number; data?: { title: string; content: string } };
      try {
        const extractRes = await this.fetchWithTimeout(`${ANYSEARCH_BASE_URL}/v1/extract`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ url: candidate.url }),
        });
        extractData = (await extractRes.json()) as typeof extractData;
      } catch (error) {
        this.logger.warn({
          event: 'ai_content_extract_candidate_failed',
          url: candidate.url,
          error: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      if (extractData.code === 0 && extractData.data?.content) {
        return {
          title: extractData.data.title || candidate.title,
          url: candidate.url,
          content: extractData.data.content.slice(0, MAX_SOURCE_CONTENT_CHARS),
        };
      }
    }

    throw new BadGatewayException('Failed to extract content from any candidate source article');
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!response.ok) {
        throw new Error(`request to ${url} failed with status ${response.status}`);
      }
      return response;
    } finally {
      clearTimeout(timeout);
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
