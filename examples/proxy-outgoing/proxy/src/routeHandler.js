const cacheResp = require('./cacheResponse');
const requireCurrent = require('./requireCurrent');
const { color, formatReqData } = require('./shared');

module.exports = async function routeHandler(req, res) {
  const formattedReq = formatReqData(req);
  const { body, domain, fullURL, method } = formattedReq;
  let matchFound = true;
  
  try {
    const matcher = requireCurrent('./matcher');
    
    console.log(`${color.block.good('PROXY')} Request for: ${color.text.info(fullURL)}`);
    
    await matcher({
      cacheResp,
      color,
      next: (err) => {
        matchFound = false;
        if (err) throw err;
      },
      req: formattedReq,
      requireCurrent,
      res,
    });
  }
  catch (err) {
    console.log(`${color.block.bad('ERROR')}\n${color.text.bad(err.stack)}`);
  }
  
  if (!matchFound) {
    console.log(`${color.block.warn('PASSTHROUGH')} Request for: ${color.text.info(fullURL)}`);
    res.send('');
  }
}
