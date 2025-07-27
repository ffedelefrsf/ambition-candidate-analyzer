FROM node:20

WORKDIR /app

COPY ./apps/frontend /app

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

EXPOSE 5173
CMD ["pnpm", "run", "dev", "--", "--host"]