# ---- Stage 1: dependencies ----
FROM node:22-slim AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- Stage 2: production runtime ----
FROM node:22-slim AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3000

CMD ["node", "--experimental-sqlite", "src/server.js"]
