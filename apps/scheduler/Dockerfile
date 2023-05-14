# BASE
FROM node:20-alpine AS base

RUN apk add --update --no-cache python3 make g++ tini
RUN corepack enable pnpm

# DEPENDENCIES
FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm --prod install

# DEPLOY
FROM base AS deploy

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY ./dist/apps/scheduler .

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "main.js"]
