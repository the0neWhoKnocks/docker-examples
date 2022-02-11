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
  }
  catch (err) {
    resp = err.stack;
    console.error(err);
  }
  
  res.send(`
    <html>
      <head>
        <title>App</title>
        <style>
          body {
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          h3, pre {
            margin: 0;
          }
          
          div {
            width: 75vw;
            max-height: 75vw;
            padding: 1em;
            border: solid 1px;
            display: flex;
            flex-direction: column;
            gap: 1em;
          }
          
          pre {
            color: #eee;
            overflow: auto;
            padding: 1em;
            background: #333;
          }
        </style>
      </head>
      <body>
        <div>
          <h3>Response for <a href="${apiURL}">${apiURL}</a></h3>
          <pre>${resp}</pre>
        </div>
      </body>
    </html>
  `);
});

app.listen(process.env.HOST_PORT, () => {
  console.log(`Server running at: http://localhost:${process.env.HOST_PORT}`);
});
