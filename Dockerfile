FROM node:10
WORKDIR /app
COPY package.json .
RUN yarn install --prod
EXPOSE 3000
COPY index.js .
COPY dist ./dist
