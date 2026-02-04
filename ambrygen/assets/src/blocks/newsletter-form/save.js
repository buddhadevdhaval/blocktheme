import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const DEFAULT_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter.jpg';
const DEFAULT_OVERLAY_TOP =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-top.svg';
const DEFAULT_OVERLAY_BOTTOM =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-bottom.svg';

function buildSrcSet( sizes ) {
	if ( ! sizes ) {
		return undefined;
	}
	return Object.values( sizes )
		.filter( ( size ) => size?.url && size?.width )
		.map( ( size ) => `${ size.url } ${ size.width }w` )
		.join( ', ' );
}

export default function Save( { attributes } ) {
	const {
		eyebrow,
		heading,
		headingTag = 'h2',
		description,
		image,
		imageAlt = '',
		imageSizes,
		overlayTopImage = DEFAULT_OVERLAY_TOP,
		overlayBottomImage = DEFAULT_OVERLAY_BOTTOM,
		backgroundColor = '',
		textColor = '',
		style,
	} = attributes;

	const displayImage = image || DEFAULT_IMAGE;
	const srcSet = buildSrcSet( imageSizes );

	const blockProps = useBlockProps.save( {
		style: {
			backgroundColor: backgroundColor || style?.color?.background,
			color: textColor,
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="newsletter newsletter-signup">
				{ /* Image Section */ }
				<div className="newsletter__image-block">
					<img
						src={ displayImage }
						srcSet={ srcSet || undefined }
						sizes="(max-width: 768px) 100vw, 600px"
						alt={
							imageAlt || __( 'Newsletter Image', 'ambrygen-web' )
						}
						className="newsletter__img"
						loading="lazy"
						decoding="async"
					/>

					{ /* Overlay Top */ }
					{ overlayTopImage && (
						<div className="newsletter__image-block__overlay newsletter__image-block__overlay-top">
							<img
								src={ overlayTopImage }
								srcSet={
									overlayTopImage.endsWith( '.svg' )
										? undefined
										: overlayTopImage
								}
								alt={ __( 'Overlay Top', 'ambrygen-web' ) }
								className="overlay__img"
								loading="lazy"
								decoding="async"
							/>
						</div>
					) }

					{ /* Overlay Bottom */ }
					{ overlayBottomImage && (
						<div className="newsletter__image-block__overlay newsletter__image-block__overlay-bottom">
							<img
								src={ overlayBottomImage }
								srcSet={
									overlayBottomImage.endsWith( '.svg' )
										? undefined
										: overlayBottomImage
								}
								alt={ __( 'Overlay Bottom', 'ambrygen-web' ) }
								className="overlay__img"
								loading="lazy"
								decoding="async"
							/>
						</div>
					) }
				</div>

				{ /* Content Section */ }
				<div className="newsletter__content-block">
					{ /* Eyebrow */ }
					{ eyebrow && (
						<RichText.Content
							tagName="span"
							value={ eyebrow }
							className="newsletter__content-block__eyebrow-text eyebrow"
						/>
					) }

					<div className="is-style-gl-s12"></div>

					{ /* Heading */ }
					{ heading && (
						<RichText.Content
							tagName={ headingTag }
							value={ heading }
							className="newsletter__content-block__heading heading-3 mb-0"
						/>
					) }

					<div className="is-style-gl-s12"></div>

					<div className="newsletter__content-block__description text-medium">
						{ /* Description */ }
						{ description && (
							<RichText.Content
								tagName="p"
								value={ description }
								className="newsletter__content-block__description-text"
							/>
						) }
					</div>

					{ /* Form Slot */ }
					<div className="newsletter-form-placeholder">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
}
