FROM node:latest
USER root

ARG GIT
ARG API_PORT

RUN git clone ${GIT} /app

USER root
WORKDIR /app/back

RUN npm run install:shared
RUN npm run install:webserver
WORKDIR /app/back/microservices/webserver
EXPOSE ${API_PORT}/tcp
CMD npm run start