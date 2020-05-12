FROM node:latest
USER root

ARG GIT
RUN git clone ${GIT} /app
COPY .env /app/.env

USER root
WORKDIR /app/back

RUN npm run install:shared
RUN npm run install:beacon
WORKDIR /app/back/microservices/beacon
CMD npm run start