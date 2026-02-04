import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	TextControl,
	PanelBody,
	PanelRow,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	const { title, headingLevel = 'h2', locations = [], iframe } = attributes;

	const HeadingTag = headingLevel || 'h2';

	const onChangeTitle = ( value ) => setAttributes( { title: value } );
	const onChangeIframe = ( value ) => setAttributes( { iframe: value } );

	const updateLocation = ( index, key, value ) => {
		const newLocations = [ ...locations ];
		newLocations[ index ] = {
			...newLocations[ index ],
			[ key ]: value,
		};
		setAttributes( { locations: newLocations } );
	};

	const addLocation = () => {
		setAttributes( {
			locations: [ ...locations, { name: '', address: '' } ],
		} );
	};

	return (
		<div { ...blockProps }>
			{ /* Sidebar Controls */ }
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<SelectControl
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						value={ headingLevel }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						] }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Map Settings', 'ambrygen-web' ) }>
					<PanelRow>
						<TextControl
							label="Map Iframe URL"
							value={ iframe || '' }
							onChange={ onChangeIframe }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div className="alongside-image-block">
				<div className="alongside-image-block__row">
					{ /* Map */ }
					<div className="alongside-image-block__media">
						<div className="alongside-image-block__image">
							{ iframe ? (
								<iframe
									src={ iframe }
									width="100%"
									height="300"
									title="Google Map Preview"
									loading="lazy"
									allowFullScreen
								/>
							) : (
								<div className="alongside-image-block__placeholder">
									No Map URL Set
								</div>
							) }
						</div>
					</div>

					{ /* Content */ }
					<div className="alongside-image-block__content">
						<HeadingTag className="alongside-image-block__title heading-2 mb-0">
							<RichText
								tagName="span"
								value={ title }
								onChange={ onChangeTitle }
								placeholder={ __(
									'Our Locations',
									'ambrygen-web'
								) }
								allowedFormats={ [
									'core/bold',
									'core/italic',
									'core/text-color',
								] }
								className="alongside-image-block__title-text"
							/>
						</HeadingTag>

						<div className="alongside-image-block__text">
							{ locations.map( ( loc, index ) => (
								<div className="location-list" key={ index }>
									<RichText
										placeholder="Location Name"
										value={ loc.name }
										onChange={ ( value ) =>
											updateLocation(
												index,
												'name',
												value
											)
										}
										className="location-title"
									/>

									<RichText
										placeholder="Address"
										value={ loc.address }
										onChange={ ( value ) =>
											updateLocation(
												index,
												'address',
												value
											)
										}
										className="text-medium"
									/>
								</div>
							) ) }

							<Button isPrimary onClick={ addLocation }>
								Add Location
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
