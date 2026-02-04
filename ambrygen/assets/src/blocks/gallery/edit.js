import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInput,
} from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl } from '@wordpress/components';
import { Fragment, useEffect, useCallback } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

const PLACEHOLDER_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/uploads/default-image.webp';

const GALLERY_VARIATIONS = [
	{
		key: 'two-column',
		label: '2 Column Layout',
		itemCount: 2,
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/two-column.png',
	},
	{
		key: 'five-column',
		label: '5 Column Layout',
		itemCount: 5,
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/five-column.png',
	},
];

// Build responsive srcset from WP image sizes
const buildSrcSet = (sizes = {}) =>
	Object.values(sizes)
		.filter((s) => s?.source_url && s?.width)
		.map((s) => `${s.source_url} ${s.width}w`)
		.join(', ');

function MediaUploadPanel({
	title,
	imageUrl,
	imageAlt,
	onSelect,
	onRemove,
	selectLabel,
	replaceLabel,
	removeLabel,
	headingTag,
	onHeadingTagChange,
	link,
	onLinkChange,
}) {
	return (
		<PanelBody title={title} initialOpen={false}>
			{!imageUrl ? (
				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelect}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button onClick={open} variant="primary">
								{selectLabel}
							</Button>
						)}
					/>
				</MediaUploadCheck>
			) : (
				<div className="image-preview">
					<img src={imageUrl} alt={imageAlt || ''} />

					<div className="image-actions">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelect}
								allowedTypes={['image']}
								render={({ open }) => (
									<Button
										onClick={open}
										variant="secondary"
									>
										{replaceLabel}
									</Button>
								)}
							/>
						</MediaUploadCheck>

						<Button
							variant="link"
							isDestructive
							onClick={onRemove}
						>
							{removeLabel}
						</Button>
					</div>

					<SelectControl
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h5'}
						options={[
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						]}
						onChange={onHeadingTagChange}
					/>

					<URLInput
						label={__('Link', 'ambrygen-web')}
						value={link || ''}
						onChange={onLinkChange}
						className="components-base-control"
						__experimentalSuggestions
					/>
				</div>
			)}
		</PanelBody>
	);
}

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		items = [],
		variation = 'two-column',
		heading = '',
		headingTag = 'h2',
	} = attributes;

	const currentVariant =
		GALLERY_VARIATIONS.find((v) => v.key === variation) ||
		GALLERY_VARIATIONS[0];

	const requiredCount = currentVariant.itemCount;

	// Initialize default items
	useEffect(() => {
		let newItems = [...items];

		if (newItems.length === 0 && variation === 'two-column') {
			newItems = [
				{
					imageUrl:
						'/wp-content/themes/ambrygen/assets/src/images/image-grid/item-1.jpg',
					imageId: 0,
					imageAlt: 'Providers',
					imageSrcSet: '',
					imageSizes: '(max-width: 768px) 100vw, 50vw',
					title: __('Providers', 'ambrygen-web'),
					headingTag: 'h5',
					description: __(
						'Learn more about how we work with our providers',
						'ambrygen-web'
					),
					link: '#',
				},
				{
					imageUrl:
						'/wp-content/themes/ambrygen/assets/src/images/image-grid/item-2.jpg',
					imageId: 0,
					imageAlt: 'Patients',
					imageSrcSet: '',
					imageSizes: '(max-width: 768px) 100vw, 50vw',
					title: __('Patients', 'ambrygen-web'),
					headingTag: 'h5',
					description: __(
						'Learn more about our offerings to patients',
						'ambrygen-web'
					),
					link: '#',
				},
			];
		}

		while (newItems.length < requiredCount) {
			newItems.push({
				imageUrl: '',
				imageId: 0,
				imageAlt: '',
				imageSrcSet: '',
				imageSizes: '(max-width: 768px) 100vw, 33vw',
				title: __('Grid Item Title', 'ambrygen-web'),
				headingTag: 'h5',
				description: '',
				link: '',
			});
		}

		if (newItems.length > requiredCount) {
			newItems = newItems.slice(0, requiredCount);
		}

		if (newItems.length !== items.length) {
			setAttributes({ items: newItems });
		}
	}, [variation, items, requiredCount, setAttributes]);

	const updateItem = useCallback(
		(index, key, value) => {
			const newItems = [...items];
			newItems[index] = { ...newItems[index], [key]: value };
			setAttributes({ items: newItems });
		},
		[items, setAttributes]
	);

	const handleImageSelect = useCallback(
		(index, media) => {
			const sizes = media?.sizes || media?.media_details?.sizes || {};
			const newItems = [...items];

			newItems[index] = {
				...newItems[index],
				imageUrl: media.url,
				imageId: media.id,
				imageAlt: media.alt || '',
				imageSrcSet: buildSrcSet(sizes),
				imageSizes: '(max-width: 768px) 100vw, 33vw',
			};

			setAttributes({ items: newItems });
		},
		[items, setAttributes]
	);

	const handlePanelOpen = (blockClientId) => {
		if (blockClientId) {
			dispatch('core/block-editor').selectBlock(blockClientId);
			dispatch('core/edit-post').openGeneralSidebar(
				'edit-post/block'
			);
		}
	};

	const blockProps = useBlockProps({
		className: `image-grid-block variation-${variation}`,
	});

	const HeadingTag = headingTag || 'h2';

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={__('Heading Settings', 'ambrygen-web')}
					initialOpen
				>
					<SelectControl
						label={__('Main Heading Tag', 'ambrygen-web')}
						value={headingTag}
						options={[
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						]}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Choose Variation', 'ambrygen-web')}
					initialOpen
				>
					<div className="ambrygen-variation-selector">
						{GALLERY_VARIATIONS.map((option) => (
							<button
								key={option.key}
								type="button"
								className={`variation-card ${variation === option.key ? 'is-active' : ''
									}`}
								onClick={() =>
									setAttributes({ variation: option.key })
								}
							>
								<img
									src={option.preview}
									alt={option.label}
								/>
								<span>{option.label}</span>
							</button>
						))}
					</div>
				</PanelBody>

				{items.map((item, index) => (
					<MediaUploadPanel
						key={index}
						title={sprintf(
							// translators: %d is the image number.
							__('Image Grid %d', 'ambrygen-web'),
							index + 1
						)}
						imageUrl={item.imageUrl}
						imageAlt={item.imageAlt}
						selectLabel={__('Select Image', 'ambrygen-web')}
						replaceLabel={__('Replace Image', 'ambrygen-web')}
						removeLabel={__('Remove Image', 'ambrygen-web')}
						onSelect={(media) =>
							handleImageSelect(index, media)
						}
						onRemove={() => updateItem(index, 'imageUrl', '')}
						headingTag={item.headingTag}
						onHeadingTagChange={(value) =>
							updateItem(index, 'headingTag', value)
						}
						link={item.link}
						onLinkChange={(value) =>
							updateItem(index, 'link', value)
						}
					/>
				))}
			</InspectorControls>

			<div {...blockProps}>
				<div className="get-started-ambry-block">
					<HeadingTag className="block-title heading-3 mb-0">
						<RichText
							tagName="span"
							value={heading}
							onChange={(value) =>
								setAttributes({ heading: value })
							}
							placeholder={__(
								'Get Started with Ambry',
								'ambrygen-web'
							)}
							allowedFormats={['core/text-color']}
						/>
					</HeadingTag>

					<div className="card-grid-block">
						{items.map((item, idx) => {
							const ItemHeadingTag =
								item.headingTag || 'h5';

							return (
								<div key={idx} className="card-col">
									<div
										className="image-block"
										role="button"
										tabIndex={0}
										onClick={() =>
											handlePanelOpen(clientId)
										}
										onKeyDown={(e) => {
											if (
												e.key === 'Enter' ||
												e.key === ' '
											) {
												handlePanelOpen(
													clientId
												);
											}
										}}
									>
										<img
											src={
												item.imageUrl ||
												PLACEHOLDER_IMAGE
											}
											alt={
												item.imageAlt ||
												item.title ||
												''
											}
											loading="lazy"
										/>
									</div>

									<div className="card-info">
										<ItemHeadingTag className="link-btn mb-0">
											<RichText
												value={item.title}
												onChange={(value) =>
													updateItem(
														idx,
														'title',
														value
													)
												}
												placeholder={__(
													'Add title…',
													'ambrygen-web'
												)}
											/>
										</ItemHeadingTag>

										<div className="card-description text-small">
											<RichText
												value={
													item.description
												}
												onChange={(value) =>
													updateItem(
														idx,
														'description',
														value
													)
												}
												placeholder={__(
													'Add description…',
													'ambrygen-web'
												)}
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Fragment>
	);
}
