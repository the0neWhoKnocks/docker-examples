const cacheResp = require('./cacheResponse');
const requireCurrent = require('./requireCurrent');
const { color, formatReqData } = require('./shared');

module.exports = async function routeHandler(req, res) {
  const formattedReq = formatReqData(req);
  const { body, domain, fullURL, method } = formattedReq;
  
  try {
    const matcher = requireCurrent('./matcher');
    
    console.log(`${color.block.good('PROXY')} Request for: ${color.text.info(fullURL)}`);
    
    await matcher({ cacheResp, req: formattedReq, res });
  }
  catch (err) {
    console.log(`${color.block.bad('ERROR')}\n${color.text.bad(err.stack)}`);
  }
  
  if (!res.headersSent) {
    console.log(`${color.block.comment('PASSTHROUGH')} Request for: ${color.text.info(fullURL)}`);
    res.send('');
  }
}
