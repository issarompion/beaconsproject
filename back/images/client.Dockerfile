FROM node:latest
USER root

ARG GIT

RUN git clone ${GIT} /app
COPY .env /app/.env

USER root
WORKDIR /app/back

RUN git pull
RUN git checkout circleci-deploy-setup
RUN npm run install:shared
RUN npm run install:client
WORKDIR /app/back/microservices/client
CMD npm run start