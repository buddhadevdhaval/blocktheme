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
function buildSrcSet(sizes) {
	if (!sizes) {
		return undefined;
	}

	return Object.values(sizes)
		.filter((s) => s?.url && s?.width)
		.map((s) => `${s.url} ${s.width}w`)
		.join(', ');
}

export default function Save({ attributes }) {
	const {
		heading,
		headingTag,
		mainImage,
		mainImageSizes,
		secondaryImage,
		secondaryImageSizes,
		overlayImage,
		overlayImageSizes,
	} = attributes;

	const Tag = headingTag || 'h2';

	return (
		<>
			<div
				{...useBlockProps.save({
					className:
						'wp-block-ambrygen-testimonials ambry-testimonials',
				})}
			>
				{ /* Overlay Graphics */}
				<div className="ambry-testimonials__graphic-images">
					{overlayImage && (
						<div className="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
							<img
								src={overlayImage}
								srcSet={buildSrcSet(overlayImageSizes)}
								alt=""
								className="overlay__img"
								loading="lazy"
								decoding="async"
							/>
						</div>
					)}

					{ /* Secondary Image */}
					{secondaryImage && (
						<div className="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
							<img
								src={secondaryImage}
								srcSet={buildSrcSet(secondaryImageSizes)}
								className="overlay__img"
								alt=""
								loading="lazy"
								decoding="async"
							/>
						</div>
					)}
				</div>

				{ /* Heading */}
				<RichText.Content
					tagName={Tag}
					value={heading}
					className="ambry-testimonials__heading heading-3  mb-0"
				/>

				<div className="is-style-gl-s32"></div>

				{ /* Layout */}
				<div className="ambry-testimonials__layout">
					{ /* Testimonials */}

					<div className="ambry-testimonials__grid">
						{ /* Main Image */}
						<div className="ambry-testimonials__top-inner__image-block">
							{mainImage && (
								<img
									src={mainImage}
									srcSet={buildSrcSet(mainImageSizes)}
									className="ambry-testimonials__main-image"
									alt=""
									loading="lazy"
									decoding="async"
								/>
							)}
						</div>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</>
	);
}
