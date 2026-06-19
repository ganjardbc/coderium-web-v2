# 🚀 Coderium V2 — Content Publishing & Knowledge Management System

Coderium V2 adalah platform modern untuk developer dan content creator mempublikasikan dan berbagi knowledge dalam berbagai format konten.

---

## 🌟 Key Features (MVP Scope)

- 📝 **Multi-Format Posts**: Buat konten dalam format article, carousel, video, atau stack gallery.
- 🎵 **Playlist / Collections**: Organisir konten ke dalam playlist tematik.
- 🖼️ **Media Management**: Upload dan kelola media terpusat dengan polymorphic attachment.
- ❤️ **Engagement**: Like dan views tracking untuk setiap konten.
- 🔍 **Full-Text Search**: Cari konten berdasarkan judul, subtitle, dan isi.
- 📊 **Analytics Dashboard**: Monitor performa konten (top views, top likes).
- 🌐 **SEO-Optimized**: SSR via Nuxt 3 untuk post detail yang SEO-friendly.
- 🌙 **Dark Mode**: UI yang nyaman untuk developer dengan dark mode support.

---

## 🛠️ Technology Stack

### Core

* **Monorepo**: PNPM Workspace + TurboRepo
* **Public Site**: Nuxt 3 (SSR) + Vue 3 + TypeScript
* **Admin Dashboard**: Vue 3 + Vite + TypeScript
* **Backend API**: NestJS + TypeScript
* **Database & ORM**: PostgreSQL + Prisma

### Frontend UI

* **Design System**: PrimeVue (UI Components)
* **Styling**: Tailwind CSS v4
* **State Management**: Pinia
* **Validation**: Zod

---

## 📁 Repository Structure

```txt
coderium-v2/
├── apps/
│   ├── web/         # Nuxt 3 — Public site (SSR)
│   ├── admin/       # Vue 3 + Vite — Admin dashboard
│   └── api/         # NestJS — Backend REST API
│
├── packages/
│   ├── ui/          # Reusable UI components
│   ├── shared-types/# Shared TypeScript interfaces
│   ├── shared-utils/# Shared utility functions
│   ├── eslint-config/
│   └── tsconfig/
│
├── docs/            # Complete project documentation
└── infra/           # Docker & deployment scripts
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js v18+
* PNPM v9+
* PostgreSQL

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

### 3. Setup Database

```bash
pnpm --filter coderium-api prisma migrate dev
pnpm --filter coderium-api prisma db seed
```

### 4. Run Development

```bash
pnpm dev
```

Access:

* **API**: http://localhost:3030/api/v1
* **Admin**: http://localhost:5174
* **Web**: http://localhost:3000

---

## 📖 Documentation

Semua dokumentasi tersimpan di folder `docs/`:

| Dokumen | Path |
| --- | --- |
| Product Requirements | `docs/product/requirements.md` |
| Architecture Design | `docs/architecture/design.md` |
| Tech Stack | `docs/architecture/tech-stack.md` |
| Module Breakdown | `docs/architecture/module-breakdown.md` |
| Database Design | `docs/database/database-design.md` |
| Prisma Schema | `docs/database/prisma-schema-design.md` |
| API Contract | `docs/api/api-contract.md` |
| Roadmap | `docs/development/roadmap.md` |
| Progress | `docs/development/progress.md` |
| Backlog | `docs/development/backlog.md` |
| Conventions | `docs/development/conventions.md` |
| Design System | `docs/frontend/design-system.md` |

---

## 📜 Development Guidelines

1. Baca `AGENTS.md` sebelum mengerjakan task apapun.
2. Ikuti urutan dari `docs/development/backlog.md`.
3. Update `docs/development/progress.md` setelah task selesai.
4. Jangan membuat fitur di luar MVP tanpa instruksi eksplisit.
5. Gunakan `shared-types` untuk type yang digunakan lebih dari satu app.
