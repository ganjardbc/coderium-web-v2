# Design — Ticket 12: Product CRUD API (apps/api)

Rujuk `requirements.md` (Planner) untuk keputusan field/endpoint/validasi. Dokumen
ini menerjemahkan itu jadi keputusan teknis konkret berdasarkan investigasi pola
modul Posts/Users existing di `apps/api`. Implementer (caf-coder) WAJIB mengikuti
dokumen ini alih-alih menebak ulang pola — kalau ada konflik dengan
`requirements.md`, `requirements.md` menang untuk soal *apa* (data/behavior),
dokumen ini menang untuk soal *bagaimana* (struktur kode/teknis).

## 1. Ringkasan pola yang diambil dari investigasi

Sumber: `apps/api/src/posts/*`, `apps/api/src/users/*`, `apps/api/src/auth/*`,
`apps/api/src/shared/filters/all-exceptions.filter.ts`, `apps/api/prisma/schema.prisma`,
`apps/api/prisma/seed.ts`, `apps/api/src/app.module.ts`, `apps/api/package.json`,
root `package.json` + `turbo.json`.

Poin penting yang membedakan Product dari Post (implementer jangan menyamakan
mentah-mentah):

- Post/Playlist punya `userId` (ownership per-author) → guard pakai kombinasi
  permission `manage_own_*` / `manage_all_*` + pengecekan `isAdmin()`/ownership
  di service layer. **Product tidak punya `userId`** (tidak ada di daftar field
  requirements, tidak ada indikasi ownership per-user di `prd.md`/`flow.md`).
  Jadi pola yang relevan bukan Posts punya dua-tier permission, tapi pola
  `UsersModule` (`manage_users`, admin-only, tanpa ownership) — lihat §3.
- Posts pakai satu `PostsController` tanpa `@Controller()` prefix, path lengkap
  dideklarasikan per-method (`@Get('posts')`, `@Get('admin/posts')`,
  `@Post('admin/posts/:slug/publish')`). **Ikuti pola ini** untuk
  `ProductsController` (bukan pola `UsersController` yang pakai
  `@Controller('admin/users')` fixed prefix), karena Product butuh dua prefix
  berbeda (`products` publik vs `admin/products`) dalam satu controller,
  persis kasus Posts.
- Auth global: `JwtAuthGuard` + `PermissionsGuard` terpasang sebagai `APP_GUARD`
  di `app.module.ts` — semua route protected by default, `@Public()` untuk
  bypass ke publik, `@Permissions(...)` untuk gating tambahan. **Tidak perlu
  guard baru** — cukup pasang decorator yang tepat.
- Exception response global (`AllExceptionsFilter`) saat ini **hanya
  meneruskan `message` sebagai string** dari `HttpException` — kalau
  `HttpException` dilempar dengan response object `{ message, fields }`,
  Nest's `HttpException.initMessage()` mengekstrak `.message` jadi string dan
  properti lain (`fields`) **hilang** sebelum sampai ke filter. Ini masalah
  nyata untuk requirement "response error validasi publish menyertakan daftar
  field yang gagal" — lihat §5 untuk keputusan.

## 2. Prisma schema

Tambahkan di `apps/api/prisma/schema.prisma`, setelah model `Playlist`/`PlaylistPost`
(tidak menyentuh model lain):

```prisma
enum ProductStatus {
  draft
  published
  archived
}

model Product {
  id             String        @id @default(uuid())
  slug           String        @unique
  name           String
  tagline        String?
  description    String?
  status         ProductStatus @default(draft)
  cover          String?
  pipelineSteps  Json?         @default("[]") @map("pipeline_steps")
  features       Json?         @default("[]")
  ctaLabel       String?       @map("cta_label")
  ctaUrl         String?       @map("cta_url")
  order          Int           @default(0)
  featured       Boolean       @default(false)
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")

  @@index([slug])
  @@index([status])
  @@index([status, order])
  @@index([featured])
  @@map("products")
}
```

Catatan:
- `@@index([slug])` terlihat redundan dengan `@unique` tapi ini **konsisten
  dengan pola existing** (`Post.slug` dan `Playlist.slug` juga punya
  `@@unique` + `@@index` terpisah) — ikut pola, jangan "optimize" dengan
  menghapusnya.
- Tidak ada `deletedAt`/`userId` — sesuai requirements (tidak ada soft-delete
  terpisah, tidak ada ownership per-user).
- `Json?` dengan `@default("[]")` untuk `pipelineSteps`/`features` mengikuti
  cara Prisma menulis default JSON (string literal berisi JSON array kosong).
  Kalau versi Prisma di repo ini (`prisma@^7.8.0`) menolak syntax `@default("[]")`
  untuk kolom `Json`, fallback: hilangkan default di schema dan set default
  `[]` di level DTO/service saat create — jangan block migration karena ini,
  cukup catat di PR description kalau terjadi.
- Enum value pakai lowercase (`draft`, `published`, `archived`) — konsisten
  dengan `UserStatus`/`PostType` existing yang semuanya lowercase.

## 3. Auth & permission (keputusan arsitektur yang WAJIB dibaca)

`requirements.md` bilang "auth admin existing, pola sama Posts, tidak butuh
role baru", dan `Out of Scope` menyebut "Role/permission baru — reuse role
admin existing". Investigasi menunjukkan **ambiguitas** ini perlu diputuskan
eksplisit, karena kalau endpoint admin Product **tidak** diberi
`@Permissions(...)` sama sekali, efeknya (lihat `PermissionsGuard.canActivate`)
adalah: **guard lolos untuk role apapun yang sudah login** (author non-admin pun
bisa akses `admin/products/*`), bukan "admin-only" seperti yang dimaksud
requirements.

Keputusan: **tambahkan satu permission baru `manage_products`** (bukan role
baru), dipetakan ke role `admin` saja di `prisma/seed.ts` — pola ini identik
dengan `manage_users` (single permission, admin-only, tanpa varian `_own`),
bukan pola dua-tier Posts (karena Product tidak punya ownership). Ini
penambahan *data* seed (permission + role-mapping), bukan penambahan
*konsep*/role baru — konsisten dengan larangan "role baru", dan tetap
"reuse role admin existing" (permission baru dipetakan ke role admin yang
sudah ada, tidak ada role baru dibuat).

Implementasi:
- `apps/api/prisma/seed.ts`: tambah entry `{ name: 'Manage Products', slug: 'manage_products', description: 'Manage all products' }` ke array `permissions`, tambahkan `'manage_products'` ke `adminPermissions` (bukan `authorPermissions`).
- Semua endpoint `admin/products/*` dipasangi `@Permissions('manage_products')` (bukan `manage_own_posts`/`manage_all_posts` — itu permission modul Posts, jangan reuse silang antar modul).
- Endpoint publik (`GET /products`, `GET /products/:slug`) dipasangi `@Public()`.

Kalau reviewer/manusia menilai keputusan ini melanggar batas "no new
permission" secara lebih ketat dari yang diasumsikan di atas, alternatif
fallback: cukup pasang `@ApiBearerAuth()` tanpa `@Permissions()` (auth-only,
semua role login bisa akses) — tapi ini **tidak** memenuhi DoD "auth yang sama
dengan modul Posts" secara semantik (Posts admin-write tetap dibatasi
permission tertentu, bukan sekadar "sudah login"). Kalau ada keberatan, stop
dan tanyakan sebelum coder lanjut ke task 6 (controller) — jangan diam-diam
pilih opsi fallback tanpa mencatat alasannya di PR description.

## 4. Struktur file (folder `apps/api/src/products/`)

Ikuti persis pola folder Posts:

```
apps/api/src/products/
  products.module.ts
  products.controller.ts
  products.service.ts
  products.service.spec.ts
  dto/
    index.ts
    create-product.dto.ts
    update-product.dto.ts
    list-products.dto.ts       # admin: page, limit, sort (order|updatedAt), dir
    pipeline-step.dto.ts       # nested item { title, description } utk validasi item JSON
    feature-item.dto.ts        # nested item { title, description }
```

`ProductsModule` daftarnya sama seperti `PostsModule` (`controllers`,
`providers`, `exports: [ProductsService]` — export meski belum ada konsumen
lain, konsisten pola existing).

Registrasi di `apps/api/src/app.module.ts`: tambah `import { ProductsModule } from './products/products.module';` dan masukkan ke array `imports`, tempatkan setelah `PlaylistsModule` (mengikuti urutan penambahan modul konten yang sudah ada) — jangan mengubah baris lain.

## 5. DTO & validasi

`CreateProductDto`:
- `name: string` — `@IsString() @MinLength(1)`.
- `slug?: string` — `@IsString() @IsOptional()` (service yang generate dari `name` kalau kosong).
- `tagline?: string`, `description?: string` — optional string.
- `status?: ProductStatusEnum` (buat enum TS lokal di DTO, sama pola `PostTypeEnum` di `create-post.dto.ts`) — `@IsEnum() @IsOptional()`, default ditangani di service (`draft` kalau tidak dikirim).
- `cover?: string` — optional string (tidak perlu `@IsUrl()` ketat di sini karena requirements hanya mewajibkan format URL valid untuk `ctaUrl`, bukan `cover`).
- `pipelineSteps?: PipelineStepDto[]` — `@IsArray() @IsOptional() @ValidateNested({ each: true }) @Type(() => PipelineStepDto)`.
- `features?: FeatureItemDto[]` — sama pola.
- `ctaLabel?: string` — optional string.
- `ctaUrl?: string` — `@IsOptional() @IsUrl()` (format dasar, class-validator `IsUrl` — ini validasi *format*, bukan validasi *wajib-untuk-publish* yang tetap dilakukan di service per requirements task 4).
- `order?: number` — `@IsOptional() @IsNumber() @Type(() => Number)`.
- `featured?: boolean` — `@IsOptional() @IsBoolean()`.

`PipelineStepDto` / `FeatureItemDto` (bentuk sama, dua file terpisah supaya
konsisten dengan pemisahan konsep tapi isi identik — kalau implementer lebih
suka satu shared DTO class untuk keduanya, itu tidak masalah, dua nama field
sama persis):
```ts
export class PipelineStepDto {
  @IsString() @MinLength(1) title!: string;
  @IsString() @IsOptional() description?: string;
}
```
Requirements tidak menyatakan `description` di item ini wajib — hanya
"minimal 1 item" untuk publish, jadi hanya `title` yang divalidasi wajib per
item.

`UpdateProductDto extends PartialType(CreateProductDto)` — sama persis pola
`UpdateProductDto`/`UpdatePostDto`.

`ListProductsDto` (dipakai endpoint admin — endpoint publik tidak butuh param
sort per requirements, list publik fixed `order` asc):
```ts
export class ListProductsDto {
  page?: number = 1;
  limit?: number = 10;
  sort?: 'order' | 'updatedAt' = 'order';   // @IsOptional() @IsIn(['order','updatedAt'])
  dir?: 'asc' | 'desc';                      // @IsOptional() @IsIn(['asc','desc']) — default ikut util di service: order→asc, updatedAt→desc
}
```

## 6. Validasi publish (service-level, bukan DTO decorator)

Buat helper privat di `ProductsService`:
```ts
private assertPublishable(candidate: { cover?: string|null; ctaUrl?: string|null; pipelineSteps?: unknown; features?: unknown }) {
  const failed: string[] = [];
  if (!candidate.cover) failed.push('cover');
  if (!candidate.ctaUrl || !isValidUrl(candidate.ctaUrl)) failed.push('ctaUrl');
  if (!Array.isArray(candidate.pipelineSteps) || candidate.pipelineSteps.length < 1) failed.push('pipelineSteps');
  if (!Array.isArray(candidate.features) || candidate.features.length < 1) failed.push('features');
  if (failed.length > 0) {
    throw new BadRequestException({ message: 'Validasi publish gagal', fields: failed });
  }
}
```

Dipanggil dari **satu titik terpusat**: dalam method `update()`/`create()`
sebelum commit ke DB, setiap kali hasil akhir `status` yang akan disimpan
adalah `published` — cek dengan menggabungkan data existing (untuk update,
partial body) + data baru, bukan cuma field yang dikirim di body (mis. kalau
admin PATCH `{ status: 'published' }` saja tanpa field lain, validasi harus
tetap cek `cover`/`ctaUrl`/dst dari row existing di DB, bukan `undefined` dari
body — kalau implementer hanya validasi field di body, ini bug: produk yang
sudah lengkap datanya lalu di-draft-kan sebagian lalu di-publish ulang tanpa
mengirim ulang semua field akan salah ditolak/diloloskan). Method `publish()`
dedicated memanggil helper yang sama dengan data existing (tidak ada body
tambahan).

`isValidUrl` — reuse `class-validator`'s internal URL check kalau ada cara
memanggilnya secara programatik (`isURL` dari `class-validator` package,
bukan hanya decorator), supaya konsisten satu sumber kebenaran format URL
antara DTO-level `@IsUrl()` dan service-level re-check.

## 7. Exception response — perbaikan `AllExceptionsFilter` (additive, low-risk)

Masalah (lihat §1): `HttpException` dengan response object
`{ message, fields }` kehilangan `fields` karena `this.message` di Nest hanya
string. Perbaikan minimal, additive-only, tidak mengubah bentuk response
existing untuk exception lain:

Di `apps/api/src/shared/filters/all-exceptions.filter.ts`, di dalam `catch()`,
setelah menghitung `status`/`message`, ambil juga raw response body kalau
`exception` adalah `HttpException` dan `getResponse()`-nya berupa object:

```ts
const rawResponse =
  exception instanceof HttpException ? exception.getResponse() : null;
const extra =
  rawResponse && typeof rawResponse === 'object' && !Array.isArray(rawResponse)
    ? (rawResponse as Record<string, unknown>)
    : {};

response.status(status).json({
  success: false,
  statusCode: status,
  timestamp: new Date().toISOString(),
  path: request.url,
  message,
  ...extra,        // spread duluan lalu override `message` di bawah supaya key kanonik tetap konsisten
  ...(extra.message ? {} : {}),
});
```

Sederhanakan: spread `extra` **sebelum** field standar supaya `message`
standar (`exception.message`) tetap final/menang kalau ada duplikasi key,
tapi properti tambahan seperti `fields` tetap lolos:
```ts
response.status(status).json({
  ...extra,
  success: false,
  statusCode: status,
  timestamp: new Date().toISOString(),
  path: request.url,
  message,
});
```
Ini **backward compatible**: exception lain di codebase (`NotFoundException('...')`, dll) yang responsenya string biasa tidak menghasilkan `extra` apa pun (object kosong), jadi tidak ada perubahan perilaku untuk mereka. Perubahan ini menyentuh file shared di luar folder `products/`, tapi additive-only dan perlu untuk memenuhi requirement response error terstruktur — dicatat eksplisit di sini supaya reviewer tahu ini disengaja, bukan scope creep tak terduga.

Kalau implementer/reviewer keberatan menyentuh file shared, alternatif:
tangani di level `ProductsController` dengan try/catch dan format response
manual — tapi ini **melanggar** requirements "mengikuti konvensi error
response existing... jangan bikin format baru sendiri" karena akan
menghasilkan bentuk response berbeda dari exception lain di apps yang sama.
Pilihan yang direkomendasikan tetap opsi filter di atas.

## 8. Service methods (`ProductsService`)

- `create(dto: CreateProductDto)`: generate/validasi slug (lihat §9), default
  `status: draft` kalau tidak dikirim, kalau `dto.status === 'published'`
  jalankan `assertPublishable(dto)` sebelum `prisma.product.create`.
- `findAllPublic(query)`: `where: { status: 'published' }`, `orderBy: { order: 'asc' }`, dengan pagination (`skip`/`take`) mengikuti pola `findAllPublic` Posts.
- `findBySlugPublic(slug)`: `findFirst({ where: { slug, status: 'published' } })`, `NotFoundException('Product not found')` kalau null — jangan bedakan pesan untuk kasus draft/archived vs tidak ada (requirements eksplisit: jangan bocor existence).
- `findAdminAll(query: ListProductsDto)`: tanpa filter status (semua), `orderBy` dinamis dari `query.sort`/`query.dir` (default `{ order: 'asc' }`).
- `findAdminById(id)`: `findUnique({ where: { id } })`, 404 kalau null.
- `update(id, dto: UpdateProductDto)`: ambil row existing dulu (404 kalau tidak ada), kalau hasil akhir status (existing atau dari `dto.status`) adalah `published`, jalankan `assertPublishable` dengan data gabungan (`{ ...existing, ...dto }`), lalu `prisma.product.update`.
- `publish(id)`: ambil existing, `assertPublishable(existing)`, update `status: 'published'`.
- `unpublish(id)`: update `status: 'draft'`, tanpa validasi.
- `archive(id)`: update `status: 'archived'`, tanpa validasi.
- `restore(id)`: update `status: 'draft'`, tanpa validasi (lihat requirements — restore selalu ke `draft`, bukan status sebelum archive, tidak ada tracking "status sebelum archive").

## 9. Slug generation & uniqueness

Reuse `slugify` dari `@coderium/shared-utils` (sama import yang dipakai
`PostsService`). Aturan (beda dari Posts karena requirements Product minta
"validasi unique" eksplisit, bukan auto-suffix diam-diam untuk kasus slug
manual):

- **Create tanpa `slug` dikirim**: `slug = slugify(name)`; kalau sudah
  terpakai, auto-suffix `-{Date.now().toString(36)}` — identik pola Posts
  (perilaku ini auto-generated, tidak perlu menolak user karena user tidak
  pernah melihat/memilih slug ini).
- **Create/Update dengan `slug` dikirim eksplisit oleh admin**: validasi
  unique dengan query `findUnique({ where: { slug } })` (exclude `id` sendiri
  saat update); kalau bentrok, lempar `ConflictException('Slug already in use')`
  (409) — **jangan** auto-suffix diam-diam untuk kasus ini, karena admin
  sengaja memilih slug tertentu (requirements: "tetap bisa diedit manual —
  validasi unique").

## 10. Endpoint final (path, method, guard)

| Method | Path | Guard | Service method |
|---|---|---|---|
| GET | `/products` | `@Public()` | `findAllPublic` |
| GET | `/products/:slug` | `@Public()` | `findBySlugPublic` |
| GET | `/admin/products` | `@Permissions('manage_products')` | `findAdminAll` |
| GET | `/admin/products/:id` | `@Permissions('manage_products')` | `findAdminById` |
| POST | `/admin/products` | `@Permissions('manage_products')` | `create` |
| PATCH | `/admin/products/:id` | `@Permissions('manage_products')` | `update` |
| POST | `/admin/products/:id/publish` | `@Permissions('manage_products')` | `publish` |
| POST | `/admin/products/:id/unpublish` | `@Permissions('manage_products')` | `unpublish` |
| POST | `/admin/products/:id/archive` | `@Permissions('manage_products')` | `archive` |
| POST | `/admin/products/:id/restore` | `@Permissions('manage_products')` | `restore` |

Catatan: requirements pakai `PATCH` untuk update (bukan `PUT` seperti Posts).
Ikuti `PATCH` sesuai requirements eksplisit — ini override yang disengaja
dari pola HTTP-verb Posts, bukan salah ketik, karena `UpdateProductDto`
partial memang lebih pas semantik `PATCH`.

## 11. Verifikasi — realita tooling `apps/api` (penting, beda dari asumsi Planner)

Cek langsung `apps/api/package.json` dan root `turbo.json`:
- `apps/api/package.json` scripts yang ada: `build`, `dev`, `start`,
  `typecheck`, `clean`, `prisma:*`. **Tidak ada `lint` atau `test` script.**
- Tidak ada `eslint.config.js`/`.eslintrc*` maupun `jest.config.*` di
  `apps/api/`.
- Root `turbo.json` cuma punya task `build`, `dev`, `lint`, `typecheck`,
  `clean` — **tidak ada task `test`**, dan task `lint` di root akan gagal untuk
  `apps/api` (tidak ada script lint di package ini) kecuali turbo
  skip-otomatis package tanpa script tsb (perilaku default turbo: package
  tanpa script yang direferensikan task akan di-skip, bukan gagal — jadi
  `pnpm run lint` di root kemungkinan tetap sukses tapi tidak benar-benar
  me-lint `apps/api`).

**Keputusan**: task 7 di `tasks.md` minta "test unit/e2e" dan DoD minta "lint
lulus" — infrastruktur untuk itu **tidak ada** di `apps/api` saat ini.
Menambahkan jest/eslint config baru untuk seluruh `apps/api` adalah perubahan
infrastruktur besar di luar scope "Product CRUD API" ticket ini (dan berisiko
mengubah hasil verifikasi module lain kalau lint/test ternyata gagal di kode
existing yang tidak terkait Product).

Rekomendasi untuk caf-coder:
1. Verifikasi yang **enforceable** dan wajib lulus untuk ticket ini:
   `pnpm --filter coderium-api run typecheck` dan
   `pnpm --filter coderium-api run build`.
2. Untuk "test": tulis file `.spec.ts` (unit test service, sesuai task 7)
   **hanya jika** `@nestjs/testing`/`jest` runner sudah bisa dieksekusi dari
   root tanpa setup tambahan (cek dulu apakah ada jest config di root monorepo
   atau di package lain yang bisa dipakai bersama sebelum menyimpulkan tidak
   bisa). Kalau ternyata memang tidak ada cara menjalankan test tanpa
   menambah infrastruktur baru, tulis test file tetap (sebagai dokumentasi
   behavior yang benar & buat future-proofing setup test), tapi laporkan
   status verifikasi run test sebagai **tidak dapat dieksekusi (infra belum
   ada)** — bukan "PASS" palsu, dan bukan alasan untuk block seluruh ticket
   (typecheck+build tetap harus lulus).
3. Untuk "lint": kalau `pnpm run lint` di root tidak benar-benar menjalankan
   apapun untuk `apps/api` (skip karena no-op script), laporkan apa adanya
   di verify-report — jangan menambahkan `eslint.config.js` baru untuk
   `apps/api` sendiri sebagai bagian dari ticket ini kecuali diminta eksplisit
   (itu perubahan tooling monorepo-wide, keputusan yang harusnya lewat ticket
   terpisah/human).

Kalau retry verify gagal karena poin ini (test/lint tidak bisa "PASS" secara
literal), itu bukan alasan menulis `verify-report.md` NEEDS_HUMAN — cukup
dokumentasikan realita ini di report, dengan typecheck+build sebagai bukti
utama ticket ini tidak merusak build.

## 12. Ringkasan keputusan yang butuh perhatian ekstra saat review

1. Permission baru `manage_products` (bukan role baru) — §3, ada rasionalnya,
   tapi ini keputusan yang paling mungkin didebat reviewer. Kalau ditolak,
   ticket ini butuh keputusan ulang sebelum controller ditulis.
2. Perubahan `AllExceptionsFilter` — §7, additive dan low-risk, tapi menyentuh
   file di luar folder `products/`.
3. `PATCH` (bukan `PUT`) untuk update — §10, sengaja override pola Posts
   sesuai requirements eksplisit.
4. Validasi publish pakai data gabungan (existing + body), bukan cuma body —
   §6, poin teknis yang mudah salah diimplementasikan kalau tidak hati-hati.
5. Realita tooling test/lint yang tidak ada di `apps/api` — §11, supaya
   caf-coder tidak stuck mencoba memenuhi DoD literal yang infra-nya belum
   ada.
