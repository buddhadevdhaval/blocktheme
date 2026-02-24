export const getThemeAssetUrl = ( path = '' ) => {
	if (
		typeof window !== 'undefined' &&
		window.ambrygenAssets &&
		window.ambrygenAssets.themeUrl
	) {
		return `${ window.ambrygenAssets.themeUrl }${ path }`;
	}

	return path;
};
