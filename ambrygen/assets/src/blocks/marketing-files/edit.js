import apiFetch from '@wordpress/api-fetch';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ComboboxControl,
	Button,
	CheckboxControl,
	PanelBody,
	Spinner,
	TextControl,
} from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { ServerSideRender } from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';
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

const DEFAULT_TERM = { id: 0, name: '', slug: '' };

// In-memory cache for material-specific category lookups to prevent duplicate API calls
const MATERIAL_CATEGORY_CACHE = {};

const getTermLabel = ( term ) => {
	if ( ! term ) {
		return '';
	}

	if ( typeof term.name === 'string' && term.name.length > 0 ) {
		return decodeEntities( term.name );
	}

	if ( typeof term.slug === 'string' && term.slug.length > 0 ) {
		return decodeEntities( term.slug );
	}

	return term.id ? `Category ${ term.id }` : '';
};

function MaterialCategoryRow( { value, onChange, index, total, onMove, onRemove } ) {
	const materialType = value?.materialType || DEFAULT_TERM;
	const category = value?.category || DEFAULT_TERM;
	const selectedPostIds = Array.isArray( value?.selectedPostIds )
		? value.selectedPostIds
		: [];

	const [ materialSearchInput, setMaterialSearchInput ] = useState( materialType?.name || '' );
	const [ materialSearch, setMaterialSearch ] = useState( materialType?.name || '' );
	useEffect( () => {
		const timeoutId = setTimeout( () => setMaterialSearch( materialSearchInput ), SEARCH_DEBOUNCE_MS );
		return () => clearTimeout( timeoutId );
	}, [ materialSearchInput ] );

	const { materialOptions, isLoadingMaterialTypes, selectedMaterial } = useSelect( ( select ) => {
		const query = {
			per_page: 20,
			hide_empty: false,
			orderby: 'name',
			order: 'asc',
			_fields: 'id,name,slug',
		};

		if ( materialSearch ) {
			query.search = materialSearch;
		}

		const fetched = select( 'core' ).getEntityRecords( 'taxonomy', 'marketing_material_type', query );
		const isResolving = select( 'core' ).isResolving( 'getEntityRecords', [ 'taxonomy', 'marketing_material_type', query ] );

		let sTerm = null;
		if ( materialType?.id ) {
			sTerm = select( 'core' ).getEntityRecord( 'taxonomy', 'marketing_material_type', materialType.id );
		}

		return {
			materialOptions: fetched,
			isLoadingMaterialTypes: isResolving,
			selectedMaterial: sTerm
		};
	}, [ materialSearch, materialType?.id ] );

	const allMaterialOptions = useMemo( () => {
		const combined = [];
		if ( Array.isArray( materialOptions ) ) combined.push( ...materialOptions );
		if ( selectedMaterial ) combined.push( selectedMaterial );

		const unique = [];
		const seen = new Set();
		combined.forEach( t => {
			if ( t && ! seen.has( t.id ) ) {
				seen.add( t.id );
				unique.push( t );
			}
		} );
		return unique;
	}, [ materialOptions, selectedMaterial ] );

	const [ categorySearchInput, setCategorySearchInput ] = useState( category?.name || '' );
	const [ categorySearch, setCategorySearch ] = useState( category?.name || '' );
	useEffect( () => {
		const timeoutId = setTimeout( () => setCategorySearch( categorySearchInput ), SEARCH_DEBOUNCE_MS );
		return () => clearTimeout( timeoutId );
	}, [ categorySearchInput ] );

	// State for material-specific categories
	const [ materialCategoryOptions, setMaterialCategoryOptions ] = useState( [] );
	const [ isLoadingMaterialCategories, setIsLoadingMaterialCategories ] = useState( false );
	const [ materialCategoriesError, setMaterialCategoriesError ] = useState( false );

	// Fetch categories specific to the selected material type ONLY when materialType changes
	useEffect( () => {
		if ( ! materialType?.id ) {
			setMaterialCategoryOptions( [] );
			return;
		}

		if ( MATERIAL_CATEGORY_CACHE[ materialType.id ] ) {
			setMaterialCategoryOptions( MATERIAL_CATEGORY_CACHE[ materialType.id ] );
			return;
		}

		let isMounted = true;
		setIsLoadingMaterialCategories( true );
		setMaterialCategoriesError( false );

		(async () => {
			try {
				const posterCategoryIds = new Set();
				for ( let page = 1; page <= 3; page++ ) {
					const posts = await apiFetch( {
						path: `/wp/v2/marketing_material?per_page=100&page=${page}&marketing_material_type=${materialType.id}&_fields=poster_category`,
					} );
					if ( Array.isArray( posts ) ) {
						posts.forEach( ( post ) => {
							( post?.poster_category || [] ).forEach( ( termId ) => posterCategoryIds.add( Number( termId ) ) );
						} );
					}
					if ( ! Array.isArray( posts ) || posts.length < 100 ) break;
				}

				const includeIds = Array.from( posterCategoryIds ).filter( ( id ) => id > 0 );
				let results = [];
				if ( includeIds.length ) {
					results = await apiFetch( {
						path: `/wp/v2/poster_category?per_page=100&hide_empty=false&orderby=name&order=asc&_fields=id,name,slug&include=${includeIds.join( ',' )}`,
					} );
				}

				if ( isMounted ) {
					const finalResults = Array.isArray( results ) ? results : [];
					MATERIAL_CATEGORY_CACHE[ materialType.id ] = finalResults;
					setMaterialCategoryOptions( finalResults );
				}
			} catch ( error ) {
				if ( isMounted ) {
					setMaterialCategoryOptions( [] );
					setMaterialCategoriesError( true );
				}
			} finally {
				if ( isMounted ) {
					setIsLoadingMaterialCategories( false );
				}
			}
		})();

		return () => { isMounted = false; };
	}, [ materialType?.id ] );

	// Fetch global categories when no material type is selected using Redux cache
	const { globalCategoryOptions, isLoadingGlobalCategories } = useSelect( ( select ) => {
		if ( materialType?.id ) {
			return { globalCategoryOptions: [], isLoadingGlobalCategories: false };
		}

		const query = {
			per_page: 20,
			hide_empty: false,
			orderby: 'name',
			order: 'asc',
			_fields: 'id,name,slug',
		};
		if ( categorySearch ) query.search = categorySearch;

		const fetched = select( 'core' ).getEntityRecords( 'taxonomy', 'poster_category', query );
		const isResolving = select( 'core' ).isResolving( 'getEntityRecords', [ 'taxonomy', 'poster_category', query ] );
		return {
			globalCategoryOptions: Array.isArray(fetched) ? fetched : [],
			isLoadingGlobalCategories: isResolving
		};
	}, [ categorySearch, materialType?.id ] );

	// Final derived category options
	const categoryOptions = useMemo( () => {
		let options = materialType?.id ? materialCategoryOptions : globalCategoryOptions;
		if ( materialType?.id && categorySearchInput ) {
			const searchLower = categorySearchInput.toLowerCase();
			options = options.filter( term => getTermLabel( term ).toLowerCase().includes( searchLower ) );
		}
		// ensure selected category is always in the list to prevent empty selected value display
		if ( category?.id && !options.some(o => Number(o.id) === Number(category.id)) ) {
			return [...options, category];
		}
		return options;
	}, [ materialType?.id, materialCategoryOptions, globalCategoryOptions, categorySearchInput, category ] );

	const isLoadingCategories = materialType?.id ? isLoadingMaterialCategories : isLoadingGlobalCategories;
	const categoriesError = materialType?.id ? materialCategoriesError : false;

	const [ postsSearchInput, setPostsSearchInput ] = useState( '' );
	const [ postsSearch, setPostsSearch ] = useState( '' );
	useEffect( () => {
		const timeoutId = setTimeout(
			() => setPostsSearch( postsSearchInput ),
			SEARCH_DEBOUNCE_MS
		);
		return () => clearTimeout( timeoutId );
	}, [ postsSearchInput ] );

	const { postsOptions, isLoadingPosts } = useSelect(
		( select ) => {
			if ( ! materialType?.id || ! category?.id ) {
				return { postsOptions: [], isLoadingPosts: false };
			}

			const query = {
				marketing_material_type: materialType.id,
				order: 'asc',
				orderby: 'title',
				per_page: 20,
				poster_category: category.id,
				search: postsSearch || undefined,
				status: 'publish',
				_fields: 'id,title',
			};

			const fetched = select( 'core' ).getEntityRecords(
				'postType',
				'marketing_material',
				query
			);
			const isResolving = select( 'core' ).isResolving(
				'getEntityRecords',
				[ 'postType', 'marketing_material', query ]
			);

			return {
				postsOptions: Array.isArray( fetched ) ? fetched : [],
				isLoadingPosts: isResolving,
			};
		},
		[ materialType?.id, category?.id, postsSearch ]
	);

	const togglePost = ( postId, isChecked ) => {
		const nextIds = isChecked
			? Array.from( new Set( [ ...selectedPostIds, postId ] ) )
			: selectedPostIds.filter( ( id ) => Number( id ) !== Number( postId ) );

		onChange( { ...value, selectedPostIds: nextIds } );
	};

	return (
		<div>
			<ItemHeader
				index={ index }
				label={ category?.name || __( 'Untitled Row', 'ambrygen-web' ) }
				prefix={ __( 'Row', 'ambrygen-web' ) }
				total={ total }
				onMove={ onMove }
				onRemove={ onRemove }
				minCount={ 1 }
			/>

			<ComboboxControl
				label={ __( 'Material Type', 'ambrygen-web' ) }
				value={ String( materialType?.id || '' ) }
				options={ allMaterialOptions.map( ( term ) => ( {
					label: getTermLabel( term ),
					value: String( term.id ),
				} ) ) }
				onFilterValueChange={ setMaterialSearchInput }
				onChange={ ( nextValue ) => {
					if ( ! nextValue ) {
						onChange( {
							...value,
							materialType: DEFAULT_TERM,
							category: DEFAULT_TERM,
							selectedPostIds: [],
						} );
						setMaterialSearchInput( '' );
						setMaterialSearch( '' );
						setCategorySearchInput( '' );
						setCategorySearch( '' );
						return;
					}

					const term = allMaterialOptions.find(
						( item ) => String( item.id ) === nextValue
					);

					if ( ! term ) {
						return;
					}

					const termLabel = getTermLabel( term );
					setMaterialSearch( termLabel );
					setCategorySearch( '' );

					onChange( {
						...value,
						materialType: {
							id: term.id,
							name: termLabel,
							slug: term.slug || '',
						},
						category: DEFAULT_TERM,
						selectedPostIds: [],
					} );
				} }
				help={ __( 'Search to find a marketing material type.', 'ambrygen-web' ) }
			/>

			{ isLoadingMaterialTypes && <Spinner /> }

			<ComboboxControl
				label={ __( 'Category', 'ambrygen-web' ) }
				value={ String( category?.id || '' ) }
				options={ categoryOptions.map( ( term ) => ( {
					label: getTermLabel( term ),
					value: String( term.id ),
				} ) ) }
				onFilterValueChange={ setCategorySearchInput }
				onChange={ ( nextValue ) => {
					if ( ! nextValue ) {
						onChange( {
							...value,
							category: DEFAULT_TERM,
							selectedPostIds: [],
						} );
						setCategorySearchInput( '' );
						setCategorySearch( '' );
						return;
					}

					const term = categoryOptions.find(
						( item ) => String( item.id ) === nextValue
					);

					if ( ! term ) {
						return;
					}

					const termLabel = getTermLabel( term );
					setCategorySearch( termLabel );

					onChange( {
						...value,
						category: {
							id: term.id,
							name: termLabel,
							slug: term.slug || '',
						},
						selectedPostIds: [],
					} );
				} }
				help={
					categoriesError
						? __( 'Unable to load categories right now.', 'ambrygen-web' )
						: __( 'Select a category for this row.', 'ambrygen-web' )
				}
			/>

			{ isLoadingCategories && <Spinner /> }

			<TextControl
				label={ __( 'Search Posts', 'ambrygen-web' ) }
				value={ postsSearchInput }
				onChange={ setPostsSearchInput }
				disabled={ ! materialType?.id || ! category?.id }
				help={ __(
					'Search to instantly filter posts.',
					'ambrygen-web'
				) }
			/>

			{ isLoadingPosts && <Spinner /> }

			{ materialType?.id > 0 && category?.id > 0 && ! isLoadingPosts && postsOptions.length === 0 && (
				<p>
					{ __(
						'No posts found for this selection.',
						'ambrygen-web'
					) }
				</p>
			) }

			{ materialType?.id > 0 && category?.id > 0 && postsOptions.length > 0 && (
				<CheckboxControl
					label={ __( 'Select All', 'ambrygen-web' ) }
					checked={
						( postsOptions || [] ).every( ( post ) =>
							selectedPostIds.some( ( id ) => Number( id ) === Number( post?.id ) )
						)
					}
					onChange={ ( isChecked ) => {
						const visibleIds = ( postsOptions || [] )
							.map( ( post ) => Number( post?.id ) )
							.filter( Boolean );

						if ( ! visibleIds.length ) {
							return;
						}

						if ( isChecked ) {
							const next = Array.from(
								new Set( [ ...selectedPostIds, ...visibleIds ] )
							);
							onChange( { ...value, selectedPostIds: next } );
							return;
						}

						const visibleSet = new Set( visibleIds.map( Number ) );
						const next = selectedPostIds.filter(
							( id ) => ! visibleSet.has( Number( id ) )
						);
						onChange( { ...value, selectedPostIds: next } );
					} }
				/>
			) }

			{ materialType?.id > 0 && category?.id > 0 && postsOptions.map( ( post ) => {
				const postId = Number( post?.id );
				const postTitle =
					post?.title?.rendered ? decodeEntities( post.title.rendered ) : '';

				if ( ! postId ) {
					return null;
				}

				return (
					<CheckboxControl
						key={ postId }
						label={ postTitle || `Post ${ postId }` }
						checked={ selectedPostIds.some(
							( id ) => Number( id ) === postId
						) }
						onChange={ ( isChecked ) => togglePost( postId, isChecked ) }
					/>
				);
			} ) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes, clientId, name } ) {
	const {
		blockId,
		title,
		headingLevel,
		selectedCategory,
		sections,
	} = attributes;
	const TagName = headingLevel || 'h2';
	const normalizedSections = Array.isArray( sections ) ? sections : [];
	const hasRepeaterSelection = normalizedSections.some(
		( section ) =>
			Array.isArray( section?.categories ) &&
			section.categories.some(
				( row ) => row?.materialType?.id > 0 && row?.category?.id > 0
			)
	);

	const moveSection = ( index, direction ) => {
		const newIndex = index + direction;
		if ( newIndex < 0 || newIndex >= normalizedSections.length || index === newIndex ) return;
		const nextSections = [ ...normalizedSections ];
		[ nextSections[ index ], nextSections[ newIndex ] ] = [ nextSections[ newIndex ], nextSections[ index ] ];
		setAttributes( { sections: nextSections } );
	};

	const removeSection = ( index ) => {
		const nextSections = normalizedSections.filter( ( _, i ) => i !== index );
		setAttributes( { sections: nextSections } );
	};

	useEffect( () => {
		const expectedId = `marketing-files-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Block Settings', 'ambrygen-web' ) } initialOpen>
					<ComboboxControl
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel }
						options={ HEADING_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Repeater', 'ambrygen-web' ) } initialOpen={ false }>
					{ normalizedSections.map( ( section, sectionIndex ) => {
						const sectionTitle = section?.title || '';
						const rows = Array.isArray( section?.categories )
							? section.categories
							: [];

						const updateSection = ( nextSection ) => {
							const nextSections = normalizedSections.map( ( s, i ) =>
								i === sectionIndex ? nextSection : s
							);
							setAttributes( { sections: nextSections } );
						};

						const moveRow = ( rowIndex, direction ) => {
							const newIndex = rowIndex + direction;
							if ( newIndex < 0 || newIndex >= rows.length || rowIndex === newIndex ) return;
							const nextRows = [ ...rows ];
							[ nextRows[ rowIndex ], nextRows[ newIndex ] ] = [ nextRows[ newIndex ], nextRows[ rowIndex ] ];
							updateSection( { ...section, categories: nextRows } );
						};

						const removeRow = ( rowIndex ) => {
							const nextRows = rows.filter( ( _, i ) => i !== rowIndex );
							updateSection( { ...section, categories: nextRows } );
						};

						return (
							<div key={ `section-${ sectionIndex }` } style={{ border: '1px solid #dcdcde', padding: '12px', marginBottom: '12px' }}>
								<ItemHeader
									index={ sectionIndex }
									label={ sectionTitle || __( 'Untitled Section', 'ambrygen-web' ) }
									prefix={ __( 'Section', 'ambrygen-web' ) }
									total={ normalizedSections.length }
									onMove={ ( itemIndex, direction ) => moveSection( sectionIndex, direction ) }
									onRemove={ () => removeSection( sectionIndex ) }
									minCount={ 1 }
								/>

								<TextControl
									label={ __( 'Section Title', 'ambrygen-web' ) }
									value={ sectionTitle }
									onChange={ ( next ) =>
										updateSection( { ...section, title: next } )
									}
								/>

								{ rows.map( ( row, rowIndex ) => (
									<div key={ `row-${ sectionIndex }-${ rowIndex }` } style={{ marginTop: '12px' }}>
										<MaterialCategoryRow
											value={ row }
											onChange={ ( nextRow ) => {
												const nextRows = rows.map( ( r, i ) =>
													i === rowIndex ? nextRow : r
												);
												updateSection( {
													...section,
													categories: nextRows,
												} );
											} }
											index={ rowIndex }
											total={ rows.length }
											onMove={ ( itemIndex, direction ) => moveRow( rowIndex, direction ) }
											onRemove={ () => removeRow( rowIndex ) }
										/>
										<hr />
									</div>
								) ) }

								<Button
									variant="primary"
									onClick={ () => {
										updateSection( {
											...section,
											categories: [
												...rows,
												{
													materialType: DEFAULT_TERM,
													category: DEFAULT_TERM,
													selectedPostIds: [],
												},
											],
										} );
									} }
								>
									{ __( 'Add Row', 'ambrygen-web' ) }
								</Button>
							</div>
						);
					} ) }

					<Button
						variant="primary"
						onClick={ () => {
							setAttributes( {
								sections: [ ...normalizedSections, { title: '', categories: [] } ],
							} );
						} }
					>
						{ __( 'Add Section', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<div className="marketing-catlouge">
					<div className="marketing-catlouge__header">
						<TagName className="heading-4 block-title mb-0 marketing-catlouge__title">
							<RichText
								tagName="span"
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
								placeholder={ __( 'Add title...', 'ambrygen-web' ) }
							/>
						</TagName>
					</div>
				</div>

				<div className="marketing-files__preview">
					{ ! hasRepeaterSelection && ! selectedCategory?.id && (
						<p>
							{ __(
								'Add a section/row in the Repeater to load marketing files.',
								'ambrygen-web'
							) }
						</p>
					) }

					{ ( hasRepeaterSelection || selectedCategory?.id ) && (
						<div className="marketing-files__ssr">
							<ServerSideRender
								block={ name }
								httpMethod="POST"
								attributes={{
									...attributes,
									sections: normalizedSections.map( s => ({
										...s,
										categories: (s.categories || []).filter(c => c.materialType?.id > 0 && c.category?.id > 0)
									})).filter( s => s.title || s.categories.length > 0 )
								}}
							/>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
