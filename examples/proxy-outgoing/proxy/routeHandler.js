module.exports = function routeHandler(req, res) {
  const url = req.originalUrl;
  
  console.log(`[PROXY] Request for: "${url}"`);
  
  if (url.endsWith('favicon.ico')) res.send('');
  else res.json({ fu: 'bar' });
}
