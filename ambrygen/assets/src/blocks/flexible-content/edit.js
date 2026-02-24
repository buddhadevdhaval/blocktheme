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
	RadioControl,
	TextControl,
} from '@wordpress/components';
import { ImageUploader, TagSelector } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		headingTag,
		content,
		imageUrl,
		imageAlt,
		imagePosition,
		layoutStyle,
		contentAlignment,
		buttons,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `iot-block ${ layoutStyle } ${ imagePosition }`,
		style: {
			'--content-alignment': contentAlignment,
		},
	} );

	const updateButton = ( index, field, value ) => {
		const newButtons = [ ...buttons ];
		newButtons[ index ] = {
			...newButtons[ index ],
			[ field ]: value,
		};
		setAttributes( { buttons: newButtons } );
	};

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

					<SelectControl
						label={ __( 'Content Alignment', 'ambrygen-web' ) }
						value={ contentAlignment }
						options={ [
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' },
						] }
						onChange={ ( value ) =>
							setAttributes( { contentAlignment: value } )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout Settings', 'ambrygen-web' ) }>
					<RadioControl
						label={ __( 'Layout Style', 'ambrygen-web' ) }
						selected={ layoutStyle }
						options={ [
							{ label: 'Standard', value: 'standard' },
							{ label: 'Overlap', value: 'overlap' },
							{ label: 'Stacked', value: 'stacked' },
						] }
						onChange={ ( value ) =>
							setAttributes( { layoutStyle: value } )
						}
					/>

					<ToggleControl
						label={ __( 'Show Image on Right', 'ambrygen-web' ) }
						checked={ imagePosition === 'iot-block__rtl' }
						onChange={ ( value ) =>
							setAttributes( {
								imagePosition: value
									? 'iot-block__rtl'
									: 'right',
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Image', 'ambrygen-web' ) }
					initialOpen={ false }
				>
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
					title={ __( 'Buttons', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ buttons.map( ( button, index ) => (
						<PanelRow key={ index }>
							<div style={ { width: '100%' } }>
								<strong>
									{ __( 'Button', 'ambrygen-web' ) }{ ' ' }
									{ index + 1 }
								</strong>

								<TextControl
									label={ __( 'Text', 'ambrygen-web' ) }
									value={ button.text }
									onChange={ ( value ) =>
										updateButton( index, 'text', value )
									}
								/>

								<LinkControl
									value={ { url: button.url } }
									onChange={ ( value ) =>
										updateButton( index, 'url', value.url )
									}
								/>

								<SelectControl
									label={ __( 'Variant', 'ambrygen-web' ) }
									value={ button.variant }
									options={ [
										{
											label: 'Light',
											value: 'site-btn is-style-site-tertiary-btn',
										},
										{ label: 'Dark', value: 'site-btn' },
									] }
									onChange={ ( value ) =>
										updateButton( index, 'variant', value )
									}
								/>
							</div>
						</PanelRow>
					) ) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="iot-block__content">
					{ /* Left image */ }
					{ imagePosition === 'iot-block__rtl' && imageUrl && (
						<div className="iot-block__image iot-block__rtl">
							<img
								src={ imageUrl }
								alt={ imageAlt || heading || undefined }
								style={ { maxWidth: '100%', height: 'auto' } }
							/>
						</div>
					) }

					{ /* Text content */ }
					<div
						className="iot-block__text"
						style={ { textAlign: contentAlignment } }
					>
						<RichText
							tagName={ headingTag }
							value={ heading }
							placeholder={ __( 'Heading…', 'ambrygen-web' ) }
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
								'Add your content here…',
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

				{ /* Right image */ }
				{ imagePosition === 'right' && imageUrl && (
					<div className="iot-block__image">
						<img
							src={ imageUrl }
							alt={ imageAlt || heading || undefined }
							style={ { maxWidth: '100%', height: 'auto' } }
							className="iot-block__img"
						/>
					</div>
				) }

				{ /* Image placeholder */ }
				{ ! imageUrl && (
					<Placeholder
						icon="format-image"
						label={ __( 'No image selected', 'ambrygen-web' ) }
						instructions={ __(
							'Upload an image from the sidebar settings.',
							'ambrygen-web'
						) }
					/>
				) }
			</div>
		</Fragment>
	);
}
