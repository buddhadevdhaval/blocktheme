import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import apiFetch from '../_shared/api-fetch';
import {
	PanelBody,
	Button,
	TextControl,
	TreeSelect,
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

const INITIAL_VISIBLE_TEST_COUNT = 12;

const MoveArrowIcon = ( { direction = 'down' } ) => (
	<svg
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		aria-hidden="true"
		focusable="false"
		style={ direction === 'up' ? { transform: 'rotate(180deg)' } : undefined }
	>
		<path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z" />
	</svg>
);

const sortPostsByOrderedIds = ( posts, orderedIds ) => {
	if ( ! orderedIds.length ) {
		return posts;
	}
	const sorted = [ ...posts ];
	sorted.sort( ( a, b ) => {
		const idxA = orderedIds.indexOf( a.id );
		const idxB = orderedIds.indexOf( b.id );
		if ( idxA !== -1 && idxB !== -1 ) return idxA - idxB;
		if ( idxA !== -1 ) return -1;
		if ( idxB !== -1 ) return 1;
		return 0;
	} );
	return sorted;
};

function TabPostsOrderControl( { tab, tabIndex, activePosts, terms, updateTab } ) {
	const tabSlug = tab.termSlug || 'all';
	let tabPosts = [ ...( activePosts || [] ) ];

	if ( tabSlug !== 'all' && terms ) {
		const targetTerm = terms.find( ( t ) => t.slug === tabSlug );
		if ( targetTerm ) {
			tabPosts = tabPosts.filter( ( p ) =>
				( p.poster_category || [] ).map( Number ).includes( targetTerm.id )
			);
		}
	}

	const orderedIds = Array.isArray( tab.orderedPostIds ) ? tab.orderedPostIds : [];
	tabPosts = sortPostsByOrderedIds( tabPosts, orderedIds );

	if ( ! tabPosts.length ) {
		return <p style={ { fontSize: 12, color: '#666', marginTop: 4 } }>{ __( 'No posts found in this tab category.', 'ambrygen-web' ) }</p>;
	}

	return tabPosts.map( ( post, pIndex ) => {
		const handleMove = ( direction ) => {
			const newPosts = [ ...tabPosts ];
			const targetIndex = pIndex + direction;
			if ( targetIndex < 0 || targetIndex >= newPosts.length ) return;

			const temp = newPosts[ pIndex ];
			newPosts[ pIndex ] = newPosts[ targetIndex ];
			newPosts[ targetIndex ] = temp;

			const newOrderedIds = newPosts.map( ( p ) => p.id );
			updateTab( tabIndex, 'orderedPostIds', newOrderedIds );
		};

		return (
			<div
				key={ post.id }
				style={ {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '12px',
					padding: '8px 0',
					borderBottom: '1px solid #f0f0f0',
					overflowWrap: 'anywhere',
					borderBottom:
								pIndex ===
								tabPosts.length - 1
									? 'none'
									: '1px solid #f0f0f0',
				} }
			>
				<span>
					{ decodeEntities( post.title?.rendered || '' ) }
				</span>
			<div
				key={ post.id }
				className="moveable__buttons"
			>
					<Button
						variant="tertiary"
						size="small"
						disabled={ pIndex === 0 }
						onClick={ () => handleMove( -1 ) }
						aria-label={ __( 'Move Up', 'ambrygen-web' ) }
						title={ __( 'Move Up', 'ambrygen-web' ) }
						icon={ <MoveArrowIcon direction="up" /> }
					>
					</Button>
					<Button
						variant="tertiary"
						size="small"
						disabled={ pIndex === tabPosts.length - 1 }
						onClick={ () => handleMove( 1 ) }
						aria-label={ __( 'Move Down', 'ambrygen-web' ) }
						title={ __( 'Move Down', 'ambrygen-web' ) }
						icon={ <MoveArrowIcon direction="down" /> }
					>
					</Button>
				
			</div>
		</div>
		);
	} );
}

function createTabId( clientId, index ) {
	return `genetic-tab-${ clientId.slice( 0, 8 ) }-${ index + 1 }`;
}

function buildTermTreeOptions( terms = [], searchTerm = '' ) {
	const termMap = new Map();
	const rootTerms = [];
	const normalizedSearch = searchTerm.trim().toLowerCase();

	terms.forEach( ( term ) => {
		termMap.set( term.id, {
			id: term.id,
			name: decodeEntities( term.name ),
			slug: term.slug,
			parent: Number( term.parent ) || 0,
			children: [],
		} );
	} );

	termMap.forEach( ( term ) => {
		if ( term.parent && termMap.has( term.parent ) ) {
			termMap.get( term.parent ).children.push( term );
			return;
		}

		rootTerms.push( term );
	} );

	const sortTerms = ( items ) =>
		items
			.sort( ( first, second ) =>
				first.name.localeCompare( second.name )
			)
			.map( ( item ) => ( {
				...item,
				children: sortTerms( item.children ),
			} ) );

	const matchesTermSearch = ( term ) => {
		if ( ! normalizedSearch ) {
			return true;
		}

		return term.name.toLowerCase().includes( normalizedSearch );
	};

	const filterTerms = ( items ) => {
		if ( ! normalizedSearch ) {
			return items.map( ( item ) => ( {
				name: item.name,
				id: item.slug,
				children: filterTerms( item.children ),
			} ) );
		}

		return items.reduce( ( filteredItems, item ) => {
			const filteredChildren = filterTerms( item.children );
			const matchesSearch = matchesTermSearch( item );

			if ( ! matchesSearch && ! filteredChildren.length ) {
				return filteredItems;
			}

			filteredItems.push( {
				name: item.name,
				id: item.slug,
				children: filteredChildren,
			} );

			return filteredItems;
		}, [] );
	};

	return [
		{
			name: __( 'All Tests', 'ambrygen-web' ),
			id: 'all',
		},
		...filterTerms( sortTerms( rootTerms ) ),
	];
}

export default function Edit( { attributes, setAttributes, clientId } ) {
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
	const hasBackgroundImage = Boolean( backgroundImage?.url );
	const [ allTerms, setAllTerms ] = useState( [] );
	const [ hasResolvedAllTerms, setHasResolvedAllTerms ] = useState( false );
	const [ termSearchInputs, setTermSearchInputs ] = useState( {} );

	const blockProps = useBlockProps( {
		className: 'block-layout',
		id: blockId || undefined,
	} );

	const selectedTermSlugs = useMemo(
		() => [
			...new Set(
				selectedTabs.reduce( ( slugs, tab ) => {
					const slug = tab?.termSlug;

					if ( slug && slug !== 'all' ) {
						slugs.push( slug );
					}

					return slugs;
				}, [] )
			),
		],
		[ selectedTabs ]
	);

	const { selectedTerms, hasResolvedSelectedTerms } = useSelect(
		( select ) => {
			if ( ! selectedTermSlugs.length ) {
				return {
					selectedTerms: [],
					hasResolvedSelectedTerms: true,
				};
			}

			const query = {
				per_page: selectedTermSlugs.length,
				hide_empty: false,
				orderby: 'name',
				order: 'asc',
				slug: selectedTermSlugs,
			};
			const { getEntityRecords, hasFinishedResolution } =
				select( 'core' );

			return {
				selectedTerms: getEntityRecords(
					'taxonomy',
					'poster_category',
					query
				),
				hasResolvedSelectedTerms: hasFinishedResolution(
					'getEntityRecords',
					[ 'taxonomy', 'poster_category', query ]
				),
			};
		},
		[ selectedTermSlugs ]
	);

	useEffect( () => {
		let isMounted = true;

		const fetchAllTerms = async () => {
			setHasResolvedAllTerms( false );

			try {
				const perPage = 100;
				const firstPagePath = `/wp/v2/poster_category?per_page=${ perPage }&page=1&hide_empty=false&orderby=name&order=asc&_fields=id,name,slug,parent`;
				const firstPageTerms = await apiFetch( {
					path: firstPagePath,
					parse: false,
				} );

				const totalPages = Number(
					firstPageTerms.headers.get( 'X-WP-TotalPages' ) || 1
				);
				const firstPageData = await firstPageTerms.json();
				const remainingPages =
					totalPages > 1
						? await Promise.all(
								Array.from(
									{ length: totalPages - 1 },
									( _, index ) =>
										apiFetch( {
											path: `/wp/v2/poster_category?per_page=${ perPage }&page=${
												index + 2
											}&hide_empty=false&orderby=name&order=asc&_fields=id,name,slug,parent`,
										} )
								)
						  )
						: [];

				if ( isMounted ) {
					setAllTerms(
						[ firstPageData, ...remainingPages ]
							.flat()
							.filter( Boolean )
					);
				}
			} catch ( error ) {
				if ( isMounted ) {
					setAllTerms( [] );
				}
			} finally {
				if ( isMounted ) {
					setHasResolvedAllTerms( true );
				}
			}
		};

		fetchAllTerms();

		return () => {
			isMounted = false;
		};
	}, [] );

	const terms = useMemo( () => {
		const mergedTerms = [ ...( selectedTerms || [] ) ];

		( allTerms || [] ).forEach( ( term ) => {
			if ( ! mergedTerms.some( ( item ) => item.id === term.id ) ) {
				mergedTerms.push( term );
			}
		} );

		return mergedTerms;
	}, [ allTerms, selectedTerms ] );

	const [ activeTab, setActiveTab ] = useState(
		selectedTabs.length > 0 ? selectedTabs[ 0 ].termSlug : 'all'
	);
	const [ expandedTabs, setExpandedTabs ] = useState( {} );

	const { activePosts, hasResolvedPosts } = useSelect(
		( select ) => {
			const { getEntityRecords, hasFinishedResolution } =
				select( 'core' );
			const query = {
				per_page: 100,
				orderby: 'title',
				order: 'asc',
			};

			if ( activeTab !== 'all' && terms ) {
				const activeTerm = terms.find( ( t ) => t.slug === activeTab );
				if ( activeTerm ) {
					query.poster_category = activeTerm.id;
				}
			}

			return {
				activePosts: getEntityRecords(
					'postType',
					'genetic-testing',
					query
				),
				hasResolvedPosts: hasFinishedResolution( 'getEntityRecords', [
					'postType',
					'genetic-testing',
					query,
				] ),
			};
		},
		[ activeTab, terms ]
	);

	const activePostCategoryIds = useMemo(
		() => [
			...new Set(
				( activePosts || [] ).flatMap(
					( post ) => post?.poster_category || []
				)
			),
		],
		[ activePosts ]
	);

	const { activePostTerms } = useSelect(
		( select ) => {
			if ( ! activePostCategoryIds.length ) {
				return {
					activePostTerms: [],
				};
			}

			const query = {
				include: activePostCategoryIds,
				per_page: activePostCategoryIds.length,
				hide_empty: false,
				orderby: 'include',
			};

			return {
				activePostTerms: select( 'core' ).getEntityRecords(
					'taxonomy',
					'poster_category',
					query
				),
			};
		},
		[ activePostCategoryIds ]
	);

	const availableTerms = useMemo( () => {
		const mergedTerms = [ ...terms ];

		( activePostTerms || [] ).forEach( ( term ) => {
			if ( ! mergedTerms.some( ( item ) => item.id === term.id ) ) {
				mergedTerms.push( term );
			}
		} );

		return mergedTerms;
	}, [ activePostTerms, terms ] );

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, isExample, setAttributes ] );

	useEffect( () => {
		if ( isExample || ! selectedTabs.length ) {
			return;
		}

		const normalizedTabs = selectedTabs.map( ( tab, index ) => ( {
			...tab,
			id: tab?.id || createTabId( clientId, index ),
		} ) );
		const needsUpdate = normalizedTabs.some(
			( tab, index ) => tab.id !== selectedTabs[ index ]?.id
		);

		if ( needsUpdate ) {
			setAttributes( { selectedTabs: normalizedTabs } );
		}
	}, [ clientId, isExample, selectedTabs, setAttributes ] );

	useEffect( () => {
		if ( ! selectedTabs.length ) {
			if ( activeTab !== 'all' ) {
				setActiveTab( 'all' );
			}
			return;
		}

		const hasActiveTab = selectedTabs.some(
			( tab ) => tab.termSlug === activeTab
		);

		if ( ! hasActiveTab ) {
			setActiveTab( selectedTabs[ 0 ].termSlug || 'all' );
		}
	}, [ activeTab, selectedTabs ] );

	const getPostCategory = ( post ) => {
		if ( ! post?.poster_category?.length || ! availableTerms?.length ) {
			return __( 'Category', 'ambrygen-web' );
		}

		const term = availableTerms.find(
			( item ) => item.id === Number( post.poster_category[ 0 ] )
		);

		return term
			? decodeEntities( term.name )
			: __( 'Category', 'ambrygen-web' );
	};

	const currentTabOrderedIds = useMemo( () => {
		const tabObj = selectedTabs.find( ( tab ) => ( tab.termSlug || 'all' ) === activeTab ) || selectedTabs[ 0 ];
		return Array.isArray( tabObj?.orderedPostIds ) ? tabObj.orderedPostIds : [];
	}, [ selectedTabs, activeTab ] );

	const sortedActivePosts = useMemo( () => {
		if ( ! Array.isArray( activePosts ) || ! activePosts.length ) {
			return [];
		}

		return sortPostsByOrderedIds( [ ...activePosts ], currentTabOrderedIds );
	}, [ activePosts, currentTabOrderedIds ] );

	const activeTabKey = activeTab || 'all';
	const isActiveTabExpanded = Boolean( expandedTabs[ activeTabKey ] );
	const visiblePosts = isActiveTabExpanded
		? sortedActivePosts
		: sortedActivePosts?.slice( 0, INITIAL_VISIBLE_TEST_COUNT );
	const shouldShowViewAll =
		hasResolvedPosts &&
		sortedActivePosts?.length > INITIAL_VISIBLE_TEST_COUNT &&
		! isActiveTabExpanded;

	const showAllActiveTabPosts = () => {
		setExpandedTabs( {
			...expandedTabs,
			[ activeTabKey ]: true,
		} );
	};

	const addTab = () => {
		const nextIndex = selectedTabs.length;
		setAttributes( {
			selectedTabs: [
				...selectedTabs,
				{
					id: createTabId( clientId, nextIndex ),
					text: '',
					termSlug: 'all',
				},
			],
		} );
	};

	const updateTab = ( index, key, value ) => {
		const newTabs = [ ...selectedTabs ];
		newTabs[ index ][ key ] = value;

		if ( key === 'termSlug' ) {
			if ( value === 'all' ) {
				newTabs[ index ].text = __( 'All Tests', 'ambrygen-web' );
			} else {
				const term = terms?.find( ( t ) => t.slug === value );
				if ( term ) {
					newTabs[ index ].text = decodeEntities( term.name );
				}
			}
		}

		setAttributes( { selectedTabs: newTabs } );
	};

	const removeTab = ( index ) => {
		const removedTab = selectedTabs[ index ];
		const newTabs = selectedTabs.filter( ( _, i ) => i !== index );

		if ( removedTab?.id ) {
			setTermSearchInputs( ( currentInputs ) => {
				const nextInputs = { ...currentInputs };
				delete nextInputs[ removedTab.id ];
				return nextInputs;
			} );
		}

		setAttributes( { selectedTabs: newTabs } );
	};

	if ( isExample ) {
		return (
			<BlockExamplePreview imagePath="/assets/src/images/genetic-testing-grid/preview.png" />
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Display Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						url={ backgroundImage?.url || '' }
						label={ __( 'Background Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								backgroundImage: {
									id: media.id,
									url: media.url,
									alt: media.alt || '',
								},
							} )
						}
						onRemove={ () =>
							setAttributes( {
								backgroundImage: {
									url: '',
									id: 0,
									alt: '',
								},
							} )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Tabs Navigation', 'ambrygen-web' ) }>
					{ selectedTabs.map( ( tab, i ) => {
						const tabKey = tab.id || createTabId( clientId, i );
						const termSearchInput =
							termSearchInputs[ tabKey ] || '';
						const termTreeOptions = buildTermTreeOptions(
							terms,
							termSearchInput
						);
						const hasMatchingCategories =
							termTreeOptions.length > 1;

						return (
							<div
								key={ tabKey }
								style={ {
									marginBottom: 16,
									border: '1px solid #ccc',
									padding: 12,
								} }
							>
								<TextControl
									label={ __( 'Tab Text', 'ambrygen-web' ) }
									value={ tab.text }
									onChange={ ( val ) =>
										updateTab( i, 'text', val )
									}
								/>
								<TextControl
									label={ __(
										'Search Categories',
										'ambrygen-web'
									) }
									value={ termSearchInput }
									onChange={ ( value ) =>
										setTermSearchInputs(
											( currentInputs ) => ( {
												...currentInputs,
												[ tabKey ]: value,
											} )
										)
									}
									placeholder={ __(
										'Search by category name',
										'ambrygen-web'
									) }
									help={
										termSearchInput &&
										! hasMatchingCategories
											? __(
													'No matching categories found.',
													'ambrygen-web'
											  )
											: __(
													'Search Categories results will be shown in Target Category.',
													'ambrygen-web'
											  )
									}
								/>
								<TreeSelect
									label={ __(
										'Target Category',
										'ambrygen-web'
									) }
									value={ tab.termSlug }
									tree={ termTreeOptions }
									onChange={ ( val ) =>
										updateTab( i, 'termSlug', val || 'all' )
									}
									disabled={
										! hasResolvedSelectedTerms ||
										! hasResolvedAllTerms
									}
									noOptionLabel={ __(
										'Select a category',
										'ambrygen-web'
									) }
									help={
										! hasResolvedSelectedTerms ||
										! hasResolvedAllTerms
											? __(
													'Loading categories…',
													'ambrygen-web'
											  )
											: __(
													'Search filters the tree while keeping the parent-child structure.',
													'ambrygen-web'
											  )
									}
								/>
								<div style={ { marginTop: 12, marginBottom: 12 } }>
									<strong>{ __( 'Posts Order in Tab', 'ambrygen-web' ) }</strong>
									<TabPostsOrderControl
										tab={ tab }
										tabIndex={ i }
										activePosts={ activePosts }
										terms={ terms }
										updateTab={ updateTab }
									/>
								</div>
								<Button
									isDestructive
									onClick={ () => removeTab( i ) }
								>
									{ __( 'Remove Tab', 'ambrygen-web' ) }
								</Button>
							</div>
						);
					} ) }
					<Button variant="secondary" onClick={ addTab }>
						{ __( 'Add Tab', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				{ hasBackgroundImage && (
					<div className="block-bg-image">
						<img
							src={ backgroundImage.url }
							alt={ backgroundImage.alt || '' }
						/>
					</div>
				) }

				<div className="icon-grid-block">
					<section className="features-tabs">
						<div className="features-tabs__header block__rowflex">
							<div className="block__rowflex--col-left">
								<RichText
									tagName={ HeadingTag }
									className="block-title block__rowflex--heading-title heading-2 mb-0"
									value={ heading }
									onChange={ ( value ) =>
										setAttributes( { heading: value } )
									}
									placeholder={ __(
										'Add Title',
										'ambrygen-web'
									) }
								/>
							</div>

							<div className="block__rowflex--block-content subtitle-1-regular">
								<RichText
									tagName="p"
									value={ description }
									onChange={ ( value ) =>
										setAttributes( {
											description: value,
										} )
									}
									placeholder={ __(
										'Add Description',
										'ambrygen-web'
									) }
								/>
							</div>
						</div>

						<div
							className="is-style-gl-s50"
							aria-hidden="true"
						></div>

						<div className="tabs-content bg-gradient1">
							<div className="tabs__nav">
								{ selectedTabs.length > 0 ? (
									selectedTabs.map( ( tab, index ) => (
										<button
											key={
												tab.id ||
												createTabId( clientId, index )
											}
											type="button"
											className={ `tabs__tab text-md-Semibold ${
												activeTab ===
												( tab.termSlug || 'all' )
													? 'is-active'
													: ''
											}` }
											onClick={ () =>
												setActiveTab(
													tab.termSlug || 'all'
												)
											}
										>
											{ tab.text ||
												__(
													'New Tab',
													'ambrygen-web'
												) }
										</button>
									) )
								) : (
									<button
										type="button"
										className="tabs__tab text-md-Semibold is-active"
										onClick={ () => setActiveTab( 'all' ) }
									>
										{ __( 'All Tests', 'ambrygen-web' ) }
									</button>
								) }
							</div>
							<div
								className="is-style-gl-s32"
								aria-hidden="true"
							></div>
							<div className="tabs__panels">
								<div className="tabs__panel is-active">
									<div className="features-tabs__grid">
										{ ! hasResolvedPosts && <Spinner /> }

										{ hasResolvedPosts &&
											visiblePosts?.length > 0 &&
											visiblePosts.map( ( post ) => (
												<div
													key={ post.id }
													className="features-tabs__card"
												>
													<div className="features-tabs__content-head">
														<div className="features-tabs__category body2-semibold">
															{ getPostCategory(
																post
															) }
														</div>

														<div className="heading-5 features-tabs__card-title block-inside-title">
															{ decodeEntities(
																post.title
																	?.rendered ||
																	''
															) }
															<div className="badge badge--blue">
																<i className="badge__dot"></i>
																{ __(
																	'Product',
																	'ambrygen-web'
																) }
															</div>
														</div>
													</div>

													<div className="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow">
														{ __(
															'View Test',
															'ambrygen-web'
														) }
													</div>
												</div>
											) ) }

										{ hasResolvedPosts &&
											activePosts &&
											activePosts.length === 0 && (
												<p>
													{ __(
														'No Test found for this tab.',
														'ambrygen-web'
													) }
												</p>
											) }
									</div>
									{ shouldShowViewAll && (
										<div className="features-tabs__footer">
											<button
												type="button"
												className="site-btn is-style-site-trailing-icon has-right-arrow features-tabs__view-all"
												aria-expanded="false"
												onClick={
													showAllActiveTabPosts
												}
											>
												{ __(
													'View All Tests',
													'ambrygen-web'
												) }
											</button>
										</div>
									) }
								</div>
							</div>
						</div>
					</section>
				</div>
			</section>
		</>
	);
}
