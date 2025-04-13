import { createApi } from "unsplash-js";

const unsplash = createApi({
	accessKey: process.env.API_UNSPLASH_KEY,
	fetch,
});

const getUnsplashPhotos = async (
	value: string,
): Promise<string[] | undefined> => {
	const result = await unsplash.search.getPhotos({
		query: value,
		perPage: 4,
	});

	if (result.response?.results) {
		// Extract a suitable image URL from each photo object
		const photoUrls: string[] = result.response.results.map(
			(photo) => photo.urls.small,
		);
		return photoUrls.length ? photoUrls : [];
	}
};

export { unsplash, getUnsplashPhotos };
