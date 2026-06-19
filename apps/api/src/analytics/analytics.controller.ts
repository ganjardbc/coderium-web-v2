import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../auth/decorators';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Analytics overview' })
  async getOverview(@CurrentUser() user: Record<string, unknown>) {
    return this.analyticsService.getOverview(
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }

  @Get('posts')
  @ApiOperation({ summary: 'Top posts by views or likes' })
  @ApiQuery({ name: 'sort', enum: ['views', 'likes'], required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getTopPosts(
    @Query('sort') sort: string = 'views',
    @Query('limit') limit: string = '10',
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.analyticsService.getTopPosts(
      sort,
      user.id as string,
      user.roles as Record<string, unknown>[],
      parseInt(limit, 10) || 10,
    );
  }
}
