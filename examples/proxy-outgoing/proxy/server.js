const { createServer } = require('http');
const net = require('net');
const express = require('express');
const requireCurrent = require('./requireCurrent');

const app = express();
const server = createServer(app);

app.use('*', (...args) => requireCurrent('./routeHandler')(...args));

server.on('connect', function(req, socket, head) {
  const { httpVersion, url } = req;
  const [connIP, connPort] = url.split(':');
  //creating TCP connection to remote server
  const conn = net.connect(connPort || 443, connIP, function() {
    // tell the client that the connection is established
    socket.write(`HTTP/${httpVersion} 200 OK\r\n\r\n`, 'UTF-8', function() {
      // creating pipes in both ends
      conn.pipe(socket);
      socket.pipe(conn);
    });
  });

  conn.on('error', (err) => {
    console.log(`Server connection error: ${err}`);
    socket.end();
  });
});

server.on('connection', (stream) => {
  console.log('connected', stream);
});

server.listen(3000, () => {
  console.log('Proxy running');
});
