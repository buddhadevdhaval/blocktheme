import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	LinkControl,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Fragment, useEffect, useMemo } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	Placeholder,
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import {
	ImageUploader,
	TagSelector,
	DEFAULT_IMAGES,
} from '../_shared/components';

const ALLOWED_CONTENT_BLOCKS = [
	'core/paragraph',
	'core/list',
	'core/buttons',
	'core/spacer',
];

const CONTENT_TEMPLATE = [ [ 'core/paragraph' ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		heading,
		subheading,
		eyebrowText,
		headingTag,
		content,
		imageUrl,
		imageAlt,
		backgroundImageUrl,
		topIconUrl,
		imagePosition,
		layoutStyle,
		contentAlignment,
		contentTopAlign,
		variation,
		buttons,
		borderRequired,
		isOriginalImage,
	} = attributes;
	const currentImagePosition = imagePosition || 'right';

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const isImageRight =
		currentImagePosition === 'right' ||
		currentImagePosition === 'iot-block__rtl';
	const imagePositionClass = isImageRight ? 'iot-block__rtl' : '';

	const defaultPlaceholder = useMemo(
		() => DEFAULT_IMAGES().placeholder,
		[]
	);
	const resolvedImageUrl = imageUrl || defaultPlaceholder?.url || '';

	const borderClass = borderRequired ? 'iot-block--border' : '';
	const topAlignClass = contentTopAlign ? 'has-top-align' : '';
	const variationClass =
		variation && variation !== 'default' ? variation : '';
	const headingClass =
		variation === 'variation-iot-author' ? 'heading-4' : 'heading-2';
	const originalImageClass = isOriginalImage ? 'orignal-image' : '';

	const blockProps = useBlockProps( {
		className: `iot-block ${ layoutStyle } ${ imagePositionClass } ${ borderClass } ${ topAlignClass } ${ variationClass } ${ originalImageClass }`,
		style: {
			'--content-alignment': contentAlignment,
		},
	} );

	const updateButton = ( index, field, value ) => {
		const newButtons = Array.isArray( buttons ) ? [ ...buttons ] : [];
		newButtons[ index ] = {
			...newButtons[ index ],
			[ field ]: value,
		};
		setAttributes( { buttons: newButtons } );
	};
	const updateButtonFields = ( index, values ) => {
		const newButtons = Array.isArray( buttons ) ? [ ...buttons ] : [];
		newButtons[ index ] = {
			...newButtons[ index ],
			...values,
		};
		setAttributes( { buttons: newButtons } );
	};
	const primaryButton = buttons?.[ 0 ] || {};
	const secondaryButton = buttons?.[ 1 ] || {};
	const hasButtons =
		Array.isArray( buttons ) &&
		buttons.some( ( button ) => button.text && button.url );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Content Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
					<ToggleControl
						label={ __( 'Show Image on right', 'ambrygen-web' ) }
						checked={ isImageRight }
						onChange={ ( value ) =>
							setAttributes( {
								imagePosition: value ? 'right' : 'left',
							} )
						}
					/>

					<ToggleControl
						label={ __( 'Image on Border', 'ambrygen-web' ) }
						checked={ borderRequired || false }
						onChange={ ( value ) =>
							setAttributes( { borderRequired: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Top Align Content', 'ambrygen-web' ) }
						checked={ !! contentTopAlign }
						onChange={ ( value ) =>
							setAttributes( { contentTopAlign: value } )
						}
					/>
					<SelectControl
						label={ __( 'Variation', 'ambrygen-web' ) }
						value={ variation || 'default' }
						options={ [
							{
								label: __( 'Default', 'ambrygen-web' ),
								value: 'default',
							},
							{
								label: __( 'Ordering Process', 'ambrygen-web' ),
								value: 'variation-process',
							},
							{
								label: __( 'IOT Author', 'ambrygen-web' ),
								value: 'variation-iot-author',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { variation: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show original image', 'ambrygen-web' ) }
						checked={ isOriginalImage }
						onChange={ ( value ) =>
							setAttributes( { isOriginalImage: value } )
						}
					/>

					<ImageUploader
						url={ imageUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								imageUrl: media.url,
								imageId: media.id,
								imageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: 0,
								imageAlt: '',
							} )
						}
						label={ __( 'Block Image', 'ambrygen-web' ) }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Asset Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<ImageUploader
						url={ backgroundImageUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								backgroundImageUrl: media.url,
								backgroundImageId: media.id,
								backgroundImageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								backgroundImageUrl: '',
								backgroundImageId: 0,
								backgroundImageAlt: '',
							} )
						}
						label={ __( 'Background Image', 'ambrygen-web' ) }
					/>
					<ImageUploader
						url={ topIconUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								topIconUrl: media.url,
								topIconId: media.id,
								topIconAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								topIconUrl: '',
								topIconId: 0,
								topIconAlt: '',
							} )
						}
						label={ __( 'Content top icon', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<PanelRow>
						<div style={ { width: '100%' } }>
							<strong>
								{ __( 'Primary Button', 'ambrygen-web' ) }
							</strong>

							<TextControl
								label={ __( 'Text', 'ambrygen-web' ) }
								value={ primaryButton.text || '' }
								onChange={ ( value ) =>
									updateButton( 0, 'text', value )
								}
							/>

							<LinkControl
								value={ {
									url: primaryButton.url || '',
									opensInNewTab:
										primaryButton.target === '_blank',
								} }
								onChange={ ( value ) =>
									updateButtonFields( 0, {
										url: value.url,
										target: value.opensInNewTab
											? '_blank'
											: '',
										rel: value.opensInNewTab
											? 'noopener noreferrer'
											: '',
									} )
								}
							/>

							<SelectControl
								label={ __( 'Button Style', 'ambrygen-web' ) }
								value={ primaryButton.variant || 'site-btn' }
								options={ [
									{
										label: 'Light',
										value: 'site-btn is-style-site-tertiary-btn',
									},
									{
										label: 'Text Button',
										value: 'site-btn is-style-site-text-btn has-right-arrow',
									},
									{ label: 'Dark', value: 'site-btn' },
								] }
								onChange={ ( value ) =>
									updateButton( 0, 'variant', value )
								}
							/>
						</div>
					</PanelRow>

					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<PanelRow>
						<div style={ { width: '100%' } }>
							<strong>
								{ __( 'Secondary Button', 'ambrygen-web' ) }
							</strong>

							<TextControl
								label={ __( 'Text', 'ambrygen-web' ) }
								value={ secondaryButton.text || '' }
								onChange={ ( value ) =>
									updateButton( 1, 'text', value )
								}
							/>

							<LinkControl
								value={ {
									url: secondaryButton.url || '',
									opensInNewTab:
										secondaryButton.target === '_blank',
								} }
								onChange={ ( value ) =>
									updateButtonFields( 1, {
										url: value.url,
										target: value.opensInNewTab
											? '_blank'
											: '',
										rel: value.opensInNewTab
											? 'noopener noreferrer'
											: '',
									} )
								}
							/>

							<SelectControl
								label={ __( 'Variant', 'ambrygen-web' ) }
								value={
									secondaryButton.variant ||
									'site-btn is-style-site-tertiary-btn'
								}
								options={ [
									{
										label: 'Light',
										value: 'site-btn is-style-site-tertiary-btn',
									},
									{
										label: 'Text Button',
										value: 'site-btn is-style-site-text-btn has-right-arrow',
									},
									{ label: 'Dark', value: 'site-btn' },
								] }
								onChange={ ( value ) =>
									updateButton( 1, 'variant', value )
								}
							/>
						</div>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ resolvedImageUrl && (
					<div className="iot-block__image">
						<img src={ resolvedImageUrl } alt={ imageAlt || '' } />
					</div>
				) }

				{ ! imageUrl && ! defaultPlaceholder?.url && (
					<Placeholder
						icon="format-image"
						label={ __( 'No image selected', 'ambrygen-web' ) }
						instructions={ __(
							'Upload an image from the sidebar settings.',
							'ambrygen-web'
						) }
					/>
				) }

				<div className="iot-block__content">
					{ /* Text content */ }
					<div
						className="iot-block__text"
						style={ { textAlign: contentAlignment } }
					>
						{ topIconUrl && (
							<>
								<div className="iot-block__top-icon">
									<img src={ topIconUrl } alt="" />
								</div>
								<div
									className="is-style-gl-s16"
									aria-hidden="true"
								></div>
							</>
						) }
						{ variation === 'variation-iot-author' && (
							<>
								<RichText
									tagName="div"
									className="iot-block__tagline"
									value={ eyebrowText }
									onChange={ ( value ) =>
										setAttributes( { eyebrowText: value } )
									}
									placeholder={ __(
										'Add eyebrow text',
										'ambrygen-web'
									) }
									allowedFormats={ [ 'core/text-color' ] }
								/>
								<div
									className="is-style-gl-s8"
									aria-hidden="true"
								></div>
							</>
						) }
						<RichText
							tagName={ headingTag || 'h2' }
							value={ heading }
							placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							className={ `${ headingClass } block-title mb-0` }
						/>
						<div
							className="is-style-gl-s4"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="block-sub-heading iot-block__sub-heading subtitle2-sbold js-gsap-fade"
							value={ subheading }
							onChange={ ( value ) =>
								setAttributes( { subheading: value } )
							}
							placeholder={ __(
								'Add subheading',
								'ambrygen-web'
							) }
						/>
						<div
							className="is-style-gl-s20"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="block-description body1 iot-block__description"
							value={ content }
							onChange={ ( value ) =>
								setAttributes( { content: value } )
							}
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
						/>
						<div className="iot-block__extra-content">
							<InnerBlocks
								allowedBlocks={ ALLOWED_CONTENT_BLOCKS }
								template={ CONTENT_TEMPLATE }
								templateLock={ false }
							/>
						</div>
					</div>
					{ hasButtons && (
						<>
							<div
								className="is-style-gl-s24"
								aria-hidden="true"
							></div>

							<div className="iot-block__button  two-btn-row">
								{ buttons.map(
									( button, index ) =>
										button.text &&
										button.url && (
											<a
												key={ index }
												href={ button.url }
												target={
													button.target || undefined
												}
												rel={ button.rel || undefined }
												className={ ` site-btn has-right-arrow ${ button.variant }` }
											>
												{ button.text }
											</a>
										)
								) }
							</div>
						</>
					) }
				</div>
			</div>
		</Fragment>
	);
}
