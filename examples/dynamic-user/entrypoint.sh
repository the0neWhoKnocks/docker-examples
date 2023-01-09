#!/bin/sh

set -e

CURR_USER="node"
CURR_GROUP="node"
CURR_UID=$(id -u "${CURR_USER}")
CURR_GID=$(id -g "${CURR_GROUP}")

if [[ "${CUSTOM_UID}" != "${CURR_UID}" ]]; then
  CUSTOM_UID="${CUSTOM_UID:-${CURR_UID}}"
  usermod --uid "${CUSTOM_UID}" "${CURR_USER}"
  
  echo "[INFO] Updated 'node' user's UID to '${CUSTOM_UID}'"
fi

if [[ "${CUSTOM_GID}" != "${CURR_GID}" ]]; then
  CUSTOM_GID="${CUSTOM_GID:-${CURR_GID}}"
  groupmod --gid "${CUSTOM_GID}" "${CURR_GROUP}"
  
  echo "[INFO] Updated 'node' user's GID to '${CUSTOM_GID}'"
fi

echo "[INFO] node's current UID:GID | $(id -u "${CURR_USER}"):$(id -g "${CURR_GROUP}")"

# Run the process specified by `CMD` in the `Dockerfile`
su-exec "${CURR_USER}:${CURR_GROUP}" "${@}"
