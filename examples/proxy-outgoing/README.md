# Proxy Outgoing

There may be cases (testing, API development) when your App will make external requests but you want to serve up mock/static data.

For the time being you have to manually add the domains you want to proxy to the `links` section of `docker-compose.yml` in the `proxied-app` Service.

- You can add any proxying logic you want to [proxy/matcher.js](./proxy/matcher.js).
- The `res` Object is from ExpressJS so you can serve data using any of it's functions.
- If you want to cache and then serve actual data from an endpoint you can use the `cacheResp` function. `cacheResp` allows for labeling a cached file so it's easier to understand what file's being served - or if you need to delete it later to cache a new payload.

---

## Run

### App without the Proxy

```sh
docker-compose up app
```

### Run the App with the Proxy

```sh
# Start Proxy in background (no logs)
docker-compose up proxied-app

# If you want to see the logs for the Proxy
docker-compose up proxy proxied-app
# or
docker-compose logs -f
```

---

## Cache data

`cacheResp` options
| Prop | Type | Description |
| ---- | ---- | ----------- |
| `label` | `String` | A label for the saved file. If not set, a hash will be generated from the URL. |
| `prefixLabel` | `Boolean` | Whether or not to prefix the label with the request method and domain. |
| `subDir` | `String` | A path to a sub directory where the file will be saved. In the format `folder/folder/folder`, it should not start or end with a slash. |

---

## Publish

This image is pretty useful, so if you want to edit and publish your own version run:
```sh
docker tag <LOCAL_IMAGE_NAME>:<TAG> <DOCKERHUB_USER>/<IMAGE_NAME>:<TAG> && docker push <DOCKERHUB_USER>/<IMAGE_NAME>:<TAG>

# example of my own publish
docker login # enter creds
docker tag proxy-outgoing_proxy:latest theonewhoknocks/nodejs-proxy:latest && docker push theonewhoknocks/nodejs-proxy:latest
```
