#!/bin/bash
DOCKERHUB_USERNAME=$1
PROJECT_VERSION=$2
API_PORT=$3

docker run -d --name auth $DOCKERHUB_USERNAME/auth:$PROJECT_VERSION
docker run -d --name client $DOCKERHUB_USERNAME/client:$PROJECT_VERSION
docker run -d --name beacon $DOCKERHUB_USERNAME/beacon:$PROJECT_VERSION
docker run -d --name content $DOCKERHUB_USERNAME/content:$PROJECT_VERSION}
docker run -d --name logger $DOCKERHUB_USERNAME/logger:$PROJECT_VERSION
docker run -d --name webserver -p $API_PORT:$API_PORT $DOCKERHUB_USERNAME/webserver:$PROJECT_VERSION

# how to use
# source .env
# sh .circleci/run_back.sh $DOCKERHUB_USERNAME $PROJECT_VERSION $GIT $API_PORT
# docker rm -f auth client beacon content logger webserver 