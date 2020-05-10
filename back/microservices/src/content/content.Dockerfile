FROM node:latest
USER root

ARG GIT
RUN git clone ${GIT} /app
COPY .env /app/.env

USER root
WORKDIR /app/back

RUN npm run install:lib
RUN npm run install:microservices
RUN npm run install:content
WORKDIR /app/back/microservices/src/content
EXPOSE 3000/tcp
CMD npm run start