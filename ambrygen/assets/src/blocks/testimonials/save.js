/**
 * WordPress dependencies
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * Builds responsive srcSet string from sizes object.
 *
 * @param {Object} sizes Image sizes object with url and width properties
 * @return {string|undefined} srcSet string or undefined if no sizes provided
 */
function buildSrcSet( sizes ) {
	if ( ! sizes ) {
		return undefined;
	}

	return Object.values( sizes )
		.filter( ( s ) => s?.url && s?.width )
		.map( ( s ) => `${ s.url } ${ s.width }w` )
		.join( ', ' );
}

/**
 * Save component for Testimonials block.
 *
 * @param {Object} props            Block props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Frontend HTML for the block
 */
export default function Save( { attributes } ) {
	const { heading, headingTag, backgroundImage, mainImage, mainImageSizes } =
		attributes;

	const Tag = headingTag || 'h2';

	return (
		<section
			{ ...useBlockProps.save( { className: 'ambry-testimonials' } ) }
			style={ {
				backgroundImage: backgroundImage
					? `url(${ backgroundImage })`
					: undefined,
			} }
		>
			{ /* Render heading */ }
			<RichText.Content
				tagName={ Tag }
				value={ heading }
				className="ambry-testimonials__heading"
			/>

			{ /* Main layout with image and testimonial items */ }
			<div className="ambry-testimonials__layout">
				{ mainImage && (
					<img
						src={ mainImage }
						srcSet={ buildSrcSet( mainImageSizes ) }
						className="ambry-testimonials__main-image"
						alt=""
					/>
				) }

				<div className="ambry-testimonials__grid">
					<InnerBlocks.Content />
				</div>
			</div>
		</section>
	);
}
