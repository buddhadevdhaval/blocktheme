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
import { useEffect, useState } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';
import { ItemHeader, BlockExamplePreview } from '../_shared/components';

const createCounterId = () =>
	`counter-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createCounter = () => ( {
	id: createCounterId(),
	prefix: '',
	number: '0',
	postfix: '',
	label: 'New Stat',
	description: 'add description here',
} );

const DEFAULT_COUNTERS = [
	createCounter(),
];

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
	const { blockId, counters = [] } = attributes;
	const [ openStatId, setOpenStatId ] = useState( null );
	
	const blockProps = useBlockProps( {
		className: 'counter-block',
	} );

	const countersLength = counters.length;
	const hasMissingIds = counters.some( ( counter ) => ! counter?.id );

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;

		if ( ! blockId || ! blockId.endsWith( clientIdSuffix ) ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, setAttributes ] );

	useEffect( () => {
		if ( ! countersLength ) {
			setAttributes( { counters: DEFAULT_COUNTERS } );
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

	if ( blockId === 'stats-counter-example' ) {
		return (
			<BlockExamplePreview
				className="stats-counter-example-preview"
				imagePath="/assets/src/images/counter/variation-1.png"
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<InspectorControls>
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
									<TextControl
										label={ __( 'Label', 'ambrygen-web' ) }
										value={ counter.label }
										onChange={ ( value ) =>
											updateCounter( counter.id, 'label', value )
										}
									/>
									<TextareaControl
										label={ __( 'Description', 'ambrygen-web' ) }
										value={ counter.description }
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

			<div className="stats-counter">
				{ counters.map( ( counter ) => {
					const hasNumberData = counter.prefix || counter.number || counter.postfix;
					
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
								{ counter.label || '' }
							</div>

							<div className="is-style-gl-s8" aria-hidden="true"></div>

							<div className="stats-counter__description">
								{ counter.description || '' }
							</div>
						</div>
					);
				} ) }
			</div>
		</div>
	);
}
