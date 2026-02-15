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

# COPY Drizzle config and source files for migrations
COPY --from=builder /src/app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /src/app/src/db ./src/db

EXPOSE 8000

CMD ["node", "dist/index.js"]