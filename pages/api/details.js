const cheerio = require("cheerio");
const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache();

const MAX_REQUESTS_PER_MINUTE = 60;
const requests = {};
setInterval(() => {
  for (const key in requests) {
    delete requests[key];
  }
}, 60000);

export default function handler(req, res) {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (requests[clientIP] && requests[clientIP] >= MAX_REQUESTS_PER_MINUTE) {
    res.status(429).json({
      message: "Too many requests",
    });
    return;
  }

  requests[clientIP] = requests[clientIP] ? requests[clientIP] + 1 : 1;

  const cacheKey = req.url; // Utiliza la URL como clave del caché
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(cachedResponse);
    return;
  }

  const {
    id
  } = req.query;

  const data = [];


  axios
    .get(`https://idev.games/game/${id}`)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);


      $("#mainwindow", html).each(function () {
        const title = $(this).find(".topBar > h1").text().trim();
        const developer = $(this).find(".embedLineBar p > a").text().trim();
        const embedCode = $(this).find("#bar > pre > code").text().trim();
        
        // Extract iframe URL using regular expression
        const iframeSrcMatch = embedCode.match(/<iframe[^>]+src="([^"]+)"/);
        const embed_url = iframeSrcMatch ? iframeSrcMatch[1] : '';
      
        data.push({
          title,
          developer,
          embed_url
        });
      });

      cache.set(cacheKey, data);
      res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
}
