import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';
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
import { useEffect, useState, useMemo } from '@wordpress/element';
import { ServerSideRender } from '@wordpress/server-side-render';
import SingleVersionSettings from './edit-variant-single';
import { ItemHeader } from '../_shared/components';

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

function TabSettings({ index, tab, updateTab, removeTab, moveTab, totalTabs }) {
	const [searchInput, setSearchInput] = useState(tab.text || '');
	const [search, setSearch] = useState(tab.text || '');

	useEffect(() => {
		const timeoutId = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
		return () => clearTimeout(timeoutId);
	}, [searchInput]);

	const { terms, parentTerms, selectedTerm, isLoadingTerms } = useSelect( ( select ) => {
		const query = {
			per_page: 20,
			hide_empty: false,
			orderby: 'name',
			order: 'asc',
			_fields: 'id,name,slug,parent',
		};

		if ( search ) {
			query.search = search;
		}

		const fetchedTerms = select( 'core' ).getEntityRecords( 'taxonomy', 'poster_category', query );
		const isResolving = select( 'core' ).isResolving( 'getEntityRecords', [ 'taxonomy', 'poster_category', query ] );
		
		let fetchedParentTerms = [];
		if ( Array.isArray( fetchedTerms ) && fetchedTerms.length > 0 ) {
			const parentIds = [...new Set(fetchedTerms.map(t => t.parent).filter(p => p > 0))];
			if ( parentIds.length > 0 ) {
				fetchedParentTerms = select( 'core' ).getEntityRecords( 'taxonomy', 'poster_category', { include: parentIds, _fields: 'id,name,slug,parent' } );
			}
		}
		
		let sTerm = null;
		if ( tab?.termId ) {
			sTerm = select( 'core' ).getEntityRecord( 'taxonomy', 'poster_category', tab.termId );
		}

		return {
			terms: fetchedTerms,
			parentTerms: fetchedParentTerms,
			selectedTerm: sTerm,
			isLoadingTerms: isResolving
		};
	}, [ search, tab?.termId ] );

	const termOptions = useMemo(() => {
		const combined = [];
		if ( Array.isArray( terms ) ) combined.push( ...terms );
		if ( Array.isArray( parentTerms ) ) combined.push( ...parentTerms );
		if ( selectedTerm ) combined.push( selectedTerm );
		
		const unique = [];
		const seen = new Set();
		combined.forEach(t => {
			if ( t && !seen.has(t.id) ) {
				seen.add(t.id);
				unique.push(t);
			}
		});
		return unique;
	}, [ terms, parentTerms, selectedTerm ]);

	const { availablePosts, isLoadingPosts } = useSelect( ( select ) => {
		if ( ! tab?.termId ) {
			return { availablePosts: [], isLoadingPosts: false };
		}
		
		const query = {
			poster_category: tab.termId,
			per_page: 100,
			status: 'publish',
			orderby: 'title',
			order: 'asc',
			_fields: 'id,title,poster_category',
		};
		
		const posts = select( 'core' ).getEntityRecords( 'postType', 'product_version', query );
		const isResolving = select( 'core' ).isResolving( 'getEntityRecords', [ 'postType', 'product_version', query ] );
		
		return {
			availablePosts: Array.isArray( posts ) ? posts : [],
			isLoadingPosts: isResolving
		};
	}, [ tab?.termId ] );

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
			<ItemHeader
				index={ index }
				label={ tab.text || `Tab ${ index + 1 }` }
				total={ totalTabs }
				onMove={ ( itemIndex, direction ) =>
					moveTab( index, direction )
				}
				onRemove={ () => removeTab( index ) }
				minCount={ 1 }
			/>

			<ComboboxControl
				label={__('Category', 'ambrygen-web')}
				value={String(tab.termId || '')}
				options={categoryOptions}
				onFilterValueChange={setSearchInput}
				onChange={(value) => {
					const term = termOptions.find(
						(item) => String(item.id) === value
					);

					updateTab(index, {
						termId: term?.id || 0,
						termSlug: term?.slug || '',
						text: term ? getTermLabel(term, termOptions) : '',
						excludedPostIds: [],
					});
				}}
				help={
					__(
						'Search categories instead of loading the full list.',
						'ambrygen-web'
					)
				}
			/>

			{isLoadingTerms && <Spinner />}

			{selectedOption && !searchInput && (
				<p style={{ marginTop: '8px', marginBottom: 0 }}>
					{__('Selected:', 'ambrygen-web')}{' '}
					<strong>{getTermLabel(selectedOption, termOptions)}</strong>
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
				{!isLoadingPosts &&
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
	} = attributes;
	const TagName = headingLevel || 'h2';

	const [materialTypeOptions, setMaterialTypeOptions] = useState([]);
	const [isLoadingMaterialTypes, setIsLoadingMaterialTypes] =
		useState(false);

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
		const expectedId = `test-catalog-${clientId.slice(0, 8)}`;

		if ( !blockId ) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [blockId, clientId, setAttributes]);

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

	const moveTab = ( index, direction ) => {
		const newIndex = index + direction;
		if (
			newIndex < 0 ||
			newIndex >= selectedTabs.length ||
			index === newIndex
		) {
			return;
		}

		const nextTabs = [ ...selectedTabs ];
		[ nextTabs[ index ], nextTabs[ newIndex ] ] = [
			nextTabs[ newIndex ],
			nextTabs[ index ],
		];
		setAttributes( { selectedTabs: nextTabs } );
	};

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
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingLevel}
						options={HEADING_OPTIONS}
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
					/>
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
								moveTab={moveTab}
								totalTabs={selectedTabs.length}
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
							selectedTabs: selectedTabs.filter( ( tab ) => tab.termId > 0 ),
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
