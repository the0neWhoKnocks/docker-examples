#!/usr/bin/env bash

echo " ╭────────────────────────╮ "
echo " │ Starting App and Proxy │ "
echo " ╰────────────────────────╯ "
docker-compose up

# NOTE: The below is supposed to happen automatically but doesn't. Perhaps it's
# because I'm using 'docker-compose' instead of just 'docker'.
sudo iptables-save | grep -v REDSOCKS | sudo iptables-restore
echo " ╭─────────────────────╮ "
echo " │ Removed Proxy rules │ "
echo " ╰─────────────────────╯ "
