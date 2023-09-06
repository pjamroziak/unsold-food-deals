# BASE
FROM node:20-alpine AS base

RUN apk add --update --no-cache python3 make g++ tini
RUN corepack enable pnpm

# DEPENDENCIES
FROM base AS dependencies
ARG IMAGE_NAME

WORKDIR /app

COPY ./dist/apps/${IMAGE_NAME}/package.json ./dist/apps/${IMAGE_NAME}/pnpm-lock.yaml ./

RUN pnpm --prod install

# DEPLOY
FROM base AS deploy

ENV NODE_ENV production
ARG IMAGE_NAME

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY ./dist/apps/${IMAGE_NAME} .

ENTRYPOINT ["/sbin/tini", "--"]
USER nonroot

CMD [ "node", "main.js"]
