#!/usr/bin/env bash

TMP_FILE=./iptables.tmp

sudo iptables-save > "${TMP_FILE}"

echo " ╭────────────────────────╮ "
echo " │ Starting App and Proxy │ "
echo " ╰────────────────────────╯ "
docker-compose up

# NOTE: The below is supposed to happen automatically but doesn't. Perhaps it's
# because I'm using 'docker-compose' instead of just 'docker'.
sudo iptables-restore < "${TMP_FILE}"
rm "${TMP_FILE}"
echo " ╭─────────────────────╮ "
echo " │ Removed Proxy rules │ "
echo " ╰─────────────────────╯ "
