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
import {
	BlockExamplePreview,
	TagSelector,
	ItemHeader,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const createLocationMapItemId = () =>
	`loc-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 9 ) }`;

const DEFAULT_LOCATIONS = [
	{ id: createLocationMapItemId(), name: '', address: '' },
	{ id: createLocationMapItemId(), name: '', address: '' },
];
const LOCATION_CONTROL_ICON_SIZE = 16;
const DEFAULT_MAP_IFRAME_SRC =
	'https://maps.google.com/maps?q=Washington%20DC%2C%20USA&z=15&output=embed';

const ensureLocationMapItemIds = ( items ) => {
	const usedIds = new Set();
	let hasChanged = false;

	const nextItems = items.map( ( item ) => {
		if ( item.id && ! usedIds.has( item.id ) ) {
			usedIds.add( item.id );
			return item;
		}

		const id = createLocationMapItemId();
		usedIds.add( id );
		hasChanged = true;

		return {
			...item,
			id,
		};
	} );

	return hasChanged ? nextItems : items;
};

const hasLocationMapItemContent = ( item ) =>
	Boolean( item.name?.trim() || item.address?.trim() );

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
		const isGoogleMapsEmbedPath = url.pathname.startsWith( '/maps/embed' );
		const isGoogleMapsOutputEmbed =
			url.pathname.startsWith( '/maps' ) &&
			url.searchParams.get( 'output' ) === 'embed';

		return (
			url.protocol === 'https:' &&
			[ 'www.google.com', 'google.com', 'maps.google.com' ].includes(
				host
			) &&
			( isGoogleMapsEmbedPath || isGoogleMapsOutputEmbed )
		);
	} catch ( error ) {
		return false;
	}
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		anchor,
		title,
		headingLevel = 'h2',
		locations = [],
		iframe,
	} = attributes;
	const isExample = blockId === 'example-block-preview';
	const blockProps = useBlockProps( {
		className: 'location-map block-layout',
		id: isExample ? undefined : anchor || blockId || undefined,
	} );

	const HeadingTag = headingLevel || 'h2';
	const iframeSrc = getIframeSrc( iframe ) || DEFAULT_MAP_IFRAME_SRC;

	useUniqueBlockId( {
		blockId,
		clientId,
		enabled: ! isExample && ! anchor,
		idPrefix: 'section',
		setAttributes,
	} );

	useEffect( () => {
		if ( locations.length ) {
			return;
		}

		setAttributes( {
			locations: DEFAULT_LOCATIONS,
		} );
	}, [ locations, setAttributes ] );

	useEffect( () => {
		if ( ! locations.length ) {
			return;
		}

		const normalizedLocations = ensureLocationMapItemIds( locations );

		if ( normalizedLocations !== locations ) {
			setAttributes( {
				locations: normalizedLocations,
			} );
		}
	}, [ locations, setAttributes ] );

	const onChangeLocationMapTitle = ( value ) =>
		setAttributes( { title: value } );

	const onChangeLocationMapIframe = ( value ) => {
		const trimmedValue = value.trim();

		if ( '' === trimmedValue || isAllowedMapUrl( trimmedValue ) ) {
			setAttributes( { iframe: value } );
		}
	};

	const updateLocationMapItem = ( index, key, value ) => {
		setAttributes( {
			locations: locations.map( ( loc, itemIndex ) =>
				itemIndex === index ? { ...loc, [ key ]: value } : loc
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

	const removeLocationMapItem = ( index ) => {
		setAttributes( {
			locations: locations.filter(
				( loc, itemIndex ) => itemIndex !== index
			),
		} );
	};

	const moveLocationMapItem = ( currentIndex, direction ) => {
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

	const filledLocations = locations.filter( hasLocationMapItemContent );
	const previewLocations = filledLocations.length
		? filledLocations
		: locations.slice( 0, 2 );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="example-block-preview"
				imagePath="/assets/src/images/location-map/preview.png"
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
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

				<PanelBody
					title={ __( 'Map Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
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

				<PanelBody
					title={ __( 'Locations', 'ambrygen-web' ) }
					initialOpen
				>
					{ locations.map( ( loc, index ) => (
						<div key={ loc.id }>
							<ItemHeader
								index={ index }
								label={ loc.name }
								total={ locations.length }
								prefix="LOCATION"
								onMove={ ( itemIndex, dir ) =>
									moveLocationMapItem( itemIndex, dir )
								}
								onRemove={ ( itemIndex ) =>
									removeLocationMapItem( itemIndex )
								}
								minCount={ 1 }
								iconSize={ LOCATION_CONTROL_ICON_SIZE }
							/>
							<TextControl
								label={ __( 'Title', 'ambrygen-web' ) }
								value={ loc.name }
								onChange={ ( value ) =>
									updateLocationMapItem(
										index,
										'name',
										value
									)
								}
							/>
							<TextControl
								label={ __( 'Address', 'ambrygen-web' ) }
								value={ loc.address }
								onChange={ ( value ) =>
									updateLocationMapItem(
										index,
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
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/highlight',
							'core/text-color',
						] }
						className="location-map__title heading-2 mb-0"
					/>
					<div className="is-style-gl-s24" aria-hidden="true"></div>

					<div className="location-map__text">
						{ previewLocations.map( ( loc ) => (
							<div className="location-list" key={ loc.id }>
								<div className="location-title text-xl-semibold">
									{ loc.name ||
										__( 'Add Title…', 'ambrygen-web' ) }
								</div>
								<div className="location-description text-medium">
									{ loc.address ||
										__( 'Add Address…', 'ambrygen-web' ) }
								</div>
								<div
									className="is-style-gl-s24"
									aria-hidden="true"
								></div>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</div>
	);
}
