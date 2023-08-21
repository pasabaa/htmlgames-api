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

  const { page } = req.query;

  const URL_BASE = "https://idev.games";
  const data = {};
  const results = [];
  const pagination = [];

  axios
    .get(`https://idev.games/recently-added-games/page${page}`)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".paginationBox", html).each(function () {
        const currentPage = $(this).find(".pagiStat").text().match(/\d+/)[0];
        const totalPages = $(this)
          .find(".pagiStat")
          .text()
          .match(/of (\d+)/)[1];

        pagination.push({
          currentPage,
          totalPages,
        });

        data.pagination = pagination;
      });

      $(".gameImageFeed", html).each(function () {
        const id = $(this).find("div > div >a").attr("href").split("/")[2];
        const title = $(this).find(".whiteboxInfo a:nth(1)").text().trim();
        const description = $(this)
          .find(".whiteboxInfo div:nth(0)")
          .text()
          .trim();
        const thumbnail =
          URL_BASE + $(this).find("div > div > a > img").attr("src");
        const backgroundStyle = $(this).css("background");

        // Extract the URL from the background style
        const cover =
          URL_BASE + backgroundStyle.match(/url\(['"]?([^'"]+)['"]?\)/)[1];

        const adFreeImage = $(this).find("img[alt='ad free']").length > 0;
        const mobileImage = $(this).find("img[alt='mobile']").length > 0;

        results.push({
          id,
          title,
          description,
          thumbnail,
          cover,
          ad_free: adFreeImage,
          mobile: mobileImage,
        });

        data.results = results;
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
