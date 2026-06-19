# .ai/skills/nestjs-module.md

## Purpose

Gunakan skill ini ketika membuat atau mengubah module NestJS di Coderium V2.

---

# Architecture

```txt
NestJS
Prisma
PostgreSQL
JWT
RBAC
```

Module pattern:

```txt
module-name/
├── dto/
├── entities/
├── constants/
├── module-name.module.ts
├── module-name.controller.ts
└── module-name.service.ts
```

---

# Controller Rules

Controller harus tipis. Hanya boleh:

```txt
Receive Request
Use DTO
Use Decorator
Call Service
Return Response
```

Jangan menaruh business logic di controller.

---

# Service Rules

Service bertanggung jawab untuk:

```txt
Business Logic
Ownership Validation
Database Query
Transaction
Error Handling
Data Transformation
```

---

# DTO Rules

Semua request body wajib menggunakan DTO.

Gunakan:

```txt
class-validator
class-transformer
```

---

# RBAC Rules

Gunakan:

```ts
@Permissions('manage_own_posts')
```

untuk protected endpoint.

---

# Ownership Rules

Author hanya boleh mengakses resource miliknya sendiri.

Selalu query menggunakan:

```ts
where: {
  id: postId,
  userId: currentUser.id,
  deletedAt: null,
}
```

---

# Prisma Rules

Gunakan:

```ts
constructor(private readonly prisma: PrismaService) {}
```

Jangan membuat PrismaClient baru.

---

# Response Rules

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

# Output Checklist

```txt
DTO dibuat
Controller dibuat
Service dibuat
Module didaftarkan
Ownership validation ada
Permission validation ada
```
