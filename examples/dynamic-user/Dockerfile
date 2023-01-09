FROM node:18-alpine

# - `shadow` adds `usermod` and `groupmod`
# - `su-exec` run the specified CMD with a specific User
# - `tzdata` so the `TZ` env var works for timezones
# - `vim zsh` for development env
RUN apk add --no-cache shadow su-exec tzdata vim zsh

# Set up User's env
WORKDIR /home/node
COPY --chown=node:node ./.vimrc ./
COPY --chown=node:node ./.zshrc ./

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/bin/ps", "aux"]
