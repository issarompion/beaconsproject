FROM node:latest
USER root

ARG GIT
ARG API_PORT

RUN git clone ${GIT} /app
COPY .env /app/.env

USER root
WORKDIR /app/back

RUN npm run install:lib
RUN npm run install:microservices
RUN npm run install:webserver
WORKDIR /app/back/microservices/src/webserver
EXPOSE ${API_PORT}/tcp
CMD npm run start