# Dynamic User

There may be cases where you want to ship a specific environment for a Container. For example if you specify `user: "10000:10000"` in your `compose` file and then enter the Container you'll be in a state where there's no home directory because you're an unknown User.

---

## Run

Locally, create required directories/files
```sh
mkdir -p ./{data,shell-stuff} && chmod 777 ./{data,shell-stuff}
touch ./shell-stuff/.zsh_history && chmod 777 ./shell-stuff/.zsh_history
```

This will run the basic example which changes the `node` UID and GID. It'll also create a file in `data` to demonstrate what permissions are applied.
```sh
docker compose up
```

If you want to mess around inside the Container, change this in the compose file:
```diff
- command: /bin/zsh -c 'rm ...
- # command: tail -F /dev/null
+ # command: /bin/zsh -c 'rm ...
+ command: tail -F /dev/null
```
Then run:
```sh
# in shell #1
docker compose up

# in shell #2
dc exec -u node app zsh
```
