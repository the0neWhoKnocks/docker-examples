module.exports = async function matcher({ cacheResp, req, res }) {
  const { body, domain, method, state } = req;
  
  if (
    domain === 'api.icndb.com'
    || domain === 'jsonplaceholder.typicode.com'
    || domain === 'rickandmortyapi.com'
  ) {
    const extraData = {};
    
    if (method === 'POST') extraData.postBody = body;
    
    res.json({
      method,
      ...extraData,
      proxiedData: await cacheResp(req, { label: 'Test' }),
      state,
    });
  }
}
