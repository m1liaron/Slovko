import { EnvVariables } from "@/libs/enums";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: EnvVariables.UNSPLASH_KEY,
  fetch: fetch,
});

export { unsplash };
