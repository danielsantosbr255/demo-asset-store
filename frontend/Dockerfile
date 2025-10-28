FROM node:22.16.0-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base AS dev
RUN corepack enable && pnpm install
COPY . .

ENV PORT=5173
ENV NODE_ENV=development

EXPOSE ${PORT}
CMD [ "pnpm", "dev" ]

FROM base AS build
RUN corepack enable && pnpm install
COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM base AS prod

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules

ENV NODE_ENV=production
ENV PORT=5173

EXPOSE ${PORT}
CMD [ "node", "./dist/main.js" ]