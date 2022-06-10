const { promises: { readFile } } = require('fs');
const { resolve: resolvePath } = require('path');
const express = require('express');
const { teenyRequest } = require('teeny-request');

const request = (url, data) => new Promise((resolve, reject) => {
  const method = data ? 'POST' : 'GET';
  
  console.log(`[${method}] data ${method === 'GET' ? 'from' : 'to'}: "${url}"`);
  
  teenyRequest({ json: data, method, uri: url }, (err, resp, body) => {
    if (err) reject(err);
    else resolve(body);
  });
});

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const app = express();
let apiNdx = 0;

app.use('/', async (req, res) => {
  if (req.originalUrl.endsWith('favicon.ico')) return res.send('');
  
  let apiURL;
  let payload;
  let resp;
  
  try {
    switch (apiNdx) {
      case 0: {
        apiURL = 'http://api.icndb.com/jokes/random';
        break;
      }
      case 1: {
        apiURL = `https://rickandmortyapi.com/api/character/${randomNumber(1, 20)}`;
        break;
      }
      case 2: {
        apiURL = 'https://jsonplaceholder.typicode.com/posts';
        payload = {
          title: 'fu',
          body: 'bar',
          userId: randomNumber(1000, 2000),
        };
        break;
      }
    }
    
    apiNdx = (apiNdx === 2) ? 0 : apiNdx + 1;
      
    resp = JSON.stringify(await request(apiURL, payload), null, 2);
    console.log(resp);
    
    // this is just for live updates for the example
    const template = await readFile(resolvePath(__dirname, './index.html'), { encoding: 'utf8' });
    const model = { apiURL, resp };
    const render = (str, data) => {
      let ret = str;
      Object.keys(data).forEach(key => {
        ret = ret.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
      });
      return ret;
    };
    resp = render(template, model);
  }
  catch (err) {
    resp = err.stack;
    console.error(err);
  }
  
  res.send(resp);
});

app.listen(process.env.HOST_PORT, () => {
  console.log(`Server running at: http://localhost:${process.env.HOST_PORT}`);
});
