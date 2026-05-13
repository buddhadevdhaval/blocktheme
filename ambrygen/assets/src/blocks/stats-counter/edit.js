import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';
import {
	ItemHeader,
	BlockVariationsExamplePreview,
} from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

const createCounterId = () =>
	`counter-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createCounter = () => ( {
	id: createCounterId(),
	prefix: '',
	number: '0',
	postfix: '',
	label: '',
	description: '',
} );

const getDefaultCounters = () => [ createCounter() ];

const normalizeCounter = ( counter = {} ) => ( {
	id: counter.id || createCounterId(),
	prefix: counter.prefix || '',
	number: counter.number || '',
	// Map legacy suffix/title to postfix/label for backwards compatibility
	postfix: counter.postfix ?? counter.suffix ?? '',
	label: counter.label ?? counter.title ?? '',
	description: counter.description || '',
} );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, counters = [], variation = 'variation-1' } = attributes;
	const [ openStatId, setOpenStatId ] = useState( null );
	const isExample = blockId === 'stats-counter-example';
	const isVariationTwo = variation === 'variation-2';
	const variants = useMemo(
		() => [
			{
				label: __( 'Variation 1', 'ambrygen-web' ),
				value: 'variation-1',
				image: getThemeAssetUrl(
					'/assets/src/images/stats-counter/variation-1.png'
				),
			},
			{
				label: __( 'Variation 2', 'ambrygen-web' ),
				value: 'variation-2',
				image: getThemeAssetUrl(
					'/assets/src/images/stats-counter/variation-2.png'
				),
			},
		],
		[]
	);

	const blockProps = useBlockProps( {
		className: 'counter-block',
		id: blockId || undefined,
	} );

	const countersLength = counters.length;
	const hasMissingIds = counters.some( ( counter ) => ! counter?.id );

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, isExample, setAttributes ] );

	useEffect( () => {
		if ( ! countersLength ) {
			setAttributes( { counters: getDefaultCounters() } );
		} else if ( hasMissingIds ) {
			setAttributes( {
				counters: counters.map( normalizeCounter ),
			} );
		}
	}, [ counters, countersLength, hasMissingIds, setAttributes ] );

	const updateCounter = ( counterId, field, value ) => {
		const finalValue = field === 'number' ? value.replace( /\D/g, '' ) : value;
		
		setAttributes( {
			counters: counters.map( ( counter ) =>
				counter.id === counterId
					? { ...counter, [ field ]: finalValue }
					: counter
			),
		} );
	};

	const addCounter = () => {
		setAttributes( {
			counters: [ ...counters, createCounter() ].map( normalizeCounter ),
		} );
	};

	const removeCounter = ( counterId ) => {
		if ( counters.length <= 1 ) {
			return;
		}

		setAttributes( {
			counters: counters
				.filter( ( counter ) => counter.id !== counterId )
				.map( normalizeCounter ),
		} );
	};

	const moveCounter = ( counterId, direction ) => {
		const currentIndex = counters.findIndex(
			( counter ) => counter.id === counterId
		);
		const nextIndex = currentIndex + direction;

		if (
			currentIndex < 0 ||
			nextIndex < 0 ||
			nextIndex >= counters.length
		) {
			return;
		}

		const updatedCounters = [ ...counters ];
		[ updatedCounters[ currentIndex ], updatedCounters[ nextIndex ] ] = [
			updatedCounters[ nextIndex ],
			updatedCounters[ currentIndex ],
		];

		setAttributes( { counters: updatedCounters.map( normalizeCounter ) } );
	};

	const toggleStat = ( id ) => {
		setOpenStatId( openStatId === id ? null : id );
	};

	if ( isExample ) {
		return (
			<BlockVariationsExamplePreview
				variants={ variants }
				className="stats-counter-example-preview"
				itemClass="stats-counter-example-preview__item"
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Layout Variation', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<div className="layout-variant-selector">
						{ variants.map( ( item ) => (
							<button
								key={ item.value }
								type="button"
								className={ `variant-button ${
									variation === item.value
										? 'is-selected'
										: ''
								}` }
								aria-pressed={ variation === item.value }
								onClick={ () =>
									setAttributes( {
										variation: item.value,
									} )
								}
							>
								<img src={ item.image } alt={ item.label } />
								<span>{ item.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>

				<PanelBody title={ __( 'Stats', 'ambrygen-web' ) } initialOpen>
					<Button
						variant="primary"
						onClick={ addCounter }
						className="stats-counter__add-btn"
					>
						{ __( 'Add New Stat', 'ambrygen-web' ) }
					</Button>
					
					<hr className="mt-16 mb-16" />

					{ counters.map( ( counter, index ) => {
						const isOpen = openStatId === counter.id;
						
						return (
						<div
							key={ counter.id }
							className="stats-counter__inspector-item"
							style={ { border: '1px solid #ddd', padding: '12px', marginBottom: '12px', borderRadius: '4px', backgroundColor: '#fff' } }
						>
							<ItemHeader
								index={ index }
								label={ counter.label || __( 'Untitled Stat', 'ambrygen-web' ) }
								total={ counters.length }
								prefix="STAT"
								onMove={ ( i, dir ) =>
									moveCounter( counters[ i ].id, dir )
								}
								onRemove={ ( i ) =>
									removeCounter( counters[ i ].id )
								}
								minCount={ 1 }
							/>
							
							<Button
								variant="tertiary"
								icon={ isOpen ? chevronUp : chevronDown }
								onClick={ () => toggleStat( counter.id ) }
								style={ { width: '100%', justifyContent: 'center', marginBottom: isOpen ? '16px' : '0' } }
							>
								{ isOpen ? __( 'Hide Fields', 'ambrygen-web' ) : __( 'Show Fields', 'ambrygen-web' ) }
							</Button>

							{ isOpen && (
								<div className="stats-counter__stat-controls">
									{ ! isVariationTwo && (
										<>
											<TextControl
												label={ __( 'Prefix', 'ambrygen-web' ) }
												value={ counter.prefix }
												onChange={ ( value ) =>
													updateCounter( counter.id, 'prefix', value )
												}
											/>
											<TextControl
												label={ __( 'Number', 'ambrygen-web' ) }
												value={ counter.number }
												onChange={ ( value ) =>
													updateCounter( counter.id, 'number', value )
												}
											/>
											<TextControl
												label={ __( 'Postfix', 'ambrygen-web' ) }
												value={ counter.postfix }
												onChange={ ( value ) =>
													updateCounter( counter.id, 'postfix', value )
												}
											/>
										</>
									) }
									<TextControl
										label={
											isVariationTwo
												? __( 'Digit', 'ambrygen-web' )
												: __( 'Label', 'ambrygen-web' )
										}
										value={ counter.label }
										placeholder={
											isVariationTwo
												? __( 'Enter Digit', 'ambrygen-web' )
												: __( 'New Stat', 'ambrygen-web' )
										}
										onChange={ ( value ) =>
											updateCounter( counter.id, 'label', value )
										}
									/>
									<TextareaControl
										label={ __( 'Description', 'ambrygen-web' ) }
										value={ counter.description }
										placeholder={ __(
											'Add description here',
											'ambrygen-web'
										) }
										onChange={ ( value ) =>
											updateCounter( counter.id, 'description', value )
										}
									/>
								</div>
							) }
						</div>
					)} ) }
				</PanelBody>
			</InspectorControls>

			{ isVariationTwo ? (
				<div className="intro__stats-wrapper">
					{ counters.map( ( counter ) => (
						<div
							key={ counter.id }
							className="intro__stat"
						>
							<div className="intro__stat-value">
								<div className="intro__stat-value-lg">
									{ counter.label || __( 'New Stat', 'ambrygen-web' ) }
								</div>
							</div>
							<div className="intro__stat-desc">
								{ counter.description ||
									__( 'Add Description...', 'ambrygen-web' ) }
							</div>
						</div>
					) ) }
				</div>
			) : (
				<div className="stats-counter">
					{ counters.map( ( counter ) => {
						const hasNumberData =
							counter.prefix || counter.number || counter.postfix;

						return (
							<div
								key={ counter.id }
								className="stats-counter__item"
							>
								{ hasNumberData && (
									<div className="stats-counter__number heading-3 mb-0">
										{ counter.prefix && <span className="stats-counter__number-prefix">{ counter.prefix }</span> }
										<span className="stats-counter__number-value">{ counter.number ? Number( counter.number ).toLocaleString() : '0' }</span>
										{ counter.postfix && <span className="stats-counter__number-suffix">{ counter.postfix }</span> }
									</div>
								) }

								<div className="stats-counter__label subtitle1-sbold">
									{ counter.label || __( 'New Stat', 'ambrygen-web' ) }
								</div>
								<div className="stats-counter__description">
									<div className="is-style-gl-s8" aria-hidden="true"></div>
									{ counter.description ||
										__( 'Add Description...', 'ambrygen-web' ) }
								</div>
							</div>
						);
					} ) }
				</div>
			) }
		</div>
	);
}
