const { createApi } = require("unsplash-js");
const dotenv = require("dotenv");

dotenv.config();

async function getUnsplashApi() {
  const fetch = (await import("node-fetch")).default; // Dynamically import node-fetch
  return createApi({
    accessKey: process.env.UNSPLASH_KEY,
    fetch,
  });
}

module.exports = getUnsplashApi;
