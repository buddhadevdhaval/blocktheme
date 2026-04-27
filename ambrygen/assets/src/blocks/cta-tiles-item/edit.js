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
	TagSelector,
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

	const defaultImages = useMemo( () => DEFAULT_IMAGES(), [] );
	const defaultImage = defaultImages.placeholder.url;
	const displayImage = imageUrl || defaultImage;
	const titleText = decodeEntities( title?.replace( /<[^>]+>/g, '' ) || '' );

	const blockProps = useBlockProps( { className: 'card-col' } );

	const HeadingTag = headingTag || 'h5';
	const ctaTilesVariation = context?.[ 'ambrygen/ctaTilesVariation' ];
	const hasLink = Boolean( link?.url );
	const hasDescription = Boolean( description );
	const showLearnMore =
		hasLink &&
		( ctaTilesVariation === 'image-title-description-icon' ||
			ctaTilesVariation === 'image-title-description' );
	const isDefaultLinkedCard =
		ctaTilesVariation === 'image-only-title' && hasLink;
	const WrapperTag = isDefaultLinkedCard ? 'a' : 'div';
	const wrapperProps = isDefaultLinkedCard
		? {
				...blockProps,
				href: link.url,
				onClick: ( event ) => event.preventDefault(),
		  }
		: blockProps;

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
					initialOpen
				>
					<div className="cta-tiles-item-sidebar">
						<ImageUploader
							label={ __( 'Card Image', 'ambrygen-web' ) }
							url={ imageUrl }
							onSelect={ onSelectImage }
							onRemove={ onRemoveImage }
						/>

						<TagSelector
							label={ __( 'Heading Tag', 'ambrygen-web' ) }
							value={ headingTag || 'h5' }
							onChange={ ( value ) =>
								setAttributes( { headingTag: value } )
							}
							type="heading"
						/>
						<CtaButtonField
							label={ __( 'Link setting', 'ambrygen-web' ) }
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
					<HeadingTag className="link-btn mb-0 heading-5">
						<RichText
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add Title…', 'ambrygen-web' ) }
						/>
					</HeadingTag>

					<div
						className={ `card-description  ${
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
							{ hasDescription &&
								ctaTilesVariation !== 'image-only-title' && (
									<div
										className="is-style-gl-s12"
										aria-hidden="true"
									></div>
								) }
							<div
								className={ `${
									ctaTilesVariation === 'image-only-title'
										? 'card-cta'
										: 'card-cta-wrapper'
								}` }
							>
								<a
									href={ link.url || '#' }
									onClick={ ( e ) => e.preventDefault() }
									className="site-btn is-style-site-text-btn has-right-arrow"
								>
									{ link.text ||
										titleText ||
										__( 'Learn more', 'ambrygen-web' ) }
								</a>
							</div>
						</>
					) }
				</div>
			</WrapperTag>
		</>
	);
}
