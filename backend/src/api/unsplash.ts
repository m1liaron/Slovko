import { EnvVariables } from "../common/enums/index.js";
import { createApi } from "unsplash-js";
import dotenv from "dotenv";

dotenv.config();

async function getUnsplashApi() {
  return createApi({
    accessKey: EnvVariables.UNSPLASH_KEY,
    fetch,
  });
}

export { getUnsplashApi };
