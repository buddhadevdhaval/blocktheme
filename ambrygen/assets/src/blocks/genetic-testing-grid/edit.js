import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';
import {
	TagSelector,
	BlockExamplePreview,
	ImageUploader,
} from '../_shared/components';

const TAXONOMY_QUERY = {
	per_page: 100,
	hide_empty: false,
	orderby: 'name',
	order: 'asc',
};

const INITIAL_VISIBLE_TEST_COUNT = 12;

function createTabId(clientId, index) {
	return `genetic-tab-${clientId.slice(0, 8)}-${index + 1}`;
}

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		heading,
		headingTag,
		description,
		selectedTabs = [],
		blockId,
		backgroundImage,
	} = attributes;
	const isExample = blockId === 'genetic-testing-grid-example';
	const HeadingTag = headingTag || 'h2';
	const hasBackgroundImage = Boolean(backgroundImage?.url);

	const blockProps = useBlockProps({
		className: 'block-layout',
		id: blockId || undefined,
	});

	const { terms, hasResolvedTerms } = useSelect((select) => {
		const { getEntityRecords, hasFinishedResolution } = select('core');

		return {
			terms: getEntityRecords(
				'taxonomy',
				'poster_category',
				TAXONOMY_QUERY
			),
			hasResolvedTerms: hasFinishedResolution('getEntityRecords', [
				'taxonomy',
				'poster_category',
				TAXONOMY_QUERY,
			]),
		};
	}, []);

	const [activeTab, setActiveTab] = useState(
		selectedTabs.length > 0 ? selectedTabs[0].termSlug : 'all'
	);
	const [expandedTabs, setExpandedTabs] = useState({});

	const { activePosts, hasResolvedPosts } = useSelect(
		(select) => {
			const { getEntityRecords, hasFinishedResolution } =
				select('core');
			const query = {
				per_page: 100,
				orderby: 'title',
				order: 'asc',
			};

			if (activeTab !== 'all' && terms) {
				const activeTerm = terms.find((t) => t.slug === activeTab);
				if (activeTerm) {
					query.poster_category = activeTerm.id;
				}
			}

			return {
				activePosts: getEntityRecords(
					'postType',
					'genetic-testing',
					query
				),
				hasResolvedPosts: hasFinishedResolution('getEntityRecords', [
					'postType',
					'genetic-testing',
					query,
				]),
			};
		},
		[activeTab, terms]
	);

	useEffect(() => {
		if (isExample) {
			return;
		}

		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({ blockId: expectedId });
		}
	}, [clientId, blockId, isExample, setAttributes]);

	useEffect(() => {
		if (isExample || !selectedTabs.length) {
			return;
		}

		const normalizedTabs = selectedTabs.map((tab, index) => ({
			...tab,
			id: tab?.id || createTabId(clientId, index),
		}));
		const needsUpdate = normalizedTabs.some(
			(tab, index) => tab.id !== selectedTabs[index]?.id
		);

		if (needsUpdate) {
			setAttributes({ selectedTabs: normalizedTabs });
		}
	}, [clientId, isExample, selectedTabs, setAttributes]);

	useEffect(() => {
		if (!selectedTabs.length) {
			if (activeTab !== 'all') {
				setActiveTab('all');
			}
			return;
		}

		const hasActiveTab = selectedTabs.some(
			(tab) => tab.termSlug === activeTab
		);

		if (!hasActiveTab) {
			setActiveTab(selectedTabs[0].termSlug || 'all');
		}
	}, [activeTab, selectedTabs]);

	const getPostCategory = (post) => {
		if (!post?.poster_category?.length || !terms?.length) {
			return __('Category', 'ambrygen-web');
		}

		const term = terms.find(
			(item) => item.id === Number(post.poster_category[0])
		);

		return term
			? decodeEntities(term.name)
			: __('Category', 'ambrygen-web');
	};

	const activeTabKey = activeTab || 'all';
	const isActiveTabExpanded = Boolean(expandedTabs[activeTabKey]);
	const visiblePosts = isActiveTabExpanded
		? activePosts
		: activePosts?.slice(0, INITIAL_VISIBLE_TEST_COUNT);
	const shouldShowViewAll =
		hasResolvedPosts &&
		activePosts?.length > INITIAL_VISIBLE_TEST_COUNT &&
		!isActiveTabExpanded;

	const showAllActiveTabPosts = () => {
		setExpandedTabs({
			...expandedTabs,
			[activeTabKey]: true,
		});
	};

	const addTab = () => {
		const nextIndex = selectedTabs.length;
		setAttributes({
			selectedTabs: [
				...selectedTabs,
				{
					id: createTabId(clientId, nextIndex),
					text: '',
					termSlug: 'all',
				},
			],
		});
	};

	const updateTab = (index, key, value) => {
		const newTabs = [...selectedTabs];
		newTabs[index][key] = value;

		if (key === 'termSlug') {
			if (value === 'all') {
				newTabs[index].text = __('All Tests', 'ambrygen-web');
			} else {
				const term = terms?.find((t) => t.slug === value);
				if (term) {
					newTabs[index].text = decodeEntities(term.name);
				}
			}
		}

		setAttributes({ selectedTabs: newTabs });
	};

	const removeTab = (index) => {
		const newTabs = selectedTabs.filter((_, i) => i !== index);
		setAttributes({ selectedTabs: newTabs });
	};

	const termOptions = useMemo(
		() => [
			{
				label: __('All Tests (all)', 'ambrygen-web'),
				value: 'all',
			},
			...(hasResolvedTerms && terms
				? terms.map((term) => ({
					label: decodeEntities(term.name),
					value: term.slug,
				}))
				: []),
		],
		[hasResolvedTerms, terms]
	);

	if (isExample) {
		return (
			<BlockExamplePreview imagePath="/assets/src/images/genetic-testing-grid/preview.png" />
		);
	}

	return (
		<>
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
				<PanelBody title={__('Display Settings', 'ambrygen-web')} initialOpen={true}>
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
				</PanelBody>
				<PanelBody title={__('Tabs Navigation', 'ambrygen-web')}>
					{selectedTabs.map((tab, i) => (
						<div
							key={tab.id || createTabId(clientId, i)}
							style={{
								marginBottom: 16,
								border: '1px solid #ccc',
								padding: 12,
							}}
						>
							<TextControl
								label={__('Tab Text', 'ambrygen-web')}
								value={tab.text}
								onChange={(val) =>
									updateTab(i, 'text', val)
								}
							/>
							<SelectControl
								label={__(
									'Target Category',
									'ambrygen-web'
								)}
								value={tab.termSlug}
								options={termOptions}
								onChange={(val) =>
									updateTab(i, 'termSlug', val)
								}
								disabled={!hasResolvedTerms}
								help={
									!hasResolvedTerms
										? __(
											'Loading categories',
											'ambrygen-web'
										)
										: ''
								}
							/>
							<Button
								isDestructive
								onClick={() => removeTab(i)}
							>
								{__('Remove Tab', 'ambrygen-web')}
							</Button>
						</div>
					))}
					<Button variant="secondary" onClick={addTab}>
						{__('Add Tab', 'ambrygen-web')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				{hasBackgroundImage && (
					<div className="block-bg-image">
						<img
							src={backgroundImage.url}
							alt={backgroundImage.alt || ''}
						/>
					</div>
				)}

				<div className="icon-grid-block">
					<section className="features-tabs">
						<div className="features-tabs__header block__rowflex">
							<div className="block__rowflex--col-left">
								<RichText
									tagName={HeadingTag}
									className="block-title block__rowflex--heading-title heading-2 mb-0"
									value={heading}
									onChange={(value) =>
										setAttributes({ heading: value })
									}
									placeholder={__(
										'Add Title',
										'ambrygen-web'
									)}
								/>
							</div>

							<div className="block__rowflex--block-content subtitle-1-regular">
								<RichText
									tagName="p"
									value={description}
									onChange={(value) =>
										setAttributes({
											description: value,
										})
									}
									placeholder={__(
										'Add Description',
										'ambrygen-web'
									)}
								/>
							</div>
						</div>

						<div
							className="is-style-gl-s50"
							aria-hidden="true"
						></div>

						<div className="tabs-content bg-gradient1">
							<div className="tabs__nav">
								{selectedTabs.length > 0 ? (
									selectedTabs.map((tab, index) => (
										<button
											key={
												tab.id ||
												createTabId(clientId, index)
											}
											type="button"
											className={`tabs__tab text-md-Semibold ${activeTab ===
												(tab.termSlug || 'all')
												? 'is-active'
												: ''
												}`}
											onClick={() =>
												setActiveTab(
													tab.termSlug || 'all'
												)
											}
										>
											{tab.text ||
												__(
													'New Tab',
													'ambrygen-web'
												)}
										</button>
									))
								) : (
									<button
										type="button"
										className="tabs__tab text-md-Semibold is-active"
										onClick={() => setActiveTab('all')}
									>
										{__('All Tests', 'ambrygen-web')}
									</button>
								)}
							</div>
							<div
								className="is-style-gl-s32"
								aria-hidden="true"
							></div>
							<div className="tabs__panels">
								<div className="tabs__panel is-active">
									<div className="features-tabs__grid">
										{!hasResolvedPosts && <Spinner />}

										{hasResolvedPosts &&
											visiblePosts?.length > 0 &&
											visiblePosts.map((post) => (
												<div
													key={post.id}
													className="features-tabs__card"
												>
													<div className="features-tabs__content-head">
														<div className="features-tabs__category body2-semibold">
															{getPostCategory(
																post
															)}
														</div>

														<div className="heading-5 features-tabs__card-title">
															{decodeEntities(
																post.title
																	?.rendered ||
																''
															)}
															<div className="badge badge--blue">
																<i className="badge__dot"></i>
																{__(
																	'Product',
																	'ambrygen-web'
																)}
															</div>
														</div>
													</div>

													<a
														className="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow"
														href={
															post.link || '#'
														}
														onClick={(event) =>
															!post.link &&
															event.preventDefault()
														}
													>
														{__(
															'View Test',
															'ambrygen-web'
														)}
													</a>
												</div>
											))}

										{hasResolvedPosts &&
											activePosts &&
											activePosts.length === 0 && (
												<p>
													{__(
														'No Test found for this tab.',
														'ambrygen-web'
													)}
												</p>
											)}
									</div>
									{shouldShowViewAll && (
										<div className="features-tabs__footer">
											<button
												type="button"
												className="site-btn is-style-site-trailing-icon has-right-arrow features-tabs__view-all"
												aria-expanded="false"
												onClick={
													showAllActiveTabPosts
												}
											>
												{__(
													'View All Tests',
													'ambrygen-web'
												)}
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</section>
				</div>
			</section>
		</>
	);
}
