const puppeteer = require('puppeteer');

async function getBrowser(browserConfig) {
  return puppeteer.launch(browserConfig);
}


module.exports = getBrowser;
