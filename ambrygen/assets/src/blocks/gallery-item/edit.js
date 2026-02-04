import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	URLInput,
} from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl } from '@wordpress/components';

const buildSrcSet = ( sizes = {} ) =>
	Object.values( sizes )
		.filter( ( s ) => s?.source_url && s?.width )
		.map( ( s ) => `${ s.source_url } ${ s.width }w` )
		.join( ', ' );

export default function Edit( { attributes, setAttributes } ) {
	const {
		imageUrl,
		imageAlt,
		imageSrcSet,
		imageSizes,
		title,
		headingTag,
		description,
		link,
	} = attributes;

	const HeadingTag = headingTag || 'h5';

	const onSelectImage = ( media ) => {
		const sizes = media?.sizes || media?.media_details?.sizes || {};
		setAttributes( {
			imageUrl: media.url,
			imageAlt: media.alt || '',
			imageSrcSet: buildSrcSet( sizes ),
			imageSizes: '(max-width: 768px) 100vw, 33vw',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image Settings', 'ambrygen' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open }>
									{ imageUrl
										? __( 'Replace Image', 'ambrygen' )
										: __( 'Select Image', 'ambrygen' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					<SelectControl
						label={ __( 'Heading Tag', 'ambrygen' ) }
						value={ headingTag }
						options={ [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].map(
							( t ) => ( { label: t.toUpperCase(), value: t } )
						) }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>

					<URLInput
						label={ __( 'Link', 'ambrygen' ) }
						value={ link }
						onChange={ ( value ) =>
							setAttributes( { link: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() } className="card-col">
				{ imageUrl && (
					<div className="image-block">
						<img
							src={ imageUrl }
							srcSet={ imageSrcSet || undefined }
							sizes={ imageSizes || undefined }
							alt={ imageAlt || title }
							loading="lazy"
						/>
					</div>
				) }

				<div className="card-info">
					<HeadingTag className="link-btn mb-0">
						<RichText
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add title…', 'ambrygen' ) }
						/>
					</HeadingTag>

					<div className="card-description text-small">
						<RichText
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __( 'Add description…', 'ambrygen' ) }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
