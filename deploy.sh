#!/usr/bin/env bash
#
# deploy.sh — Coderium Web v2 production redeploy
#
# Usage:
#   ./deploy.sh                    # pull latest main, build & redeploy ALL services
#   ./deploy.sh api                # deploy hanya service api
#   ./deploy.sh api web admin      # deploy service tertentu
#   ./deploy.sh --no-build         # skip build (recreate dari image yang ada)
#   ./deploy.sh --force            # lanjut meski ada perubahan lokal belum di-commit
#   ./deploy.sh --prune            # prune dangling images setelah build
#   ./deploy.sh --prisma           # cek migrasi prisma (DRY-RUN — tidak terapkan apa-apa)
#   ./deploy.sh --prisma --apply   # terapkan migrasi yang belum jalan (sembarangan? tidak)
#
# Alur: cek prereq -> cek perubahan lokal -> git fetch + reset ke origin/main
#       -> build image -> recreate container -> healthcheck -> verifikasi endpoint.
# Config (compose/.env) di-bake ke image, jadi perubahan config WAJIB di-commit
# dulu sebelum deploy, kalau tidak akan ketimpa oleh git reset --hard.
# Prisma: migrate deploy butuh CLI yang TIDAK ada di image API. Mode --prisma
# meng-staging schema+migrations ke /tmp, install prisma lokal, lalu jalankan
# dari HOST. Password diambil dari env container postgres (printenv), tidak
# pernah diketik manual. Default = dry-run (prisma migrate diff / status),
# migrasi sungguhan HANYA dengan --apply. Tidak pernah prisma db seed.
set -euo pipefail

STACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$STACK_DIR"

COMPOSE="docker-compose.prod.yml"
REMOTE="origin"
BRANCH="main"
CONTAINERS=(coderium-api-prod coderium-web-prod coderium-admin-prod)

# docker butuh sudo di server ini; otomatis deteksi
SUDO=""
if ! docker info >/dev/null 2>&1; then
  SUDO="sudo"
fi

SERVICES=()
NO_BUILD=0
FORCE=0
PRUNE=0
PRISMA=0
PRISMA_APPLY=0

for arg in "$@"; do
  case "$arg" in
    --no-build) NO_BUILD=1 ;;
    --force)    FORCE=1 ;;
    --prune)    PRUNE=1 ;;
    --prisma)   PRISMA=1 ;;
    --apply)    PRISMA_APPLY=1 ;;
    -h|--help)
      sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) SERVICES+=("$arg") ;;
  esac
done

log()  { printf '\033[1;36m[deploy]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[deploy]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[deploy]\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m[deploy]\033[0m %s\n' "$*" >&2; exit 1; }

compose() { $SUDO docker compose -f "$COMPOSE" "$@"; }

# ---------------------------------------------------------------------------
# 0. Prasyarat
# ---------------------------------------------------------------------------
command -v docker >/dev/null 2>&1 || die "docker tidak ditemukan di PATH"
[[ -f "$COMPOSE" ]] || die "compose file '$COMPOSE' tidak ditemukan di $STACK_DIR"
[[ -f ".env" ]]     || die ".env tidak ada — salin .env.example dan isi dulu"

# ---------------------------------------------------------------------------
# 1. Cek perubahan lokal (git reset --hard akan MENIMPA file tracked yang berubah)
# ---------------------------------------------------------------------------
if [[ $FORCE -eq 0 ]]; then
  LOCAL=$(git status --porcelain --untracked-files=no)
  if [[ -n "$LOCAL" ]]; then
    warn "Ada perubahan lokal yang BELUM di-commit:"
    printf '\033[1;33m%s\033[0m\n' "$LOCAL"
    die "git reset --hard origin/$BRANCH akan menimpanya. Commit dulu, atau pakai --force."
  fi
fi

# ---------------------------------------------------------------------------
# 2. Sync ke remote
# ---------------------------------------------------------------------------
log "Sync ke $REMOTE/$BRANCH ..."
git fetch --prune "$REMOTE"
git reset --hard "$REMOTE/$BRANCH"
ok "Repo sudah di posisi $(git rev-parse --short HEAD) ($(git log -1 --format=%s))"

# ---------------------------------------------------------------------------
# 3. Build image (Turbo monorepo, bisa 3-5 menit)
# ---------------------------------------------------------------------------
if [[ $NO_BUILD -eq 0 ]]; then
  log "Build image ... (bisa 3-5 menit)"
  compose build "${SERVICES[@]+"${SERVICES[@]}"}"
  ok "Build selesai"
else
  log "Skip build (--no-build)"
fi

# ---------------------------------------------------------------------------
# 4. Recreate container
# ---------------------------------------------------------------------------
if [[ ${#SERVICES[@]} -eq 0 ]]; then
  log "Deploy SEMUA service ..."
  compose up -d            # recreate otomatis yang image/config-nya berubah; postgres tidak disentuh
else
  log "Deploy service: ${SERVICES[*]}"
  compose up -d --no-deps "${SERVICES[@]}"
fi

if [[ $PRUNE -eq 1 ]]; then
  $SUDO docker image prune -f
fi

# ---------------------------------------------------------------------------
# 5. Healthcheck API (tunggu sampai siap, timeout 120s)
# ---------------------------------------------------------------------------
log "Tunggu API siap ..."
API_OK=0
for i in $(seq 1 24); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
        http://localhost:3031/api/v1/posts/recent || true)
  if [[ "$CODE" == "200" ]]; then API_OK=1; break; fi
  sleep 5
done
[[ $API_OK -eq 1 ]] || die "API tidak sehat setelah 120s (http $CODE). Cek: sudo docker logs coderium-api-prod --tail 50"

# ---------------------------------------------------------------------------
# 5b. Prisma migrate (opsional, --prisma)
#     CLI prisma TIDAK ada di image API (hanya client). Dijalankan dari HOST:
#     schema+migrations di-staging ke /tmp, prisma di-install lokal di sana.
#     Password diambil dari env container postgres — tidak pernah diketik manual.
#     Tanpa --apply hanya dry-run (migrasi TIDAK diterapkan).
# ---------------------------------------------------------------------------
run_prisma() {
  local MIGRATE_MODE="deploy"
  if [[ $PRISMA_APPLY -eq 0 ]]; then
    log "MODE DRY-RUN — tidak menerapkan migrasi apa pun"
    MIGRATE_MODE="diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --exit-code"
  fi

  # ambil kredensial dari container postgres (jangan pernah hardcode)
  local PGPASSWORD
  PGPASSWORD=$($SUDO docker exec coderium-postgres-prod printenv POSTGRES_PASSWORD 2>/dev/null || true)
  [[ -n "$PGPASSWORD" ]] || die "Gagal membaca POSTGRES_PASSWORD dari container coderium-postgres-prod"
  local PGUSER=${POSTGRES_USER:-postgres}
  local PGDATABASE=${POSTGRES_DB:-coderium}
  local DBURL="postgresql://${PGUSER}:${PGPASSWORD}@127.0.0.1:5432/${PGDATABASE}?schema=public"

  local TMPDIR_STAGE
  TMPDIR_STAGE=$(mktemp -d /tmp/prisma-deploy.XXXXXX)
  trap 'rm -rf "$TMPDIR_STAGE"' EXIT

  log "Stage prisma ke $TMPDIR_STAGE ..."
  mkdir -p "$TMPDIR_STAGE/prisma"
  cp apps/api/prisma/schema.prisma "$TMPDIR_STAGE/prisma/"
  cp -r apps/api/prisma/migrations "$TMPDIR_STAGE/prisma/"
  cp apps/api/prisma/migration_lock.toml "$TMPDIR_STAGE/prisma/" 2>/dev/null || true

  # ambil versi prisma dari package.json (mis. "^7.8.0" -> 7.8.0) — npm install butuh versi eksplisit
  local PRISMA_VER PRISMA_RAW TMPDIR_STAGE SQL
  PRISMA_RAW=$(node -p "const p=require('./apps/api/package.json'); (p.dependencies&&p.dependencies.prisma)||(p.devDependencies&&p.devDependencies.prisma)||''")
  [[ -n "$PRISMA_RAW" ]] || die "prisma tidak ditemukan di dependencies/devDependencies apps/api/package.json"
  PRISMA_VER=${PRISMA_RAW//[^0-9.]/}
  log "Versi prisma: $PRISMA_VER"

  (cd "$TMPDIR_STAGE" \
    && npm init -y >/dev/null 2>&1 \
    && npm install prisma@"$PRISMA_VER" --no-save --silent) || die "Gagal install prisma di staging"

  cat > "$TMPDIR_STAGE/prisma.config.ts" <<EOF
import { defineConfig } from 'prisma/config';
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env['DATABASE_URL'] },
});
EOF

  log "Jalankan: prisma migrate $MIGRATE_MODE ..."
  if [[ $PRISMA_APPLY -eq 0 ]]; then
    SQL=$(cd "$TMPDIR_STAGE" && DATABASE_URL="$DBURL" ./node_modules/.bin/prisma migrate diff \
          --from-migrations prisma/migrations \
          --to-schema-datamodel prisma/schema.prisma \
          --script 2>&1) || true
    if [[ -z "$SQL" || "$SQL" == *"No difference detected"* || "$SQL" == *"empty"* ]]; then
      ok "Tidak ada migrasi tertunda (schema sudah sinkron dengan DB)"
    else
      warn "Ada migrasi tertunda! Jalankan: ./deploy.sh --prisma --apply"
      printf '%s\n' "$SQL" | head -40
    fi
  else
    (cd "$TMPDIR_STAGE" && DATABASE_URL="$DBURL" ./node_modules/.bin/prisma migrate deploy) \
      || die "prisma migrate deploy GAGAL — DB mungkin berubah. Periksa output di atas."
  fi
  rm -rf "$TMPDIR_STAGE"
  trap - EXIT
}

if [[ $PRISMA -eq 1 ]]; then
  log "=== PRISMA MODE ==="
  run_prisma
  ok "Prisma selesai"
fi

# ---------------------------------------------------------------------------
# 6. Verifikasi
# ---------------------------------------------------------------------------
log "Status container:"
$SUDO docker ps --filter "name=coderium" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

log "Cek network nginx-proxy-manager_default:"
for c in "${CONTAINERS[@]}"; do
  NETS=$($SUDO docker inspect "$c" --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' 2>/dev/null || true)
  if [[ "$NETS" == *"nginx-proxy-manager_default"* ]]; then
    ok "$c -> terhubung ke NPM network"
  else
    warn "$c -> TIDAK terhubung ke NPM network! ($NETS)"
  fi
done

log "Cek endpoint publik via NPM:"
for d in "coderium.id" "admin.coderium.id" "api.coderium.id/api/v1/posts/recent"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 -k \
        "https://$d/" --resolve "${d%%/*}:443:127.0.0.1" || true)
  if [[ "$CODE" == "200" || "$CODE" == "301" || "$CODE" == "302" ]]; then
    ok "https://$d -> $CODE"
  else
    warn "https://$d -> $CODE (periksa NPM / Cloudflare)"
  fi
done

ok "Deploy selesai. HEAD = $(git rev-parse --short HEAD)"
