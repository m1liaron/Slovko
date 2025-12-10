import dotenv from "dotenv";
import { createApi } from "unsplash-js";

import { EnvVariables } from "../common/enums/index.js";

dotenv.config();

const unsplash = createApi({
  accessKey: EnvVariables.UNSPLASH_KEY,
  fetch: fetch,
});

export { unsplash };
