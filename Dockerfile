# ─── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# ─── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat vips-dev fftw-dev build-base python3
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install sharp natively for Alpine/musl
RUN npm install --save sharp --legacy-peer-deps

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# DOCKER_BUILD=1 tells next.config.ts to enable output:'standalone'.
# This var ONLY exists here — never set it in Coolify's environment variables panel.
ENV DOCKER_BUILD=1

RUN npm run build

# ─── Stage 3: Minimal production runtime ───────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache vips
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@img  ./node_modules/@img

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
