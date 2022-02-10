# Proxy Outgoing

There may be cases (testing, API development) when your App will make external requests but you want to serve up mock/static data.

For the time being you have to manually add the domains you want to proxy to the `networks.outgoing.aliases` section of `docker-compose.yml` in the `proxy` Service.

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
```
