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
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TagSelector, ItemHeader } from '../_shared/components';

const createLocationMapItemId = () =>
	`loc-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 9 ) }`;

const DEFAULT_LOCATIONS = [
	{ id: createLocationMapItemId(), name: '', address: '' },
	{ id: createLocationMapItemId(), name: '', address: '' },
];

const getIframeSrc = ( value ) => {
	if ( ! value ) {
		return '';
	}

	const trimmedValue = value.trim();

	if ( trimmedValue.startsWith( '<iframe' ) ) {
		const srcMatch = trimmedValue.match( /src=(['"])(.*?)\1/i );

		return srcMatch?.[ 2 ] || '';
	}

	return trimmedValue;
};

const isAllowedMapUrl = ( value ) => {
	const iframeSrc = getIframeSrc( value );

	if ( ! iframeSrc ) {
		return true;
	}

	try {
		const url = new URL( iframeSrc );
		const host = url.hostname.toLowerCase();

		return (
			url.protocol === 'https:' &&
			[ 'www.google.com', 'google.com', 'maps.google.com' ].includes(
				host
			) &&
			url.pathname.startsWith( '/maps/embed' )
		);
	} catch ( error ) {
		return false;
	}
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const blockProps = useBlockProps( {
		className: 'location-map',
	} );

	const {
		blockId,
		title,
		headingLevel = 'h2',
		locations = [],
		iframe,
	} = attributes;

	const HeadingTag = headingLevel || 'h2';
	const iframeSrc = getIframeSrc( iframe );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	useEffect( () => {
		if ( locations.length ) {
			return;
		}

		setAttributes( {
			locations: DEFAULT_LOCATIONS,
		} );
	}, [ locations, setAttributes ] );

	const onChangeLocationMapTitle = ( value ) =>
		setAttributes( { title: value } );

	const onChangeLocationMapIframe = ( value ) => {
		const trimmedValue = value.trim();

		if ( '' === trimmedValue || isAllowedMapUrl( trimmedValue ) ) {
			setAttributes( { iframe: value } );
		}
	};

	const updateLocationMapItem = ( id, key, value ) => {
		setAttributes( {
			locations: locations.map( ( loc ) =>
				loc.id === id ? { ...loc, [ key ]: value } : loc
			),
		} );
	};

	const addLocationMapItem = () => {
		setAttributes( {
			locations: [
				...locations,
				{ name: '', address: '', id: createLocationMapItemId() },
			],
		} );
	};

	const removeLocationMapItem = ( id ) => {
		setAttributes( {
			locations: locations.filter( ( loc ) => loc.id !== id ),
		} );
	};

	const moveLocationMapItem = ( id, direction ) => {
		const currentIndex = locations.findIndex( ( loc ) => loc.id === id );
		const nextIndex = currentIndex + direction;

		if (
			currentIndex < 0 ||
			nextIndex < 0 ||
			nextIndex >= locations.length
		) {
			return;
		}

		const updatedLocations = [ ...locations ];
		[ updatedLocations[ currentIndex ], updatedLocations[ nextIndex ] ] = [
			updatedLocations[ nextIndex ],
			updatedLocations[ currentIndex ],
		];

		setAttributes( { locations: updatedLocations } );
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
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
							label={ __( 'Iframe', 'ambrygen-web' ) }
							value={ iframe || '' }
							help={ __(
								'Paste an https:// Google Maps embed URL or full iframe embed code.',
								'ambrygen-web'
							) }
							onChange={ onChangeLocationMapIframe }
						/>
					</PanelRow>
				</PanelBody>

				<PanelBody title={ __( 'Locations', 'ambrygen-web' ) } initialOpen>
					{ locations.map( ( loc, index ) => (
						<div key={ loc.id }>
							<ItemHeader
								index={ index }
								label={ loc.name }
								total={ locations.length }
								prefix="LOCATION"
								onMove={ ( itemIndex, dir ) =>
									moveLocationMapItem(
										locations[ itemIndex ].id,
										dir
									)
								}
								onRemove={ ( itemIndex ) =>
									removeLocationMapItem(
										locations[ itemIndex ].id
									)
								}
								minCount={ 1 }
							/>
							<TextControl
								label={ __( 'Title', 'ambrygen-web' ) }
								value={ loc.name }
								onChange={ ( value ) =>
									updateLocationMapItem( loc.id, 'name', value )
								}
							/>
							<TextControl
								label={ __( 'Address', 'ambrygen-web' ) }
								value={ loc.address }
								onChange={ ( value ) =>
									updateLocationMapItem(
										loc.id,
										'address',
										value
									)
								}
							/>
						</div>
					) ) }

					<Button variant="primary" onClick={ addLocationMapItem }>
						{ __( 'Add Location', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div className="location-map__row">
				<div className="location-map__media">
					<div className="location-map__image">
						{ iframeSrc ? (
							<iframe
								src={ iframeSrc }
								width="100%"
								height="300"
								title={ __(
									'Google Map Preview',
									'ambrygen-web'
								) }
								loading="lazy"
								allowFullScreen
							/>
						) : (
							<div className="location-map__placeholder">
								{ __( 'No Map URL Set', 'ambrygen-web' ) }
							</div>
						) }
					</div>
				</div>

				<div className="location-map__content">
					<RichText
						tagName={ HeadingTag }
						value={ title }
						onChange={ onChangeLocationMapTitle }
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/highlight',
							'core/text-color',
						] }
						className="location-map__title heading-2 mb-0"
					/>
					{ title && (
						<div className="is-style-gl-s24" aria-hidden="true"></div>
					) }

					<div className="location-map__text">
						{ locations.map( ( loc ) => (
							<div className="location-list" key={ loc.id }>
								<div className="location-title text-xl-semibold">
									{ loc.name || __(
										'Add Title...',
										'ambrygen-web'
									) }
								</div>
								<div className="location-description text-medium">
									{ loc.address || __(
										'Add Address...',
										'ambrygen-web'
									) }
								</div>
								{ loc.address && (
									<div className="is-style-gl-s24" aria-hidden="true"></div>
								) }
							</div>
						) ) }
					</div>
				</div>
			</div>
		</div>
	);
}

