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
import { useEffect, useState } from '@wordpress/element';
import { ServerSideRender } from '@wordpress/server-side-render';

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

function MaterialCategoryRow( { value, onChange } ) {
	const materialType = value?.materialType || DEFAULT_TERM;
	const category = value?.category || DEFAULT_TERM;
	const selectedPostIds = Array.isArray( value?.selectedPostIds )
		? value.selectedPostIds
		: [];

	const [ materialSearch, setMaterialSearch ] = useState( materialType?.name || '' );
	const [ materialOptions, setMaterialOptions ] = useState( [] );
	const [ isLoadingMaterialTypes, setIsLoadingMaterialTypes ] = useState( false );
	const [ materialTypesError, setMaterialTypesError ] = useState( false );

	const [ categorySearch, setCategorySearch ] = useState( category?.name || '' );
	const [ categoryOptions, setCategoryOptions ] = useState( [] );
	const [ isLoadingCategories, setIsLoadingCategories ] = useState( false );
	const [ categoriesError, setCategoriesError ] = useState( false );

	const [ postsSearch, setPostsSearch ] = useState( '' );
	const [ postsOptions, setPostsOptions ] = useState( [] );
	const [ isLoadingPosts, setIsLoadingPosts ] = useState( false );
	const [ postsError, setPostsError ] = useState( false );
	const [ hasLoadedPosts, setHasLoadedPosts ] = useState( false );

	useEffect( () => {
		let isMounted = true;
		const timeoutId = setTimeout( async () => {
			setIsLoadingMaterialTypes( true );
			setMaterialTypesError( false );

			try {
				const query = new URLSearchParams( {
					per_page: '20',
					hide_empty: 'false',
					orderby: 'name',
					order: 'asc',
					_fields: 'id,name,slug',
				} );

				if ( materialSearch ) {
					query.set( 'search', materialSearch );
				}

				const results = await apiFetch( {
					path: `/wp/v2/marketing_material_type?${ query.toString() }`,
				} );

				if ( isMounted ) {
					setMaterialOptions( Array.isArray( results ) ? results : [] );
				}
			} catch ( error ) {
				if ( isMounted ) {
					setMaterialOptions( [] );
					setMaterialTypesError( true );
				}
			} finally {
				if ( isMounted ) {
					setIsLoadingMaterialTypes( false );
				}
			}
		}, SEARCH_DEBOUNCE_MS );

		return () => {
			isMounted = false;
			clearTimeout( timeoutId );
		};
	}, [ materialSearch ] );

	useEffect( () => {
		let isMounted = true;
		const timeoutId = setTimeout( async () => {
			setIsLoadingCategories( true );
			setCategoriesError( false );

			try {
				let results = [];

				if ( materialType?.id ) {
					const posterCategoryIds = new Set();
					const perPage = 100;
					const maxPages = 3;

					for ( let page = 1; page <= maxPages; page++ ) {
						const postsQuery = new URLSearchParams( {
							per_page: String( perPage ),
							page: String( page ),
							marketing_material_type: String( materialType.id ),
							_fields: 'poster_category',
						} );

						const posts = await apiFetch( {
							path: `/wp/v2/marketing_material?${ postsQuery.toString() }`,
						} );

						if ( Array.isArray( posts ) ) {
							posts.forEach( ( post ) => {
								( post?.poster_category || [] ).forEach( ( termId ) => {
									posterCategoryIds.add( Number( termId ) );
								} );
							} );
						}

						if ( ! Array.isArray( posts ) || posts.length < perPage ) {
							break;
						}
					}

					const includeIds = Array.from( posterCategoryIds ).filter(
						( id ) => id > 0
					);

					if ( includeIds.length ) {
						const termQuery = new URLSearchParams( {
							per_page: '100',
							hide_empty: 'false',
							orderby: 'name',
							order: 'asc',
							_fields: 'id,name,slug',
							include: includeIds.join( ',' ),
						} );

						results = await apiFetch( {
							path: `/wp/v2/poster_category?${ termQuery.toString() }`,
						} );
					} else {
						results = [];
					}
				} else {
					const query = new URLSearchParams( {
						per_page: '20',
						hide_empty: 'false',
						orderby: 'name',
						order: 'asc',
						_fields: 'id,name,slug',
					} );

					if ( categorySearch ) {
						query.set( 'search', categorySearch );
					}

					results = await apiFetch( {
						path: `/wp/v2/poster_category?${ query.toString() }`,
					} );
				}

				if ( materialType?.id && categorySearch && Array.isArray( results ) ) {
					const searchLower = categorySearch.toLowerCase();
					results = results.filter( ( term ) =>
						getTermLabel( term ).toLowerCase().includes( searchLower )
					);
				}

				if ( isMounted ) {
					setCategoryOptions( Array.isArray( results ) ? results : [] );
				}
			} catch ( error ) {
				if ( isMounted ) {
					setCategoryOptions( [] );
					setCategoriesError( true );
				}
			} finally {
				if ( isMounted ) {
					setIsLoadingCategories( false );
				}
			}
		}, SEARCH_DEBOUNCE_MS );

		return () => {
			isMounted = false;
			clearTimeout( timeoutId );
		};
	}, [ categorySearch, materialType?.id ] );

	useEffect( () => {
		setPostsOptions( [] );
		setPostsError( false );
		setHasLoadedPosts( false );
	}, [ materialType?.id, category?.id ] );

	const loadPosts = async () => {
		if ( ! materialType?.id || ! category?.id ) {
			return;
		}

		setPostsError( false );
		setIsLoadingPosts( true );

		try {
			const query = new URLSearchParams( {
				per_page: '50',
				marketing_material_type: String( materialType.id ),
				poster_category: String( category.id ),
				orderby: 'title',
				order: 'asc',
				_fields: 'id,title',
			} );

			if ( postsSearch ) {
				query.set( 'search', postsSearch );
			}

			const results = await apiFetch( {
				path: `/wp/v2/marketing_material?${ query.toString() }`,
			} );

			setPostsOptions( Array.isArray( results ) ? results : [] );
			setHasLoadedPosts( true );
		} catch ( error ) {
			setPostsOptions( [] );
			setPostsError( true );
			setHasLoadedPosts( true );
		} finally {
			setIsLoadingPosts( false );
		}
	};

	const togglePost = ( postId, isChecked ) => {
		const nextIds = isChecked
			? Array.from( new Set( [ ...selectedPostIds, postId ] ) )
			: selectedPostIds.filter( ( id ) => Number( id ) !== Number( postId ) );

		onChange( { ...value, selectedPostIds: nextIds } );
	};

	return (
		<div>
			<ComboboxControl
				label={ __( 'Material Type', 'ambrygen-web' ) }
				value={ String( materialType?.id || '' ) }
				options={ materialOptions.map( ( term ) => ( {
					label: getTermLabel( term ),
					value: String( term.id ),
				} ) ) }
				onFilterValueChange={ setMaterialSearch }
				onChange={ ( nextValue ) => {
					if ( ! nextValue ) {
						onChange( {
							...value,
							materialType: DEFAULT_TERM,
							category: DEFAULT_TERM,
							selectedPostIds: [],
						} );
						setCategorySearch( '' );
						return;
					}

					const term = materialOptions.find(
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
				help={
					materialTypesError
						? __( 'Unable to load material types right now.', 'ambrygen-web' )
						: __( 'Select a marketing material type.', 'ambrygen-web' )
				}
			/>

			{ isLoadingMaterialTypes && <Spinner /> }

			<ComboboxControl
				label={ __( 'Category', 'ambrygen-web' ) }
				value={ String( category?.id || '' ) }
				options={ categoryOptions.map( ( term ) => ( {
					label: getTermLabel( term ),
					value: String( term.id ),
				} ) ) }
				onFilterValueChange={ setCategorySearch }
				onChange={ ( nextValue ) => {
					if ( ! nextValue ) {
						onChange( {
							...value,
							category: DEFAULT_TERM,
							selectedPostIds: [],
						} );
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
				value={ postsSearch }
				onChange={ setPostsSearch }
				disabled={ ! materialType?.id || ! category?.id }
				help={ __(
					'Click "Load Posts" to fetch results (prevents repeated AJAX calls on every keypress).',
					'ambrygen-web'
				) }
			/>

			<Button
				variant="secondary"
				disabled={ ! materialType?.id || ! category?.id || isLoadingPosts }
				onClick={ loadPosts }
			>
				{ hasLoadedPosts
					? __( 'Reload Posts', 'ambrygen-web' )
					: __( 'Load Posts', 'ambrygen-web' ) }
			</Button>

			{ isLoadingPosts && <Spinner /> }

			{ postsError && (
				<p className="components-notice is-error">
					{ __( 'Unable to load posts right now.', 'ambrygen-web' ) }
				</p>
			) }

			{ hasLoadedPosts &&
				( postsOptions || [] ).length === 0 &&
				! postsError && (
					<p>
						{ __(
							'No posts found for this selection.',
							'ambrygen-web'
						) }
					</p>
				) }

			{ hasLoadedPosts && ( postsOptions || [] ).length > 0 && (
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

			{ hasLoadedPosts && ( postsOptions || [] ).map( ( post ) => {
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
			Array.isArray( section?.categories ) && section.categories.length > 0
	);

	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( {
				blockId: `marketing-files-${ clientId.slice( 0, 8 ) }`,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Block Settings', 'ambrygen-web' ) } initialOpen>
					<ComboboxControl
						label={ __( 'Heading Level', 'ambrygen-web' ) }
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

						return (
							<div key={ `section-${ sectionIndex }` }>
								<TextControl
									label={ __( 'Section Title', 'ambrygen-web' ) }
									value={ sectionTitle }
									onChange={ ( next ) =>
										updateSection( { ...section, title: next } )
									}
								/>

								{ rows.map( ( row, rowIndex ) => (
									<div key={ `row-${ sectionIndex }-${ rowIndex }` }>
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
										/>

										<Button
											isDestructive
											variant="secondary"
											onClick={ () => {
												const nextRows = rows.filter(
													( _, i ) => i !== rowIndex
												);
												updateSection( { ...section, categories: nextRows } );
											} }
										>
											{ __( 'Remove Row', 'ambrygen-web' ) }
										</Button>
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

								<Button
									isDestructive
									variant="secondary"
									onClick={ () => {
										const nextSections = normalizedSections.filter(
											( _, i ) => i !== sectionIndex
										);
										setAttributes( { sections: nextSections } );
									} }
								>
									{ __( 'Remove Section', 'ambrygen-web' ) }
								</Button>
								<hr />
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
								attributes={ attributes }
							/>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
