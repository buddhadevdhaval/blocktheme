import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { TagSelector, ImageUploader, ItemHeader } from '../_shared/components';

const createStepId = () =>
	`step-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createStep = ( count ) => ( {
	id: createStepId(),
	stepNumber: `STEP ${ count }`,
	title: '',
	description: '',
	iconUrl: '',
	iconId: 0,
	iconAlt: '',
} );

const DEFAULT_STEPS = [
	{
		id: 'step-1',
		stepNumber: 'STEP 1',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
	{
		id: 'step-2',
		stepNumber: 'STEP 2',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
	{
		id: 'step-3',
		stepNumber: 'STEP 3',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
	{
		id: 'step-4',
		stepNumber: 'STEP 4',
		title: '',
		description: '',
		iconUrl: '',
		iconId: 0,
		iconAlt: '',
	},
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		headingTag,
		headingText,
		subtitle,
		steps = [],
	} = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;
		const hasMissingIds = steps.some( ( step ) => ! step?.id );
		const nextAttributes = {};

		if ( ! blockId ) {
			nextAttributes.blockId = expectedId;
		}

		if ( ! steps.length ) {
			nextAttributes.steps = DEFAULT_STEPS;
		} else if ( hasMissingIds ) {
			nextAttributes.steps = steps.map( ( step ) => ( {
				...step,
				id: step?.id || createStepId(),
			} ) );
		}

		if ( ! Object.keys( nextAttributes ).length ) {
			return;
		}

		setAttributes( nextAttributes );
	}, [ clientId, blockId, steps, setAttributes ] );

	const updateStep = ( stepId, field, value ) => {
		setAttributes( {
			steps: steps.map( ( step ) =>
				step.id === stepId ? { ...step, [ field ]: value } : step
			),
		} );
	};

	const addStep = () => {
		setAttributes( {
			steps: [ ...steps, createStep( steps.length + 1 ) ],
		} );
	};

	const removeStep = ( stepId ) => {
		if ( steps.length <= 1 ) {
			return;
		}

		setAttributes( {
			steps: steps.filter( ( step ) => step.id !== stepId ),
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

		setAttributes( { steps: updatedSteps } );
	};

	const HeadingTag = headingTag || 'h2';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Section Settings', 'ambrygen-web' ) }
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
					<Button
						variant="primary"
						onClick={ addStep }
						style={ { marginTop: '12px' } }
					>
						{ __( 'Add New Step', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				{ steps.map( ( step, index ) => (
					<PanelBody
						key={ step.id }
						title={ `${ __( 'Step', 'ambrygen-web' ) } ${
							index + 1
						}` }
						initialOpen={ false }
					>
						<ItemHeader
							index={ index }
							label={ step.title }
							total={ steps.length }
							onMove={ ( i, dir ) =>
								moveStep( steps[ i ].id, dir )
							}
							onRemove={ ( i ) => removeStep( steps[ i ].id ) }
							minCount={ 1 }
						/>

						<ImageUploader
							label={ __( 'Step Icon', 'ambrygen-web' ) }
							url={ step.iconUrl || '' }
							onSelect={ ( media ) =>
								setAttributes( {
									steps: steps.map( ( currentStep ) =>
										currentStep.id === step.id
											? {
													...currentStep,
													iconUrl: media.url || '',
													iconId: media.id || 0,
													iconAlt:
														media.alt ||
														currentStep.iconAlt ||
														'',
											  }
											: currentStep
									),
								} )
							}
							onRemove={ () =>
								setAttributes( {
									steps: steps.map( ( currentStep ) =>
										currentStep.id === step.id
											? {
													...currentStep,
													iconUrl: '',
													iconId: 0,
													iconAlt: '',
											  }
											: currentStep
									),
								} )
							}
						/>
					</PanelBody>
				) ) }
			</InspectorControls>

			<div
				{ ...useBlockProps( {
					className: 'block-layout ordering-process-steps',
				} ) }
			>
				<div className="ordering-process-steps__header">
					<RichText
						tagName={ HeadingTag }
						className="heading-4 block-title mb-0"
						value={ headingText }
						onChange={ ( value ) =>
							setAttributes( { headingText: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12" aria-hidden="true"></div>
					<RichText
						tagName="p"
						className="body1 ordering-process-steps__subtitle"
						value={ subtitle }
						onChange={ ( value ) =>
							setAttributes( { subtitle: value } )
						}
						placeholder={ __( 'Add Description…', 'ambrygen-web' ) }
					/>
				</div>

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="ordering-process-steps__steps">
					{ steps.map( ( step ) => {
						return (
							<div
								key={ step.id }
								className="ordering-process-steps__step"
							>
								<div className="ordering-process-steps__step-icon">
									{ step.iconUrl && (
										<img
											src={ step.iconUrl }
											alt={ step.iconAlt || '' }
										/>
									) }
								</div>
								<div className="ordering-process-steps__step-content">
									<RichText
										tagName="div"
										className="body2-semibold ordering-process-steps__step-number"
										value={ step.stepNumber || '' }
										onChange={ ( value ) =>
											updateStep(
												step.id,
												'stepNumber',
												value
											)
										}
										placeholder={ __(
											'STEP Count',
											'ambrygen-web'
										) }
									/>
									<RichText
										tagName="div"
										className="subtitle2-sbold ordering-process-steps__step-title mb-0"
										value={ step.title || '' }
										onChange={ ( value ) =>
											updateStep(
												step.id,
												'title',
												value
											)
										}
										placeholder={ __(
											'Step title',
											'ambrygen-web'
										) }
									/>
									<RichText
										tagName="div"
										className="body1 ordering-process-steps__step-desc"
										value={ step.description || '' }
										onChange={ ( value ) =>
											updateStep(
												step.id,
												'description',
												value
											)
										}
										placeholder={ __(
											'Step description',
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
