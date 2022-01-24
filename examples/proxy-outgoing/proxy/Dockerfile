FROM node:14-alpine

RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node/*
WORKDIR /home/node
RUN npm i --unsafe-perm express
