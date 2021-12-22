# Reverse Proxy

1. Determine Docker's IP `ip addr show | grep docker`
  - Was `172.17.0.1/16` (so use just `172.17.0.1`)
1. Map IP to local host name, `sudo vim /etc/hosts`
  ```sh
  # example
  172.17.0.1  <NAME>.loc
  ```
  ```sh
  # for this example
  172.17.0.1  app1.loc
  172.17.0.1  app2.loc
  ```
1. Start the servers
  ```sh
  # should be run from within this directory
  docker-compose up apps-proxy
  ```
