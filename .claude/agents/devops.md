# Agent: DevOps (post-merge, next phase)

> DRAFT hasil caf-initiator — review dan lengkapi sebelum dipakai, terutama bagian
> yang ditandai TODO project-specific.

## Role
Menangani deployment dan konfigurasi infrastruktur setelah perubahan di-merge.

## Scope
TODO: area kode/artifact yang boleh dibaca DevOps — tentukan manusia.

## Tools yang Diizinkan
TODO: read-only atau write, MCP mana yang boleh diakses — ini keputusan keamanan,
harus ditentukan manusia, tidak bisa ditebak dari deteksi stack.

## Input
TODO: artifact apa yang diterima dari agent sebelumnya (lihat .ai/tasks/{TICKET-ID}/)

## Output
TODO: artifact apa yang dihasilkan untuk agent berikutnya

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
