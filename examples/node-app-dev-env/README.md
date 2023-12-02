# Node App Dev Env

Instead of a User having to switch between different Node versions locally on their machine, they can just run Node in the Container they're going to ship their App in.

This example demonstrates creating a base image that'll house your preferred shell, and any development tools you need (any App specific CLI tools would go in the App's Dockerfile).

- [Build](#build)
- [Run](#run)
- [Publish](#publish)

---

## Build

Build the base image which can then be used as a base for any other Node App.

```sh
docker compose build node20-base-image
```

---

## Run

Note that there'd usually be a `src` directory where assets would be compiled from and placed into `dist`. For this example I'm cutting out the middleman since it's not important for this example.

```sh
# Only needs to happen once per Shell session (or if you change the file).
source bin/repo-funcs.sh

# Bootstraps files/folders, starts the Container, then enters the Container.
# The first run will be a little slow because it's building the image.
startcont

# Verify your local files/folders are mounted within the Container.
ll

# Installs the Node modules locally to your machine (due to the bind mount).
npm i

# Start the App
# - In your Browser, go to http://localhost:3000 (the Server reports the port it's listening on, not what you may have mapped it to in the compose file).
# - View/debug it's source via chrome://inspect.
nr start:dev

# (CTRL+C) to stop the App

# Exit the Container, `docker compose down` will automatically be called.
exit
```

If you then re-run `startcont`, and start typing `nr` an auto-completion value for your previously run commands should appear.

There is a `preinstall` script in the `package.json` that'll warn a User if they try to run `npm i` outside of the Container environment. This prevents any confusion if a User is running an older version of Node locally but some modules expect a newer one.

---

## Publish

The image doesn't have to be published if you only need it locally, but if you switch computers or need to share the image, run:
```sh
# format
docker push <DOCKERHUB_USER>/<IMAGE_NAME>:<TAG>

# example of my own publish
docker login # enter creds (login only needs to be run once per machine, unless you've run docker logout)
docker compose build node20-base-image # ensure image is built
docker push theonewhoknocks/dev-base:node20
```
