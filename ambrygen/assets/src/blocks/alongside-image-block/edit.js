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
} from '@wordpress/components';

import { TagSelector } from '../_shared/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const createLocationId = () =>
	`loc-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 9 ) }`;

export default function Edit( { attributes, setAttributes, clientId } ) {
	const blockProps = useBlockProps();

	const {
		blockId,
		title,
		headingLevel = 'h2',
		locations = [],
		iframe,
	} = attributes;

	const HeadingTag = headingLevel || 'h2';

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const onChangeTitle = ( value ) => setAttributes( { title: value } );
	const onChangeIframe = ( value ) => {
		if ( '' === value || value.startsWith( 'https://' ) ) {
			setAttributes( { iframe: value } );
		}
	};

	const updateLocation = ( id, key, value ) => {
		setAttributes( {
			locations: locations.map( ( loc ) =>
				loc.id === id ? { ...loc, [ key ]: value } : loc
			),
		} );
	};

	const addLocation = () => {
		setAttributes( {
			locations: [
				...locations,
				{ name: '', address: '', id: createLocationId() },
			],
		} );
	};
	const removeLocation = ( id ) => {
		setAttributes( {
			locations: locations.filter( ( loc ) => loc.id !== id ),
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
					<TagSelector
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						type="heading"
						value={ headingLevel }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Map Settings', 'ambrygen-web' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Map Iframe URL', 'ambrygen-web' ) }
							value={ iframe || '' }
							type="url"
							help={ __(
								'Paste an https:// Google Maps embed URL.',
								'ambrygen-web'
							) }
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
									{ __( 'No Map URL Set', 'ambrygen-web' ) }
								</div>
							) }
						</div>
					</div>

					{ /* Content */ }
					<div className="alongside-image-block__content">
						<RichText
							tagName={ HeadingTag }
							value={ title }
							onChange={ onChangeTitle }
							placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
							allowedFormats={ [
								'core/bold',
								'core/italic',
								'core/text-color',
							] }
							className="alongside-image-block__title heading-2 mb-0"
						/>
						<div className="is-style-gl-s24"></div>

						<div className="alongside-image-block__text">
							{ locations.map( ( loc ) => (
								<div className="location-list" key={ loc.id }>
									<RichText
										placeholder={ __(
											'Add Title…',
											'ambrygen-web'
										) }
										value={ loc.name }
										onChange={ ( value ) =>
											updateLocation(
												loc.id,
												'name',
												value
											)
										}
										className="location-title text-xl-semibold"
									/>

									<RichText
										placeholder={ __(
											'Add Address…',
											'ambrygen-web'
										) }
										value={ loc.address }
										onChange={ ( value ) =>
											updateLocation(
												loc.id,
												'address',
												value
											)
										}
										className="text-medium"
									/>
									<div className="is-style-gl-s24"></div>
									<div className="actions-button">
										<Button
											variant="secondary"
											onClick={ () =>
												removeLocation( loc.id )
											}
											className="components-button is-destructive"
										>
											{ __(
												'Remove Location',
												'ambrygen-web'
											) }
										</Button>
									</div>
								</div>
							) ) }

							<Button variant="primary" onClick={ addLocation }>
								{ __( 'Add Location', 'ambrygen-web' ) }
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
