/**
 * Build a srcset string from WordPress media sizes.
 *
 * @param {Object<string, {url: string, width: number}>} sizes
 * @return {string} Srcset attribute value.
 */
export const buildSrcSet = ( sizes = {} ) =>
	Object.values( sizes )
		.reduce( ( srcset, size ) => {
			if ( ! size?.url || ! size?.width ) {
				return srcset;
			}

			srcset.push( `${ size.url } ${ size.width }w` );
			return srcset;
		}, [] )
		.join( ', ' );
