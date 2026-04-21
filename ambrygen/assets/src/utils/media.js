/**
 * Build a srcset string from WordPress media sizes.
 *
 * @param {Object<string, {url: string, width: number}>} sizes
 * @return {string} Srcset attribute value.
 */
export const buildSrcSet = ( sizes = {} ) =>
	Object.values( sizes )
		.filter( ( size ) => size?.url && size?.width )
		.map( ( size ) => `${ size.url } ${ size.width }w` )
		.join( ', ' );
