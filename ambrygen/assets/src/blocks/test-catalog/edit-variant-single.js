import apiFetch from '@wordpress/api-fetch';
import { Button, ComboboxControl, PanelBody, Spinner } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';

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

const normalizeIds = ( value ) => {
	if ( Array.isArray( value ) ) {
		return value.map( ( id ) => {
			const next = Number( id );
			return Number.isFinite( next ) && next > 0 ? next : 0;
		} );
	}
	return [];
};

export default function SingleVersionSettings({ attributes, setAttributes }) {
	const {
		singleCategoryId = 0,
		singleProductVersionId = 0,
		singleProductVersionIds,
	} = attributes;

	const selectedVersionIds = useMemo(
		() => normalizeIds( singleProductVersionIds ),
		[ singleProductVersionIds ]
	);

	const [categorySearch, setCategorySearch] = useState('');
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [categoriesError, setCategoriesError] = useState(false);

	const [versionSearch, setVersionSearch] = useState('');
	const [versionOptions, setVersionOptions] = useState([]);
	const [isLoadingVersions, setIsLoadingVersions] = useState(false);
	const [versionsError, setVersionsError] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const timeoutId = setTimeout(async () => {
			setIsLoadingCategories(true);
			setCategoriesError(false);

			try {
				const query = new URLSearchParams({
					per_page: '20',
					hide_empty: 'false',
					orderby: 'name',
					order: 'asc',
					_fields: 'id,name,slug,parent',
				});

				if (categorySearch) {
					query.set('search', categorySearch);
				}

				const results = await apiFetch({
					path: `/wp/v2/poster_category?${query.toString()}`,
				});

				if (isMounted) {
					const terms = Array.isArray(results) ? results : [];
					setCategoryOptions(terms);

					const parentIdsToFetch = terms
						.filter((t) => t.parent > 0 && !terms.some((pt) => pt.id === t.parent))
						.map((t) => t.parent);

					if (parentIdsToFetch.length > 0) {
						apiFetch({
							path: `/wp/v2/poster_category?include=${[...new Set(parentIdsToFetch)].join(',')}&_fields=id,name,slug,parent`,
						})
							.then((parentTerms) => {
								if (isMounted && Array.isArray(parentTerms)) {
									setCategoryOptions((current) => {
										const existingIds = current.map((c) => c.id);
										const uniqueNew = parentTerms.filter((p) => !existingIds.includes(p.id));
										return [...current, ...uniqueNew];
									});
								}
							})
							.catch(() => { });
					}
				}
			} catch (error) {
				if (isMounted) {
					setCategoryOptions([]);
					setCategoriesError(true);
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
	}, [categorySearch]);

	useEffect(() => {
		let isMounted = true;

		const shouldSearch = versionSearch && versionSearch.trim().length > 0;
		if (!singleCategoryId && !shouldSearch) {
			setVersionOptions([]);
			return () => {
				isMounted = false;
			};
		}

		const timeoutId = setTimeout(async () => {
			setIsLoadingVersions(true);
			setVersionsError(false);

			try {
				const query = new URLSearchParams({
					per_page: '20',
					status: 'publish',
					orderby: 'title',
					order: 'asc',
					_fields: 'id,title,poster_category',
				});

				if (singleCategoryId) {
					query.set('poster_category', String(singleCategoryId));
				}

				if (shouldSearch) {
					query.set('search', versionSearch.trim());
				}

				const posts = await apiFetch({
					path: `/wp/v2/product_version?${query.toString()}`,
				});

				if (isMounted) {
					setVersionOptions(Array.isArray(posts) ? posts : []);
				}
			} catch (error) {
				if (isMounted) {
					setVersionOptions([]);
					setVersionsError(true);
				}
			} finally {
				if (isMounted) {
					setIsLoadingVersions(false);
				}
			}
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
		};
	}, [singleCategoryId, versionSearch]);

	useEffect(() => {
		let isMounted = true;

		const idsToEnsure = selectedVersionIds.filter( ( id ) => id > 0 ).length
			? selectedVersionIds.filter( ( id ) => id > 0 )
			: singleProductVersionId
				? [ Number( singleProductVersionId ) ]
				: [];

		if ( idsToEnsure.length === 0 ) {
			return () => {
				isMounted = false;
			};
		}

		const missingIds = idsToEnsure.filter(
			( id ) => ! versionOptions.some( ( post ) => Number( post.id ) === id )
		);

		if ( missingIds.length === 0 ) {
			return () => {
				isMounted = false;
			};
		}

		Promise.all(
			missingIds.map( ( id ) =>
				apiFetch( {
					path: `/wp/v2/product_version/${ id }?_fields=id,title,poster_category`,
				} ).catch( () => null )
			)
		).then( ( posts ) => {
			if ( ! isMounted ) {
				return;
			}
			const validPosts = ( posts || [] ).filter( ( post ) => post?.id );
			if ( validPosts.length === 0 ) {
				return;
			}

			setVersionOptions( ( current ) => {
				const existingIds = new Set(
					( current || [] ).map( ( item ) => Number( item.id ) )
				);
				const uniqueNew = validPosts.filter(
					( post ) => ! existingIds.has( Number( post.id ) )
				);
				return [ ...uniqueNew, ...( current || [] ) ];
			} );
		} );

		return () => {
			isMounted = false;
		};
	}, [singleProductVersionId, selectedVersionIds, versionOptions]);

	const selectedCategoryOption = categoryOptions.find(
		(term) => Number(term.id) === Number(singleCategoryId)
	);
	const categoryComboOptions = categoryOptions.map((term) => ({
		label: getTermLabel(term, categoryOptions),
		value: String(term.id),
	}));

	const versionComboOptions = versionOptions.map((post) => ({
		label: getPostLabel(post),
		value: String(post.id),
	}));

	return (
		<PanelBody title={__('Single Version Settings', 'ambrygen-web')} initialOpen>
			<ComboboxControl
				label={__('Category Filter (Optional)', 'ambrygen-web')}
				value={singleCategoryId ? String(singleCategoryId) : ''}
				options={categoryComboOptions}
				onFilterValueChange={setCategorySearch}
				onChange={(value) => {
					const nextId = Number(value) || 0;
					setAttributes({
						singleCategoryId: nextId,
						singleProductVersionId: 0,
						singleProductVersionIds: [],
					});
				}}
				help={
					categoriesError
						? __('Unable to load categories right now.', 'ambrygen-web')
						: __('Search categories to narrow the list (optional).', 'ambrygen-web')
				}
			/>
			{isLoadingCategories && <Spinner />}
			{selectedCategoryOption && !categorySearch && (
				<p style={{ marginTop: '8px', marginBottom: 0 }}>
					{__('Selected:', 'ambrygen-web')}{' '}
					<strong>{getTermLabel(selectedCategoryOption, categoryOptions)}</strong>
				</p>
			)}

			<div style={{ marginTop: '12px' }}>
				<p style={{ marginTop: 0, marginBottom: '8px' }}>
					{ __(
						'Product Versions (Repeater)',
						'ambrygen-web'
					) }
				</p>

				{ ( selectedVersionIds.length
					? selectedVersionIds
					: singleProductVersionId
						? [ singleProductVersionId ]
						: []
				).map( ( versionId, index ) => (
					<div
						key={ `version-${ versionId }-${ index }` }
						style={ { marginBottom: '12px' } }
					>
						<ComboboxControl
							label={
								index === 0
									? __( 'Product Version', 'ambrygen-web' )
									: __( 'Product Version', 'ambrygen-web' )
							}
							value={ versionId ? String( versionId ) : '' }
							options={ versionComboOptions }
							onFilterValueChange={ setVersionSearch }
							onChange={ ( value ) => {
								const nextId = Number( value ) || 0;
								const base = selectedVersionIds.length
									? [ ...selectedVersionIds ]
									: singleProductVersionId
										? [ Number( singleProductVersionId ) ]
										: [];
								base[ index ] = nextId;
								const nextIds = base.map( ( id ) => Number( id ) || 0 );
								setAttributes( {
									singleProductVersionIds: nextIds,
									singleProductVersionId:
										nextIds.find( ( id ) => id > 0 ) || 0,
								} );
							} }
							help={
								versionsError
									? __(
											'Unable to load product versions right now.',
											'ambrygen-web'
									  )
									: singleCategoryId
										? __(
												'Search product versions by title.',
												'ambrygen-web'
										  )
										: __(
												'Type to search product versions by title (no category required).',
												'ambrygen-web'
										  )
							}
						/>

						<Button
							isDestructive
							variant="secondary"
							onClick={ () => {
								const base = selectedVersionIds.length
									? [ ...selectedVersionIds ]
									: singleProductVersionId
										? [ Number( singleProductVersionId ) ]
										: [];
								base.splice( index, 1 );
								const nextIds = base.map( ( id ) => Number( id ) || 0 );
								setAttributes( {
									singleProductVersionIds: nextIds,
									singleProductVersionId:
										nextIds.find( ( id ) => id > 0 ) || 0,
								} );
							} }
							style={ { marginTop: '8px' } }
						>
							{ __( 'Remove', 'ambrygen-web' ) }
						</Button>
					</div>
				) ) }

				<Button
					isSecondary
					onClick={ () => {
						const base = selectedVersionIds.length
							? [ ...selectedVersionIds ]
							: singleProductVersionId
								? [ Number( singleProductVersionId ) ]
								: [];
						setAttributes( {
							singleProductVersionIds: [ ...base, 0 ],
						} );
					} }
				>
					{ __( 'Add Product Version', 'ambrygen-web' ) }
				</Button>

				{ isLoadingVersions && <Spinner /> }

				{ ( selectedVersionIds.length > 0 || singleProductVersionId > 0 ) && (
					<Button
						isSecondary
						onClick={ () =>
							setAttributes( {
								singleProductVersionId: 0,
								singleProductVersionIds: [],
							} )
						}
						style={ { marginTop: '8px' } }
					>
						{ __( 'Clear All', 'ambrygen-web' ) }
					</Button>
				) }

				<hr style={ { marginTop: '16px' } } />

				<ComboboxControl
					label={__('Legacy Single Product Version', 'ambrygen-web')}
					value={singleProductVersionId ? String(singleProductVersionId) : ''}
					options={versionComboOptions}
					onFilterValueChange={setVersionSearch}
					onChange={(value) => {
						const nextId = Number( value ) || 0;
						setAttributes( {
							singleProductVersionId: nextId,
							singleProductVersionIds: nextId ? [ nextId ] : [],
						} );
					}}
					help={
						versionsError
							? __('Unable to load product versions right now.', 'ambrygen-web')
							: singleCategoryId
								? __('Search product versions by title.', 'ambrygen-web')
								: __('Type to search product versions by title (no category required).', 'ambrygen-web')
					}
				/>
			</div>
		</PanelBody>
	);
}
