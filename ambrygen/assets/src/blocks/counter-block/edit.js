import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { trash } from '@wordpress/icons';
import { useEffect, useMemo } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';

const createCounterId = () =>
	`counter-${Date.now().toString(36)}-${Math.random()
		.toString(36)
		.slice(2, 8)}`;

const createCounter = () => ({
	id: createCounterId(),
	number: '0',
	numberSm: '',
	numberLg2: '',
	suffix: '',
	title: '',
	description: '',
});

function CounterPreviewItem({
	counter,
	index,
	total,
	updateCounter,
	removeCounter,
	variation,
}) {
	return (
		<div className="stats-counter__item">
			<div
				className="reorder-controls d-flex flex-column align-items-center"
			>
				<Button
					icon={trash}
					size="small"
					isDestructive
					disabled={total <= 1}
					onClick={() => removeCounter(counter.id)}
					label={__('Remove', 'ambrygen-web')}
				/>
				<div>
					<strong>
						{__('Item', 'ambrygen-web')} {index + 1}:{' '}
						{counter.title || __('Untitled', 'ambrygen-web')}
					</strong>
				</div>

			</div>

			{variation !== 'variation-2' && (
				<div className="stats-counter__number heading-3 mb-0">
					<RichText
						tagName="span"
						className="stats-counter__number-value"
						value={counter.number || ''}
						onChange={(value) =>
							updateCounter(counter.id, 'number', value)
						}
						placeholder={__('0', 'ambrygen-web')}
						aria-label={__('Counter number', 'ambrygen-web')}
					/>
					<RichText
						tagName="span"
						className="stats-counter__number-suffix"
						value={counter.suffix || ''}
						onChange={(value) =>
							updateCounter(counter.id, 'suffix', value)
						}
						placeholder={__('', 'ambrygen-web')}
						aria-label={__('Counter suffix', 'ambrygen-web')}
					/>
				</div>
			)}

			<RichText
				tagName="div"
				className={
					variation === 'variation-2'
						? 'intro__stat-value-lg heading-3'
						: 'stats-counter__label subtitle1-sbold'
				}
				value={counter.title || ''}
				onChange={(value) =>
					updateCounter(counter.id, 'title', value)
				}
				placeholder={
					variation === 'variation-2'
						? __('Enter Digit', 'ambrygen-web')
						: __('Counter title', 'ambrygen-web')
				}
				aria-label={__('Value/Title', 'ambrygen-web')}
			/>

			{variation !== 'variation-2' && (
				<div className="is-style-gl-s8" aria-hidden="true"></div>
			)}

			<RichText
				tagName="div"
				className={
					variation === 'variation-2'
						? 'intro__stat-desc'
						: 'stats-counter__description'
				}
				value={counter.description || ''}
				onChange={(value) =>
					updateCounter(counter.id, 'description', value)
				}
				placeholder={__('Counter description', 'ambrygen-web')}
				aria-label={__('Counter description', 'ambrygen-web')}
			/>
		</div>
	);
}

export default function Edit({ attributes, setAttributes, clientId }) {
	const { blockId, counters = [], variation } = attributes;

	const VARIANTS = useMemo(
		() => [
			{
				label: __('Variation 1', 'ambrygen-web'),
				value: 'variation-1',
				image: getThemeAssetUrl(
					'/assets/src/images/counter/variation-1.png'
				),
			},
			{
				label: __('Variation 2', 'ambrygen-web'),
				value: 'variation-2',
				image: getThemeAssetUrl(
					'/assets/src/images/counter/variation-2.png'
				),
			},
		],
		[]
	);

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId || !blockId.endsWith(clientId.slice(0, 8))) {
			setAttributes({ blockId: expectedId });
		}
	}, [clientId, blockId, setAttributes]);

	useEffect(() => {
		const hasMissingIds = counters.some((counter) => !counter?.id);

		if (!hasMissingIds) {
			return;
		}

		setAttributes({
			counters: counters.map((counter) => ({
				...counter,
				id: counter?.id || createCounterId(),
			})),
		});
	}, [counters, setAttributes]);

	const updateCounter = (counterId, field, value) => {
		setAttributes({
			counters: counters.map((counter) =>
				counter.id === counterId
					? { ...counter, [field]: value }
					: counter
			),
		});
	};

	const addCounter = () => {
		setAttributes({
			counters: [...counters, createCounter()],
		});
	};

	const removeCounter = (counterId) => {
		if (counters.length <= 1) {
			return;
		}

		setAttributes({
			counters: counters.filter(
				(counter) => counter.id !== counterId
			),
		});
	};

	return (
		<>
			<div
				{...useBlockProps({
					className: 'counter-block',
				})}
			>
				<InspectorControls>
					<PanelBody title={__('Layout Variation', 'ambrygen-web')}>
						<div className="layout-variant-selector">
							{VARIANTS.map((item) => (
								<button
									key={item.value}
									type="button"
									className={`variant-button ${variation === item.value
										? 'is-selected'
										: ''
										}`}
									aria-pressed={variation === item.value}
									onClick={() =>
										setAttributes({
											variation: item.value,
										})
									}
								>
									<img
										src={item.image}
										alt={item.label}
									/>
									<span>{item.label}</span>
								</button>
							))}
						</div>
					</PanelBody>
				</InspectorControls>
				<div className="counter-block__actions">
					<Button variant="primary" onClick={addCounter}>
						{__('Add Counter', 'ambrygen-web')}
					</Button>
				</div>
				<div
					className={`stats-counter stats-counter--${variation}`}
				>
					{counters.map((counter, index) => (
						<CounterPreviewItem
							key={counter.id}
							counter={counter}
							index={index}
							total={counters.length}
							updateCounter={updateCounter}
							removeCounter={removeCounter}
							variation={variation}
						/>
					))}
				</div>
			</div>
		</>
	);
}
