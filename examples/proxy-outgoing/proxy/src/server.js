const { readFileSync } = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const routeHandler = require('./routeHandler');
const { color } = require('./shared');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// handle requests
app.use('*', routeHandler);

function portHandler(port) {
  return [port, () => {
    console.log(`${color.block.good('RUN')} Proxy on Container port: ${color.text.info(port)}`);
  }];
}

http.createServer(app).listen(...portHandler(80));
https.createServer({
  cert: readFileSync(process.env.CRT, 'utf8'),
  key: readFileSync(process.env.KEY, 'utf8'),
}, app).listen(...portHandler(443));
