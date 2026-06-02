import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
} from '@wordpress/components';
import {
	ImageUploader,
	DEFAULT_IMAGES,
	TagSelector,
	CtaButtonField,
	BlockVariationsExamplePreview,
} from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useUniqueBlockId } from '../_shared/hooks';
import { getThemeAssetUrl } from '../../utils/assets';

const CONTACT_INFO_FORM_VARIATIONS = {
	INFO: 'info-view',
	FORM: 'form-view',
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		variation = '',
		eyebrow,
		heading,
		headingTag = 'h2',
		description,
		phoneNumber = '',
		emailAddress = '',
		buttonText = '',
		buttonUrl = '',
		cta = {},
		image,
		imageAlt,
		overlayTopImage,
		overlayBottomImage,
	} = attributes;

	const phoneIconUrl = getThemeAssetUrl( '/assets/src/images/phone-icon.svg' );
	const mailIconUrl = getThemeAssetUrl( '/assets/src/images/mail-icon.svg' );

	const blockProps = useBlockProps();
	const currentBlock = useSelect(
		( select ) => select( 'core/block-editor' ).getBlock( clientId ),
		[ clientId ]
	);
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const variants = useMemo(
		() => [
			{
				label: __( 'Info View', 'ambrygen-web' ),
				value: CONTACT_INFO_FORM_VARIATIONS.INFO,
				image: getThemeAssetUrl(
					'/assets/src/images/contact-info/info-var.png'
				),
			},
			{
				label: __( 'Form View', 'ambrygen-web' ),
				value: CONTACT_INFO_FORM_VARIATIONS.FORM,
				image: getThemeAssetUrl(
					'/assets/src/images/contact-info/form-var.png'
				),
			},
		],
		[]
	);

	const defaultImage = defaults?.placeholder || {};
	const displayImage = image || defaultImage.url || '';
	const displayImageAlt = image ? imageAlt || '' : defaultImage.alt || '';
	const phoneHref = phoneNumber.replace( /[^0-9+]/g, '' );
	const hasEyebrow = Boolean( eyebrow );
	const hasHeading = Boolean( heading );
	const hasDescription = Boolean( description );
	const hasShortcodeBlock = currentBlock?.innerBlocks?.some(
		( innerBlock ) => innerBlock?.name === 'core/shortcode'
	);
	const hasInfoContent = Boolean(
		phoneNumber || emailAddress || cta?.text || buttonText
	);
	const normalizedVariation =
		variation ||
		(hasShortcodeBlock && !hasInfoContent
			? CONTACT_INFO_FORM_VARIATIONS.FORM
			: CONTACT_INFO_FORM_VARIATIONS.INFO);
	const isInfoView =
		normalizedVariation === CONTACT_INFO_FORM_VARIATIONS.INFO;
	const isFormView =
		normalizedVariation === CONTACT_INFO_FORM_VARIATIONS.FORM;
	const ctaValue = {
		text: cta?.text || buttonText || '',
		url: cta?.url || buttonUrl || '',
		target: cta?.target || '',
		rel: cta?.rel || '',
	};
	const ctaRel =
		ctaValue.target === '_blank'
			? [ ctaValue.rel, 'noopener', 'noreferrer' ]
					.filter( Boolean )
					.join( ' ' )
			: ctaValue.rel;
	const hasInfoListing = isInfoView && ( phoneNumber || emailAddress );
	const hasCta = isInfoView && ctaValue.text && ctaValue.url;
	const hasTextContent = hasEyebrow || hasHeading || hasDescription;
	const isExample = blockId === 'contact-info-form-example';

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
	} );

	useEffect( () => {
		if ( ! variation ) {
			setAttributes( {
				variation: normalizedVariation,
			} );
		}
	}, [ variation, normalizedVariation, setAttributes ] );

	if ( isExample ) {
		return (
			<BlockVariationsExamplePreview
				variants={ variants }
				className="cta-tiles-example-preview"
				itemClass="cta-tiles-example-preview__item"
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Layout Variation', 'ambrygen-web' ) }>
					<div className="layout-variant-selector">
						{ variants.map( ( item ) => (
							<button
								key={ item.value }
								type="button"
								className={ `variant-button ${
									normalizedVariation === item.value
										? 'is-selected'
										: ''
								}` }
								aria-pressed={
									normalizedVariation === item.value
								}
								onClick={ () =>
									setAttributes( {
										variation: item.value,
									} )
								}
							>
								<img
									src={ item.image }
									alt=""
									aria-hidden="true"
								/>
								<span>{ item.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) } initialOpen={ false }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						type="heading"
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Content Settings', 'ambrygen-web' ) } initialOpen={ true }>
					<ImageUploader
						url={ image }
						onSelect={ ( img ) =>
							setAttributes( {
								image: img.url,
								imageId: img.id,
								imageAlt: img.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								image: '',
								imageId: 0,
								imageAlt: '',
							} )
						}
						label={ __( 'Image', 'ambrygen-web' ) }
					/>
					{ isInfoView && (
						<>
							<TextControl
								label={ __( 'Phone Number', 'ambrygen-web' ) }
								value={ phoneNumber }
								onChange={ ( value ) =>
									setAttributes( {
										phoneNumber: value || '',
									} )
								}
							/>
							<TextControl
								type="email"
								label={ __( 'Email Address', 'ambrygen-web' ) }
								value={ emailAddress }
								onChange={ ( value ) =>
									setAttributes( {
										emailAddress: value || '',
									} )
								}
							/>
							<CtaButtonField
								label={ __( '', 'ambrygen-web' ) }
								value={ ctaValue }
								showVariant={ false }
								onChange={ ( value ) =>
									setAttributes( {
										cta: value,
										buttonText:
											value?.text || '',
										buttonUrl:
											value?.url || '',
									} )
								}
							/>
						</>
					) }
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
						label={ __( 'Top Overlay Image', 'ambrygen-web' ) }
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
						label={ __( 'Bottom Overlay Image', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div className="newsletter newsletter-signup block-layout">
				<div className="newsletter__image-block">
					{ displayImage && (
						<img
							src={ displayImage }
							alt={ displayImageAlt }
							className="newsletter__img"
							loading="lazy"
							decoding="async"
						/>
					) }

					{ overlayTopImage && (
						<div
							className="newsletter__image-block__overlay newsletter__image-block__overlay-top"
							aria-hidden="true"
						>
							<img
								src={ overlayTopImage }
								alt=""
								className="overlay__img"
								aria-hidden="true"
							/>
						</div>
					) }

					{ overlayBottomImage && (
						<div
							className="newsletter__image-block__overlay newsletter__image-block__overlay-bottom"
							aria-hidden="true"
						>
							<img
								src={ overlayBottomImage }
								alt=""
								className="overlay__img"
								aria-hidden="true"
							/>
						</div>
					) }
				</div>

				<div className="newsletter__content-block">
					<RichText
						tagName="div"
						value={ eyebrow }
						allowedFormats={ [ 'core/text-color' ] }
						onChange={ ( value ) =>
							setAttributes( { eyebrow: value } )
						}
						className="newsletter__content-block__eyebrow-text eyebrow hero-kicker"
						placeholder={ __(
							'Add Eyebrow...',
							'ambrygen-web'
						) }
					/>

					<div
						className="is-style-gl-s12"
						aria-hidden="true"
					/>

					<RichText
						tagName={ headingTag }
						value={ heading }
						allowedFormats={ [ 'core/text-color' ] }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						className="newsletter__content-block__heading heading-3 mb-0"
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>

					<div
						className="is-style-gl-s12"
						aria-hidden="true"
					/>

					<RichText
						tagName="div"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						className="newsletter__content-block__description-text text-medium block-description"
						placeholder={ __( 'Add Description...', 'ambrygen-web' ) }
					/>

					{ hasInfoListing && (
						<>
							<div
								className="is-style-gl-s36"
								aria-hidden="true"
							/>
							<div className="newsletter__info-listing">
								{ phoneNumber && phoneHref && (
									<div className="newsletter__info-listing__item">
										<div
											className="newsletter__info-listing__item__icon"
											aria-hidden="true"
										>
											<img
												src={ phoneIconUrl }
												alt=""
											/>
										</div>
										<div className="newsletter__info-listing__item__text text-medium">
											<a href={ `tel:${ phoneHref }` }>
												{ phoneNumber }
											</a>
										</div>
									</div>
								) }
								{ emailAddress && (
									<div className="newsletter__info-listing__item">
										<div
											className="newsletter__info-listing__item__icon"
											aria-hidden="true"
										>
											<img
												src={ mailIconUrl }
												alt=""
											/>
										</div>
										<div className="newsletter__info-listing__item__text text-medium">
											<a
												href={ `mailto:${ emailAddress }` }
											>
												{ emailAddress }
											</a>
										</div>
									</div>
								) }
							</div>
						</>
					) }

					{ hasCta && (
						<>
							<div
								className="is-style-gl-s36"
								aria-hidden="true"
							/>
							<div className="newsletter__block__button-wrapper">
								<a
									className="site-btn is-style-site-secondary-btn  has-right-arrow"
									href={ ctaValue.url }
									target={ ctaValue.target || undefined }
									rel={ ctaRel || undefined }
								>
									{ ctaValue.text }
								</a>
							</div>
						</>
					) }

					{ isFormView && (
						<>
							<div
								className="is-style-gl-s12"
								aria-hidden="true"
							/>
							<div
								className="newsletter-form-placeholder"
								role="group"
								aria-label={ __(
									'Contact info form',
									'ambrygen-web'
								) }
							>
								<InnerBlocks
									allowedBlocks={ [ 'core/shortcode' ] }
									templateLock={ false }
								/>
							</div>
						</>
					) }
				</div>
			</div>
		</div>
	);
}
