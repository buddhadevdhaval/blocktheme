import { __ } from '@wordpress/i18n';
import { RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

import {
	ImagePlaceholder,
	ImageUploader,
	CtaButtonField,
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
			imageID: null,
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

			<div className="card-col">
				{ imageUrl ? (
					<div className="image-block">
						<img
							src={ imageUrl }
							srcSet={ imageSrcSet || undefined }
							sizes={ imageSizes || undefined }
							alt={ imageAlt || title || '' }
							loading="lazy"
						/>
					</div>
				) : (
					<ImagePlaceholder
						label={ __( 'No logo selected', 'ambrygen' ) }
						minHeight="500px"
					/>
				) }

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
							galleryVariation !== 'two-column'
								? 'body2-reg'
								: 'text-small'
						}` }
					>
						<RichText
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __( 'Add description…', 'ambrygen' ) }
						/>
					</div>

					{ showLearnMore && link?.text && (
						<>
							{ galleryVariation !== 'two-column' && (
								<div
									className="is-style-gl-s12"
									aria-hidden="true"
								></div>
							) }
							<div
								className={ `${
									galleryVariation === 'two-column'
										? 'card-cta'
										: 'card-cta-wrapper'
								}` }
							>
								<span className="learn-more-btn link-btn">
									{ link.text ||
										__( 'Learn more', 'ambrygen' ) }
								</span>
							</div>
						</>
					) }
				</div>
			</div>
		</>
	);
}
