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

RUN npm ci

COPY --from=builder /src/app/dist ./dist

COPY src ./src

COPY drizzle.config.ts ./


EXPOSE 8000

CMD ["node", "dist/index.js"]