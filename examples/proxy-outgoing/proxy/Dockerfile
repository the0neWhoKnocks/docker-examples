FROM node:14-alpine

USER node

WORKDIR /home/node
RUN mkdir -p proxy/cache

WORKDIR /home/node/proxy
RUN npm i --loglevel=error body-parser cli-color express hash-sum teeny-request

COPY ./src/* ./

CMD ["node", "--inspect=0.0.0.0:9229", "./server.js"]
