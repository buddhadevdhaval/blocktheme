import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	LinkControl,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
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

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		headingTag,
		content,
		imageUrl,
		imagePosition,
		layoutStyle,
		contentAlignment,
		buttons,
	} = attributes;
	const defaultPlaceholder = DEFAULT_IMAGES().placeholder;
	const resolvedImageUrl = imageUrl || defaultPlaceholder?.url || '';

	const blockProps = useBlockProps( {
		className: `iot-block  ${ layoutStyle } ${ imagePosition }`,
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
	const primaryButton = buttons?.[ 0 ] || {};
	const secondaryButton = buttons?.[ 1 ] || {};

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
					/>
					<ToggleControl
						label={ __( 'Show Image on Right', 'ambrygen-web' ) }
						checked={ imagePosition === 'left' }
						onChange={ ( value ) =>
							setAttributes( {
								imagePosition: value
									? 'left'
									: 'iot-block__rtl',
							} )
						}
					/>

					<ImageUploader
						url={ imageUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								imageUrl: media.url,
								imageId: media.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: 0,
							} )
						}
						label={ __( 'Block Image', 'ambrygen-web' ) }
					/>
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
								value={ { url: primaryButton.url || '' } }
								onChange={ ( value ) =>
									updateButton( 0, 'url', value.url )
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
									{ label: 'Dark', value: 'site-btn' },
								] }
								onChange={ ( value ) =>
									updateButton( 0, 'variant', value )
								}
							/>
						</div>
					</PanelRow>

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
								value={ { url: secondaryButton.url || '' } }
								onChange={ ( value ) =>
									updateButton( 1, 'url', value.url )
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
						<img src={ resolvedImageUrl } />
					</div>
				) }

				{ /* Fallback only if no uploaded image and no global default image */ }
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
						<RichText
							tagName={ headingTag || 'h2' }
							value={ heading }
							placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							className="heading-2 block-title mb-0"
						/>
						<div
							className="is-style-gl-s20"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="body1 iot-block__description"
							value={ content }
							onChange={ ( value ) =>
								setAttributes( { content: value } )
							}
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
						/>
					</div>
					{ buttons?.length > 0 && (
						<>
							<div
								className="is-style-gl-s24"
								aria-hidden="true"
							></div>

							<div className="iot-block__button">
								{ buttons.map(
									( button, index ) =>
										button.text &&
										button.url && (
											<a
												key={ index }
												href="#"
												className={ ` is-style-site-trailing-icon site-btn ${ button.variant }` }
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
