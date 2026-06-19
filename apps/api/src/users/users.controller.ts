import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Permissions } from '../auth/decorators';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('manage_users')
  @ApiOperation({ summary: 'List all users (admin only)' })
  async findAll() {
    return this.usersService.findAll();
  }
}
