FROM node:10
WORKDIR /app
COPY . /app
RUN yarn install
EXPOSE 3000
ENTRYPOINT [ "yarn", "start" ]
