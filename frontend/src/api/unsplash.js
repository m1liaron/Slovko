import { API_UNSPLASH_KEY } from "@env";
import { createApi } from "unsplash-js";

const unsplash = createApi({
	accessKey: API_UNSPLASH_KEY,
	fetch,
});

export default unsplash;
