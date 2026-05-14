import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { getThemeAssetUrl } from '../../utils/assets';
import { useUniqueBlockId } from '../_shared/hooks';
import {
	BlockVariationsExamplePreview,
	ImageUploader,
	ItemHeader,
	TagSelector,
} from '../_shared/components';

const MAX_STEPS = 3;
const MAX_STATS = 2;

const createItemId = ( prefix ) =>
	`${ prefix }-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createStep = () => ( {
	id: createItemId( 'step' ),
	iconId: 0,
	iconUrl: '',
	iconAlt: '',
	label: '',
} );

const createStat = () => ( {
	id: createItemId( 'stat' ),
	label: '',
	stats: '',
	postfix: '',
} );

const normalizeStep = ( step = {} ) => ( {
	id: step.id || createItemId( 'step' ),
	iconId: Number( step.iconId ) || 0,
	iconUrl: step.iconUrl || '',
	iconAlt: step.iconAlt || '',
	label: step.label || '',
} );

const normalizeSteps = ( steps = [] ) =>
	steps.map( ( step ) => normalizeStep( step ) );

const normalizeStat = ( stat = {} ) => ( {
	id: stat.id || createItemId( 'stat' ),
	label: stat.label || '',
	stats: stat.stats || '',
	postfix: stat.postfix || '',
} );

const normalizeStats = ( stats = [] ) =>
	stats.map( ( stat ) => normalizeStat( stat ) );

function StepControls( {
	step,
	updateStep,
	replaceStepIcon,
	clearStepIcon,
	index,
} ) {
	return (
		<div className="supporting-steps__step-controls">
			<TextControl
				label={ __( 'Label', 'ambrygen-web' ) }
				value={ step.label }
				onChange={ ( value ) => updateStep( step.id, 'label', value ) }
			/>
			<ImageUploader
				label={ sprintf(
					/* translators: %d: Step number. */
					__( 'Step %d Icon', 'ambrygen-web' ),
					index + 1
				) }
				url={ step.iconUrl }
				onSelect={ ( media ) => replaceStepIcon( step.id, media ) }
				onRemove={ () => clearStepIcon( step.id ) }
			/>
		</div>
	);
}

function StatControls( { stat, updateStat } ) {
	return (
		<div className="supporting-steps__stat-controls">
			<TextControl
				label={ __( 'Label', 'ambrygen-web' ) }
				value={ stat.label }
				onChange={ ( value ) => updateStat( stat.id, 'label', value ) }
			/>
			<TextControl
				label={ __( 'Stat', 'ambrygen-web' ) }
				value={ stat.stats }
				onChange={ ( value ) => updateStat( stat.id, 'stats', value ) }
			/>
			<TextControl
				label={ __( 'Postfix', 'ambrygen-web' ) }
				value={ stat.postfix }
				onChange={ ( value ) => updateStat( stat.id, 'postfix', value ) }
			/>
		</div>
	);
}

const VARIANTS = [
	{
		label: __( 'Text View', 'ambrygen-web' ),
		value: 'text-view',
		image: getThemeAssetUrl(
			'/assets/src/images/supporting-steps/text-view.png'
		),
	},
	{
		label: __( 'Stats View', 'ambrygen-web' ),
		value: 'stats-view',
		image: getThemeAssetUrl(
			'/assets/src/images/supporting-steps/stats-view.png'
		),
	},
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		anchor,
		variation = 'text-view',
		heading,
		headingTag,
		heading2,
		description,
		steps = [],
		stats = [],
	} = attributes;

	const isStatsView = variation === 'stats-view';
	const isExample = blockId === 'supporting-steps-example';
	const HeadingTag = headingTag || 'h2';
	const hasInitializedDefaultStep = useRef( false );
	const sourceSteps = Array.isArray( steps ) ? steps : [];
	const stepsLength = sourceSteps.length;
	const hasMissingStepIds = sourceSteps.some( ( step ) => ! step?.id );
	const visibleSteps = sourceSteps.slice( 0, MAX_STEPS );
	const sourceStats = Array.isArray( stats ) ? stats : [];
	const statsLength = sourceStats.length;
	const hasMissingStatIds = sourceStats.some( ( stat ) => ! stat?.id );
	const visibleStats = sourceStats.slice( 0, MAX_STATS );

	useUniqueBlockId( {
		blockId,
		clientId,
		enabled: ! isExample,
		idPrefix: 'supporting-steps',
		setAttributes,
	} );

	useEffect( () => {
		if ( isExample || hasInitializedDefaultStep.current ) {
			return;
		}

		hasInitializedDefaultStep.current = true;

		if ( steps.length === 0 ) {
			setAttributes( { steps: [ createStep() ] } );
		}
	}, [ isExample, steps.length, setAttributes ] );

	useEffect( () => {
		if ( ! stepsLength ) {
			return;
		}

		if ( hasMissingStepIds || stepsLength > MAX_STEPS ) {
			setAttributes( {
				steps: normalizeSteps( sourceSteps ).slice( 0, MAX_STEPS ),
			} );
		}
	}, [ hasMissingStepIds, setAttributes, sourceSteps, stepsLength ] );

	useEffect( () => {
		if ( ! isStatsView || ! statsLength ) {
			return;
		}

		if ( hasMissingStatIds || statsLength > MAX_STATS ) {
			setAttributes( {
				stats: normalizeStats( sourceStats ).slice( 0, MAX_STATS ),
			} );
		}
	}, [
		hasMissingStatIds,
		isStatsView,
		setAttributes,
		sourceStats,
		statsLength,
	] );

	const blockProps = useBlockProps( {
		className: `supporting-steps${ isStatsView ? ' variation-stats-view' : '' }`,
		id: anchor || blockId || undefined,
	} );

	if ( isExample ) {
		return (
			<BlockVariationsExamplePreview
				variants={ VARIANTS }
				className="supporting-steps-example-preview"
				itemClass="supporting-steps-example-preview__item"
			/>
		);
	}

	const updateStep = ( stepId, field, value ) => {
		setAttributes( {
			steps: sourceSteps.map( ( step ) =>
				step.id === stepId ? { ...step, [ field ]: value } : step
			),
		} );
	};

	const addStep = () => {
		if ( sourceSteps.length >= MAX_STEPS ) {
			return;
		}
		setAttributes( {
			steps: normalizeSteps( [ ...sourceSteps, createStep() ] ).slice(
				0,
				MAX_STEPS
			),
		} );
	};

	const removeStep = ( stepId ) => {
		if ( sourceSteps.length <= 1 ) {
			return;
		}

		setAttributes( {
			steps: normalizeSteps(
				sourceSteps.filter( ( step ) => step.id !== stepId )
			),
		} );
	};

	const moveStep = ( stepId, direction ) => {
		const currentIndex = sourceSteps.findIndex(
			( step ) => step.id === stepId
		);
		const nextIndex = currentIndex + direction;

		if (
			currentIndex < 0 ||
			nextIndex < 0 ||
			nextIndex >= sourceSteps.length
		) {
			return;
		}

		const updatedSteps = [ ...sourceSteps ];
		[ updatedSteps[ currentIndex ], updatedSteps[ nextIndex ] ] = [
			updatedSteps[ nextIndex ],
			updatedSteps[ currentIndex ],
		];

		setAttributes( {
			steps: normalizeSteps( updatedSteps ).slice( 0, MAX_STEPS ),
		} );
	};

	const replaceStepIcon = ( stepId, media ) => {
		setAttributes( {
			steps: sourceSteps.map( ( step ) =>
				step.id === stepId
					? {
							...step,
							iconId: media?.id || 0,
							iconUrl: media?.url || '',
							iconAlt: media?.alt || '',
					  }
					: step
			),
		} );
	};

	const clearStepIcon = ( stepId ) => {
		setAttributes( {
			steps: sourceSteps.map( ( step ) =>
				step.id === stepId
					? {
							...step,
							iconId: 0,
							iconUrl: '',
							iconAlt: '',
					  }
					: step
			),
		} );
	};

	const updateStat = ( statId, field, value ) => {
		setAttributes( {
			stats: sourceStats.map( ( stat ) =>
				stat.id === statId ? { ...stat, [ field ]: value } : stat
			),
		} );
	};

	const addStat = () => {
		if ( sourceStats.length >= MAX_STATS ) {
			return;
		}
		setAttributes( {
			stats: normalizeStats( [ ...sourceStats, createStat() ] ).slice(
				0,
				MAX_STATS
			),
		} );
	};

	const removeStat = ( statId ) => {
		if ( sourceStats.length <= 1 ) {
			return;
		}

		setAttributes( {
			stats: normalizeStats(
				sourceStats.filter( ( stat ) => stat.id !== statId )
			),
		} );
	};

	const moveStat = ( statId, direction ) => {
		const currentIndex = sourceStats.findIndex(
			( stat ) => stat.id === statId
		);
		const nextIndex = currentIndex + direction;

		if (
			currentIndex < 0 ||
			nextIndex < 0 ||
			nextIndex >= sourceStats.length
		) {
			return;
		}

		const updatedStats = [ ...sourceStats ];
		[ updatedStats[ currentIndex ], updatedStats[ nextIndex ] ] = [
			updatedStats[ nextIndex ],
			updatedStats[ currentIndex ],
		];

		setAttributes( {
			stats: normalizeStats( updatedStats ).slice( 0, MAX_STATS ),
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Layout Variation', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<div className="layout-variant-selector">
						{ VARIANTS.map( ( variant ) => (
							<button
								key={ variant.value }
								type="button"
								className={ `variant-button ${
									variation === variant.value
										? 'is-selected'
										: ''
								}` }
								aria-pressed={ variation === variant.value }
								onClick={ () =>
									setAttributes( {
										variation: variant.value,
									} )
								}
							>
								<img
									src={ variant.image }
									alt=""
								/>
								<span>{ variant.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>

				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ HeadingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Steps', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					{ visibleSteps.map( ( step, index ) => (
						<div
							key={ step.id }
							className="supporting-steps__inspector-step"
						>
							<ItemHeader
								index={ index }
								label={ step.label }
								total={ visibleSteps.length }
								prefix="STEP"
								onMove={ ( itemIndex, dir ) =>
									moveStep( visibleSteps[ itemIndex ].id, dir )
								}
								onRemove={ ( itemIndex ) =>
									removeStep( visibleSteps[ itemIndex ].id )
								}
								minCount={ 1 }
							/>
							<StepControls
								step={ step }
								index={ index }
								updateStep={ updateStep }
								replaceStepIcon={ replaceStepIcon }
								clearStepIcon={ clearStepIcon }
							/>
						</div>
					) ) }

					{ visibleSteps.length < MAX_STEPS && (
						<Button variant="primary" onClick={ addStep }>
							{ __( 'Add New Step', 'ambrygen-web' ) }
						</Button>
					) }
				</PanelBody>

				{ isStatsView && (
					<PanelBody
						title={ __( 'Stats Items', 'ambrygen-web' ) }
						initialOpen={ false }
					>
						{ visibleStats.map( ( stat, index ) => (
							<div
								key={ stat.id }
								className="supporting-steps__inspector-stat"
							>
								<ItemHeader
									index={ index }
									label={ stat.label }
									total={ visibleStats.length }
									prefix="STAT"
									onMove={ ( itemIndex, dir ) =>
										moveStat( visibleStats[ itemIndex ].id, dir )
									}
									onRemove={ ( itemIndex ) =>
										removeStat( visibleStats[ itemIndex ].id )
									}
									minCount={ 1 }
								/>
								<StatControls
									stat={ stat }
									updateStat={ updateStat }
								/>
							</div>
						) ) }

						{ visibleStats.length < MAX_STATS && (
							<Button variant="primary" onClick={ addStat }>
								{ __( 'Add New Stat', 'ambrygen-web' ) }
							</Button>
						) }
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				{ visibleSteps.length > 0 && (
					<div className="supporting-steps__steps">
						{ visibleSteps.map( ( step ) => (
							<div
								className="supporting-steps__step-card"
								key={ step.id }
							>
								{ step.iconUrl && (
									<div className="supporting-steps__step-icon">
										<img
											src={ step.iconUrl }
											alt={ step.iconAlt || '' }
											width="100"
											height="100"
										/>
									</div>
								) }
								<div className="subtitle2-sbold supporting-steps__step-label">
									{ step.label ||
										__(
											'Add step label in sidebar',
											'ambrygen-web'
										) }
								</div>
							</div>
						) ) }
					</div>
				) }

				<div className="supporting-steps__content">
					{ isStatsView ? (
						<>
							<RichText
								tagName={ HeadingTag }
								className="supporting-steps__turnaround-label"
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder={ __(
									'Add Heading...',
									'ambrygen-web'
								) }
							/>
							<RichText
								tagName="div"
								className="supporting-steps__turnaround-value"
								value={ heading2 }
								onChange={ ( value ) =>
									setAttributes( { heading2: value } )
								}
								placeholder={ __(
									'Add value',
									'ambrygen-web'
								) }
							/>

							{ visibleStats.length > 0 && (
								<div className="supporting-steps__stats">
									{ visibleStats.map( ( stat ) => (
										<div
											className="supporting-steps__stats-item"
											key={ stat.id }
										>
											<div className="supporting-steps__stats-label subtitle1-sbold">
												{ stat.label ||
													__(
														'label',
														'ambrygen-web'
													) }
											</div>
											<div className="supporting-steps__stats-value">
												<span>
													{ stat.stats ||
														__(
															'stat',
															'ambrygen-web'
														) }
												</span>
												{ ' ' }
												<span className="supporting-steps__stats-postfix">
													{ stat.postfix ||
														__(
															'postfix',
															'ambrygen-web'
														) }
												</span>
											</div>
										</div>
									) ) }
								</div>
							) }
						</>
					) : (
						<>
							<RichText
								tagName={ HeadingTag }
								className="supporting-steps__turnaround-label"
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder={ __(
									'Add heading 1',
									'ambrygen-web'
								) }
							/>
							<RichText
								tagName="div"
								className="supporting-steps__turnaround-value"
								value={ heading2 }
								onChange={ ( value ) =>
									setAttributes( { heading2: value } )
								}
								placeholder={ __(
									'Add heading 2',
									'ambrygen-web'
								) }
							/>
							<RichText
								tagName="div"
								className="subtitle1-regular supporting-steps__description block-description"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( {
										description: value,
									} )
								}
								placeholder={ __(
									'Add Description...',
									'ambrygen-web'
								) }
							/>
						</>
					) }
				</div>
			</div>
		</>
	);
}
