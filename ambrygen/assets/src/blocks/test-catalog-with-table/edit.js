import { useEffect, useMemo, useState } from '@wordpress/element';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	ComboboxControl,
	PanelBody,
	SearchControl,
	Spinner,
	TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
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
const ORDER_URL = '/providers/ordering-process';

const getPostLabel = ( post ) => decodeEntities( post?.title?.rendered || '' );

const getDescendantTermIds = ( rootTermId, terms = [] ) => {
	const rootId = Number( rootTermId );
	if ( ! rootId ) {
		return [];
	}

	const descendants = new Set( [ rootId ] );
	let foundNewMatch = true;

	while ( foundNewMatch ) {
		foundNewMatch = false;
		terms.forEach( ( term ) => {
			const termId = Number( term?.id );
			const parentId = Number( term?.parent );

			if (
				termId &&
				parentId &&
				descendants.has( parentId ) &&
				! descendants.has( termId )
			) {
				descendants.add( termId );
				foundNewMatch = true;
			}
		} );
	}

	return Array.from( descendants );
};

const buildPostsQuery = ( termIds = [] ) =>
	Array.isArray( termIds ) && termIds.length
		? {
				poster_category: termIds.join( ',' ),
				per_page: 100,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
				_fields: 'id,title,excerpt',
		  }
		: null;

const getTabProductTermIds = ( tab, terms = [] ) => {
	const selectedSubTermIds = Array.isArray( tab?.subTermIds )
		? tab.subTermIds.map( Number ).filter( Boolean )
		: [];

	if ( selectedSubTermIds.length ) {
		return Array.from(
			new Set(
				selectedSubTermIds.flatMap( ( termId ) =>
					getDescendantTermIds( termId, terms )
				)
			)
		);
	}

	return getDescendantTermIds( tab?.termId, terms );
};

const getTermLabel = ( term, allTerms = [] ) => {
	if ( ! term ) {
		return '';
	}

	let label = term.name
		? decodeEntities( term.name )
		: decodeEntities( term.slug || '' );

	if ( term.parent && term.parent > 0 ) {
		const parent = allTerms.find(
			( item ) => Number( item.id ) === Number( term.parent )
		);
		if ( parent?.name ) {
			label = `${ decodeEntities( parent.name ) } - ${ label }`;
		}
	}

	return label;
};

const getTabCategoryLabel = ( tab, terms = [] ) => {
	const selectedSubTerms = Array.isArray( tab?.subTermIds )
		? tab.subTermIds
				.map( ( termId ) =>
					terms.find( ( term ) => Number( term.id ) === Number( termId ) )
				)
				.filter( Boolean )
		: [];

	if ( selectedSubTerms.length ) {
		return selectedSubTerms
			.map( ( term ) => decodeEntities( term.name || '' ) )
			.filter( Boolean )
			.join( ', ' );
	}

	return tab?.text || '';
};

function TabSettings( { index, tab, updateTab, removeTab, totalTabs } ) {
	const [ childSearchInput, setChildSearchInput ] = useState( tab.text || '' );
	const [ childSearch, setChildSearch ] = useState( tab.text || '' );
	const [ productSearchInput, setProductSearchInput ] = useState( '' );
	const subTermDependency = Array.isArray( tab.subTermIds )
		? tab.subTermIds.map( Number ).sort( ( a, b ) => a - b ).join( ',' )
		: '';

	useEffect( () => {
		const timeoutId = setTimeout(
			() => setChildSearch( childSearchInput ),
			SEARCH_DEBOUNCE_MS
		);
		return () => clearTimeout( timeoutId );
	}, [ childSearchInput ] );

	const {
		childTerms,
		selectedChildTerm,
		subChildTerms,
		selectedTermDescendantIds,
		isLoadingChildren,
		isLoadingSubChildren,
		posts,
		isLoadingPosts,
	} = useSelect(
		( select ) => {
			const childQuery = {
				per_page: 100,
				hide_empty: true,
				orderby: 'name',
				order: 'asc',
				_fields: 'id,name,slug,parent',
			};

			if ( tab.parentTermId ) {
				childQuery.parent = tab.parentTermId;
			}

			if ( childSearch ) {
				childQuery.search = childSearch;
			}

			const fetchedChildTerms = select( 'core' ).getEntityRecords(
				'taxonomy',
				'poster_category',
				childQuery
			);

			const currentChildTerm = tab.termId
				? select( 'core' ).getEntityRecord(
						'taxonomy',
						'poster_category',
						tab.termId
				  )
				: null;
			const subChildQuery = {
				per_page: 100,
				hide_empty: true,
				orderby: 'name',
				order: 'asc',
				_fields: 'id,name,slug,parent',
				parent: tab.termId || 0,
			};
			const fetchedSubChildTerms = tab.termId
				? select( 'core' ).getEntityRecords(
						'taxonomy',
						'poster_category',
						subChildQuery
				  )
				: [];

			const fetchedAllTerms = select( 'core' ).getEntityRecords(
				'taxonomy',
				'poster_category',
				{
					per_page: 100,
					hide_empty: false,
					_fields: 'id,parent',
				}
			);
			const descendantIds = getTabProductTermIds( tab, fetchedAllTerms || [] );
			const postQuery = buildPostsQuery( descendantIds );

			return {
				childTerms: fetchedChildTerms,
				selectedChildTerm: currentChildTerm,
				subChildTerms: fetchedSubChildTerms,
				selectedTermDescendantIds: descendantIds,
				isLoadingChildren: select( 'core' ).isResolving(
					'getEntityRecords',
					[ 'taxonomy', 'poster_category', childQuery ]
				),
				isLoadingSubChildren: tab.termId
					? select( 'core' ).isResolving( 'getEntityRecords', [
							'taxonomy',
							'poster_category',
							subChildQuery,
					  ] )
					: false,
				posts: postQuery
					? select( 'core' ).getEntityRecords(
							'postType',
							'product_version',
							postQuery
					  )
					: [],
				isLoadingPosts: postQuery
					? select( 'core' ).isResolving( 'getEntityRecords', [
							'postType',
							'product_version',
							postQuery,
					  ] )
					: false,
			};
		},
		[ childSearch, tab.parentTermId, tab.termId, subTermDependency ]
	);

	const childCategoryOptions = useMemo( () => {
		const combined = [
			...( Array.isArray( childTerms ) ? childTerms : [] ),
			...( selectedChildTerm ? [ selectedChildTerm ] : [] ),
		];
		const seen = new Set();
		return combined
			.filter( ( item ) => {
				if ( ! item || seen.has( item.id ) ) {
					return false;
				}
				if ( tab.parentTermId ) {
					if ( Number( item.parent ) !== Number( tab.parentTermId ) ) {
						return false;
					}
				} else if ( ! tab.termId && Number( item.parent ) <= 0 ) {
					return false;
				}
				seen.add( item.id );
				return true;
			} )
			.map( ( term ) => ( {
				label: decodeEntities( term.name ),
				value: String( term.id ),
			} ) );
	}, [ childTerms, selectedChildTerm, tab.parentTermId, tab.termId ] );

	const featuredIds = Array.isArray( tab.featuredProductVersionIds )
		? tab.featuredProductVersionIds.map( Number )
		: [];
	const selectedSubTermValues = Array.isArray( tab.subTermIds )
		? tab.subTermIds.map( String )
		: [];
	const subChildOptions = Array.isArray( subChildTerms )
		? subChildTerms.map( ( term ) => ( {
				label: decodeEntities( term.name ),
				value: String( term.id ),
		  } ) )
		: [];
	const updateSubTermSelection = ( optionValue, shouldAdd ) => {
		const currentSubTermIds = Array.isArray( tab.subTermIds )
			? tab.subTermIds
			: [];
		const nextSubTermIds = shouldAdd
			? [ ...currentSubTermIds, Number( optionValue ) ]
			: currentSubTermIds.filter(
					( termId ) => Number( termId ) !== Number( optionValue )
			  );

		updateTab( index, {
			subTermIds: Array.from(
				new Set( nextSubTermIds.map( Number ).filter( Boolean ) )
			),
			featuredProductVersionIds: [],
		} );
	};
	const filteredPosts = Array.isArray( posts )
		? posts.filter( ( post ) =>
				getPostLabel( post )
					.toLowerCase()
					.includes( productSearchInput.trim().toLowerCase() )
		  )
		: [];

	return (
		<div style={ { border: '1px solid #dcdcde', padding: '12px', marginBottom: '12px', borderRadius: '8px' } }>
			<ItemHeader
				index={ index }
				label={ tab.text || `Tab ${ index + 1 }` }
				total={ totalTabs }
				onMove={ () => undefined }
				onRemove={ () => removeTab( index ) }
				minCount={ 1 }
			/>
			<>
				<ComboboxControl
					label={ __( 'Child Category', 'ambrygen-web' ) }
					value={ String( tab.termId || '' ) }
					options={ childCategoryOptions }
					onFilterValueChange={ setChildSearchInput }
					onChange={ ( value ) => {
						const term = [
							...( childTerms || [] ),
							...( selectedChildTerm ? [ selectedChildTerm ] : [] ),
						].find( ( item ) => String( item.id ) === value );
						updateTab( index, {
							termId: term?.id || 0,
							termSlug: term?.slug || '',
							text: term ? decodeEntities( term.name ) : '',
							subTermIds: [],
							featuredProductVersionIds: [],
						} );
					} }
					help={ __( 'Choose the child category that should load products.', 'ambrygen-web' ) }
				/>
				{ isLoadingChildren && <Spinner /> }
				{ !! tab.termId && selectedTermDescendantIds.length > 1 && (
					<p style={ { marginTop: '8px', marginBottom: 0, color: '#50575e' } }>
						{ __(
							'Products from this category and its inner subcategories will be shown.',
							'ambrygen-web'
						) }
					</p>
				) }
				{ !! tab.termId && (
					<div style={ { marginTop: '12px' } }>
						<div style={ { fontWeight: 600, marginBottom: '8px' } }>
							{ __( 'Sub Child Category', 'ambrygen-web' ) }
						</div>
						<p style={ { marginTop: 0, marginBottom: '8px', color: '#50575e' } }>
							{ __(
								'Optional. If selected, featured products will be loaded only from these sub child categories.',
								'ambrygen-web'
							) }
						</p>
						{ subChildOptions.length ? (
							<div
								style={ {
									border: '1px solid #e0e0e0',
									borderRadius: '6px',
									padding: '8px 10px',
									maxHeight: '180px',
									overflow: 'auto',
									background: '#fff',
								} }
							>
								{ subChildOptions.map( ( option ) => {
									const isChecked = selectedSubTermValues.includes( option.value );

									return (
										<div
											key={ option.value }
											style={ {
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												gap: '12px',
												padding: '6px 0',
												borderBottom: '1px solid #f0f0f0',
											} }
										>
											<span>{ option.label }</span>
											<Button
												variant={ isChecked ? 'secondary' : 'tertiary' }
												size="small"
												onClick={ () =>
													updateSubTermSelection( option.value, ! isChecked )
												}
											>
												{ isChecked
													? __( 'Remove', 'ambrygen-web' )
													: __( 'Add', 'ambrygen-web' ) }
											</Button>
										</div>
									);
								} ) }
							</div>
						) : (
							<p style={ { marginTop: 0, marginBottom: 0, color: '#50575e' } }>
								{ __( 'No sub child categories found for this child category.', 'ambrygen-web' ) }
							</p>
						) }
					</div>
				) }
				{ isLoadingSubChildren && <Spinner /> }
			</>

			<TextControl
				label={ __( 'Tab Label', 'ambrygen-web' ) }
				value={ tab.text || '' }
				onChange={ ( value ) => updateTab( index, { text: value } ) }
			/>
			<div style={ { marginTop: '16px' } }>
				<div style={ { fontWeight: 600, marginBottom: '8px' } }>
					{ __( 'Featured Products', 'ambrygen-web' ) }
				</div>
				<SearchControl
					label={ __( 'Search Products', 'ambrygen-web' ) }
					value={ productSearchInput }
					onChange={ setProductSearchInput }
					placeholder={ __( 'Search products', 'ambrygen-web' ) }
				/>
				{ isLoadingPosts && <Spinner /> }
				{ ! isLoadingPosts && ! tab.termId && (
					<p style={ { color: '#50575e' } }>
						{ __( 'Select a child category to load products.', 'ambrygen-web' ) }
					</p>
				) }
				{ ! isLoadingPosts && !! tab.termId && (
					<div style={ { border: '1px solid #e0e0e0', borderRadius: '6px', maxHeight: '240px', overflow: 'auto', padding: '8px' } }>
						{ filteredPosts.length ? (
							filteredPosts.map( ( post ) => (
								<div
									key={ post.id }
									style={ {
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: '12px',
										padding: '6px 0',
										borderBottom: '1px solid #f0f0f0',
									} }
								>
									<span>{ getPostLabel( post ) }</span>
									<Button
										variant={ featuredIds.includes( post.id ) ? 'secondary' : 'primary' }
										size="small"
										onClick={ () => {
											const isSelected = featuredIds.includes( post.id );
											const nextIds = isSelected
												? featuredIds.filter( ( id ) => id !== post.id )
												: [ ...featuredIds, post.id ];
											updateTab( index, {
												featuredProductVersionIds: nextIds,
											} );
										} }
									>
										{ featuredIds.includes( post.id )
											? __( 'Remove', 'ambrygen-web' )
											: __( 'Add', 'ambrygen-web' ) }
									</Button>
								</div>
							) )
						) : (
							<p style={ { margin: 0, color: '#50575e' } }>
								{ __( 'No matching products found.', 'ambrygen-web' ) }
							</p>
						) }
					</div>
				) }
			</div>
		</div>
	);
}

function TabsPreview( { selectedTabs = [] } ) {
	const previewData = useSelect(
		( select ) => {
			const allTerms = select( 'core' ).getEntityRecords( 'taxonomy', 'poster_category', {
				per_page: 100,
				hide_empty: false,
				_fields: 'id,parent',
			} ) || [];

			return selectedTabs.map( ( tab ) => {
				const postsQuery = buildPostsQuery(
					getTabProductTermIds( tab, allTerms )
				);
				const posts = postsQuery
					? select( 'core' ).getEntityRecords(
							'postType',
							'product_version',
							postsQuery
					  ) || []
					: [];

				const featuredIds = Array.isArray( tab.featuredProductVersionIds )
					? tab.featuredProductVersionIds.map( Number )
					: [];

				const featuredPosts = posts.filter( ( post ) =>
					featuredIds.includes( Number( post.id ) )
				);

				return {
					id: tab.id,
					slug: tab.termSlug || `tab-${ tab.id }`,
					text: tab.text || '',
					categoryName: getTabCategoryLabel( tab, allTerms ),
					featuredPosts,
				};
			} );
		},
		[ selectedTabs ]
	);

	return (
		previewData.length > 0 ? (
			<div className="tabs tabs-content">
				<div className="tabs__mobile-nav">
					<select className="tabs__select text-md-sbold" disabled>
						{ previewData.map( ( tab ) => (
							<option key={ tab.id } value={ tab.slug }>
								{ tab.text }
							</option>
						) ) }
					</select>
				</div>
				<div className="tabs__nav" role="tablist">
					{ previewData.map( ( tab, index ) => (
						<button
							key={ tab.id }
							className={ `tabs__tab text-md-sbold${ index === 0 ? ' is-active' : '' }` }
							type="button"
						>
							{ tab.text }
						</button>
					) ) }
				</div>
				<div className="is-style-gl-s32"></div>
				<div className="tabs__panels">
					{ previewData.map( ( tab, index ) => (
						<div
							key={ tab.id }
							className={ `tabs__panel${ index === 0 ? ' is-active' : '' }` }
							id={ tab.slug }
						>
							<div className="cardiology-filter__items-grid">
								{ tab.featuredPosts.length ? (
									tab.featuredPosts.map( ( post ) => (
										<div key={ post.id } className="cardiology-filter__card">
											<div className="body2-semibold cardiology-filter__card-category">
												{ tab.categoryName }
											</div>
											<div className="is-style-gl-s4"></div>
											<div className="cardiology-filter__card-info">
												<div className="subtitle1-sbold cardiology-filter__card-name">
													{ getPostLabel( post ) }
												</div>
												<div className="cardiology-filter__card-badge text-small-medium">
													{ __( 'Preview', 'ambrygen-web' ) }
												</div>
											</div>
											<div className="is-style-gl-s12"></div>
											<div className="body1 cardiology-filter__card-text">
												{ decodeEntities( post?.excerpt?.rendered || '' )
													.replace( /<[^>]+>/g, '' )
													.slice( 0, 140 ) || __( 'Selected product preview.', 'ambrygen-web' ) }
											</div>
											<div className="is-style-gl-s24"></div>
											<div className="cardiology-filter__card-actions">
												<a href={ ORDER_URL } className="site-btn has-right-arrow btn-small">
													{ __( 'Order', 'ambrygen-web' ) }
												</a>
												<span className="site-btn is-style-site-tertiary-btn btn-small">
													{ __( 'Test details', 'ambrygen-web' ) }
												</span>
											</div>
										</div>
									) )
								) : (
									<p>{ __( 'Select featured products for this tab.', 'ambrygen-web' ) }</p>
								) }
							</div>
						</div>
					) ) }
				</div>
			</div>
		) : (
			<p>{ __( 'Add one or more tabs in the block settings.', 'ambrygen-web' ) }</p>
		)
	);
}

function TablePreview( { selectedTabs = [] } ) {
	const tableRowsData = useSelect(
		( select ) => {
			const allTerms = select( 'core' ).getEntityRecords( 'taxonomy', 'poster_category', {
				per_page: 100,
				hide_empty: false,
				_fields: 'id,parent',
			} ) || [];

			return selectedTabs.map( ( tab ) => {
				const postsQuery = buildPostsQuery(
					getTabProductTermIds( tab, allTerms )
				);

				return postsQuery
					? select( 'core' ).getEntityRecords(
							'postType',
							'product_version',
							postsQuery
					  ) || []
					: [];
			} );
		},
		[ selectedTabs ]
	);

	const tableRows = useMemo( () => {
		const rows = [];
		const seen = new Set();
		tableRowsData.forEach( ( posts ) => {
			posts.forEach( ( post ) => {
				if ( ! seen.has( post.id ) ) {
					seen.add( post.id );
					rows.push( post );
				}
			} );
		} );
		return rows;
	}, [ tableRowsData ] );

	return (
		<>
			<div className="is-style-gl-s32"></div>
			<div className="gl-data-table-body">
				<div className="gl-data-table variation-gray25 gl-data-table--cols-6">
					<div className="gl-data-table__grid">
						<div className="gl-data-table__row gl-data-table__row--header">
							<div className="gl-data-table__cell">{ __( 'Code', 'ambrygen-web' ) }</div>
							<div className="gl-data-table__cell">{ __( 'Test Name', 'ambrygen-web' ) }</div>
							<div className="gl-data-table__cell">{ __( 'Genes', 'ambrygen-web' ) }</div>
							<div className="gl-data-table__cell">{ __( 'Gene List (Abbreviated)', 'ambrygen-web' ) }</div>
							<div className="gl-data-table__cell">{ __( 'Turnaround', 'ambrygen-web' ) }</div>
							<div className="gl-data-table__cell"></div>
						</div>
						{ tableRows.length ? (
							tableRows.map( ( post ) => (
								<div key={ post.id } className="gl-data-table__row">
									<div className="gl-data-table__cell">-</div>
									<div className="gl-data-table__cell gl-data-table__cell--name">
										{ getPostLabel( post ) }
									</div>
									<div className="gl-data-table__cell">-</div>
									<div className="gl-data-table__cell">-</div>
									<div className="gl-data-table__cell gl-data-table__cell--highlight">-</div>
									<div className="gl-data-table__cell">
										<a href={ ORDER_URL } className="site-btn has-right-arrow btn-small">
											{ __( 'Order', 'ambrygen-web' ) }
										</a>
									</div>
								</div>
							) )
						) : (
							<div className="gl-data-table__row">
								<div className="gl-data-table__cell" style={ { gridColumn: '1 / -1' } }>
									{ __( 'Select tab categories to preview table rows.', 'ambrygen-web' ) }
								</div>
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		searchLabel,
		searchPlaceholder,
		featuredEyebrow,
		featuredTitle,
		featuredDescription,
		tableEyebrow,
		tableTitle,
		tableDescription,
		headingLevel,
		parentCategoryId = 0,
		selectedTabs = [],
	} = attributes;

	const TagName = headingLevel || 'h2';
	const [ parentSearchInput, setParentSearchInput ] = useState( '' );
	const [ parentSearch, setParentSearch ] = useState( '' );

	useEffect( () => {
		const timeoutId = setTimeout(
			() => setParentSearch( parentSearchInput ),
			SEARCH_DEBOUNCE_MS
		);
		return () => clearTimeout( timeoutId );
	}, [ parentSearchInput ] );

	useEffect( () => {
		const expectedId = `test-catalog-with-table-${ clientId.slice( 0, 8 ) }`;
		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	const { parentTerms, selectedParentTerm, isLoadingParents } = useSelect(
		( select ) => {
			const parentQuery = {
				per_page: 100,
				hide_empty: true,
				orderby: 'name',
				order: 'asc',
				_fields: 'id,name,slug,parent',
			};

			if ( parentSearch ) {
				parentQuery.search = parentSearch;
			}

			return {
				parentTerms: select( 'core' ).getEntityRecords(
					'taxonomy',
					'poster_category',
					parentQuery
				),
				selectedParentTerm: parentCategoryId
					? select( 'core' ).getEntityRecord(
							'taxonomy',
							'poster_category',
							parentCategoryId
					  )
					: null,
				isLoadingParents: select( 'core' ).isResolving(
					'getEntityRecords',
					[ 'taxonomy', 'poster_category', parentQuery ]
				),
			};
		},
		[ parentCategoryId, parentSearch ]
	);

	const parentCategoryOptions = useMemo(
		() => [
			{ label: __( 'Select parent category', 'ambrygen-web' ), value: '' },
			...( Array.isArray( parentTerms )
				? parentTerms.map( ( term ) => ( {
						label: getTermLabel( term, parentTerms ),
						value: String( term.id ),
				  } ) )
				: [] ),
		],
		[ parentTerms ]
	);

	const addTab = () => {
		setAttributes( {
			selectedTabs: [
				...selectedTabs,
				{
					id: `tab-${ Date.now() }`,
					parentTermId: parentCategoryId || 0,
					termId: 0,
					termSlug: '',
					text: '',
					subTermIds: [],
					featuredProductVersionIds: [],
				},
			],
		} );
	};

	const updateTab = ( index, updates ) => {
		const nextTabs = [ ...selectedTabs ];
		nextTabs[ index ] = { ...nextTabs[ index ], ...updates };
		setAttributes( { selectedTabs: nextTabs } );
	};

	const removeTab = ( index ) => {
		setAttributes( {
			selectedTabs: selectedTabs.filter( ( _, tabIndex ) => tabIndex !== index ),
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tabs', 'ambrygen-web' ) } initialOpen>
					<ComboboxControl
						label={ __( 'Parent Category', 'ambrygen-web' ) }
						value={ String( parentCategoryId || '' ) }
						options={ parentCategoryOptions }
						onFilterValueChange={ setParentSearchInput }
						onChange={ ( value ) => {
							const nextParentId = Number( value ) || 0;
							setAttributes( {
								parentCategoryId: nextParentId,
								selectedTabs: selectedTabs.map( ( tab ) => ( {
									...tab,
									parentTermId: nextParentId,
									termId: 0,
									termSlug: '',
									text: '',
									subTermIds: [],
									featuredProductVersionIds: [],
								} ) ),
							} );
						} }
						help={ __( 'Main filter. After this, choose child categories inside each tab.', 'ambrygen-web' ) }
					/>
					{ isLoadingParents && <Spinner /> }
					{ selectedParentTerm && (
						<p style={ { marginTop: '8px', marginBottom: '12px', color: '#50575e' } }>
							{ __( 'Selected parent:', 'ambrygen-web' ) } <strong>{ decodeEntities( selectedParentTerm.name ) }</strong>
						</p>
					) }
					{ selectedTabs.map( ( tab, index ) => (
						<TabSettings
							key={ tab.id || `tab-${ index }` }
							index={ index }
							tab={ { ...tab, parentTermId: parentCategoryId || 0 } }
							updateTab={ updateTab }
							removeTab={ removeTab }
							totalTabs={ selectedTabs.length }
						/>
					) ) }
					<Button variant="secondary" onClick={ addTab }>
						{ __( 'Add Tab', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<ComboboxControl
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel }
						options={ HEADING_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value || 'h2' } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<div className="genes-table catlouge-search">
					<div className="genes-table__search cardiology-tests__search-area">
						<RichText
							tagName="div"
							className="eyebrow kicker-text cardiology-tests__search-label"
							value={ searchLabel }
							onChange={ ( value ) => setAttributes( { searchLabel: value } ) }
							placeholder={ __( 'Search label...', 'ambrygen-web' ) }
						/>
						<div className="is-style-gl-s12" aria-hidden="true"></div>
						<form className="genes-table__search-form" onSubmit={ ( event ) => event.preventDefault() }>
							<input
								type="search"
								className="genes-table__search-input"
								value={ searchPlaceholder }
								readOnly
							/>
							<input type="submit" className="genes-table__search-button" value="Search" />
						</form>
					</div>
				</div>

				<div className="is-style-gl-s24" aria-hidden="true"></div>

				<div className="container-1280 bg-primary_25 block-bg">

						<div className="block-layout cardiology-filter__grid">
							<div className="cardiology-filter__header">
								<RichText
									tagName="div"
									className="eyebrow cardiology-filter__subtitle kicker-text"
									value={ featuredEyebrow }
									onChange={ ( value ) => setAttributes( { featuredEyebrow: value } ) }
									placeholder={ __( 'Featured eyebrow...', 'ambrygen-web' ) }
								/>
								{ !! featuredEyebrow && (
									<div className="is-style-gl-s16" aria-hidden="true"></div>
								) }
								<TagName className="heading-4 block-title mb-0 cardiology-filter__title">
									<RichText
										tagName="span"
										value={ featuredTitle }
										onChange={ ( value ) => setAttributes( { featuredTitle: value } ) }
										placeholder={ __( 'Featured title...', 'ambrygen-web' ) }
									/>
								</TagName>
								{ !! featuredTitle && (
									<div className="is-style-gl-s16" aria-hidden="true"></div>
								) }
								<RichText
									tagName="div"
									className="body1 cardiology-filter__desc block-description"
									value={ featuredDescription }
									onChange={ ( value ) => setAttributes( { featuredDescription: value } ) }
									placeholder={ __( 'Featured description...', 'ambrygen-web' ) }
								/>
							</div>

							<div className="is-style-gl-s50" aria-hidden="true"></div>

							<TabsPreview selectedTabs={ selectedTabs } />
						</div>

				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="container-1280">

						<div className="block-layout catlouge-table-result">
							<div className="catlouge-table-result__header">
								<RichText
									tagName="div"
									className="eyebrow catlouge-table-result__subtitle"
									value={ tableEyebrow }
									onChange={ ( value ) => setAttributes( { tableEyebrow: value } ) }
									placeholder={ __( 'Table eyebrow...', 'ambrygen-web' ) }
								/>
								{ !! tableEyebrow && (
									<div className="is-style-gl-s12" aria-hidden="true"></div>
								) }
								<TagName className="heading-4 mb-0 block-title catlouge-table-result__title">
									<RichText
										tagName="span"
										value={ tableTitle }
										onChange={ ( value ) => setAttributes( { tableTitle: value } ) }
										placeholder={ __( 'Table title...', 'ambrygen-web' ) }
									/>
								</TagName>
								{ !! tableTitle && (
									<div className="is-style-gl-s12" aria-hidden="true"></div>
								) }
								<RichText
									tagName="div"
									className="body1 catlouge-table-result__desc block-description"
									value={ tableDescription }
									onChange={ ( value ) => setAttributes( { tableDescription: value } ) }
									placeholder={ __( 'Table description...', 'ambrygen-web' ) }
								/>
							</div>

							<TablePreview selectedTabs={ selectedTabs } />
						</div>

				</div>
			</div>
		</>
	);
}
