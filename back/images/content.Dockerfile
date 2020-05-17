FROM node:latest
USER root

ARG GIT

RUN git clone ${GIT} /app
COPY .env /app/.env

USER root
WORKDIR /app/back

RUN git pull
RUN npm run install:shared
RUN npm run install:content
WORKDIR /app/back/microservices/content
CMD npm run start