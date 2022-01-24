# Proxy Outgoing

There may be cases (testing, API development) when your App will make external requests but you want to serve up mock/static data.

---

## Run

Run the App without the Proxy
```sh
docker-compose up app
```

Run the App with the Proxy
```sh
./start.sh
```
A shell script is required right now to ensure the `iptables` rules are reset every time.

**Note**: For now it only proxies `http` requests, `https` requests result in a failure to connect.
