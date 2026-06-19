FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy monorepo config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build
RUN pnpm --filter @coderium/tsconfig build
RUN pnpm --filter @coderium/shared-types build
RUN pnpm --filter @coderium/shared-utils build
RUN pnpm --filter coderium-api prisma:generate
RUN pnpm --filter coderium-api build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3030

CMD ["node", "apps/api/dist/main"]
