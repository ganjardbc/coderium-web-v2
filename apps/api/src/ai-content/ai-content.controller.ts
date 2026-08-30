import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiContentService } from './ai-content.service';
import { CommitCoverDto } from './dto';
import { CurrentUser, Permissions } from '../auth/decorators';

@ApiTags('AI Content')
@ApiBearerAuth()
@Controller('admin/ai-content')
export class AiContentController {
  constructor(private readonly aiContentService: AiContentService) {}

  @Permissions('manage_own_posts', 'manage_all_posts')
  @Post('generate')
  @ApiOperation({ summary: 'Generate a trending article draft via AI (LLM + web search)' })
  async generate() {
    const data = await this.aiContentService.generateArticle();
    return { success: true, message: 'Article generated', data };
  }

  @Permissions('manage_own_posts', 'manage_all_posts')
  @Post('cover')
  @ApiOperation({ summary: 'Fetch an external cover image and store it via MediaService' })
  async commitCover(
    @Body() dto: CommitCoverDto,
    @CurrentUser() user: { id: string },
  ) {
    const data = await this.aiContentService.commitCover(dto.imageUrl, user.id);
    return { success: true, message: 'Cover uploaded', data };
  }
}
