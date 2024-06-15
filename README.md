# Express Mongodb Docker Demo


This is an Express app using Mongodb 

# Run

## Using Docker Cli

```bash
# create network
docker network create mongo-network

# start mongodb
docker run -d \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=password \
--name mongodb \
--net mongo-network \
mongo:latest

# start mongo-express
docker run -d \
-p 8080:8081 \
-e ME_CONFIG_MONGODB_SERVER=mongodb \
-e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
-e ME_CONFIG_MONGODB_ADMINPASSWORD=password \
--net mongo-network \
--name mongo-express \
mongo-express
```

## With Docker Compose

`docker-compose -f mongo.yaml up -d`

to shut down and clean up

`docker-compose -f mongo.yaml down`

# Requirements

* Docker
* Node
* mongo image
* mongo-express image
