FROM node:16.19.0

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=password

COPY package.json /app/

COPY src /app/

WORKDIR /app

RUN npm install

CMD [ "node", "server.js" ]