const express = require('express');
const { teenyRequest } = require('teeny-request');

const request = (url) => new Promise((resolve, reject) => {
  console.log(`Request data from: "${url}"`);
  
  teenyRequest({ uri: url }, (err, resp, body) => {
    if (err) reject(err);
    else resolve(body);
  });
});

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const app = express();

const apis = [
  process.env.API_URL1,
  process.env.API_URL2,
];
let apiNdx = 0;

app.use('/', async (req, res) => {
  if (req.originalUrl.endsWith('favicon.ico')) return res.send('');
  
  let apiURL = apis[apiNdx];
  let data;
  
  if (apiNdx) apiURL = apiURL.replace('<ID>', randomNumber(1, 20));
  apiNdx = !apiNdx ? 1 : 0;
  
  try {
    data = JSON.stringify(await request(apiURL), null, 2);
    console.log(data);
  }
  catch (err) {
    data = err.stack;
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
          <pre>${data}</pre>
        </div>
      </body>
    </html>
  `);
});

app.listen(process.env.HOST_PORT, () => {
  console.log(`Server running at: http://localhost:${process.env.HOST_PORT}`);
});
