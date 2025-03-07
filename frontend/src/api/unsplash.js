import { API_UNSPLASH_KEY } from '@env';
import { createApi } from "unsplash-js";
import axios from "axios";

const unsplash = createApi({
    accessKey: API_UNSPLASH_KEY,
    fetch: axios,
});

export default unsplash;