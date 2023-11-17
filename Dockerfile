ARG NODE_VERSION=18.16.0

# --------------------- Base -------------------------------- #

FROM node:${NODE_VERSION}-slim as base

RUN apt-get update -qq

RUN npm i -g pnpm

# --------------------- Builder ----------------------------- #

FROM base as builder

RUN apt-get install -y python-is-python3 pkg-config build-essential openssl

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

# --------------------- Release ----------------------------- #

FROM base AS Release

ENV NODE_ENV=production

RUN apt-get install -y libssl-dev dumb-init -y --no-install-recommends

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD [ "dumb-init", "pnpm", "start:migrate:prod" ]