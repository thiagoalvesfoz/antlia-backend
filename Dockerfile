ARG NODE_VERSION=18.16.0

FROM node:${NODE_VERSION}-slim as base

RUN apt-get update -qq

FROM base as build

RUN apt-get install -y python-is-python3 pkg-config build-essential openssl

RUN npm i -g pnpm

WORKDIR /app 
COPY package*.json . 
COPY pnpm-lock.yaml .
RUN pnpm install

COPY prisma .
RUN npx prisma generate

COPY . .
RUN pnpm build
RUN pnpm prune --prod

RUN ls

FROM base AS deploy

ENV NODE_ENV=production

RUN apt-get install -y libssl-dev dumb-init -y --no-install-recommends

WORKDIR /app

COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules/ ./node_modules

EXPOSE 3000

CMD [ "dumb-init", "node", "dist/main.js" ]