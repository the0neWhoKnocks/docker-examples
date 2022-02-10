module.exports = function routeHandler(req, res) {
  const domain = req.headers.host;
  const url = `${!!req.socket.ssl ? 'https' : 'http'}://${domain}${req.originalUrl}`;
  
  console.log(`[PROXY] Request for: "${url}"`);
  
  if (
    domain === 'api.icndb.com'
    || domain === 'rickandmortyapi.com'
  ) {
    return res.json({ mock: `for "${url}"` });
  }
  
  res.send('');
}
