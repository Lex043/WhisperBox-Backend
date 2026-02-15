#Build stage

FROM node:22-alpine AS builder

WORKDIR /src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


#Production stage

FROM node:22-alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /src/app/dist ./dist

COPY --from=builder /src/app/drizzle.config.ts ./drizzle.config.ts

COPY --from=builder /src/app/src ./src

EXPOSE 8000

CMD ["sh", "-c", "npx tsx drizzle-kit push && node dist/index.js"]