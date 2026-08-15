# .caf/discovery/

Output Discovery (Klaster 1) — PM Agent + UX Designer. Tiap fitur baru = 1 subfolder slug.

## Struktur

```
discovery/{slug}/
  prd.md      - PM Agent: problem, goal, scope, acceptance criteria
  flow.md     - UX Designer (opsional): user flow / interaksi UI, dipanggil kalau fitur sentuh permukaan user
  handoff.md  - mapping slug -> ticket ID (diisi saat discovery-to-ticket)
```

## Alur

1. `/caf-discovery-start` -> tulis `prd.md` (+ `flow.md` kalau relevan). Tidak sentuh kode, tidak buat ticket.
2. `/caf-discovery-to-ticket` -> baca `prd.md` + `flow.md`, tampilkan per-item buat approval manusia, create ticket cuma yang di-approve, catat mapping di `handoff.md`.

Slug penamaan: kebab-case, singkat, deskriptif (contoh: `update-components-in-apps-admin-using-primevue`).

## Catatan

- Agent discovery gak pernah auto-create ticket tanpa konfirmasi eksplisit per item.
- Referensi ticket lanjutan (planning/implementasi) ada di `.caf/tasks/`.
