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
import { useState } from '@wordpress/element';
import { TagSelector, BlockExamplePreview } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		headingTag,
		description,
		selectedTabs = [],
		blockId,
	} = attributes;
	const isExample = blockId === 'genetic-testing-grid-example';

	const blockProps = useBlockProps( {
		className: 'block-layout',
		id: blockId,
	} );

	const { terms, hasResolvedTerms } = useSelect( ( select ) => {
		const { getEntityRecords, hasFinishedResolution } = select( 'core' );
		const query = {
			per_page: 100,
			hide_empty: false,
			orderby: 'name',
			order: 'asc',
		};

		return {
			terms: getEntityRecords( 'taxonomy', 'poster_category', query ),
			hasResolvedTerms: hasFinishedResolution( 'getEntityRecords', [
				'taxonomy',
				'poster_category',
				query,
			] ),
		};
	}, [] );

	const [ activeTab, setActiveTab ] = useState(
		selectedTabs.length > 0 ? selectedTabs[ 0 ].termSlug : 'all'
	);

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

	const getPostCategory = ( post ) => {
		if ( ! post?.poster_category?.length || ! terms?.length ) {
			return 'Category';
		}

		const term = terms.find(
			( item ) => item.id === Number( post.poster_category[ 0 ] )
		);

		return term ? decodeEntities( term.name ) : 'Category';
	};

	const addTab = () => {
		setAttributes( {
			selectedTabs: [ ...selectedTabs, { text: '', termSlug: 'all' } ],
		} );
	};

	const updateTab = ( index, key, value ) => {
		const newTabs = [ ...selectedTabs ];
		newTabs[ index ][ key ] = value;

		if ( key === 'termSlug' ) {
			if ( value === 'all' ) {
				newTabs[ index ].text = 'All Test';
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
		const newTabs = selectedTabs.filter( ( _, i ) => i !== index );
		setAttributes( { selectedTabs: newTabs } );
	};

	if ( isExample ) {
		return (
			<BlockExamplePreview imagePath="/assets/src/images/icon-grid/variation3.png" />
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Tabs Navigation', 'ambrygen-web' ) }>
					{ selectedTabs.map( ( tab, i ) => (
						<div
							key={ i }
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
							<SelectControl
								label={ __(
									'Target Category',
									'ambrygen-web'
								) }
								value={ tab.termSlug }
								options={ [
									{
										label: 'All Test (all)',
										value: 'all',
									},
									...( hasResolvedTerms && terms
										? terms.map( ( t ) => ( {
												label: decodeEntities( t.name ),
												value: t.slug,
										  } ) )
										: [] ),
								] }
								onChange={ ( val ) =>
									updateTab( i, 'termSlug', val )
								}
								disabled={ ! hasResolvedTerms }
								help={
									! hasResolvedTerms
										? __(
												'Loading categories',
												'ambrygen-web'
										  )
										: ''
								}
							/>
							<Button
								isDestructive
								onClick={ () => removeTab( i ) }
							>
								{ __( 'Remove Tab', 'ambrygen-web' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addTab }>
						{ __( 'Add Tab', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="icon-grid-block">
					<section className="features-tabs">
						<div className="features-tabs__header block__rowflex">
							<RichText
								tagName={ headingTag || 'h2' }
								className="block-title block__rowflex--heading-title heading-2 mb-0"
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Add Title"
							/>

							<div
								className="is-style-gl-s20"
								aria-hidden="true"
							></div>

							<div className="block__rowflex--block-content subtitle-1-regular">
								<RichText
									tagName="p"
									value={ description }
									onChange={ ( value ) =>
										setAttributes( {
											description: value,
										} )
									}
									placeholder="Add Description"
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
											key={ index }
											type="button"
											className={ `tabs__tab text-md-Semibold ${
												activeTab === tab.termSlug
													? 'is-active'
													: ''
											}` }
											onClick={ () =>
												setActiveTab( tab.termSlug )
											}
										>
											{ tab.text || 'New Tab' }
										</button>
									) )
								) : (
									<button
										type="button"
										className="tabs__tab text-md-Semibold is-active"
										onClick={ () => setActiveTab( 'all' ) }
									>
										All Test
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
											activePosts?.length > 0 &&
											activePosts.map( ( post ) => (
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

														<div className="heading-5 features-tabs__card-title">
															{ decodeEntities(
																post.title
																	?.rendered ||
																	''
															) }
															<div className="badge badge--blue">
																<i className="badge__dot"></i>
																Product
															</div>
														</div>
													</div>

													<a
														className="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow"
														href={
															post.link || '#'
														}
													>
														View Product
													</a>
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
								</div>
							</div>
						</div>
					</section>
				</div>
			</section>
		</>
	);
}

