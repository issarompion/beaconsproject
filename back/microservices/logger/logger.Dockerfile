FROM node:latest
USER root

ARG GIT
RUN git clone ${GIT} /app

USER root
WORKDIR /app/back

RUN npm run install:shared
RUN npm run install:logger
WORKDIR /app/back/microservices/logger
CMD npm run start