import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import {
	ImageUploader,
	ImagePlaceholder,
	TagSelector,
} from '../_shared/components';
import { t } from '../_shared/utils';

export default function Edit( { attributes, setAttributes } ) {
	const {
		eyebrow,
		heading,
		headingTag = 'h2',
		description,
		image,
		overlayTopImage,
		overlayBottomImage,
		style,
	} = attributes;

	const resolvedOverlayTopImage = overlayTopImage;
	const resolvedOverlayBottomImage = overlayBottomImage;

	const blockProps = useBlockProps( {
		style: {
			backgroundColor: style?.color?.background,
			color: style?.color?.text,
			padding: '60px 20px',
		},
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				{ /* Newsletter Image */ }
				<PanelBody title={ t( 'Newsletter Image', 'ambrygen-web' ) }>
					<ImageUploader
						url={ image }
						onSelect={ ( img ) =>
							setAttributes( { image: img.url, imageId: img.id } )
						}
						onRemove={ () =>
							setAttributes( { image: '', imageId: 0 } )
						}
						label={ t( 'Newsletter Image', 'ambrygen-web' ) }
					/>
				</PanelBody>

				{ /* Heading Settings */ }
				<PanelBody title={ t( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ t( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>

				{ /* Overlay Images */ }
				<PanelBody title={ t( 'Overlay Images', 'ambrygen-web' ) }>
					<ImageUploader
						url={ overlayTopImage }
						onSelect={ ( img ) =>
							setAttributes( {
								overlayTopImage: img.url,
								overlayTopImageId: img.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								overlayTopImage: '',
								overlayTopImageId: 0,
							} )
						}
						label={ t( 'Top Overlay', 'ambrygen-web' ) }
					/>

					<ImageUploader
						url={ overlayBottomImage }
						onSelect={ ( img ) =>
							setAttributes( {
								overlayBottomImage: img.url,
								overlayBottomImageId: img.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								overlayBottomImage: '',
								overlayBottomImageId: 0,
							} )
						}
						label={ t( 'Bottom Overlay', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Editor Preview */ }
			<div className="newsletter newsletter-signup">
				<div className="newsletter__image-block">
					{ image ? (
						<img
							src={ image }
							alt={ t( 'Newsletter image', 'ambrygen-web' ) }
							className="newsletter__img"
							loading="lazy"
							decoding="async"
						/>
					) : (
						<ImagePlaceholder
							text={ t(
								'No newsletter image set',
								'ambrygen-web'
							) }
						/>
					) }

					{ /* Decorative overlays */ }
					{ resolvedOverlayTopImage && (
						<div
							className="newsletter__image-block__overlay newsletter__image-block__overlay-top"
							aria-hidden="true"
						>
							<img
								src={ resolvedOverlayTopImage }
								alt=""
								className="overlay__img"
								aria-hidden="true"
							/>
						</div>
					) }

					{ resolvedOverlayBottomImage && (
						<div
							className="newsletter__image-block__overlay newsletter__image-block__overlay-bottom"
							aria-hidden="true"
						>
							<img
								src={ resolvedOverlayBottomImage }
								alt=""
								className="overlay__img"
								aria-hidden="true"
							/>
						</div>
					) }
				</div>

				<div className="newsletter__content-block">
					{ eyebrow && (
						<RichText
							tagName="div"
							value={ eyebrow }
							onChange={ ( value ) =>
								setAttributes( { eyebrow: value } )
							}
							className="newsletter__content-block__eyebrow-text eyebrow"
							placeholder={ t( 'Newsletter', 'ambrygen-web' ) }
						/>
					) }

					<div className="is-style-gl-s12" aria-hidden="true" />

					{ heading && (
						<RichText
							tagName={ headingTag }
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							className="newsletter__content-block__heading heading-3 mb-0"
							placeholder={ t( 'Stay informed', 'ambrygen-web' ) }
						/>
					) }

					<div className="is-style-gl-s12" aria-hidden="true" />

					{ description && (
						<RichText
							tagName="div"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							className="newsletter__content-block__description-text text-medium block-description"
							placeholder={ t(
								'Subscribe text…',
								'ambrygen-web'
							) }
						/>
					) }

					<div
						className="newsletter-form-placeholder"
						aria-label={ t(
							'Newsletter signup form',
							'ambrygen-web'
						) }
					>
						<InnerBlocks
							allowedBlocks={ [
								'gravityforms/form',
								'core/shortcode',
								'core/html',
							] }
							templateLock={ false }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
