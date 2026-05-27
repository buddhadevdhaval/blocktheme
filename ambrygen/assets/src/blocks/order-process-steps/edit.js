import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import {
	TagSelector,
	ImageUploader,
	ItemHeader,
	BlockExamplePreview,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const createStepId = () =>
	`step-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createStep = () => ( {
	id: createStepId(),
	title: '',
	description: '',
	iconUrl: '',
	iconId: 0,
	iconAlt: '',
} );

const DEFAULT_STEPS = [
	{
		id: 'step-1',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
	{
		id: 'step-2',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
	{
		id: 'step-3',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
	{
		id: 'step-4',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
];

const normalizeSteps = ( steps = [] ) =>
	steps.map( ( step ) => ( {
		id: step?.id || createStepId(),
		title: step?.title || '',
		description: step?.description || '',
		iconUrl: step?.iconUrl || '',
		iconId: step?.iconId || 0,
		iconAlt: step?.iconAlt || '',
	} ) );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		headingTag,
		headingText,
		subtitle,
		steps = [],
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'block-layout order-process-steps',
	} );
	const stepsLength = steps.length;
	const hasMissingIds = steps.some( ( step ) => ! step?.id );
	const isExample = blockId === 'order-process-steps-example';

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
	} );

	useEffect( () => {
		if ( ! stepsLength ) {
			setAttributes( { steps: DEFAULT_STEPS } );
		} else if ( hasMissingIds ) {
			setAttributes( {
				steps: normalizeSteps( steps ),
			} );
		}
	}, [ steps, stepsLength, hasMissingIds, setAttributes ] );

	const updateStep = ( stepId, field, value ) => {
		setAttributes( {
			steps: steps.map( ( step ) =>
				step.id === stepId ? { ...step, [ field ]: value } : step
			),
		} );
	};

	const addStep = () => {
		setAttributes( {
			steps: normalizeSteps( [ ...steps, createStep() ] ),
		} );
	};

	const removeStep = ( stepId ) => {
		if ( steps.length <= 1 ) {
			return;
		}

		setAttributes( {
			steps: normalizeSteps(
				steps.filter( ( step ) => step.id !== stepId )
			),
		} );
	};

	const updateStepImage = ( stepId, media ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			steps: normalizeSteps(
				steps.map( ( currentStep ) =>
					currentStep.id === stepId
						? {
								...currentStep,
								iconUrl: media.url,
								iconId: media.id || 0,
								iconAlt:
									media.alt || currentStep.iconAlt || '',
						  }
						: currentStep
				)
			),
		} );
	};

	const removeStepImage = ( stepId ) => {
		setAttributes( {
			steps: normalizeSteps(
				steps.map( ( currentStep ) =>
					currentStep.id === stepId
						? {
								...currentStep,
								iconUrl: '',
								iconId: 0,
								iconAlt: '',
						  }
						: currentStep
				)
			),
		} );
	};

	const moveStep = ( stepId, direction ) => {
		const currentIndex = steps.findIndex( ( step ) => step.id === stepId );
		const nextIndex = currentIndex + direction;

		if ( currentIndex < 0 || nextIndex < 0 || nextIndex >= steps.length ) {
			return;
		}

		const updatedSteps = [ ...steps ];
		[ updatedSteps[ currentIndex ], updatedSteps[ nextIndex ] ] = [
			updatedSteps[ nextIndex ],
			updatedSteps[ currentIndex ],
		];

		setAttributes( { steps: normalizeSteps( updatedSteps ) } );
	};

	const HeadingTag = headingTag || 'h2';

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="order-process-steps-example-preview"
				imagePath="/assets/src/images/order-process-steps/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>

				<PanelBody title={ __( 'Steps', 'ambrygen-web' ) } initialOpen>
					{ steps.map( ( step, index ) => (
						<div
							key={ step.id }
							className="order-process-steps__inspector-step"
						>
							<ItemHeader
								index={ index }
								label={ step.title }
								total={ steps.length }
								prefix="STEP"
								onMove={ ( i, dir ) =>
									moveStep( steps[ i ].id, dir )
								}
								onRemove={ ( i ) =>
									removeStep( steps[ i ].id )
								}
								minCount={ 1 }
							/>

							<ImageUploader
								label={ __( 'Step Icon', 'ambrygen-web' ) }
								url={ step.iconUrl || '' }
								onSelect={ ( media ) =>
									updateStepImage( step.id, media )
								}
								onRemove={ () => removeStepImage( step.id ) }
							/>
						</div>
					) ) }
					<Button
						variant="primary"
						onClick={ addStep }
						className="order-process-steps__add-step"
					>
						{ __( 'Add New Step', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="order-process-steps__header">
					<RichText
						tagName={ HeadingTag }
						className="heading-4 block-title mb-0"
						value={ headingText }
						onChange={ ( value ) =>
							setAttributes( { headingText: value } )
						}
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>

					<div
						className="is-style-gl-s12"
						aria-hidden="true"
					></div>

					<RichText
						tagName="p"
						className="body1 order-process-steps__subtitle"
						value={ subtitle }
						onChange={ ( value ) =>
							setAttributes( { subtitle: value } )
						}
						placeholder={ __(
							'Add Description...',
							'ambrygen-web'
						) }
					/>
				</div>


				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="order-process-steps__steps">
					{ steps.map( ( step, index ) => {
						return (
							<div
								key={ step.id }
								className="order-process-steps__step"
							>
								{ step.iconUrl && (
									<div className="order-process-steps__step-icon">
										<img
											src={ step.iconUrl }
											alt={ step.iconAlt || '' }
										/>
									</div>
								) }
								<div className="order-process-steps__step-content">
									<div className="body2-semibold order-process-steps__step-number">
										{ `STEP ${ index + 1 }` }
									</div>
									<RichText
										tagName="div"
										className="subtitle2-sbold order-process-steps__step-title mb-0"
										value={ step.title || '' }
										onChange={ ( value ) =>
											updateStep(
												step.id,
												'title',
												value
											)
										}
										placeholder={ __(
											'Add Step Title',
											'ambrygen-web'
										) }
									/>
									<RichText
										tagName="div"
										className="body1 order-process-steps__step-desc"
										value={ step.description || '' }
										onChange={ ( value ) =>
											updateStep(
												step.id,
												'description',
												value
											)
										}
										placeholder={ __(
											'Add Step Description',
											'ambrygen-web'
										) }
									/>
								</div>
							</div>
						);
					} ) }
				</div>
			</div>
		</>
	);
}
