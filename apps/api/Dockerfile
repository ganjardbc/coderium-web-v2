FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm@9.15.9 && pnpm install --frozen-lockfile

RUN pnpm --filter @coderium/tsconfig build
RUN pnpm --filter @coderium/shared-types build
RUN pnpm --filter @coderium/shared-utils build
RUN pnpm --filter coderium-api prisma:generate
RUN pnpm --filter coderium-api build

RUN pnpm --filter coderium-api deploy --prod /out

# Copy Prisma generated client (hidden folder not included by pnpm deploy)
RUN mkdir -p /prisma-client && cp -r /app/node_modules/.pnpm/@prisma+client@*/node_modules/.prisma /prisma-client/

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /out ./
COPY --from=builder /prisma-client/.prisma ./node_modules/.prisma

EXPOSE 3030

CMD ["node", "dist/main"]