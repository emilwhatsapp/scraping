const express = require("express");
const puppeteer = require("puppeteer-core");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url parameter" });

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: "wss://chrome.browserless.io?token=S4srKbw0MVOy1T118032d477237f8e719421162872"
    });

    const page = await browser.newPage();
    await page.goto("https://terabox.hnn.workers.dev", { waitUntil: "networkidle2" });

    // Masukkan URL ke input
    await page.type("#input-url", url);
    await page.click("#get-link-button");

    // Tunggu hasil
    await page.waitForSelector(".tree-view", { timeout: 10000 });

    const result = await page.evaluate(() => {
      return document.querySelector(".tree-view").innerText;
    });

    await browser.close();
    res.json({ result });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
