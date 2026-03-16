import { __ } from '@wordpress/i18n';
import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

import {
	ImageUploader,
	CtaButtonField,
	DEFAULT_IMAGES,
} from '../_shared/components';

export default function Edit( { attributes, setAttributes, context } ) {
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

	const defaultImage = DEFAULT_IMAGES().placeholder.url;
	const displayImage = imageUrl || defaultImage;

	const blockProps = useBlockProps( { className: 'card-col' } );

	const HeadingTag = headingTag || 'h5';
	const galleryVariation = context?.[ 'ambrygen/galleryVariation' ];
	//const showLearnMore = galleryVariation === 'image-content-grid';
	const showLearnMore =
		galleryVariation === 'image-content-grid' ||
		galleryVariation === 'variation-features'; // new variation

	const onSelectImage = ( media ) => {
		if ( ! media ) {
			return;
		}

		setAttributes( {
			imageID: media.id,
			imageUrl: media.url,
			imageAlt: media.alt || '',
			imageSrcSet: media.srcset || '',
			imageSizes: media.sizes || '',
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			imageID: 0,
			imageUrl: '',
			imageAlt: '',
			imageSrcSet: '',
			imageSizes: '',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Image Settings', 'ambrygen' ) }
					initialOpen
				>
					<ImageUploader
						label={ __( 'Card Image', 'ambrygen' ) }
						url={ imageUrl }
						onSelect={ onSelectImage }
						onRemove={ onRemoveImage }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Text & Link Settings', 'ambrygen' ) }>
					<SelectControl
						label={ __( 'Heading Tag', 'ambrygen' ) }
						value={ headingTag }
						options={ [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].map(
							( tag ) => ( {
								label: tag.toUpperCase(),
								value: tag,
							} )
						) }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
					<CtaButtonField
						label={ __( 'Link setting' ) }
						textLabel={ __( 'Link Text' ) }
						defaultVariant="primary"
						value={ link }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { link: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="image-block">
					<img
						src={ displayImage }
						srcSet={ imageSrcSet || undefined }
						sizes={ imageSizes || undefined }
						alt={ imageAlt || title || '' }
						loading="lazy"
					/>
				</div>

				<div className="card-info">
					{ /* { galleryVariation !== 'variation-features' && ( */ }
					<HeadingTag className="link-btn mb-0 heading-5">
						<RichText
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add title…', 'ambrygen' ) }
						/>
					</HeadingTag>
					{ /* ) } */ }

					<div
						className={ `card-description  ${
							galleryVariation !== 'default'
								? 'body2-reg'
								: 'text-small'
						}` }
					>
						<RichText
							tagName="p"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __( 'Add description…', 'ambrygen' ) }
						/>
					</div>

					{ showLearnMore && link?.text && (
						<>
							{ galleryVariation !== 'default' && (
								<div
									className="is-style-gl-s12"
									aria-hidden="true"
								></div>
							) }
							<div
								className={ `${
									galleryVariation === 'default'
										? 'card-cta'
										: 'card-cta-wrapper'
								}` }
							>
								<a
									href={ link.url || '#' }
									onClick={ ( e ) => e.preventDefault() }
									className="site-btn is-style-site-text-btn has-icon"
								>
									{ link.text ||
										__( 'Learn more', 'ambrygen' ) }
								</a>
							</div>
						</>
					) }
				</div>
			</div>
		</>
	);
}
