const http = require('http');
// const net = require('net');

// const { URL } = require('url');

// // Create an HTTP tunneling proxy
// const proxy = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('OK');
// });
// proxy.on('connect', (req, clientSocket, head) => {
//   // Connect to an origin server
//   const { port, hostname } = new URL(`http://${req.url}`);
//   const serverSocket = net.connect(port || 80, hostname, () => {
//     clientSocket.write([
//       'HTTP/1.1 200 Connection Established',
//       'Proxy-agent: Node.js-Proxy',
//     ].join('\n'));
//     serverSocket.write(head);
//     serverSocket.pipe(clientSocket);
//     clientSocket.pipe(serverSocket);
//   });
// });
// 
// // Now that proxy is running
// proxy.listen(3000, () => {
//   console.log('Proxy running');
// 
//   // // Make a request to a tunneling proxy
//   // const options = {
//   //   port: 1337,
//   //   host: '127.0.0.1',
//   //   method: 'CONNECT',
//   //   path: 'www.google.com:80'
//   // };
//   // 
//   // const req = http.request(options);
//   // req.end();
//   // 
//   // req.on('connect', (res, socket, head) => {
//   //   console.log('got connected!');
//   // 
//   //   // Make a request over an HTTP tunnel
//   //   socket.write('GET / HTTP/1.1\r\n' +
//   //                'Host: www.google.com:80\r\n' +
//   //                'Connection: close\r\n' +
//   //                '\r\n');
//   //   socket.on('data', (chunk) => {
//   //     console.log(chunk.toString());
//   //   });
//   //   socket.on('end', () => {
//   //     proxy.close();
//   //   });
//   // });
// });



const { readFileSync } = require('fs');
const express = require('express');
const httpProxy = require('http-proxy');
const requireCurrent = require('./requireCurrent');

const app = express();

app.use('*', (...args) => requireCurrent('./routeHandler')(...args));

const server = http.createServer(app);
const PORT__PROXY = process.env.PORT__PROXY || 3000;
const PORT__SERVER = process.env.PORT__SERVER || 3001;

// server.on('connect', (req, clientSocket, head) => {
//   // Connect to an origin server
//   const url = `http://${req.url}`;
//   const { port, hostname } = new URL(url);
// 
//   const serverSocket = net.connect(port || 80, hostname, () => {
//     console.log('[CONNECT]', url);
// 
//     const payload = [
//       `HTTP/${req.httpVersion} 200 Connection Established`,
//       'Proxy-agent: Node.js-Proxy',
//     ].join('\n');
// 
//     clientSocket.write(payload, 'UTF-8', () => {
//       // console.log('--', req);
//       // process.exit(1);
//       serverSocket.write(JSON.stringify({ bar: 'fu' }));
//       serverSocket.end();
//     });
//     // serverSocket.write(head);
//     // serverSocket.pipe(clientSocket);
//     // clientSocket.pipe(serverSocket);
//   });
// 
// 
//   // var proxySocket = new net.Socket();
//   // proxySocket.connect(port || 80, hostname, () => {
//   //   proxySocket.write(head);
//   //   clientSocket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
//   // });
//   // 
//   // proxySocket.on('data', (chunk) => {
//   //   clientSocket.write(chunk);
//   // });
//   // 
//   // proxySocket.on('end', () => {
//   //   clientSocket.end();
//   // });
//   // 
//   // proxySocket.on('error', () => {
//   //   clientSocket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
//   //   clientSocket.end();
//   // });
//   // 
//   // clientSocket.on('data', (chunk) => {
//   //   proxySocket.write(chunk);
//   // });
//   // 
//   // clientSocket.on('end', () => {
//   //   proxySocket.end();
//   // });
//   // 
//   // clientSocket.on('error', () => {
//   //   proxySocket.end();
//   // });
// });

httpProxy
  .createProxyServer({ target: `http://localhost:${PORT__SERVER}` })
  .listen(PORT__PROXY);

server.listen(PORT__SERVER, () => {
  console.log('Proxy running');
});
