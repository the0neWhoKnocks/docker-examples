## Create intermediary Container specifically for package.json 
FROM theonewhoknocks/dev-base:node20 as example-app--packagejson
# Create a temporary package.json where things like `version` and `scripts`
# are omitted so the cache of the build step is invalidated only when modules
# are modified.
COPY --chown=node:node ./package*.json ./
RUN ["node", "/home/node/packageJSONParser.js"]

# Set up the environment
FROM theonewhoknocks/dev-base:node20 AS example-app
ENV APP=/home/node/app
ENV IN_CONTAINER=true
ENV NODE_ENV=production
RUN mkdir -p $APP/node_modules && chown -R node:node /home/node/*

# #####
# # Add App specific packages below
# #####
# # ffmpeg - For general image/video manipulation/generation.
# RUN apk add --no-cache --update ffmpeg

WORKDIR $APP

# Copy over package related files from the preperation step to install
# production modules
COPY --chown=node:node --from=example-app--packagejson ./package*.json ./

# Install production dependencies
RUN npm i --only=production --quiet --unsafe-perm && rm ./package*.json

# Copy locally compiled code to the image (order from least to most changed for faster builds)
COPY --chown=node:node ./dist/constants.js ./
COPY --chown=node:node ./dist/utils ./
COPY --chown=node:node ./dist/server ./
COPY --chown=node:node ./dist/public ./

# Expose the default port from the Server, on the container
EXPOSE 80

# Start the app
CMD ["node", "server"]
