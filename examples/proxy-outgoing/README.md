# Proxy Outgoing

There may be cases (testing, API development) when your App will make external requests but you want to serve up mock/static data.

---

## Run

### App without the Proxy

```sh
docker-compose up app
```

### Run the App with the Proxy

**Note**: To ensure Firewall rules don't get messed up, you can back up and restore settings via:
```sh
# backup
sudo iptables-save > ./iptables.bak
# restore
sudo iptables-restore < ./iptables.bak 
```

**Note**: For now it only proxies `http` requests, `https` requests result in a failure to connect.

A shell script is required right now to ensure the `iptables` rules are reset every time (in case docker-compose doesn't exit consistently).

```sh
./start.sh
```
