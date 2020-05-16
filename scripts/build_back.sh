#!/usr/bin/env bash
user=$1
tag=$2
git=$3
api_port=$4

docker build -f $(pwd)/back/microservices/auth/auth.Dockerfile --tag $user/auth:$tag --build-arg GIT=$git .
docker build -f $(pwd)/back/microservices/beacon/beacon.Dockerfile --tag $user/beacon:$tag --build-arg GIT=$git .
docker build -f $(pwd)/back/microservices/client/client.Dockerfile --tag $user/client:$tag --build-arg GIT=$git .
docker build -f $(pwd)/back/microservices/content/content.Dockerfile --tag $user/content:$tag --build-arg GIT=$git .
docker build -f $(pwd)/back/microservices/logger/logger.Dockerfile --tag $user/logger:$tag --build-arg GIT=$git .
docker build -f $(pwd)/back/microservices/webserver/webserver.Dockerfile --tag $user/webserver:$tag --build-arg GIT=$git --build-arg API_PORT=$api_port .

# sh scripts/build_back.sh $DOCKERHUB_USERNAME $PROJECT_VERSION $GIT $API_PORT