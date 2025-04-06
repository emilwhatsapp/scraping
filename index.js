import express from 'express';
import puppeteer from 'puppeteer-core';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: 'wss://chrome.browserless.io?token=YOUR_API_KEY',
      defaultViewport: null,
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000); // 60 detik
    page.setDefaultTimeout(60000);

    await page.goto('https://terabox.hnn.workers.dev', { waitUntil: 'networkidle2' });

    await page.type('#input-url', url);
    await page.click('#get-link-button');

    await page.waitForSelector('.tree-view', { timeout: 30000 });

    const result = await page.evaluate(() => {
      return document.querySelector('.tree-view')?.innerText || 'No result';
    });

    await browser.close();

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
