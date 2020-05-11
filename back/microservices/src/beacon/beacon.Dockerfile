FROM node:latest
USER root

ARG GIT
RUN git clone ${GIT} /app
COPY .env /app/.env

USER root
WORKDIR /app/back

RUN npm run install:lib
RUN npm run install:microservices
RUN npm run install:beacon
WORKDIR /app/back/microservices/src/beacon
CMD npm run start