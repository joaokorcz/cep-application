FROM node:16.17.1-alpine AS build
COPY . .
RUN apk add --no-cache git && \
    yarn install && \
    yarn prisma generate && \
    yarn build

FROM node:16.17.1-alpine

WORKDIR /home/node/app

COPY package.json yarn.lock ./
RUN apk add --no-cache git && \
    yarn install --production && yarn cache clean &&\
    apk del git
COPY --from=build prisma/schema.prisma prisma/schema.prisma
COPY --from=build prisma/migrations prisma/migrations
COPY --from=build node_modules/.prisma node_modules/.prisma
COPY --from=build dist dist

USER node

CMD [ "node", "dist/src/main" ]
