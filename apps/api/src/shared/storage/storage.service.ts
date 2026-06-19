import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  disk: string;
  width?: number | null;
  height?: number | null;
}

@Injectable()
export class StorageService {
  private readonly uploadDir: string;
  private readonly baseUrl: string;
  private readonly disk: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || path.join(process.cwd(), 'uploads');
    this.baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3030';
    this.disk = 'local';

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `${this.baseUrl}/uploads/${filename}`,
      disk: this.disk,
      width: null,
      height: null,
    };
  }

  async delete(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // File might not exist
    }
  }
}
