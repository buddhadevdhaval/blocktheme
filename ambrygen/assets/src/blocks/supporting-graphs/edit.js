import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, Placeholder } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';
import { ImageUploader, TagSelector } from '../_shared/components';

const createItemId = (prefix) =>
	`${prefix}-${Date.now().toString(36)}-${Math.random()
		.toString(36)
		.slice(2, 8)}`;

const createStep = () => ({
	id: createItemId('step'),
	iconId: 0,
	iconUrl: '',
	iconAlt: '',
	label: '',
});

const createSocialCard = () => ({
	id: createItemId('card'),
	title: '',
	value: '',
	unit: '',
});

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		heading,
		headingTag,
		description,
		imageUrl,
		imageAlt,
		variation = 'default',
		steps = [],
		turnaroundLabel,
		turnaroundValue,
		turnaroundDescription,
		socialCards = [],
	} = attributes;

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId || !blockId.endsWith(clientId.slice(0, 8))) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [blockId, clientId, setAttributes]);

	const isStepsVariation = variation === 'variation-style-steps';
	const VARIANTS = [
		{
			label: 'Graph',
			value: 'default',
			image: getThemeAssetUrl(
				'/assets/src/images/supporting-graphs/graph.png'
			),
		},
		{
			label: 'Steps',
			value: 'variation-style-steps',
			image: getThemeAssetUrl(
				'/assets/src/images/supporting-graphs/steps.png'
			),
		},
	];

	const blockProps = useBlockProps({
		className: `supporting-graphs${isStepsVariation ? ' variation-style-steps' : ''
			}`,
	});

	const updateStep = (index, field, value) => {
		const updatedSteps = [...steps];
		updatedSteps[index] = {
			...updatedSteps[index],
			[field]: value,
		};
		setAttributes({ steps: updatedSteps });
	};

	const addStep = () => {
		setAttributes({ steps: [...steps, createStep()] });
	};

	const removeStep = (index) => {
		setAttributes({
			steps: steps.filter((step, stepIndex) => stepIndex !== index),
		});
	};

	const updateSocialCard = (index, field, value) => {
		const updatedCards = [...socialCards];
		updatedCards[index] = {
			...updatedCards[index],
			[field]: value,
		};
		setAttributes({ socialCards: updatedCards });
	};

	const addSocialCard = () => {
		setAttributes({
			socialCards: [...socialCards, createSocialCard()],
		});
	};

	const removeSocialCard = (index) => {
		setAttributes({
			socialCards: socialCards.filter(
				(card, cardIndex) => cardIndex !== index
			),
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Layout Variation', 'ambrygen-web')}
					initialOpen={true}
				>
					<div className="layout-variant-selector">
						{VARIANTS.map((variant) => (
							<button
								key={variant.value}
								type="button"
								className={`variant-button ${variation === variant.value
									? 'is-selected'
									: ''
									}`}
								onClick={() =>
									setAttributes({
										variation: variant.value,
									})
								}
							>
								<img
									src={variant.image}
									alt={variant.label}
								/>
								<span>{variant.label}</span>
							</button>
						))}
					</div>
				</PanelBody>
				<PanelBody title={__('Heading Settings', 'ambrygen-web')}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h2'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody
					title={__('Supporting Graph Settings', 'ambrygen-web')}
				>
					{!isStepsVariation && (
						<>
							<ImageUploader
								label={__('Chart Image', 'ambrygen-web')}
								url={imageUrl}
								onSelect={(media) =>
									setAttributes({
										imageUrl: media.url,
										imageId: media.id,
										imageAlt: media.alt || '',
									})
								}
								onRemove={() =>
									setAttributes({
										imageUrl: '',
										imageId: 0,
										imageAlt: '',
									})
								}
							/>
						</>
					)}
					{isStepsVariation && (
						<>
							<Button variant="primary" onClick={addStep}>
								{__('Add Step', 'ambrygen-web')}
							</Button>
							<Button
								variant="secondary"
								onClick={addSocialCard}
								style={{ marginLeft: '8px' }}
							>
								{__('Add Item', 'ambrygen-web')}
							</Button>
						</>
					)}
					{isStepsVariation &&
						steps.map((step, index) => (
							<ImageUploader
								key={step.id || index}
								label={sprintf(
									/* translators: %d: Step number. */
									__('Step %d Icon', 'ambrygen-web'),
									index + 1
								)}
								url={step.iconUrl}
								onSelect={(media) => {
									const updatedSteps = [...steps];
									updatedSteps[index] = {
										...updatedSteps[index],
										iconId: media.id || 0,
										iconUrl: media.url,
										iconAlt: media.alt || step.label || '',
									};
									setAttributes({ steps: updatedSteps });
								}}
								onRemove={() => {
									const updatedSteps = [...steps];
									updatedSteps[index] = {
										...updatedSteps[index],
										iconId: 0,
										iconUrl: '',
										iconAlt: '',
									};
									setAttributes({ steps: updatedSteps });
								}}
							/>
						))}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{isStepsVariation ? (
					<>
						{steps.length > 0 && (
							<div className="supporting-graphs__steps">
								{steps.map((step, index) => (
									<div
										className="supporting-graphs__step-card"
										key={step.id || index}
									>
										{step.iconUrl && (
											<div className="supporting-graphs__step-icon">
												<img
													src={step.iconUrl}
													alt={step.iconAlt || ''}
													width="100"
													height="100"
												/>
											</div>
										)}
										<RichText
											tagName="div"
											className="subtitle2-sbold supporting-graphs__step-label"
											value={step.label}
											onChange={(value) =>
												updateStep(
													index,
													'label',
													value
												)
											}
											placeholder={__(
												'Add step label',
												'ambrygen-web'
											)}
										/>
										<Button
											variant="secondary"
											isDestructive
											onClick={() =>
												removeStep(index)
											}
										>
											{__(
												'Remove Step',
												'ambrygen-web'
											)}
										</Button>
									</div>
								))}
							</div>
						)}

						<div className="supporting-graphs__content">
							<RichText
								tagName="div"
								className="supporting-graphs__turnaround-label"
								value={turnaroundLabel}
								onChange={(value) =>
									setAttributes({
										turnaroundLabel: value,
									})
								}
								placeholder={__(
									'Add label',
									'ambrygen-web'
								)}
							/>
							<RichText
								tagName="div"
								className="supporting-graphs__turnaround-value"
								value={turnaroundValue}
								onChange={(value) =>
									setAttributes({
										turnaroundValue: value,
									})
								}
								placeholder={__(
									'Add label',
									'ambrygen-web'
								)}
							/>
							<RichText
								tagName="div"
								className="subtitle1-regular supporting-graphs__description"
								value={description}
								onChange={(value) =>
									setAttributes({
										description: value,
									})
								}
								placeholder={__(
									'Add description',
									'ambrygen-web'
								)}
							/>

							{socialCards.length > 0 && (
								<div className="social-cards">
									{socialCards.map((card, index) => (
										<div
											className="social-cards__item"
											key={card.id || index}
										>
											<RichText
												tagName="div"
												className="social-cards__title subtitle1-sbold"
												value={card.title}
												onChange={(value) =>
													updateSocialCard(
														index,
														'title',
														value
													)
												}
												placeholder={__(
													'Add title',
													'ambrygen-web'
												)}
											/>
											<div className="social-cards__value">
												<RichText
													tagName="span"
													value={card.value}
													onChange={(value) =>
														updateSocialCard(
															index,
															'value',
															value
														)
													}
													placeholder={__(
														'Add value',
														'ambrygen-web'
													)}
												/>
												{' '}
												<RichText
													tagName="span"
													className="social-cards__unit"
													value={card.unit}
													onChange={(value) =>
														updateSocialCard(
															index,
															'unit',
															value
														)
													}
													placeholder={__(
														'Add unit',
														'ambrygen-web'
													)}
												/>
											</div>
											<Button
												variant="secondary"
												isDestructive
												onClick={() =>
													removeSocialCard(index)
												}
											>
												{__(
													'Remove Item',
													'ambrygen-web'
												)}
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					</>
				) : (
					<>
						<div className="supporting-graphs__chart-card">
							<div className="supporting-graphs__chart-image">
								{imageUrl ? (
									<img
										src={imageUrl}
										alt={imageAlt || ''}
									/>
								) : (
									<Placeholder
										icon="format-image"
										label={__(
											'Chart image',
											'ambrygen-web'
										)}
										instructions={__(
											'Upload the supporting graph image from block settings.',
											'ambrygen-web'
										)}
									/>
								)}
							</div>
						</div>

						<div className="supporting-graphs__content">
							<RichText
								tagName={headingTag || 'h2'}
								className="heading-4 block-title mb-0 supporting-graphs__heading"
								value={heading}
								onChange={(value) =>
									setAttributes({ heading: value })
								}
								placeholder={__(
									'Add heading',
									'ambrygen-web'
								)}
							/>
							<div className="is-style-gl-s24"></div>
							<RichText
								tagName="div"
								className="subtitle1-regular supporting-graphs__description"
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
								}
								placeholder={__(
									'Add description',
									'ambrygen-web'
								)}
							/>
						</div>
					</>
				)}
			</div>
		</>
	);
}

