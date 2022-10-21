FROM node:16.18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN yarn build

###

FROM node:16.18-alpine

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

WORKDIR /app

EXPOSE 3000
CMD [ "node", "dist/src/main" ]
