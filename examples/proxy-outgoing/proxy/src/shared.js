const cc = require('cli-color');

module.exports = {
  color: {
    block: {
      bad: str => cc.bold.redBright.inverse(` ${str} `),
      comment: str => cc.bold.whiteBright.inverse(` ${str} `),
      good: str => cc.bold.greenBright.inverse(` ${str} `),
      info: str => cc.bold.cyanBright.inverse(` ${str} `),
    },
    text: {
      bad: cc.redBright,
      info: cc.cyanBright,
      warn: cc.yellowBright,
    },
  },
  formatReqData(req) {
    const { headers, originalUrl, socket } = req;
    const domain = headers.host;
    const fullURL = `${!!socket.ssl ? 'https' : 'http'}://${domain}${originalUrl}`;
    return { ...req, domain, fullURL, pathAndParams: originalUrl };
  },
}
