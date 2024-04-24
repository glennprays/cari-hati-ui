FROM node:alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/.next ./.next

COPY --from=build-stage /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
