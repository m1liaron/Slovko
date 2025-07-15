import { EnvVariables } from "../common/enums";
import { createApi } from "unsplash-js";
import dotenv from "dotenv";

dotenv.config();

async function getUnsplashApi() {
  const fetch = (await import("node-fetch")).default; // Dynamically import node-fetch
  return createApi({
    accessKey: EnvVariables.UNSPLASH_KEY,
    fetch,
  });
}

module.exports = getUnsplashApi;
