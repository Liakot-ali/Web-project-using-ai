const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const root = process.cwd();
  const indexFile = path.join(root, 'index.html');
  if (!fs.existsSync(indexFile)) {
    console.error('index.html not found in', root);
    process.exit(2);
  }

  const indexUrl = pathToFileURL(indexFile).toString();

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const globalRequestFailures = [];
  const globalBadResponses = [];
  const consoleMessages = [];

  page.on('requestfailed', req => {
    const f = {url: req.url(), method: req.method(), resourceType: req.resourceType(), failure: req.failure() ? req.failure().errorText : null};
    globalRequestFailures.push(f);
  });

  page.on('response', res => {
    try {
      const status = res.status();
      if (status >= 400) {
        globalBadResponses.push({url: res.url(), status, statusText: res.statusText(), request: {method: res.request().method(), resourceType: res.request().resourceType()}});
      }
    } catch (e) {}
  });

  page.on('console', msg => {
    consoleMessages.push({type: msg.type(), text: msg.text()});
  });

  await page.goto(indexUrl, { waitUntil: 'load' });

  const hrefs = await page.$$eval('.details-link', els => els.map(a => a.getAttribute('href')));

  const checks = [];

  for (const href of hrefs) {
    const pageObj = {pageUrl: null, missingImages: [], requestFailures: [], responseFailures: [], error: null};
    try {
      const pageUrl = new URL(href, indexUrl).toString();
      pageObj.pageUrl = pageUrl;
      const rfBefore = globalRequestFailures.length;
      const brBefore = globalBadResponses.length;

      await page.goto(pageUrl, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(500);

      const imgs = await page.$$eval('img', imgs => imgs.map(i => ({src: i.currentSrc || i.src || null, naturalWidth: i.naturalWidth})));
      pageObj.missingImages = imgs.filter(i => !i.src || i.naturalWidth === 0).map(i => i.src || '(no-src)');

      pageObj.requestFailures = globalRequestFailures.slice(rfBefore).map(f => ({url: f.url, failure: f.failure, method: f.method, resourceType: f.resourceType}));
      pageObj.responseFailures = globalBadResponses.slice(brBefore);
    } catch (e) {
      pageObj.error = String(e);
    }
    checks.push(pageObj);
    await page.goto(indexUrl, { waitUntil: 'load' });
  }

  const report = {generated: new Date().toISOString(), checks, globalRequestFailures, globalBadResponses, consoleMessages};
  fs.mkdirSync('reports', { recursive: true });
  const out = path.join('reports', 'playwright-failures.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log('Report written to', out);

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
