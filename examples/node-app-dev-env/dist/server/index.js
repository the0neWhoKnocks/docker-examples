const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-weight: bold;
            font-family: monospace;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        Howdy Pardner
      </body>
    </html>
  `);
});

const port = process.env.SERVER_PORT || 80;
app.listen(port, () => {
  console.log(`\nServer running at: http://localhost:${port}`);
});
