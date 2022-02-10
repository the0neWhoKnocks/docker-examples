# Build faketime binaries via a multi-stage build
FROM node:14-alpine as ftbin
RUN apk update \
  && apk upgrade \
  && apk add --update alpine-sdk \
  && apk add --no-cache git make cmake 
WORKDIR /
RUN git clone https://github.com/wolfcw/libfaketime.git
WORKDIR /libfaketime/src
RUN make install

FROM node:14-alpine
# `tzdata` so the `TZ` env var works for timezones
RUN apk add --no-cache --update tzdata
# Copy over faketime binaries. '.so' files are in 'lib', binaries in 'bin'
COPY --from=ftbin /usr/local/bin/faketime /usr/local/bin/faketime
COPY --from=ftbin /usr/local/lib/faketime/libfaketime.so.1 /usr/local/lib/faketime/
COPY --from=ftbin /usr/local/lib/faketime/libfaketimeMT.so.1 /usr/local/lib/faketime/
# Set up NodeJS deps
RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node/*
WORKDIR /home/node
USER node
RUN npm i express
