import { Controller, Post, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { EngagementService } from './engagement.service';
import { Public } from '../auth/decorators';

@ApiTags('Engagement')
@Controller('posts')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Public()
  @Post(':slug/view')
  @ApiOperation({ summary: 'Track post view' })
  async trackView(@Param('slug') slug: string, @Req() req: Request) {
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'];
    const referer = req.headers['referer'] as string | undefined;
    return this.engagementService.trackView(slug, ipAddress, userAgent, referer);
  }

  @Public()
  @Post(':slug/like')
  @ApiOperation({ summary: 'Toggle post like' })
  async toggleLike(@Param('slug') slug: string, @Req() req: Request) {
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || '0.0.0.0';
    return this.engagementService.toggleLike(slug, ipAddress);
  }
}
