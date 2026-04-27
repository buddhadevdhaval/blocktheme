import apiFetch from '@wordpress/api-fetch';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	CheckboxControl,
	ComboboxControl,
	PanelBody,
	Spinner,
	TextControl,
} from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { ServerSideRender } from '@wordpress/server-side-render';
import SingleVersionSettings from './edit-variant-single';

const HEADING_OPTIONS = [
	{ label: 'H1', value: 'h1' },
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
	{ label: 'H5', value: 'h5' },
	{ label: 'H6', value: 'h6' },
];

const SEARCH_DEBOUNCE_MS = 300;

const getTermLabel = (term, allTerms = []) => {
	if (!term) {
		return '';
	}

	let label = '';
	if (typeof term.name === 'string' && term.name.length > 0) {
		label = decodeEntities(term.name);
	} else if (typeof term.slug === 'string' && term.slug.length > 0) {
		label = decodeEntities(term.slug);
	} else {
		label = term.id ? `Category ${term.id}` : '';
	}

	if (term.parent && term.parent > 0) {
		const parent = allTerms.find((t) => Number(t.id) === Number(term.parent));
		if (parent) {
			const parentName = parent.name ? decodeEntities(parent.name) : decodeEntities(parent.slug || '');
			if (parentName) {
				label = `${parentName} - ${label}`;
			}
		}
	}

	return label;
};

const getPostLabel = (post) => decodeEntities(post?.title?.rendered || '');

const EDIT_VARIANT_OPTIONS = [
	{ label: __('Tabbed (Default)', 'ambrygen-web'), value: 'tabs' },
	{ label: __('Single Product Version', 'ambrygen-web'), value: 'single' },
];

function TabSettings({ index, tab, updateTab, removeTab }) {
	const [search, setSearch] = useState(tab.text || '');
	const [termOptions, setTermOptions] = useState([]);
	const [isLoadingTerms, setIsLoadingTerms] = useState(false);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [availablePosts, setAvailablePosts] = useState([]);
	const [termsError, setTermsError] = useState(false);
	const [postsError, setPostsError] = useState(false);

	useEffect(() => {
		if (!tab?.termId && !search) {
			setTermOptions([]);
		}
	}, [search, tab?.termId]);

	useEffect(() => {
		let isMounted = true;
		const timeoutId = setTimeout(async () => {
			if (tab?.termId && !search) {
				return;
			}

			setIsLoadingTerms(true);
			setTermsError(false);

			try {
				const query = new URLSearchParams({
					per_page: '20',
					hide_empty: 'false',
					orderby: 'name',
					order: 'asc',
					_fields: 'id,name,slug,parent',
				});

				if (search) {
					query.set('search', search);
				}

				const results = await apiFetch({
					path: `/wp/v2/poster_category?${query.toString()}`,
				});

				if (isMounted) {
					const terms = Array.isArray(results) ? results : [];
					setTermOptions(terms);

					// Fetch missing parents to ensure "Parent - Child" labels work
					const parentIdsToFetch = terms
						.filter(t => t.parent > 0 && !terms.some(pt => pt.id === t.parent))
						.map(t => t.parent);

					if (parentIdsToFetch.length > 0) {
						apiFetch({
							path: `/wp/v2/poster_category?include=${[...new Set(parentIdsToFetch)].join(',')}&_fields=id,name,slug,parent`,
						}).then(parentTerms => {
							if (isMounted && Array.isArray(parentTerms)) {
								setTermOptions(current => {
									const existingIds = current.map(c => c.id);
									const uniqueNew = parentTerms.filter(p => !existingIds.includes(p.id));
									return [...current, ...uniqueNew];
								});
							}
						}).catch(() => { });
					}
				}
			} catch (error) {
				if (isMounted) {
					setTermOptions([]);
					setTermsError(true);
				}
			} finally {
				if (isMounted) {
					setIsLoadingTerms(false);
				}
			}
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
		};
	}, [search, tab?.termId]);

	useEffect(() => {
		let isMounted = true;

		if (!tab?.termId) {
			setAvailablePosts([]);
			return () => {
				isMounted = false;
			};
		}

		const loadSelectedTerm = async () => {
			const exists = termOptions.some(
				(term) => Number(term.id) === Number(tab.termId)
			);

			if (exists) {
				return;
			}

			try {
				const term = await apiFetch({
					path: `/wp/v2/poster_category/${tab.termId}?_fields=id,name,slug,parent`,
				});

				if (isMounted && term?.id) {
					setTermOptions((currentTerms) => {
						if (
							currentTerms.some(
								(item) =>
									Number(item.id) === Number(term.id)
							)
						) {
							return currentTerms;
						}

						return [term, ...currentTerms];
					});
				}
			} catch (error) { }
		};

		loadSelectedTerm();

		return () => {
			isMounted = false;
		};
	}, [tab?.termId, termOptions]);

	useEffect(() => {
		let isMounted = true;

		if (!tab?.termId) {
			setAvailablePosts([]);
			return () => {
				isMounted = false;
			};
		}

		const loadPosts = async () => {
			setIsLoadingPosts(true);
			setPostsError(false);

			try {
				const query = new URLSearchParams({
					poster_category: String(tab.termId),
					per_page: '100',
					status: 'publish',
					orderby: 'title',
					order: 'asc',
					_fields: 'id,title,poster_category',
				});

				const posts = await apiFetch({
					path: `/wp/v2/product_version?${query.toString()}`,
				});

				if (isMounted) {
					setAvailablePosts(Array.isArray(posts) ? posts : []);
				}
			} catch (error) {
				if (isMounted) {
					setAvailablePosts([]);
					setPostsError(true);
				}
			} finally {
				if (isMounted) {
					setIsLoadingPosts(false);
				}
			}
		};

		loadPosts();

		return () => {
			isMounted = false;
		};
	}, [tab?.termId]);

	const selectedOption = termOptions.find(
		(term) => String(term.id) === String(tab.termId || '')
	);
	const categoryOptions = termOptions.map((term) => ({
		label: getTermLabel(term, termOptions),
		value: String(term.id),
	}));

	return (
		<div
			style={{
				border: '1px solid #dcdcde',
				padding: '12px',
				marginBottom: '12px',
			}}
		>
			<ComboboxControl
				label={__('Category', 'ambrygen-web')}
				value={String(tab.termId || '')}
				options={categoryOptions}
				onFilterValueChange={setSearch}
				onChange={(value) => {
					const term = termOptions.find(
						(item) => String(item.id) === value
					);

					updateTab(index, {
						termId: term?.id || 0,
						termSlug: term?.slug || '',
						text: term ? getTermLabel(term) : '',
						excludedPostIds: [],
					});
				}}
				help={
					termsError
						? __(
							'Unable to load categories right now.',
							'ambrygen-web'
						)
						: __(
							'Search categories instead of loading the full list.',
							'ambrygen-web'
						)
				}
			/>

			{isLoadingTerms && <Spinner />}

			{selectedOption && !search && (
				<p style={{ marginTop: '8px', marginBottom: 0 }}>
					{__('Selected:', 'ambrygen-web')}{' '}
					<strong>{getTermLabel(selectedOption)}</strong>
				</p>
			)}

			<TextControl
				label={__('Tab Label', 'ambrygen-web')}
				value={tab.text || ''}
				onChange={(value) => updateTab(index, { text: value })}
			/>

			<div style={{ marginTop: '12px' }}>
				<strong>{__('Posts to show', 'ambrygen-web')}</strong>
				{isLoadingPosts && <Spinner />}
				{postsError && (
					<div>
						{__(
							'Unable to load product versions for this category.',
							'ambrygen-web'
						)}
					</div>
				)}
				{!isLoadingPosts &&
					!postsError &&
					tab?.termId &&
					availablePosts.length === 0 && (
						<div>
							{__(
								'No product versions found in this category.',
								'ambrygen-web'
							)}
						</div>
					)}
				{availablePosts.map((post) => {
					const excluded = Array.isArray(tab.excludedPostIds)
						? tab.excludedPostIds
						: [];
					const isChecked = !excluded.includes(post.id);

					return (
						<CheckboxControl
							key={post.id}
							label={getPostLabel(post)}
							checked={isChecked}
							onChange={(checked) => {
								const nextExcluded = checked
									? excluded.filter((id) => id !== post.id)
									: [...excluded, post.id];

								updateTab(index, {
									excludedPostIds: nextExcluded,
								});
							}}
						/>
					);
				})}
			</div>

			<Button isDestructive onClick={() => removeTab(index)}>
				{__('Remove Tab', 'ambrygen-web')}
			</Button>
		</div>
	);
}

export default function Edit({ attributes, setAttributes, clientId, name }) {
	const {
		blockId,
		eyebrow,
		title,
		subtitle,
		headingLevel,
		selectedTabs = [],
		marketingMaterialTypeId = 0,
		editVariant = 'tabs',
		mainCategoryId = 0,
		subCategoryId = 0,
	} = attributes;
	const TagName = headingLevel || 'h2';

	const [materialTypeOptions, setMaterialTypeOptions] = useState([]);
	const [isLoadingMaterialTypes, setIsLoadingMaterialTypes] =
		useState(false);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [mainCategorySearch, setMainCategorySearch] = useState('');
	const [subCategorySearch, setSubCategorySearch] = useState('');

	useEffect(() => {
		setIsLoadingMaterialTypes(true);
		apiFetch({
			path: '/wp/v2/marketing_material_type?per_page=100&_fields=id,name',
		})
			.then((results) => {
				setMaterialTypeOptions(
					results.map((term) => ({
						label: decodeEntities(term.name),
						value: term.id,
					}))
				);
			})
			.finally(() => setIsLoadingMaterialTypes(false));
	}, []);

	useEffect(() => {
		let isMounted = true;
		const timeoutId = setTimeout(async () => {
			setIsLoadingCategories(true);

			try {
				const query = new URLSearchParams({
					per_page: '100',
					hide_empty: 'false',
					orderby: 'name',
					order: 'asc',
					_fields: 'id,name,slug,parent',
				});

				if (mainCategorySearch) {
					query.set('search', mainCategorySearch);
				}

				const results = await apiFetch({
					path: `/wp/v2/poster_category?${query.toString()}`,
				});

				if (!isMounted) {
					return;
				}

				const terms = Array.isArray(results) ? results : [];
				let nextTerms = terms;

				const parentIdsToFetch = terms
					.filter(
						(term) =>
							term.parent > 0 &&
							!terms.some((parentTerm) => parentTerm.id === term.parent)
					)
					.map((term) => term.parent);

				if (parentIdsToFetch.length > 0) {
					try {
						const parentTerms = await apiFetch({
							path: `/wp/v2/poster_category?include=${[
								...new Set(parentIdsToFetch),
							].join(',')}&_fields=id,name,slug,parent`,
						});

						if (Array.isArray(parentTerms)) {
							const existingIds = nextTerms.map((term) => term.id);
							nextTerms = [
								...nextTerms,
								...parentTerms.filter(
									(term) => !existingIds.includes(term.id)
								),
							];
						}
					} catch (error) {}
				}

				if (mainCategoryId > 0 && !nextTerms.some((term) => term.id === mainCategoryId)) {
					try {
						const selectedMainTerm = await apiFetch({
							path: `/wp/v2/poster_category/${mainCategoryId}?_fields=id,name,slug,parent`,
						});

						if (selectedMainTerm?.id) {
							nextTerms = [selectedMainTerm, ...nextTerms];
						}
					} catch (error) {}
				}

				if (subCategoryId > 0 && !nextTerms.some((term) => term.id === subCategoryId)) {
					try {
						const selectedSubTerm = await apiFetch({
							path: `/wp/v2/poster_category/${subCategoryId}?_fields=id,name,slug,parent`,
						});

						if (selectedSubTerm?.id) {
							nextTerms = [selectedSubTerm, ...nextTerms];
						}
					} catch (error) {}
				}

				setCategoryOptions(nextTerms);
			} catch (error) {
				if (isMounted) {
					setCategoryOptions([]);
				}
			} finally {
				if (isMounted) {
					setIsLoadingCategories(false);
				}
			}
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
		};
	}, [mainCategorySearch, mainCategoryId, subCategoryId]);

	useEffect(() => {
		if (!blockId && clientId) {
			setAttributes({
				blockId: `test-catalog-${clientId.slice(0, 8)}`,
			});
		}
	}, []); // run only once

	const addTab = () => {
		setAttributes({
			selectedTabs: [
				...selectedTabs,
				{
					id: `tab-${Date.now()}`,
					termId: 0,
					termSlug: '',
					text: '',
					excludedPostIds: [],
				},
			],
		});
	};

	const updateTab = (index, updates) => {
		const newTabs = [...selectedTabs];
		newTabs[index] = { ...newTabs[index], ...updates };
		setAttributes({ selectedTabs: newTabs });
	};

	const removeTab = (index) => {
		setAttributes({
			selectedTabs: selectedTabs.filter((_, i) => i !== index),
		});
	};

	const mainCategoryOptions = [
		{ label: __('Select main category', 'ambrygen-web'), value: '0' },
		...categoryOptions
			.filter((term) =>
				categoryOptions.some(
					(childTerm) => Number(childTerm.parent || 0) === Number(term.id)
				)
			)
			.filter((term) =>
				!mainCategorySearch
					? true
					: decodeEntities(term.name)
							.toLowerCase()
							.includes(mainCategorySearch.toLowerCase())
			)
			.map((term) => ({
				label: decodeEntities(term.name),
				value: String(term.id),
			})),
	];

	const subCategoryOptions = [
		{ label: __('All sub categories', 'ambrygen-web'), value: '0' },
		...categoryOptions
			.filter(
				(term) => Number(term.parent || 0) === Number(mainCategoryId || 0)
			)
			.filter((term) =>
				!subCategorySearch
					? true
					: decodeEntities(term.name)
							.toLowerCase()
							.includes(subCategorySearch.toLowerCase())
			)
			.map((term) => ({
				label: decodeEntities(term.name),
				value: String(term.id),
			})),
	];

	return (
		<>
			<InspectorControls>
				{editVariant !== 'single' && (
					<PanelBody title={__('Content', 'ambrygen-web')} initialOpen>
						<TextControl
							label={__('Eyebrow', 'ambrygen-web')}
							value={eyebrow}
							onChange={(value) =>
								setAttributes({ eyebrow: value })
							}
						/>
						<TextControl
							label={__('Title', 'ambrygen-web')}
							value={title}
							onChange={(value) =>
								setAttributes({ title: value })
							}
						/>
						<TextControl
							label={__('Subtitle', 'ambrygen-web')}
							value={subtitle}
							onChange={(value) =>
								setAttributes({ subtitle: value })
							}
						/>
					</PanelBody>
				)}

				<PanelBody title={__('Display', 'ambrygen-web')} initialOpen>
					<ComboboxControl
						label={__('Edit Variant', 'ambrygen-web')}
						value={editVariant}
						options={EDIT_VARIANT_OPTIONS}
						onChange={(value) =>
							setAttributes({ editVariant: value || 'tabs' })
						}
						help={__(
							'Choose between the classic tabbed catalog and the single product version view.',
							'ambrygen-web'
						)}
					/>
				</PanelBody>

				<PanelBody title={__('Heading Settings', 'ambrygen-web')}>
					<ComboboxControl
						label={__('Heading Level', 'ambrygen-web')}
						value={headingLevel}
						options={HEADING_OPTIONS}
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Category Filter', 'ambrygen-web')}
					initialOpen
				>
					<ComboboxControl
						label={__('Main Category', 'ambrygen-web')}
						value={String(mainCategoryId || 0)}
						options={mainCategoryOptions}
						onFilterValueChange={setMainCategorySearch}
						onChange={(value) =>
							setAttributes({
								mainCategoryId: Number(value) || 0,
								subCategoryId: 0,
							})
						}
						help={__(
							'Select the parent category used to filter products and linked genetic testing posts.',
							'ambrygen-web'
						)}
					/>

					<ComboboxControl
						label={__('Sub Category', 'ambrygen-web')}
						value={String(subCategoryId || 0)}
						options={subCategoryOptions}
						onFilterValueChange={setSubCategorySearch}
						onChange={(value) =>
							setAttributes({
								subCategoryId: Number(value) || 0,
							})
						}
						disabled={!mainCategoryId}
						help={__(
							'Optionally narrow the results to a child category.',
							'ambrygen-web'
						)}
					/>

					{isLoadingCategories && <Spinner />}
				</PanelBody>

				<PanelBody
					title={__('Marketing Material Settings', 'ambrygen-web')}
				>
					<ComboboxControl
						label={__('Filter by Type', 'ambrygen-web')}
						value={marketingMaterialTypeId}
						options={materialTypeOptions}
						onChange={(value) =>
							setAttributes({
								marketingMaterialTypeId: Number(value),
							})
						}
						help={__(
							'Select a type to only show PDFs of that specific category.',
							'ambrygen-web'
						)}
					/>
					{isLoadingMaterialTypes && <Spinner />}
				</PanelBody>

				{editVariant === 'single' ? (
					<SingleVersionSettings
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				) : (
					<PanelBody title={__('Tabs', 'ambrygen-web')} initialOpen>
						{selectedTabs.map((tab, index) => (
							<TabSettings
								key={tab.id || `tab-${index}`}
								index={index}
								tab={tab}
								updateTab={updateTab}
								removeTab={removeTab}
							/>
						))}

						<Button isSecondary onClick={addTab}>
							{__('Add Tab', 'ambrygen-web')}
						</Button>
					</PanelBody>
				)}
			</InspectorControls>

			<div {...useBlockProps()}>
				<div className="test-catlouge">
					<div className="test-catlouge__header">
						<RichText
							tagName="div"
							className="hero-kicker overline-text test-catlouge__eyebrow"
							value={eyebrow}
							onChange={(value) =>
								setAttributes({ eyebrow: value })
							}
							placeholder={__('Add eyebrow...', 'ambrygen-web')}
						/>
						<div className="is-style-gl-s12"></div>
						<TagName className="heading-4 block-title mb-0 test-catlouge__title">
							<RichText
								tagName="span"
								value={title}
								onChange={(value) =>
									setAttributes({ title: value })
								}
								placeholder={__('Add title...', 'ambrygen-web')}
							/>
						</TagName>
						<div className="is-style-gl-s12"></div>
						<RichText
							tagName="div"
							className="body1 test-catlouge__subtitle"
							value={subtitle}
							onChange={(value) =>
								setAttributes({ subtitle: value })
							}
							placeholder={__(
								'Add subtitle...',
								'ambrygen-web'
							)}
						/>
					</div>
				</div>

				<div className="test-catalog-ssr-container">
					<ServerSideRender
						block={name}
						attributes={{
							...attributes,
							eyebrow: '',
							title: '',
							subtitle: '',
						}}
					/>
				</div>
			</div>
		</>
	);
}
