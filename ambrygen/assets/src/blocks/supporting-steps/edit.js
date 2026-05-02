import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { getThemeAssetUrl } from '../../utils/assets';
import {
	BlockVariationsExamplePreview,
	ImageUploader,
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
	const HeadingTag = headingTag || 'h2';

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `supporting-steps-${ clientIdSuffix }`;

		if ( ! blockId || ! blockId.endsWith( clientIdSuffix ) ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: `supporting-steps${ isStatsView ? ' variation-stats-view' : '' }`,
		id: anchor || blockId || undefined,
	} );

	if ( blockId === 'supporting-steps-example' ) {
		return (
			<BlockVariationsExamplePreview
				variants={ VARIANTS }
				className="supporting-steps-example-preview"
				itemClass="supporting-steps-example-preview__item"
			/>
		);
	}

	const updateStep = ( index, field, value ) => {
		const updatedSteps = [ ...steps ];
		updatedSteps[ index ] = {
			...updatedSteps[ index ],
			[ field ]: value,
		};
		setAttributes( { steps: updatedSteps } );
	};

	const addStep = () => {
		if ( steps.length >= MAX_STEPS ) {
			return;
		}
		setAttributes( { steps: [ ...steps, createStep() ] } );
	};

	const removeStep = ( index ) => {
		setAttributes( {
			steps: steps.filter( ( _, stepIndex ) => stepIndex !== index ),
		} );
	};

	const updateStat = ( index, field, value ) => {
		const updatedStats = [ ...stats ];
		updatedStats[ index ] = {
			...updatedStats[ index ],
			[ field ]: value,
		};
		setAttributes( { stats: updatedStats } );
	};

	const addStat = () => {
		if ( stats.length >= MAX_STATS ) {
			return;
		}
		setAttributes( { stats: [ ...stats, createStat() ] } );
	};

	const removeStat = ( index ) => {
		setAttributes( {
			stats: stats.filter( ( _, statIndex ) => statIndex !== index ),
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Layout Settings', 'ambrygen-web' ) }
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
					<Button
						variant="primary"
						onClick={ addStep }
						disabled={ steps.length >= MAX_STEPS }
					>
						{ __( 'Add Step', 'ambrygen-web' ) }
					</Button>

					{ steps.map( ( step, index ) => (
						<ImageUploader
							key={ step.id }
							label={ sprintf(
								/* translators: %d: Step number. */
								__( 'Step %d Icon', 'ambrygen-web' ),
								index + 1
							) }
							url={ step.iconUrl }
							onSelect={ ( media ) => {
								const updatedSteps = [ ...steps ];
								updatedSteps[ index ] = {
									...updatedSteps[ index ],
									iconId: media.id || 0,
									iconUrl: media.url,
									iconAlt:
										media.alt || step.label || '',
								};
								setAttributes( {
									steps: updatedSteps,
								} );
							} }
							onRemove={ () => {
								const updatedSteps = [ ...steps ];
								updatedSteps[ index ] = {
									...updatedSteps[ index ],
									iconId: 0,
									iconUrl: '',
									iconAlt: '',
								};
								setAttributes( {
									steps: updatedSteps,
								} );
							} }
						/>
					) ) }
				</PanelBody>

				{ isStatsView && (
					<PanelBody
						title={ __( 'Stats Items', 'ambrygen-web' ) }
						initialOpen={ false }
					>
						<Button
							variant="secondary"
							onClick={ addStat }
							disabled={ stats.length >= MAX_STATS }
						>
							{ __( 'Add Stat', 'ambrygen-web' ) }
						</Button>
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				{ steps.length > 0 && (
					<div className="supporting-steps__steps">
						{ steps.map( ( step, index ) => (
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
								<RichText
									tagName="div"
									className="subtitle2-sbold supporting-steps__step-label"
									value={ step.label }
									onChange={ ( value ) =>
										updateStep(
											index,
											'label',
											value
										)
									}
									placeholder={ __(
										'Add step label',
										'ambrygen-web'
									) }
								/>
								<Button
									variant="secondary"
									isDestructive
									onClick={ () =>
										removeStep( index )
									}
								>
									{ __(
										'Remove Step',
										'ambrygen-web'
									) }
								</Button>
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
									'Add heading',
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

							{ stats.length > 0 && (
								<div className="supporting-steps__stats">
									{ stats.map( ( stat, index ) => (
										<div
											className="supporting-steps__stats-item"
											key={ stat.id }
										>
											<RichText
												tagName="div"
												className="supporting-steps__stats-label subtitle1-sbold"
												value={ stat.label }
												onChange={ ( value ) =>
													updateStat(
														index,
														'label',
														value
													)
												}
												placeholder={ __(
													'Add label',
													'ambrygen-web'
												) }
											/>
											<div className="supporting-steps__stats-value">
												<RichText
													tagName="span"
													value={ stat.stats }
													onChange={ ( value ) =>
														updateStat(
															index,
															'stats',
															value
														)
													}
													placeholder={ __(
														'Add stat',
														'ambrygen-web'
													) }
												/>
												{ ' ' }
												<RichText
													tagName="span"
													className="supporting-steps__stats-postfix"
													value={
														stat.postfix
													}
													onChange={ ( value ) =>
														updateStat(
															index,
															'postfix',
															value
														)
													}
													placeholder={ __(
														'Add postfix',
														'ambrygen-web'
													) }
												/>
											</div>
											<Button
												variant="secondary"
												isDestructive
												onClick={ () =>
													removeStat( index )
												}
											>
												{ __(
													'Remove Stat',
													'ambrygen-web'
												) }
											</Button>
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
								className="subtitle1-regular supporting-steps__description"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( {
										description: value,
									} )
								}
								placeholder={ __(
									'Add description',
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
