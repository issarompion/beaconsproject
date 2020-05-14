FROM node:latest
USER root

ARG GIT
RUN git clone ${GIT} /app

USER root
WORKDIR /app/back

RUN npm run install:shared
RUN npm run install:auth
WORKDIR /app/back/microservices/auth
CMD npm run start