# Production Multi-Stage Dockerfile for Synapse Adaptive Memory Game
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Non-root user for security
USER node

ENV PORT=3000 \
    NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server/server.js"]
