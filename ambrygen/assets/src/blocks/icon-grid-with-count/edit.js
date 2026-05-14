import {
	InnerBlocks,
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	SearchControl,
	Spinner,
	Button,
	Notice,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useUniqueBlockId } from '../_shared/hooks';
import {
	TagSelector,
	CtaButtonField,
	BlockExamplePreview,
	ImageUploader,
} from '../_shared/components';

const ITEM_BLOCK_NAME = 'ambrygen/icon-grid-with-count-item';
const ALLOWED_BLOCKS = [ITEM_BLOCK_NAME];
const TERMS_PER_PAGE = 20;

export default function Edit({ attributes, setAttributes, clientId }) {
	const { heading, headingTag, description, link, blockId, backgroundImage } =
		attributes;
	const { insertBlocks, removeBlocks } = useDispatch('core/block-editor');
	const isExample = blockId === 'icon-grid-with-count-example';
	const HeadingTag = headingTag || 'h2';
	const hasBackgroundImage = Boolean(backgroundImage?.url);
	const [termSearchInput, setTermSearchInput] = useState('');

	useUniqueBlockId({
		blockId,
		clientId,
		enabled: !isExample,
		idPrefix: 'section',
		setAttributes,
	});

	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId),
		[clientId]
	);
	const selectedTermIds = useMemo(
		() =>
			innerBlocks
				.map((block) => Number(block.attributes?.selectedTerm) || 0)
				.filter(Boolean),
		[innerBlocks]
	);
	const availableTerms = useSelect(
		(select) => {
			const query = {
				per_page: TERMS_PER_PAGE,
				hide_empty: false,
				orderby: 'name',
				order: 'asc',
			};

			if (termSearchInput.trim()) {
				query.search = termSearchInput.trim();
			}

			return select('core').getEntityRecords(
				'taxonomy',
				'poster_category',
				query
			);
		},
		[termSearchInput]
	);
	const selectedTermsById = useSelect(
		(select) => {
			if (!selectedTermIds.length) {
				return {};
			}

			const terms = selectedTermIds
				.map((termId) =>
					select('core').getEntityRecord(
						'taxonomy',
						'poster_category',
						termId
					)
				)
				.filter(Boolean);

			return terms.reduce((termsById, term) => {
				termsById[term.id] = term;
				return termsById;
			}, {});
		},
		[selectedTermIds]
	);

	const termOptions = useMemo(() => {
		if (!Array.isArray(availableTerms)) {
			return [];
		}

		return availableTerms
			.filter((term) => !selectedTermIds.includes(term.id))
			.map((term) => ({
				label:
					decodeEntities(term.name).trim() ||
					sprintf(
						/* translators: %d: taxonomy term ID. */
						__('Category #%d', 'ambrygen-web'),
						term.id
					),
				value: term.id,
			}));
	}, [availableTerms, selectedTermIds]);
	const selectedTermOptions = useMemo(
		() =>
			selectedTermIds.map((termId) => {
				const term = selectedTermsById[termId];
				return {
					value: termId,
					label:
						decodeEntities(term?.name || '').trim() ||
						sprintf(
							/* translators: %d: taxonomy term ID. */
							__('Category #%d', 'ambrygen-web'),
							termId
						),
					isLoading: !term,
				};
			}),
		[selectedTermIds, selectedTermsById]
	);

	useEffect(() => {
		const emptyBlockIds = innerBlocks
			.filter(
				(block) => !(Number(block.attributes?.selectedTerm) || 0)
			)
			.map((block) => block.clientId);

		if (emptyBlockIds.length) {
			removeBlocks(emptyBlockIds, false);
		}
	}, [innerBlocks, removeBlocks]);

	const toggleTermBlock = (termId, isSelected) => {
		if (isSelected) {
			if (selectedTermIds.includes(termId)) {
				return;
			}

			insertBlocks(
				createBlock(ITEM_BLOCK_NAME, { selectedTerm: termId }),
				innerBlocks.length,
				clientId,
				false
			);
			return;
		}

		const blocksToRemove = innerBlocks
			.filter(
				(block) =>
					(Number(block.attributes?.selectedTerm) || 0) === termId
			)
			.map((block) => block.clientId);

		if (blocksToRemove.length) {
			removeBlocks(blocksToRemove, false);
		}
	};

	if (isExample) {
		return (
			<BlockExamplePreview
				imagePath="/assets/src/images/icon-grid-with-count/preview.png"
			/>
		);
	}

	const blockProps = useBlockProps({
		className: 'block-layout our-testing-menu',
		id: blockId || undefined,
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Heading Settings', 'ambrygen-web')} initialOpen={false}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h2'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody title={__('Display Settings', 'ambrygen-web')}>
					<ImageUploader
						url={backgroundImage?.url || ''}
						label={__('Background Image', 'ambrygen-web')}
						onSelect={(media) =>
							setAttributes({
								backgroundImage: {
									id: media.id,
									url: media.url,
									alt: media.alt || '',
								},
							})
						}
						onRemove={() =>
							setAttributes({
								backgroundImage: {
									url: '',
									id: 0,
									alt: '',
								},
							})
						}
					/>
					<CtaButtonField
						label={__('', 'ambrygen-web')}
						textLabel={__('Link Text', 'ambrygen-web')}
						defaultVariant="primary"
						value={link}
						showVariant={false}
						onChange={(value) =>
							setAttributes({ link: value })
						}
					/>
				</PanelBody>
				<PanelBody
					title={__('Grid Items', 'ambrygen-web')}
					initialOpen={false}
				>
					<p
						className="icon-grid-with-count__term-count"
						role="status"
						aria-live="polite"
						aria-atomic="true"
					>
						{sprintf(
							/* translators: %d: number of selected categories. */
							__('%d category(s) selected', 'ambrygen-web'),
							selectedTermIds.length
						)}
					</p>
					<TermPicker
						isLoading={!availableTerms}
						options={termOptions}
						selectedTerms={selectedTermOptions}
						searchValue={termSearchInput}
						onSearchChange={setTermSearchInput}
						onToggle={toggleTermBlock}
						hasOptions={termOptions.length > 0}
					/>
				</PanelBody>
			</InspectorControls>
			{hasBackgroundImage && (
				<div className="block-bg-image">
					<img
						src={backgroundImage.url}
						alt={backgroundImage.alt || ''}
					/>
				</div>
			)}
			<div className="our-testing-menu__header block__rowflex">
				<div className='block__rowflex--col-left'>
					<RichText
						tagName={HeadingTag}
						className="block-title block__rowflex--heading-title heading-3 mb-0"
						value={heading}
						onChange={(value) =>
							setAttributes({ heading: value })
						}
						placeholder={__('Add Heading...', 'ambrygen-web')}
					/>
				</div>

				<div className="block__rowflex--block-content subtitle1-reg">
					<RichText
						tagName="p"
						value={description}
						onChange={(value) =>
							setAttributes({ description: value })
						}
						placeholder={__(
							'Add Description...',
							'ambrygen-web'
						)}
					/>

					<div className="block_rowflex-link">
						{link?.url && link?.text && (
							<a
								href={link.url}
								target={link.target || undefined}
								rel={link.rel || undefined}
								className="site-btn is-style-site-text-btn has-right-arrow"
								onClick={(e) => e.preventDefault()}
							>
								{link.text}
								{link.target === '_blank' && (
									<span className="screen-reader-text">
										{__(
											'(opens in new tab)',
											'ambrygen-web'
										)}
									</span>
								)}
							</a>
						)}
					</div>
				</div>
			</div>
			<div className="is-style-gl-s64" aria-hidden="true"></div>

			<div className="our-testing-menu__grid">
				{selectedTermIds.length === 0 && (
					<Notice status="info" isDismissible={false}>
						{__(
							'Add categories from the Grid Items settings panel.',
							'ambrygen-web'
						)}
					</Notice>
				)}
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					renderAppender={false}
					orientation="horizontal"
				/>
			</div>
		</div>
	);
}

function TermPicker({
	isLoading,
	options,
	selectedTerms,
	searchValue,
	onSearchChange,
	onToggle,
	hasOptions,
}) {
	return (
		<div className="icon-grid-with-count__term-picker">
			{isLoading ? (
				<Spinner />
			) : (
				<>
					{selectedTerms.length > 0 && (
						<div className="icon-grid-with-count__selected-terms">
							<div className="icon-grid-with-count__picker-label">
								{__('Selected Categories', 'ambrygen-web')}
							</div>
							<div
								className="icon-grid-with-count__selected-term-list"
								role="list"
								aria-label={__(
									'Selected categories',
									'ambrygen-web'
								)}
							>
								{selectedTerms.map((term) => (
									<div
										key={term.value}
										className="icon-grid-with-count__selected-term"
										role="listitem"
									>
										<span>
											{term.label}
											{term.isLoading && (
												<span className="screen-reader-text">
													{__(
														' loading',
														'ambrygen-web'
													)}
												</span>
											)}
										</span>
										<Button
											isDestructive
											variant="tertiary"
											size="small"
											onClick={() =>
												onToggle(term.value, false)
											}
										>
											{__('Remove', 'ambrygen-web')}
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="icon-grid-with-count__picker-field">
						<SearchControl
							label={__('Add Category', 'ambrygen-web')}
							value={searchValue}
							onChange={onSearchChange}
							placeholder={__(
								'Search categories',
								'ambrygen-web'
							)}
						/>
						<p className="icon-grid-with-count__picker-help">
							{hasOptions
								? __(
									'Search and add categories without using the item dropdown.',
									'ambrygen-web'
								)
								: __(
									'No matching categories are available to add.',
									'ambrygen-web'
								)}
						</p>
						{hasOptions && (
							<div
								className="icon-grid-with-count__term-options"
								role="list"
								aria-label={__(
									'Available categories to add',
									'ambrygen-web'
								)}
							>
								{options.map((option) => (
									<div
										key={option.value}
										className="icon-grid-with-count__term-option"
										role="listitem"
									>
										<span>{option.label}</span>
										<Button
											variant="secondary"
											size="small"
											onClick={() =>
												onToggle(option.value, true)
											}
										>
											{__('Add', 'ambrygen-web')}
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
