FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json ./
RUN npm install --package-lock-only --no-audit --no-fund
RUN npm ci

COPY . .
RUN npm run build


# ---- Runtime stage (optional) ----
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/public ./public
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
