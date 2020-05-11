FROM node:latest
USER root

ARG GIT
RUN git clone ${GIT} /app
COPY .env /app/.env

USER root
WORKDIR /app/back

RUN npm run install:lib
RUN npm run install:microservices
RUN npm run install:auth
WORKDIR /app/back/microservices/src/auth
CMD npm run start