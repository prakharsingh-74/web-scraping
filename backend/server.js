const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to fetch product sitemap URL
app.post('/api/pre-scrape', async (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).send('Domain is required');
  }

  try {
    const robotsResponse = await axios.get(`https://${domain}/robots.txt`);
    const robotsText = robotsResponse.data;
    const sitemapUrl = robotsText.match(/Sitemap: (.+)/i)[1].trim();
    const sitemapResponse = await axios.get(sitemapUrl);
    const sitemapXml = sitemapResponse.data;
    const parser = new xml2js.Parser();
    parser.parseString(sitemapXml, (err, result) => {
      if (err) {
        return res.status(500).send('Failed to parse XML');
      }

      const productSitemapUrl = result.sitemapindex.sitemap.find(s => s.loc[0].includes('product')).loc[0];
      res.json({ productSitemapUrl });
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to fetch products from the sitemap URL
app.post('/api/fetch-products', async (req, res) => {
  const { sitemapUrl } = req.body;
  if (!sitemapUrl) {
    return res.status(400).send('Sitemap URL is required');
  }

  try {
    const response = await axios.get(sitemapUrl);
    const xml = response.data;
    const parser = new xml2js.Parser();

    parser.parseString(xml, (err, result) => {
      if (err) {
        return res.status(500).send('Failed to parse XML');
      }

      if (!result.urlset || !result.urlset.url) {
        return res.status(500).send('Invalid XML structure');
      }

      const products = result.urlset.url.map((item) => ({
        link: item.loc[0],
        image: item['image:image'] && item['image:image'][0]['image:loc'] ? item['image:image'][0]['image:loc'][0] : '',
        title: item['image:image'] && item['image:image'][0]['image:title'] ? item['image:image'][0]['image:title'][0] : 'No title',
      }));

      res.json(products);
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
