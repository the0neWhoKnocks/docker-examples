const { promises: { readFile, writeFile } } = require('fs');
const { resolve: resolvePath } = require('path');
const hash = require('hash-sum');
const mkdirp = require('mkdirp');
const { teenyRequest } = require('teeny-request');
const { color, formatReqData } = require('./shared');

const CACHE_PATH = resolvePath(__dirname, './cache');

const formatLabel = (label, fallbackStr) => {
  return label
    ? label.replace(/[/\\?%*:|"<>]/g, '').replace(/\s/g, '_')
    : hash(fallbackStr)
};

const request = (req, transform) => new Promise((resolve, reject) => {
  const { body: reqBody, fullURL, headers, method, pathAndParams } = formatReqData(req);
  const payload = { uri: fullURL, method };
  
  if (method === 'POST') payload.json = reqBody;
  
  teenyRequest(payload, (err, resp, body) => {
    if (err) return reject(err);
    
    if (transform) resolve( transform(resp, body) );
    else {
      if (
        typeof body === 'string'
        && resp?.headers?.['content-type']?.includes('application/json')
      ) {
        body = JSON.parse(body);
      }
      
      resolve(body);
    }
  });
});

module.exports = async function cacheResponse(req, {
  label,
  prefixLabel = true,
  subDir = '',
  transform,
} = {}) {
  let cachedFile;
  
  try {
    const { domain, fullURL, method, pathAndParams } = formatReqData(req);
    const formattedLabel = formatLabel(label, pathAndParams);
    const basePath = `${CACHE_PATH}${subDir ? `/${subDir}` : ''}`;
    const labelPrefix = prefixLabel ? `[${method}]_[${domain}]__` : '';
    const cachedFilePath = `${basePath}/${labelPrefix}${formattedLabel}.json`;
    
    if (subDir) await mkdirp(basePath);
    
    try {
      cachedFile = JSON.parse(await readFile(cachedFilePath, 'utf8'));
      console.log(`${color.block.good('SERVE')} Cache for ${color.text.info(cachedFilePath)}`);
    }
    catch (err) { /**/ }
    
    if (!cachedFile) {
      try {
        console.log(`${color.block.info('CACHE')} Data from ${color.text.info(fullURL)}`);
        cachedFile = await request(req, transform);
        await writeFile(cachedFilePath, JSON.stringify(cachedFile, null, 2), 'utf8');
        console.log(`${color.block.good('SERVE')} Cache for ${color.text.info(cachedFilePath)}`);
      }
      catch (err) {
        console.log(`${color.block.bad('ERROR')} Caching ${fullURL}:\n${color.text.bad(err.stack)}`);
      }
    }
  }
  catch (err) { console.log(`${color.block.bad('ERROR')}\n${color.text.bad(err.stack)}`); }
  
  return cachedFile;
}
