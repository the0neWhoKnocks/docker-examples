# Certificate Authority

Generate self-signed certs for your development projects.

- [Build](#build)
- [Run](#run)
  - [Use the env vars from the image](#use-the-env-vars-from-the-image)
  - [Provide values via environment variables](#provide-values-via-environment-variables)
- [Publish](#publish)

---

## Build

```sh
docker compose build gencerts
```

---

## Run

### Use the env vars from the image

```sh
UID=$UID GID=$GID docker compose run --rm gencerts
```

### Provide values via environment variables

```sh
# compose
UID=$UID GID=$GID docker compose run --rm \
  -e CERT__DOMAIN="homelab.net" \
  -e CERT__FILENAME="homelab" \
  -e CERT__IP="192.168.0.5" \
  gencerts

# docker
mkdir -p "$PWD/output"
docker run --rm -it \
  -v "$PWD/output:/opt/rootca/output" \
  -v "/etc/passwd:/etc/passwd:ro" \
  -v "/etc/group:/etc/group:ro" \
  --user $UID:$GID \
  -e CERT__DOMAIN="homelab.net" \
  -e CERT__FILENAME="homelab" \
  -e CERT__IP="192.168.0.5" \
  theonewhoknocks/gencerts:latest

# [ Output ]
# X509v3 Subject Alternative Name:
#   DNS:homelab.net, DNS:*.homelab.net, IP Address:192.168.0.5
#
# So the cert covers the root domain, wild-card sub-domains, and the host IP.

# Note: You can replace CERT__IP with `-e CERT__IP_RANGE="10.3.2.1,192.168.0-1.5-7"` to get:
#   DNS:homelab.net, DNS:*.homelab.net, IP Address:10.3.2.1, IP Address:192.168.0.5, IP Address:192.168.0.6, IP Address:192.168.0.7, IP Address:192.168.1.5, IP Address:192.168.1.6, IP Address:192.168.1.7
```

You could wrap the above in a shell function for reusability:
```sh
function genCerts {
  if [[ "$1" == "" ]] || [[ "$2" == "" ]] || [[ "$3" == "" ]]; then
    echo "[ERROR] Missing arguments"
    echo 'genCerts "<DOMAIN>" "<FILENAME>" "<IP>"'
    return 1
  fi
  
  local ip="CERT__IP=$3"
  if echo "$3" | grep -q "-"; then
    ip="CERT__IP_RANGE=$3"
  fi
  
  local outputPath="$PWD/certs"
  mkdir -p "$outputPath"
  docker run --rm -it \
    -v "$outputPath:/opt/rootca/output" \
    -v "/etc/passwd:/etc/passwd:ro" \
    -v "/etc/group:/etc/group:ro" \
    --user $UID:$GID \
    -e CERT__DOMAIN="$1" \
    -e CERT__FILENAME="$2" \
    -e $ip \
    theonewhoknocks/gencerts:latest
}
```

---

## Publish

This image is pretty useful. If you want to edit and publish your own version, update the `image` name in the compose file then run:
```sh
# format
docker push <DOCKERHUB_USER>/<IMAGE_NAME>:<TAG>

# example of my own publish
docker login # enter creds
docker compose build gencerts # ensure image is built
docker push theonewhoknocks/gencerts:latest
```
