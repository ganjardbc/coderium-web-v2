FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy monorepo config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Build
RUN pnpm --filter @coderium/tsconfig build
RUN pnpm --filter @coderium/shared-types build
RUN pnpm --filter @coderium/shared-utils build
RUN pnpm --filter coderium-web build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/web/.output ./.output

EXPOSE 5174

ENV PORT=5174
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
