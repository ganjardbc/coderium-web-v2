FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy monorepo config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ ./packages/
COPY apps/admin/ ./apps/admin/

# Build
RUN pnpm --filter @coderium/tsconfig build
RUN pnpm --filter @coderium/shared-types build
RUN pnpm --filter @coderium/shared-utils build
RUN pnpm --filter @coderium/ui build
RUN pnpm --filter coderium-admin build

FROM nginx:stable-alpine AS runner

COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
