# Coderium V2 - Prisma Schema Design

## Overview

Dokumen ini menjelaskan desain Prisma schema untuk Coderium V2.

File Prisma berada di:

```txt
apps/api/prisma/schema.prisma
```

---

# Generator & Datasource

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

# Enums

```prisma
enum UserStatus {
  active
  inactive
  suspended
}

enum PostType {
  article
  carousel
  video
  stack_gallery
}
```

---

# Models

## User

```prisma
model User {
  id                       String    @id @default(uuid())
  name                     String
  email                    String    @unique
  passwordHash             String?   @map("password_hash")
  avatarUrl                String?   @map("avatar_url")
  status                   UserStatus @default(active)
  emailVerifiedAt          DateTime? @map("email_verified_at")
  twoFactorSecret          String?   @map("two_factor_secret")
  twoFactorRecoveryCodes   String?   @map("two_factor_recovery_codes")
  twoFactorConfirmedAt     DateTime? @map("two_factor_confirmed_at")
  createdAt                DateTime  @default(now()) @map("created_at")
  updatedAt                DateTime  @updatedAt @map("updated_at")
  deletedAt                DateTime? @map("deleted_at")

  roles       UserRole[]
  posts       Post[]
  playlists   Playlist[]
  media       Media[]
  postLikes   PostLike[]

  @@index([email])
  @@index([status])
  @@index([deletedAt])
  @@map("users")
}
```

---

## Role

```prisma
model Role {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  userRoles        UserRole[]
  rolePermissions  RolePermission[]

  @@map("roles")
}
```

---

## Permission

```prisma
model Permission {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  rolePermissions RolePermission[]

  @@map("permissions")
}
```

---

## UserRole

```prisma
model UserRole {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  roleId    String   @map("role_id")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])
  role Role @relation(fields: [roleId], references: [id])

  @@unique([userId, roleId])
  @@map("user_roles")
}
```

---

## RolePermission

```prisma
model RolePermission {
  id           String   @id @default(uuid())
  roleId       String   @map("role_id")
  permissionId String   @map("permission_id")
  createdAt    DateTime @default(now()) @map("created_at")

  role       Role       @relation(fields: [roleId], references: [id])
  permission Permission @relation(fields: [permissionId], references: [id])

  @@unique([roleId, permissionId])
  @@map("role_permissions")
}
```

---

## Post

```prisma
model Post {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  slug            String    @unique
  title           String
  subtitle        String?
  content         String?
  tags            Json?
  cover           String?
  type            PostType  @default(article)
  media           Json?
  isPublished     Boolean   @default(false) @map("is_published")
  publishedAt     DateTime? @map("published_at")
  viewsCount      Int       @default(0) @map("views_count")
  likesCount      Int       @default(0) @map("likes_count")
  metaDescription String?   @map("meta_description")
  metaKeywords    String?   @map("meta_keywords")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")

  user      User         @relation(fields: [userId], references: [id])
  playlists PlaylistPost[]
  views     PostView[]
  likes     PostLike[]
  mediables Mediable[]

  @@index([slug])
  @@index([type])
  @@index([isPublished])
  @@index([publishedAt])
  @@index([userId, isPublished])
  @@map("posts")
}
```

---

## Playlist

```prisma
model Playlist {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  title       String
  description String?
  slug        String    @unique
  cover       String?
  isPublished Boolean   @default(false) @map("is_published")
  order       Int       @default(0)
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  user      User           @relation(fields: [userId], references: [id])
  posts     PlaylistPost[]
  mediables Mediable[]

  @@index([slug])
  @@index([isPublished])
  @@index([userId, isPublished])
  @@map("playlists")
}
```

---

## PlaylistPost

```prisma
model PlaylistPost {
  id         String   @id @default(uuid())
  playlistId String   @map("playlist_id")
  postId     String   @map("post_id")
  userId     String   @map("user_id")
  order      Int      @default(0)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  playlist Playlist @relation(fields: [playlistId], references: [id])
  post     Post     @relation(fields: [postId], references: [id])

  @@unique([playlistId, postId])
  @@index([playlistId])
  @@index([postId])
  @@map("playlist_post")
}
```

---

## Media

```prisma
model Media {
  id           String   @id @default(uuid())
  userId       String?  @map("user_id")
  filename     String
  originalName String   @map("original_name")
  mimeType     String   @map("mime_type")
  size         Int
  url          String
  disk         String   @default("r2")
  width        Int?
  height       Int?
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  user      User?      @relation(fields: [userId], references: [id])
  mediables Mediable[]

  @@index([userId])
  @@index([mimeType])
  @@map("media")
}
```

---

## Mediable

```prisma
model Mediable {
  id           String   @id @default(uuid())
  mediaId      String   @map("media_id")
  mediableType String   @map("mediable_type")
  mediableId   String   @map("mediable_id")
  tag          String   @default("default")
  order        Int      @default(0)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  media    Media     @relation(fields: [mediaId], references: [id])
  post     Post?     @relation(fields: [mediableId], references: [id])
  playlist Playlist? @relation(fields: [mediableId], references: [id])

  @@index([mediableType, mediableId])
  @@index([mediaId])
  @@index([tag])
  @@map("mediables")
}
```

---

## PostView

```prisma
model PostView {
  id        BigInt   @id @default(autoincrement())
  postId    String   @map("post_id")
  ipAddress String   @map("ip_address")
  userAgent String?  @map("user_agent")
  referer   String?
  viewedAt  DateTime @map("viewed_at")
  createdAt DateTime @default(now()) @map("created_at")

  post Post @relation(fields: [postId], references: [id])

  @@index([postId])
  @@index([ipAddress])
  @@index([viewedAt])
  @@map("post_views")
}
```

---

## PostLike

```prisma
model PostLike {
  id        BigInt   @id @default(autoincrement())
  postId    String   @map("post_id")
  ipAddress String   @map("ip_address")
  userId    String?  @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  post Post  @relation(fields: [postId], references: [id])
  user User? @relation(fields: [userId], references: [id])

  @@unique([postId, ipAddress])
  @@index([postId])
  @@map("post_likes")
}
```

---

# Migration Commands

```bash
# Generate Prisma Client
pnpm --filter coderium-api prisma generate

# Create migration
pnpm --filter coderium-api prisma migrate dev --name <migration-name>

# Apply migration in production
pnpm --filter coderium-api prisma migrate deploy

# Reset database (dev only)
pnpm --filter coderium-api prisma migrate reset

# Seed database
pnpm --filter coderium-api prisma db seed
```
