import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, Button } from '@wordpress/components';
import { dispatch } from '@wordpress/data';

function buildSrcSet( sizes ) {
	if ( ! sizes ) {
		return undefined;
	}
	return Object.values( sizes )
		.filter( ( size ) => size?.url && size?.width )
		.map( ( size ) => `${ size.url } ${ size.width }w` )
		.join( ', ' );
}

// Default image path
const DEFAULT_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter.jpg';

export default function Edit( { attributes, setAttributes } ) {
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

	const blockProps = useBlockProps( {
		style: {
			backgroundColor: backgroundColor || style?.color?.background,
			color: textColor,
			padding: '60px 20px',
		},
	} );

	const openInspector = () => {
		dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' );
	};

	const onSelectImage = ( img ) => {
		setAttributes( {
			image: img.url,
			imageId: img.id,
			imageAlt: img.alt || '',
			imageSizes: img.sizes || {},
		} );
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Newsletter Image', 'ambrygen-web' ) }>
					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant={
											image ? 'secondary' : 'primary'
										}
									>
										{ image
											? __(
													'Replace Image',
													'ambrygen-web'
											  )
											: __(
													'Upload Image',
													'ambrygen-web'
											  ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>

						{ image && (
							<Button
								isDestructive
								variant="link"
								onClick={ () =>
									setAttributes( {
										image: '',
										imageId: 0,
										imageAlt: '',
										imageSizes: {},
									} )
								}
							>
								{ __( 'Remove Image', 'ambrygen-web' ) }
							</Button>
						) }
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div className="newsletter-signup">
				<div className="newsletter-image">
					<button
						type="button"
						className="newsletter-image-button"
						onClick={ openInspector }
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' || e.key === ' ' ) {
								openInspector();
								e.preventDefault();
							}
						} }
						aria-label={ __(
							'Open block settings',
							'ambrygen-web'
						) }
						style={ { border: 0, background: 'none', padding: 0 } }
					>
						<img
							src={ displayImage }
							srcSet={ srcSet }
							sizes="(max-width: 768px) 100vw, 520px"
							alt={
								imageAlt ||
								__( 'Newsletter Image', 'ambrygen-web' )
							}
						/>
					</button>
				</div>

				<div className="newsletter-form-section">
					<RichText
						tagName="span"
						value={ eyebrow }
						onChange={ ( value ) =>
							setAttributes( { eyebrow: value } )
						}
						className="newsletter-eyebrow"
						placeholder={ __( 'Newsletter', 'ambrygen-web' ) }
					/>

					<RichText
						tagName="h3"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						className="newsletter-heading"
						placeholder={ __( 'Stay informed', 'ambrygen-web' ) }
					/>

					<RichText
						tagName="p"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						className="newsletter-description"
						placeholder={ __( 'Subscribe text…', 'ambrygen-web' ) }
					/>

					<div className="newsletter-form-placeholder">
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
