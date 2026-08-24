import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductsDto,
  ListPublicProductsDto,
} from './dto';
import { Public, Permissions } from '../auth/decorators';

@ApiTags('Products')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Public endpoints ─────────────────────────────────────────

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'List published products (public)' })
  async findAllPublic(@Query() query: ListPublicProductsDto) {
    return this.productsService.findAllPublic(query);
  }

  @Public()
  @Get('products/:slug')
  @ApiOperation({ summary: 'Get product detail by slug (public)' })
  async findBySlugPublic(@Param('slug') slug: string) {
    return this.productsService.findBySlugPublic(slug);
  }

  // ─── Admin endpoints ──────────────────────────────────────────

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Get('admin/products')
  @ApiOperation({ summary: 'List all products (admin)' })
  async findAdminAll(@Query() query: ListProductsDto) {
    return this.productsService.findAdminAll(query);
  }

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Get('admin/products/:id')
  @ApiOperation({ summary: 'Get product by id (admin)' })
  async findAdminById(@Param('id') id: string) {
    return this.productsService.findAdminById(id);
  }

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Post('admin/products')
  @ApiOperation({ summary: 'Create product' })
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productsService.create(dto);
    return { success: true, message: 'Product created', data: product };
  }

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Patch('admin/products/:id')
  @ApiOperation({ summary: 'Update product' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Post('admin/products/:id/publish')
  @ApiOperation({ summary: 'Publish product' })
  async publish(@Param('id') id: string) {
    return this.productsService.publish(id);
  }

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Post('admin/products/:id/unpublish')
  @ApiOperation({ summary: 'Unpublish product' })
  async unpublish(@Param('id') id: string) {
    return this.productsService.unpublish(id);
  }

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Post('admin/products/:id/archive')
  @ApiOperation({ summary: 'Archive product' })
  async archive(@Param('id') id: string) {
    return this.productsService.archive(id);
  }

  @ApiBearerAuth()
  @Permissions('manage_products')
  @Post('admin/products/:id/restore')
  @ApiOperation({ summary: 'Restore product' })
  async restore(@Param('id') id: string) {
    return this.productsService.restore(id);
  }
}
