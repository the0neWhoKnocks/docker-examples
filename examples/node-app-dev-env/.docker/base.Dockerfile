## Base Node image
FROM node:20.6.0-alpine3.18 as node20-dev-base
# Add any extra base packages below. Comment why they're added for your own 
# sanity later. Add any App specific packages further down (there's a comment).
# - `rsync` for the `dist` setup
# - `tzdata` so the `TZ` env var works for timezones
# - `vim zsh` for development env
RUN apk add --no-cache --update rsync tzdata vim zsh

# Set up a usable terminal experience for development
RUN echo "update-notifier=false" >> /home/node/.npmrc
COPY ./.docker/.vimrc /home/node/
COPY ./.docker/.zshrc /home/node/
COPY ./.docker/packageJSONParser.js /home/node/
COPY ./.docker/zsh-autosuggestions.zsh /home/node/
