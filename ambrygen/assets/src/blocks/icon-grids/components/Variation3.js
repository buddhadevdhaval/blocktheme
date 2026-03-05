import { InspectorControls, RichText } from '@wordpress/block-editor';
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

export default function Variation3( { attributes, setAttributes } ) {
	const { heading, headingTag, description, selectedTabs = [] } = attributes;

	const { terms, hasResolvedTerms } = useSelect( ( select ) => {
		const { getEntityRecords, hasFinishedResolution } = select( 'core' );
		const query = { per_page: -1 };
		return {
			terms: getEntityRecords( 'taxonomy', 'test_type', query ),
			hasResolvedTerms: hasFinishedResolution( 'getEntityRecords', [
				'taxonomy',
				'test_type',
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
			const query = { per_page: -1 };

			if ( activeTab !== 'all' && terms ) {
				const activeTerm = terms.find( ( t ) => t.slug === activeTab );
				if ( activeTerm ) {
					query.test_type = activeTerm.id;
				}
			}

			return {
				activePosts: getEntityRecords(
					'postType',
					'blood-test',
					query
				),
				hasResolvedPosts: hasFinishedResolution( 'getEntityRecords', [
					'postType',
					'blood-test',
					query,
				] ),
			};
		},
		[ activeTab, terms ]
	);

	const getPostCategory = ( post ) => {
		if ( ! post?.test_type?.length || ! terms?.length ) {
			return 'Category';
		}
		const term = terms.find(
			( item ) => item.id === Number( post.test_type[ 0 ] )
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
				newTabs[ index ].text = 'All Tests';
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

	return (
		<>
			<InspectorControls>
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
								label={ __( 'Target Term', 'ambrygen-web' ) }
								value={ tab.termSlug }
								options={ [
									{
										label: 'All Tests (all)',
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
										? __( 'Loading terms…', 'ambrygen-web' )
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

			<section className="features-tabs">
				<div className="features-tabs__header block__rowflex">
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-2 block-title mb-0 block__rowflex--heading-title"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder="Add Title..."
					/>

					<div className="is-style-gl-s20" aria-hidden="true"></div>

					<div className="block__rowflex--block-content subtitle-1-regular">
						<RichText
							tagName="p"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( {
									description: value,
								} )
							}
							placeholder="Add Description..."
						/>
					</div>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="tabs-content bg-gradient1">
					<div className="tabs__nav">
						{ selectedTabs.length > 0 ? (
							selectedTabs.map( ( tab, index ) => (
								<button
									key={ index }
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
								className="tabs__tab text-md-Semibold is-active"
								onClick={ () => setActiveTab( 'all' ) }
							>
								All Tests
							</button>
						) }
					</div>
					<div className="is-style-gl-s32" aria-hidden="true"></div>
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
													{ getPostCategory( post ) }
												</div>

												<div className="heading-5 features-tabs__card-title">
													{ decodeEntities(
														post.title?.rendered ||
															''
													) }
													<div className="badge badge--blue">
														<i className="badge__dot"></i>
														Test
													</div>
												</div>
											</div>

											<a
												className="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up"
												href={ post.link || '#' }
											>
												View Test
											</a>
										</div>
									) ) }

								{ hasResolvedPosts &&
									activePosts &&
									activePosts.length === 0 && (
										<p>
											{ __(
												'No posts found for this tab.',
												'ambrygen-web'
											) }
										</p>
									) }
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
