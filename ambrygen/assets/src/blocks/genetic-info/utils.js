/**
 * Validates YouTube and Vimeo URLs with enhanced security checks.
 * Supports multiple URL formats and prevents malicious URLs.
 *
 * @param {string} url Video URL to validate
 * @return {boolean} True if valid YouTube/Vimeo URL
 */
export const isValidVideoUrl = ( url ) => {
	if ( ! url || typeof url !== 'string' ) {
		return false;
	}

	try {
		// Basic URL structure validation
		const urlObj = new URL( url );

		// Only allow https protocols
		if ( urlObj.protocol !== 'https:' ) {
			return false;
		}

		// YouTube validation - multiple formats
		const youtubePatterns = [
			/^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
			/^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
			/^https?:\/\/youtu\.be\/[\w-]+/,
		];

		// Vimeo validation - multiple formats
		const vimeoPatterns = [
			/^https?:\/\/(www\.)?vimeo\.com\/\d+/,
			/^https?:\/\/player\.vimeo\.com\/video\/\d+/,
		];

		const isValidYoutube = youtubePatterns.some( ( pattern ) =>
			pattern.test( url )
		);
		const isValidVimeo = vimeoPatterns.some( ( pattern ) =>
			pattern.test( url )
		);

		return isValidYoutube || isValidVimeo;
	} catch ( error ) {
		return false;
	}
};

/**
 * Converts YouTube/Vimeo URLs to embed iframe src with enhanced validation.
 * Returns empty string for invalid URLs to prevent security issues.
 *
 * @param {string} url Video URL
 * @return {string} Embed iframe src or empty string
 */
export const getIframeSrc = ( url ) => {
	if ( ! isValidVideoUrl( url ) ) {
		return '';
	}

	try {
		// YouTube URL processing
		if ( url.includes( 'youtube.com' ) || url.includes( 'youtu.be' ) ) {
			let videoId = '';

			if ( url.includes( 'watch?v=' ) ) {
				videoId = url.split( 'watch?v=' )[ 1 ]?.split( '&' )[ 0 ];
			} else if ( url.includes( 'embed/' ) ) {
				videoId = url.split( 'embed/' )[ 1 ]?.split( '?' )[ 0 ];
			} else if ( url.includes( 'youtu.be/' ) ) {
				videoId = url.split( 'youtu.be/' )[ 1 ]?.split( '?' )[ 0 ];
			}

			// Validate video ID format (11 characters for YouTube)
			if ( videoId && /^[a-zA-Z0-9_-]{11}$/.test( videoId ) ) {
				return `https://www.youtube.com/embed/${ videoId }?rel=0&modestbranding=1&playsinline=1`;
			}
		}

		// Vimeo URL processing
		if ( url.includes( 'vimeo.com' ) ) {
			const parts = url.split( '/' ).filter( Boolean );
			const videoId = parts.pop();

			// Validate video ID format (numeric for Vimeo)
			if ( videoId && /^\d+$/.test( videoId ) ) {
				return `https://player.vimeo.com/video/${ videoId }?dnt=1`;
			}
		}

		return '';
	} catch ( error ) {
		return '';
	}
};
