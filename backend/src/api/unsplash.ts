import dotenv from "dotenv";

import { EnvVariables } from "../common/enums/index.js";
import { createApi } from "unsplash-js";

dotenv.config();

const unsplash = createApi({
  accessKey: EnvVariables.UNSPLASH_KEY,
  fetch: fetch,
});

export { unsplash };
