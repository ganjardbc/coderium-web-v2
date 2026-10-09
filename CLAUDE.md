# CLAUDE.md

> Diisi pada TASK-0 Agency Pivot (2026-10-09) dari kondisi repo dan
> `docs/development/agency-pivot/`. Hapus catatan ini setelah direview manusia.

## Project

- Tipe: monorepo (Turborepo)
- Package manager: pnpm (`pnpm@9.15.9`, workspace `apps/*` dan `packages/*`)
- Tracker: Linear
- Database: postgresql (Prisma v7 + `@prisma/adapter-pg`, skema di `apps/api/prisma/schema.prisma`)

## Apps

- `apps/admin` (`coderium-admin`) — Vue 3 + Vite, PrimeVue, Pinia, Tailwind CSS v4. Dashboard admin.
- `apps/api` (`coderium-api`) — NestJS + Prisma. REST API, prefix `/api/v1`.
- `apps/web` (`coderium-web`) — Nuxt 3 (SSR), Tailwind CSS v4. Situs publik coderium.id.
- `packages/eslint-config` — hanya file konfigurasi (`index.js`), tanpa skrip.
- `packages/shared-types` — tipe TypeScript bersama, build dengan tsup.
- `packages/shared-utils` — fungsi murni (slugify, formatDate, dst), build dengan tsup. Dipakai `apps/api`.
- `packages/tsconfig` — preset tsconfig (`base.json`, `nestjs.json`, `vue.json`), tanpa skrip.
- `packages/ui` — komponen generik `Ui*` (UiButton, UiInput, UiBadge), build dengan tsup.

## Konvensi Kode

Aturan lengkap ada di `AGENTS.md` dan `docs/development/conventions.md`. Yang paling
sering menentukan kualitas PR:

**Umum**
- Satu task kecil pada satu waktu, mengikuti `docs/development/backlog.md`. Jangan
  refactor di luar task, jangan hapus file tanpa alasan.
- Nama file kebab-case; komponen Vue reusable PascalCase; halaman admin `list.vue`,
  `create.vue`, `edit.vue`.
- TypeScript strict. Tidak ada `any` tanpa alasan.
- Tipe yang dipakai lintas app ditaruh di `packages/shared-types`, bukan diduplikasi.
  Kondisi saat ini: belum ada app yang mengimpor `@coderium/shared-types`, dan tipe
  Product masih lokal di `apps/admin/src/modules/products/stores/product.store.ts`
  dan di halaman `apps/web/pages/products/`. Jangan menambah salinan baru.
- Commit: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`. Branch pipeline CAF:
  `ai-agent/{TICKET-ID}`.

**apps/api (NestJS)**
- Struktur module: `module-name/{dto,entities,constants}` + `*.module.ts`,
  `*.controller.ts`, `*.service.ts`.
- Controller tipis: terima request, pakai DTO dan decorator, panggil service,
  kembalikan response. Logika bisnis, query, transaksi, dan error handling di service.
- Validasi input lewat DTO class-validator (ValidationPipe global).
- JWT guard global: semua route terproteksi secara default. Route publik wajib
  `@Public()`. Route admin memakai `@Permissions('...')` + `@ApiBearerAuth()`.
- Jangan membuat `PrismaClient` baru; inject `PrismaService`.
- Response: `{ success, message, data }`; list menambah
  `meta: { page, limit, total, total_pages }`.
- Error: lempar `HttpException` Nest dari service. `AllExceptionsFilter`
  (`apps/api/src/shared/filters`) meneruskan properti tambahan pada body exception
  (mis. `fields` pada error validasi publish produk).
- API publik hanya mengembalikan konten terpublikasi (post: `is_published = true`
  dan `deleted_at = null`; product: `status = published`). 404 yang sama untuk
  not-found dan draft.
- Database: UUID primary key, kolom snake_case, field Prisma camelCase. Soft delete
  untuk users, posts, playlists. Product tidak punya `deletedAt`; status `archived`
  berperan sebagai soft delete.
- Perubahan skema hanya additive; migration tidak menyentuh tabel lain.

**apps/admin (Vue 3)**
- Struktur module: `src/modules/{nama}/{pages,components,stores,services,types,router}`.
  Route per module di `modules/*/router/index.ts`, didaftarkan di
  `src/core/global-routes.ts`, dengan `meta: { title, layout, permission }`.
- State lewat Pinia (`*.store.ts`, `useXxxStore`).
- Komponen reusable yang sudah ada dan harus dipakai ulang: `RichTextEditor.vue`,
  `MediaUploader.vue`, `RepeatableListField.vue` (daftar berulang title + description
  dengan tambah/hapus/urut), `AdminPagination.vue`, `EmptyState.vue`.
- Form produk: status diturunkan dari tombol submit ("Simpan sebagai Draft" /
  "Simpan & Publish"), tidak ada dropdown status. Error publish dibaca dari
  `err.response.data.fields`.

**apps/web (Nuxt 3)**
- Routing berbasis file di `pages/`. Halaman dirender SSR.
- Ambil data dengan `useAsyncData` + `$fetch` ke `runtimeConfig.public.apiBase`
  (`/api`, di-proxy ke backend lewat `routeRules` di `nuxt.config.ts`).
- Metadata halaman lewat `composables/useSeo.ts`; JSON-LD lewat `composables/useJsonLd.ts`.
- Sitemap: route statis terdeteksi otomatis dari `pages/`; slug dinamis dari
  `server/routes/_sitemap-urls.ts`.
- Semua halaman wajib punya kelas `dark:` (dark mode) dan rapi di mobile.
- Pakai komponen yang ada (`ProductCard`, `FeaturedProductCard`, `NotFoundState`,
  `EmptyState`, `BackButton`, `PostListItem`, `SkeletonBlock`) sebelum membuat baru.

## Konteks Bisnis

- coderium.id sedang dipivot dari blog menjadi situs AI agency untuk tim engineering.
  Sumber kebenaran pivot: `docs/development/agency-pivot/plan.md`, `requirements.md`,
  dan `tasks.md` (Phase 17 - Agency Pivot).
- Dua produk: **CAF (Coderium Agent Framework)** dan **AI Code Reviewer**. Artikel
  tetap ada sebagai pelengkap.
- Kontak hanya lewat email `coderium.id@gmail.com` (tautan `mailto:` dengan subjek terisi).
  Tidak ada form kontak, penyimpanan lead, pembayaran, atau akun klien.
- Halaman baru berbahasa Indonesia penuh.
- Konten produk diisi lewat admin, bukan di-hardcode di kode.
- Klaim, angka, dan harga di situs hanya boleh diambil dari bagian "Data yang boleh
  dipakai" di `docs/development/agency-pivot/requirements.md`. Jangan menambah klaim
  atau angka baru. Bagian "Keputusan yang sudah final" di `plan.md` tidak diubah.
- User sistem: pengunjung publik (`apps/web`), serta admin dan author (`apps/admin`)
  dengan RBAC. Author hanya boleh mengakses resource miliknya (query di-scope `userId`);
  Product tidak punya ownership dan dijaga permission `manage_products` (admin saja).
- Jangan pernah mengekspos konten draft ke publik, mencatat JWT di log, atau menyimpan
  biner file di database (database hanya menyimpan URL).

## Perintah Verifikasi

Dijalankan dari root (Turborepo). Skrip yang benar-benar ada di `package.json`:

- typecheck: `pnpm typecheck` (`turbo run typecheck`; membangun dependency `packages/*` dulu)
- lint: `pnpm lint` (`turbo run lint`) — skrip ada di root, tetapi tidak ada satu pun
  workspace yang punya skrip `lint`, sehingga perintah ini menjalankan 0 task. Lulusnya
  bukan bukti apa pun.
- test: tidak ada skrip `test` di root maupun di workspace mana pun. File
  `*.spec.ts` di `apps/api` (products, ai-content) ada tetapi tidak bisa dieksekusi
  (Jest tidak terpasang).
- build: `pnpm build` (`turbo run build`)

Per app:

- `pnpm --filter coderium-api typecheck` (`tsc --noEmit`) dan `build` (`nest build`).
  Jalankan `pnpm --filter coderium-api prisma:generate` dulu bila Prisma Client belum
  ter-generate atau skema berubah. Tidak ada skrip lint dan test.
- `pnpm --filter coderium-admin typecheck` (`vue-tsc --noEmit`) dan `build`
  (`vue-tsc -b && vite build`). Tidak ada skrip lint dan test.
- `pnpm --filter coderium-web typecheck` (`nuxi typecheck`) dan `build` (`nuxt build`).
  Tidak ada skrip lint dan test.

CI (`.github/workflows/ci.yml`) menjalankan: install, `prisma:generate`, `pnpm typecheck`,
`pnpm build`. Karena lint dan test tidak tersedia, typecheck dan build adalah bukti
utama non-regresi; perilaku yang tidak tercakup wajib dicatat sebagai belum diuji.

## Referensi

- Lihat `AGENTS.md` untuk aturan cross-tool.
- Lihat `docs/development/agency-pivot/` untuk plan, requirements, dan tasks pivot agency.
- Lihat `docs/golden-examples/` untuk referensi kode.
- Lihat `docs/decisions/` untuk ADR.
- Lihat `.caf/workflows/task-completion.md` untuk definition of done.
- Lihat `.caf/tasks/README.md` untuk struktur artifact handoff.
