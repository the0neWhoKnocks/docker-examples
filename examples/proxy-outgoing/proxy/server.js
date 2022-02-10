const { readFileSync } = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const requireCurrent = require('./requireCurrent');

const app = express();

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
