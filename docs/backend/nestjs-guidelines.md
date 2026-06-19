# Coderium V2 - NestJS Guidelines

## Overview

Dokumen ini menjelaskan guidelines pengembangan backend NestJS di Coderium V2.

---

# Module Structure

Setiap module:

```txt
module-name/
├── dto/
│   ├── create-module.dto.ts
│   └── update-module.dto.ts
├── entities/
│   └── module.entity.ts
├── constants/
│   └── module.constant.ts
├── module-name.module.ts
├── module-name.controller.ts
└── module-name.service.ts
```

---

# Controller Pattern

Controller hanya boleh:

1. Menerima request.
2. Validasi via DTO.
3. Memanggil service.
4. Mengembalikan response.

```ts
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Public()
  async findAll(@Query() query: ListPostsDto) {
    return this.postsService.findAll(query);
  }

  @Post()
  @Permissions('manage_own_posts')
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: User,
  ) {
    return this.postsService.create(dto, user.id);
  }
}
```

---

# Service Pattern

```ts
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: string) {
    const slug = slugify(dto.title);

    return this.prisma.post.create({
      data: {
        ...dto,
        slug,
        userId,
      },
    });
  }

  async findOne(slug: string, userId: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        userId,
        deletedAt: null,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
```

---

# DTO Pattern

```ts
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsEnum(PostType)
  type: PostType;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
```

---

# Global Guards

JWT guard aktif secara global.

Public route gunakan:

```ts
@Public()
```

Permission route gunakan:

```ts
@Permissions('manage_own_posts')
```

---

# Response Interceptor

Gunakan global `ApiResponseInterceptor` untuk format response standar.

---

# Error Handling

Gunakan NestJS built-in exceptions:

```ts
throw new NotFoundException('Post not found');
throw new ForbiddenException('Access denied');
throw new BadRequestException('Invalid data');
throw new ConflictException('Slug already exists');
```

---

# Pagination

DTO untuk pagination:

```ts
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}
```

Gunakan:

```ts
const skip = (page - 1) * limit;
const [data, total] = await this.prisma.$transaction([
  this.prisma.post.findMany({ skip, take: limit, where }),
  this.prisma.post.count({ where }),
]);
```

---

# Soft Delete Pattern

Selalu filter `deletedAt: null` di query:

```ts
where: {
  deletedAt: null,
}
```

Soft delete:

```ts
await this.prisma.post.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

---

# Environment Variables

```ts
// config/app.config.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3030,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },
  storage: {
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
  },
});
```
