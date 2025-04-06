const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/scrape', async (req, res) => {
  const inputUrl = req.query.url || 'https://terabox.com/s/1ky9XWVVJJrIUgg1B_awGkA';
  const pwd = req.query.pwd || '';

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // spoof User-Agent
  await page.setUserAgent(
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
  );

  // buka halaman
  await page.goto('https://terabox.hnn.workers.dev/', { waitUntil: 'networkidle2' });

  // isi form dan klik tombol
  await page.type('#input-url', inputUrl);
  if (pwd) await page.type('#input-password', pwd);
  await page.click('#get-link-button');

  // tunggu hasil muncul
  await page.waitForSelector('.tree-view');

  // ambil isi hasilnya
  const hasil = await page.evaluate(() => {
    return document.querySelector('.tree-view').innerText.trim();
  });

  await browser.close();

  res.json({ hasil });
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
