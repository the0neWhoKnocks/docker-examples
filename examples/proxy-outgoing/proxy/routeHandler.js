module.exports = function routeHandler(req, res) {
  const { body, headers, method, originalUrl, socket } = req;
  const domain = headers.host;
  const url = `${!!socket.ssl ? 'https' : 'http'}://${domain}${originalUrl}`;
  
  console.log(`[PROXY] Request for: "${url}"`);
  
  if (
    domain === 'api.icndb.com'
    || domain === 'jsonplaceholder.typicode.com'
    || domain === 'rickandmortyapi.com'
  ) {
    let extraData = {};
    
    if (method === 'POST') {
      extraData = { postBody: body };
    }
    
    return res.json({
      method,
      mock: `for "${url}"`,
      ...extraData,
    });
  }
  
  res.send('');
}
