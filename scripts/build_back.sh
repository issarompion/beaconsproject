#!/usr/bin/env bash
user=$1
tag=$2
git=$3
api_port=$4

docker build -f /back/images/auth.Dockerfile --tag $user/auth:$tag --build-arg GIT=$git .
docker build -f /back/images/beacon/beacon.Dockerfile --tag $user/beacon:$tag --build-arg GIT=$git .
docker build -f /back/images/client.Dockerfile --tag $user/client:$tag --build-arg GIT=$git .
docker build -f /back/images/content.Dockerfile --tag $user/content:$tag --build-arg GIT=$git .
docker build -f /back/images/logger.Dockerfile --tag $user/logger:$tag --build-arg GIT=$git .
docker build -f /back/images/webserver.Dockerfile --tag $user/webserver:$tag --build-arg GIT=$git --build-arg API_PORT=$api_port .

# sh scripts/build_back.sh $DOCKERHUB_USERNAME $PROJECT_VERSION $GIT $API_PORT