#!/bin/bash

CONTAINER="example-app-dev"
export REPO_FUNCS=()

# Wire up the current User so that any files created in development can easily
# be manipulated by the User or during test runs.
# Export to ensure `docker compose` can use'm
export CURR_UID=$(id -u)
export CURR_GID=$(id -g)

REPO_FUNCS+=("startcont")
function startcont {
  # Ensure required directories are set up
  mkdir -p ./{.app_data,.ignore}
  touch ./.ignore/.zsh_history
  chmod 777 ./.ignore/.zsh_history
  
  # # If your App requires things like API keys (that should NOT be in your compose file).
  # envPath="./.env"
  # if [ ! -f "${envPath}" ]; then
  #   echo -e "##\n# NOTE: Any new variables should have defaults added in 'repo-funcs.sh'\n##\n" >> "${envPath}"
  #   echo "APP_SPECIFIC_VAR=<VAL>" >> "${envPath}"
  #  
  #   echo -e "\n The '.env' file wasn't set up, so it was populated with temporary values.\n Any variables with '<VAL>' need to be updated."
  #   return
  # elif grep -q "<VAL>" "${envPath}"; then
  #   echo -e "\n The '.env' file contains variables that need '<VAL>' replaced."
  #   return
  # fi
  
  # # If your App needs to support https.
  # if [ ! -d "./certs" ]; then
  #   echo -e "\n You need to set up the 'certs' folder.\n If you don't know how, follow the instructions on https://github.com/the0neWhoKnocks/generate-certs."
  #   return
  # fi
  
  # Ensure base files/folders are available to copy to container during `build`.
  # NOTE: This would usually happen in a script, but doing it manually for the example.
  mkdir -p ./dist/{public,server,utils}
  if [ ! -f "./dist/constants.js" ]; then
    touch ./dist/constants.js
    echo -e "module.exports = {};\n" > ./dist/constants.js
  fi
  
  # boot container and enter it
  docker compose up -d "${CONTAINER}"
  exitCode=$?
  if [ $exitCode -ne 0 ]; then
    echo "[ERROR] Problem starting ${CONTAINER}"
    return $exitCode
  fi
  docker compose exec -u node -it "${CONTAINER}" zsh && docker compose down
}

REPO_FUNCS+=("entercont")
function entercont {
  docker compose exec -u node -it "${CONTAINER}" zsh
}
