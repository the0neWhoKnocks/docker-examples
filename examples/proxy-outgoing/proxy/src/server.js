const { readFileSync } = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const catchAll = require('./routeHandler');
const { color } = require('./shared');

const app = express();
let state = {};

// add CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') return res.send(200);
  
  next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// maintain state that can be used for testing
app.get('/state', (req, res) => {
  console.log(`${color.block.good('GET')} State: ${JSON.stringify(state)}`);
  res.json(state);
});
app.put('/state', (req, res) => {
  state = req.body || {};
  console.log(`${color.block.good('SET')} State to: ${JSON.stringify(state)}`);
  res.json(state);
});
// handle requests
const addState = (req, res, next) => {
  req.state = state;
  next();
};
app.use('*', addState, catchAll);

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
