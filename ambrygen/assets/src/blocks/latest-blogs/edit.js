import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import {
	PanelBody,
	ComboboxControl,
	RangeControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const HEADING_OPTIONS = [
	{ label: 'H1', value: 'h1' },
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
	{ label: 'H5', value: 'h5' },
	{ label: 'H6', value: 'h6' },
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		headingLevel,
		postsPerPage,
	} = attributes;

	useEffect( () => {
		const expectedId = `latest-blogs-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	const { posts, categories, isFetching, defaultCatId } = useSelect( ( select ) => {
		const { getEntityRecords, isResolving } = select( 'core' );

		// Fetch categories to find the default one
		const allCategories = getEntityRecords( 'taxonomy', 'category', { per_page: 20, hide_empty: true } ) || [];
		const defaultCat = allCategories.find( cat => cat.name === 'Ambry News' || cat.name === 'Ambry' ) || allCategories[0];

		const queryArgs = {
			per_page: postsPerPage || 6,
			_embed: true,
		};

		if ( defaultCat ) {
			queryArgs.categories = [ defaultCat.id ];
		}

		return {
			posts: getEntityRecords( 'postType', 'post', queryArgs ),
			categories: allCategories,
			isFetching: isResolving( 'core', 'getEntityRecords', [ 'postType', 'post', queryArgs ] ),
			defaultCatId: defaultCat ? defaultCat.id : null,
		};
	}, [ postsPerPage ] );

	const blockProps = useBlockProps( {
		className: 'latest-blogs',
	} );

	const TagName = headingLevel || 'h2';

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Block Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ComboboxControl
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel }
						options={ HEADING_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
					<RangeControl
						label={ __( 'Posts Per Page', 'ambrygen-web' ) }
						value={ postsPerPage }
						onChange={ ( value ) => setAttributes( { postsPerPage: value } ) }
						min={ 1 }
						max={ 12 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ /* SECTION 2 — Filter Bar */ }


						<div className="blog-listing-header">
							<RichText
								tagName={ TagName }
								className="heading-4 block-title mb-0"
								value={ title }
								onChange={ ( value ) => setAttributes( { title: value } ) }
								placeholder={ __( 'Add Title...', 'ambrygen-web' ) }
							/>
							<div className="is-style-gl-s32" aria-hidden="true"></div>
							<div className="blog-filters">
								<div className="blog-filters__dropdown">
									<label className="blog-filters__label text-small-semibold">{ __( 'Filter by Tag', 'ambrygen-web' ) }</label>
									<div className="is-style-gl-s8" aria-hidden="true"></div>
									<select className="blog-filters__select text-md-medium" disabled>
										<option>{ __( 'All Tags', 'ambrygen-web' ) }</option>
									</select>
								</div>
								<div className="blog-filters__tabs-wrap">
									<div className="horizontal-tabs tabs__nav">
										{ categories && categories.map( cat => (
											<button
												key={ cat.id }
												type="button"
												className={ `tabs__tab text-md-Semibold ${ cat.id === defaultCatId ? 'active is-active' : '' }` }
											>
												{ cat.name }
											</button>
										) ) }
									</div>
								</div>
								<div className="blog-filters__search search-bar-block">
									<div className="search-form">
										<input type="text" placeholder={ __( 'Search', 'ambrygen-web' ) } readOnly />
										<button className="button" type="button">{ __( 'Search', 'ambrygen-web' ) }</button>
									</div>
								</div>
							</div>
						</div>



				<div className="is-style-gl-s40" aria-hidden="true"></div>

				{ /* SECTION 3 — Blog Listing Grid */ }

						<div className="ambrygen-ajax-pagination__content">
							{ isFetching && <Spinner /> }
							{ ! isFetching && posts && (
								<div className="blog-listing">
									{ posts.map( ( post ) => {
										const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
										const tags = post._embedded?.['wp:term']?.[1] || [];
										const author = post._embedded?.['author']?.[0];
										const date = new Date( post.date ).toLocaleDateString( 'en-US', {
											month: 'long',
											day: 'numeric',
											year: 'numeric'
										} );

										return (
											<div key={ post.id } className="blog-listing__card">
												<div className="blog-listing__image-wrap">
													{ featuredImage ? (
														<img src={ featuredImage } className="blog-listing__image" alt="" />
													) : (
														<div className="blog-listing__image placeholder"></div>
													) }
													<div className="blog-listing__date flag-details">
														<span>{ date }</span>
													</div>
												</div>

												<div className="blog-listing__content">
													<h3 className="text-lg-semibold blog-listing__title mb-0">
														{ post?.title?.rendered || __( '(No Title)', 'ambrygen-web' ) }
													</h3>
													<div className="is-style-gl-s12" aria-hidden="true"></div>

													{ author && (
														<div className="blog-listing__author-block">
															<img className="blog-listing__author-avatar" src={ author?.avatar_urls?.['96'] || 'https://i.pravatar.cc/40?img=47' } alt="" width="36" height="36" />
															<div className="blog-listing__author-info">
																<span className="blog-listing__author-name text-small-semibold">{ author?.name }</span>
															</div>
														</div>
													) }

													<div className="is-style-gl-s8" aria-hidden="true"></div>
													<div className="blog-listing__body">
														<div className="body-s blog-listing__description" dangerouslySetInnerHTML={ { __html: post?.excerpt?.rendered || '' } } />
														<div className="body-s blog-listing__category">
															{ tags.length > 0 ? tags.map( tag => (
																<div key={ tag.id } className="blog-listing__category__item">{ tag.name }</div>
															) ) : (
																<div className="blog-listing__category__item">{ __( 'Sample Tag', 'ambrygen-web' ) }</div>
															) }
														</div>
													</div>
												</div>
											</div>
										);
									} ) }
								</div>
							) }

							{ posts && posts.length >= postsPerPage && (
								<>
									<div className="is-style-gl-s50" aria-hidden="true"></div>
									<div className="load-more-btn">
										<button type="button" className="site-btn is-style-site-text-btn has-right-arrow">
											{ __( 'Load More', 'ambrygen-web' ) }
										</button>
									</div>
								</>
							) }
						</div>

			</div>
		</Fragment>
	);
}

