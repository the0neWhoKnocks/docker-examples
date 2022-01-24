const { readFileSync } = require('fs');
const express = require('express');
const requireCurrent = require('./requireCurrent');

const app = express();

app.use('*', (...args) => requireCurrent('./routeHandler')(...args));

app.listen(3000, () => {
  console.log('Proxy running');
});
