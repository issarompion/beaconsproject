#!/usr/bin/env bash
user=$1
tag=$2
api_port=$3


docker run -d --name auth $user/auth:$tag
docker run -d --name client $user/client:$tag
docker run -d --name beacon $user/beacon:$tag
docker run -d --name content $user/content:$tag
docker run -d --name logger $user/logger:$tag
docker run -d --name webserver -p $api_port:$api_port $user/webserver:$tag

# sh scripts/run_back.sh $DOCKERHUB_USERNAME $PROJECT_VERSION $GIT $API_PORT