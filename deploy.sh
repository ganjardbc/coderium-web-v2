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
#
# Alur: cek prereq -> cek perubahan lokal -> git fetch + reset ke origin/main
#       -> build image -> recreate container -> healthcheck -> verifikasi endpoint.
# Config (compose/.env) di-bake ke image, jadi perubahan config WAJIB di-commit
# dulu sebelum deploy, kalau tidak akan ketimpa oleh git reset --hard.
#
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

for arg in "$@"; do
  case "$arg" in
    --no-build) NO_BUILD=1 ;;
    --force)    FORCE=1 ;;
    --prune)    PRUNE=1 ;;
    -h|--help)
      sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
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
