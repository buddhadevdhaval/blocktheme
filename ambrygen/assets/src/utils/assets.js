export const getThemeAssetUrl = ( path = '' ) => {
	if ( ! path || /^https?:\/\//.test( path ) ) {
		return path;
	}

	if (
		typeof window !== 'undefined' &&
		window.ambrygenAssets &&
		window.ambrygenAssets.themeUrl
	) {
		return `${ window.ambrygenAssets.themeUrl }${ path }`;
	}

	if ( typeof document !== 'undefined' ) {
		const themeScript = [ ...document.scripts ].find( ( script ) =>
			script.src.includes( '/assets/build/' )
		);

		if ( themeScript ) {
			const themeUrl = themeScript.src.split( '/assets/build/' )[ 0 ];

			return `${ themeUrl }${ path }`;
		}
	}

	return path;
};
