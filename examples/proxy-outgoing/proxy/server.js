const { readFileSync } = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const requireCurrent = require('./requireCurrent');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// handle requests
app.use('*', (...args) => requireCurrent('./routeHandler')(...args));

function portHandler(port) {
  return [port, () => {
    console.log(`Proxy running on Container port: ${port}`);
  }];
}

http.createServer(app).listen(...portHandler(80));
https.createServer({
  cert: readFileSync(process.env.CRT, 'utf8'),
  key: readFileSync(process.env.KEY, 'utf8'),
}, app).listen(...portHandler(443));
