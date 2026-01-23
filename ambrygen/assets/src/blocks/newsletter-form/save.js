import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const DEFAULT_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter.jpg';

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
		description,
		image,
		imageAlt,
		imageSizes,
		backgroundColor = '#005E7F',
		textColor = '#8AD8F4',
		style,
	} = attributes;

	const displayImage = image || DEFAULT_IMAGE;
	const srcSet = buildSrcSet( imageSizes );

	const blockProps = useBlockProps.save( {
		style: {
			backgroundColor: backgroundColor || style?.color?.background,
			color: textColor,
			padding: '60px 20px',
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="newsletter-signup">
				<div className="newsletter-image">
					<img
						src={ displayImage }
						srcSet={ srcSet }
						sizes="(max-width: 768px) 100vw, 600px"
						alt={
							imageAlt || __( 'Newsletter Image', 'ambrygen-web' )
						}
						className="newsletter-img"
						loading="lazy"
						decoding="async"
					/>
				</div>

				<div className="newsletter-form-section">
					{ eyebrow && (
						<RichText.Content
							tagName="span"
							value={ eyebrow }
							className="newsletter-eyebrow"
						/>
					) }

					{ heading && (
						<RichText.Content
							tagName="h3"
							value={ heading }
							className="newsletter-heading"
						/>
					) }

					{ description && (
						<RichText.Content
							tagName="p"
							value={ description }
							className="newsletter-description"
						/>
					) }

					<div className="newsletter-form-placeholder">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
}
