import { __ } from '@wordpress/i18n';
import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
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

	const blockProps = useBlockProps( { className: 'card-col' } );

	const HeadingTag = headingTag || 'h5';
	const galleryVariation = context?.[ 'ambrygen/galleryVariation' ];
	const hasLink = Boolean( link?.url );
	const showLearnMore =
		hasLink &&
		( galleryVariation === 'image-content-grid' ||
			galleryVariation === 'variation-features' );
	const isDefaultLinkedCard = galleryVariation === 'default' && hasLink;
	const WrapperTag = isDefaultLinkedCard ? 'a' : 'div';
	const wrapperProps = isDefaultLinkedCard
		? {
				...blockProps,
				href: link.url,
				onClick: ( event ) => event.preventDefault(),
		  }
		: blockProps;

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
					onChange={ ( value ) => setAttributes( { link: value } ) }
				/>
			</InspectorControls>

			<WrapperTag { ...wrapperProps }>
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
					<HeadingTag className="link-btn mb-0 heading-5">
						<RichText
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __(
								'Add subtitle…',
								'ambrygen-web'
							) }
						/>
					</HeadingTag>

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
							placeholder={ __(
								'Add short description…',
								'ambrygen-web'
							) }
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
