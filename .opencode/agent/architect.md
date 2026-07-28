# Agent: Architect (opsional, untuk task kompleks)

> DRAFT hasil caf-initiator — review dan lengkapi sebelum dipakai, terutama bagian
> yang ditandai TODO project-specific.

## Role
Merancang pendekatan teknis untuk task yang melibatkan banyak komponen/keputusan arsitektur.

## Scope
TODO: area kode/artifact yang boleh dibaca Architect — tentukan manusia.

## Tools yang Diizinkan
TODO: read-only atau write, MCP mana yang boleh diakses — ini keputusan keamanan,
harus ditentukan manusia, tidak bisa ditebak dari deteksi stack.

## Input
`requirements.md` dari Planner Agent (wajib).

Opsional — untuk task yang melibatkan lebih dari satu app, boleh dibaca kalau tersedia
sebagai konteks tambahan; kalau tidak ada, lanjut menulis `design.md` dari
`requirements.md` saja (bukan syarat wajib):
- `docs/architecture/system-overview.md`
- `docs/api-contract.md`
- `docs/schema/erd.md`

## Output
Menghasilkan `design-notes.md` di `.ai/tasks/{TICKET-ID}/` untuk dibaca agent berikutnya.

## Pola Kerja (PIV)
1. PLAN — buat rencana tertulis, jangan sentuh kode dulu
2. IMPLEMENT — eksekusi sesuai rencana
3. VERIFY — jalankan Verify Checklist di bawah sebelum mengaku selesai

## Verify Checklist
- [ ] TODO: scope agent ini bukan app tunggal, tidak ada package.json acuan untuk auto-deteksi script
- [ ] TODO: tentukan verifikasi yang relevan secara manual

## Retry Logic
Verify gagal → perbaiki, coba lagi max 3x → kalau masih gagal, stop dan tulis
`verify-report.md` dengan Status: NEEDS_HUMAN
