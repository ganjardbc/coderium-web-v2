# Agent Handoff Format

> Sebagian isi file ini auto-generate dari roster agent terdeteksi.

Setiap ticket punya folder sendiri: `.caf/tasks/{TICKET-ID}/`. Agent baca output agent
sebelumnya dari folder ini, bukan dari chat/memori.

## Artifact per Agent (berdasarkan roster terdeteksi)

| Agent | Artifact Output |
|---|---|
| Planner | `requirements.md`, `tasks.md` |
| Architect | `design.md` |
| Frontend | kode + `verify-report.md` |
| Backend | kode + `verify-report.md` |
| QA | `qa-report.md` |
| Reviewer | `review-notes.md` |
| Documentation | update `docs/` (paralel, non-blocking) |
| PM | `prd.md`, `flow.md` (di `.caf/discovery/{slug}/`, bukan `.caf/tasks/` — lihat CAF.md Klaster 1) |
| UX Designer | `flow.md` (di `.caf/discovery/{slug}/`, bukan `.caf/tasks/` — lihat CAF.md Klaster 1) |
| Auditor | `audit-report.md` (di `.caf/audits/{DATE}/`, bukan `.caf/tasks/` — lihat CAF.md Klaster 4) |

## Format `verify-report.md`

```markdown
# Verify Report

Status: PASS | NEEDS_HUMAN

## Checklist
- [ ] lint
- [ ] typecheck
- [ ] test
- [ ] build

## Catatan
TODO: detail hasil verifikasi, error kalau ada
```

## Agent Tambahan (Custom)

- `web.md` — artifact format belum standar, perlu didefinisikan manual (TODO)
