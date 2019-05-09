FROM node:10-alpine

WORKDIR /app

COPY package*.json /app/

RUN apk --no-cache add --virtual native-deps \
  git g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install node-gyp -g &&\
  npm install &&\
  npm rebuild bcrypt --build-from-source && \
  npm cache clean --force &&\
  apk del native-deps

COPY . /app/
COPY src/config/config.docker.json /app/src/config/config.json

RUN npm install
#RUN npx sequelize db:drop
#RUN npx sequelize db:create
#RUN npx sequelize db:migrate
#RUN npx sequelize db:seed:all

RUN chmod +x init/*.sh

EXPOSE 3000

CMD ["/bin/sh", "init/reset.sh"]

