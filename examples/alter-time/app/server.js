const express = require('express');

const app = express();

app.use('/', async (req, res) => {
  if (req.originalUrl.endsWith('favicon.ico')) return res.send('');
  
  const [month, day, year] = (new Date()).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Los_Angeles' }).split('/');
  const [time, meridiem] = (new Date()).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles' }).split(', ')[1].split(' ');
  const serverStamp = `${year}-${month}-${day} ${time}${meridiem.toLowerCase()}`;
  
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
          
          #root {
            width: 400px;
            font-size: 1.5rem;
            font-family: monospace;
            padding: 1em;
            border: solid 1px;
            display: flex;
            flex-direction: column;
            gap: 1em;
          }
          
          h3 {
            margin-bottom: 0.25em;
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
        <div id="root"></div>
        <script>
          const [month, day, year] = (new Date()).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Los_Angeles' }).split('/');
          const [time, meridiem] = (new Date()).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles' }).split(', ')[1].split(' ');
          const clientStamp = \`\${year}-\${month}-\${day} \${time}\${meridiem.toLowerCase()}\`;
          
          document.getElementById('root').innerHTML = [
            ['Server Time (mocked)', '${serverStamp}'],
            ['Client Time', clientStamp],
          ].map(([title, stamp]) => {
            return \`
              <div>
                <h3>\${title}</h3>
                <pre>\${stamp}</pre>
              </div>
            \`;
          }).join('');
        </script>
      </body>
    </html>
  `);
});

app.listen(process.env.HOST_PORT, () => {
  console.log(`Server running at: http://localhost:${process.env.HOST_PORT}`);
});
