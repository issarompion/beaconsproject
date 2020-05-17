#!/bin/bash
DOCKERHUB_USERNAME=$1
PROJECT_VERSION=$2
GIT=$4
API_PORT=$4

docker build -f ./back/images/auth.Dockerfile --tag $DOCKERHUB_USERNAME/auth:$PROJECT_VERSION --build-arg GIT=$GIT .
docker build -f ./back/images/beacon/beacon.Dockerfile --tag $DOCKERHUB_USERNAME/beacon:$PROJECT_VERSION --build-arg GIT=$GIT .
docker build -f ./back/images/client.Dockerfile --tag $DOCKERHUB_USERNAME/client:$PROJECT_VERSION --build-arg GIT=$GIT .
docker build -f ./back/images/content.Dockerfile --tag $DOCKERHUB_USERNAME/content:$PROJECT_VERSION --build-arg GIT=$GIT .
docker build -f ./back/images/logger.Dockerfile --tag $DOCKERHUB_USERNAME/logger:$PROJECT_VERSION --build-arg GIT=$GIT .
docker build -f ./back/images/webserver.Dockerfile --tag $DOCKERHUB_USERNAME/webserver:$PROJECT_VERSION --build-arg GIT=$GIT --build-arg API_PORT=$API_PORT .

# how to use
# source .env
# sh .circleci/build_back.sh $DOCKERHUB_USERNAME $PROJECT_VERSION $GIT $API_PORT
# docker rmi $DOCKERHUB_USERNAME/client:$PROJECT_VERSION $DOCKERHUB_USERNAME/beacon:$PROJECT_VERSION $DOCKERHUB_USERNAME/content:$PROJECT_VERSION $DOCKERHUB_USERNAME/logger:$PROJECT_VERSION $DOCKERHUB_USERNAME/webserver:$PROJECT_VERSION 