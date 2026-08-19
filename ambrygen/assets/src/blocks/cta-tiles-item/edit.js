import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

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
		description,
		link,
	} = attributes;

	const defaultImages = useMemo( () => DEFAULT_IMAGES(), [] );
	const defaultImage = defaultImages.placeholder.url;
	const displayImage = imageUrl || defaultImage;
	const titleText = decodeEntities( title?.replace( /<[^>]+>/g, '' ) || '' );

	const blockProps = useBlockProps( { className: 'card-col' } );

	const ctaTilesVariation = context?.[ 'ambrygen/ctaTilesVariation' ];
	const hasLink = Boolean( link?.url );
	const showLearnMore =
		hasLink &&
		( ctaTilesVariation === 'image-title-description-icon' ||
			ctaTilesVariation === 'image-title-description' );
	const WrapperTag = 'div';
	const wrapperProps = blockProps;

	const onSelectImage = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			imageID: media.id || 0,
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
					title={ __( 'Tiles Item Settings', 'ambrygen-web' ) }
				>
					<div className="cta-tiles-item-sidebar">
						<ImageUploader
							label={ __( 'Card Image', 'ambrygen-web' ) }
							url={ imageUrl }
							onSelect={ onSelectImage }
							onRemove={ onRemoveImage }
						/>

						<CtaButtonField
							label={ __( '', 'ambrygen-web' ) }
							textLabel={ __( 'Link Text', 'ambrygen-web' ) }
							defaultVariant="primary"
							value={ link }
							showVariant={ false }
							onChange={ ( value ) =>
								setAttributes( { link: value } )
							}
						/>
					</div>
				</PanelBody>
			</InspectorControls>

			<WrapperTag { ...wrapperProps }>
				<div className="image-block">
					<img
						src={ displayImage }
						srcSet={ imageSrcSet || undefined }
						sizes={ imageSizes || undefined }
						alt={ imageAlt || titleText }
						loading="lazy"
					/>
				</div>

				<div className="card-info">
					<div className="link-btn mb-0 heading-5 block-inside-title">
						<RichText
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add Title…', 'ambrygen-web' ) }
						/>
					</div>

					<div
						className={ `card-description block-inside-description  ${
							ctaTilesVariation !== 'image-only-title'
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
							placeholder={ __(
								'Add Short Description…',
								'ambrygen-web'
							) }
						/>
					</div>

					{ showLearnMore && (
						<>
							<div
								className={ `${
									ctaTilesVariation === 'image-only-title'
										? 'card-cta'
										: 'card-cta-wrapper'
								}` }
							>
								<div className="site-btn is-style-site-text-btn has-right-arrow">
									{ link.text ||
										titleText ||
										__( 'Learn more', 'ambrygen-web' ) }
								</div>
							</div>
						</>
					) }
				</div>
			</WrapperTag>
		</>
	);
}
