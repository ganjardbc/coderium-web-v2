import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { ListMediaDto, UpdateMediaDto } from './dto';
import { CurrentUser } from '../auth/decorators';

@ApiTags('Media')
@ApiBearerAuth()
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('uploads/image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload single image' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string },
  ) {
    const media = await this.mediaService.upload(file, user.id);
    return { success: true, message: 'Image uploaded', data: media };
  }

  @Post('uploads/images')
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple images (max 10)' })
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: { id: string },
  ) {
    const media = await this.mediaService.uploadMultiple(files, user.id);
    return { success: true, message: `${media.length} images uploaded`, data: media };
  }

  @Get('admin/media')
  @ApiOperation({ summary: 'List media' })
  async findAll(
    @Query() query: ListMediaDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.mediaService.findAll(
      query,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }

  @Put('admin/media/:id')
  @ApiOperation({ summary: 'Update media metadata' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    const media = await this.mediaService.update(
      id,
      dto,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
    return { success: true, message: 'Media updated', data: media };
  }

  @Delete('admin/media/:id')
  @ApiOperation({ summary: 'Delete media' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.mediaService.remove(
      id,
      user.id as string,
      user.roles as Record<string, unknown>[],
    );
  }
}
