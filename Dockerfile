# BASE
FROM node:19-alpine AS base

RUN npm i -g pnpm

# DEPENDENCIES
FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# BUILD
FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

# DEPLOY
FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/locales ./locales/
COPY --from=build /app/node_modules ./node_modules

ENV NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED=true
EXPOSE 3000
CMD [ "node", "dist/main.js"]
