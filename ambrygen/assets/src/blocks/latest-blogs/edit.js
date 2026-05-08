import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import {
	PanelBody,
	RangeControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { TagSelector } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		headingLevel,
		postsPerPage,
	} = attributes;

	const [ selectedCategoryId, setSelectedCategoryId ] = useState( null );
	const [ selectedTagId, setSelectedTagId ] = useState( null );

	// Initialize block ID
	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `latest-blogs-${ clientIdSuffix }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	// Fetch data matching render.php logic
	const { posts, categories, tags, isFetching, defaultCatId } = useSelect( ( select ) => {
		const { getEntityRecords, isResolving } = select( 'core' );
		
		// Get categories - hide_empty: true, exclude uncategorized
		const allCategories = getEntityRecords( 'taxonomy', 'category', { 
			per_page: 100, 
			hide_empty: true 
		} ) || [];
		
		const uncategorizedTerm = getEntityRecords( 'taxonomy', 'category', { slug: 'uncategorized' } )?.[0];
		const filteredCategories = allCategories.filter( cat => cat.id !== uncategorizedTerm?.id );
		
		// Get tags - hide_empty: true
		const allTags = getEntityRecords( 'taxonomy', 'post_tag', { 
			per_page: 100, 
			hide_empty: true 
		} ) || [];
		
		// Find default category: 'Ambry' > 'Ambry News' > first category
		let defaultCat = null;
		if ( filteredCategories.length > 0 ) {
			defaultCat = filteredCategories.find( cat => cat.name === 'Ambry' ) || 
					   filteredCategories.find( cat => cat.name === 'Ambry News' ) || 
					   filteredCategories[0];
		}
		
		// Build query
		const queryArgs = {
			per_page: postsPerPage || 6,
			_embed: true,
			orderby: 'date',
			order: 'desc',
			status: 'publish',
		};
		
		if ( selectedTagId ) {
			queryArgs.tags = selectedTagId;
		} else if ( selectedCategoryId ) {
			queryArgs.categories = selectedCategoryId;
		} else if ( defaultCat ) {
			queryArgs.categories = defaultCat.id;
		}
		
		const fetchedPosts = getEntityRecords( 'postType', 'post', queryArgs );
		
		return {
			posts: fetchedPosts,
			categories: filteredCategories,
			tags: allTags,
			isFetching: isResolving( 'core', 'getEntityRecords', [ 'postType', 'post', queryArgs ] ),
			defaultCatId: defaultCat?.id || null,
		};
	}, [ postsPerPage, selectedCategoryId, selectedTagId ] );

	// Fetch complete post data including meta for each post
	const postsWithFullData = useSelect( ( select ) => {
		if ( ! posts || posts.length === 0 ) {
			return [];
		}
		
		const { getEntityRecord } = select( 'core' );
		
		// Fetch each post with full data including meta
		const fullPosts = posts.map( post => {
			const fullPost = getEntityRecord( 'postType', 'post', post.id, { 
				context: 'edit',
				_fields: ['id', 'title', 'excerpt', 'date', 'meta', 'link', '_embedded']
			} );
			
			// Also try to get the embedded data
			if ( fullPost && ! fullPost._embedded ) {
				fullPost._embedded = post._embedded;
			}
			
			return fullPost || post;
		} );
		
		return fullPosts;
	}, [ posts ] );

	// Initialize selected category
	useEffect( () => {
		if ( defaultCatId && ! selectedCategoryId && ! selectedTagId ) {
			setSelectedCategoryId( defaultCatId );
		}
	}, [ defaultCatId, selectedCategoryId, selectedTagId ] );

	const blockProps = useBlockProps( {
		id: blockId || undefined,
	} );

	const HeadingTag = headingLevel || 'h2';

	const handleCategoryClick = ( categoryId ) => {
		setSelectedCategoryId( categoryId );
		setSelectedTagId( null );
	};

	const handleTagChange = ( event ) => {
		const tagId = parseInt( event.target.value );
		setSelectedTagId( tagId || null );
		if ( tagId ) {
			setSelectedCategoryId( null );
		}
	};

	const formatDate = ( dateString ) => {
		if ( ! dateString ) return '';
		const date = new Date( dateString );
		return date.toLocaleDateString( 'en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		} );
	};

	// Get authors data matching BlogRenderer::get_post_authors_data()
	const getPostAuthorsData = ( post ) => {
		const authorsData = [];
		
		// Log to debug what we're getting
		console.log('Post ID:', post?.id);
		console.log('Post meta:', post?.meta);
		
		// Check for webinar authors from meta (custom field)
		const webinarAuthors = post?.meta?.webinar_authors;
		
		console.log('Webinar authors:', webinarAuthors);
		
		// Only use webinar authors if they exist and are non-empty
		if ( webinarAuthors && Array.isArray( webinarAuthors ) && webinarAuthors.length > 0 ) {
			webinarAuthors.forEach( author => {
				const authorData = {
					name: author.name || '',
					designation: author.designation || '',
					avatar_id: author.avatar_id || 0,
				};
				
				// Only add if name exists
				if ( authorData.name ) {
					authorsData.push( authorData );
				}
			} );
		}
		
		console.log('Authors data:', authorsData);
		
		// Return empty array if no webinar authors (matches frontend - no fallback)
		return authorsData;
	};

	// Format author names with designations matching frontend
	const formatAuthorNames = ( authorsData ) => {
		return authorsData.map( author => {
			let name = author.name;
			if ( author.designation ) {
				name += `, ${ author.designation }`;
			}
			return name;
		} ).join( ' | ' );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel }
						type="heading"
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Post Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
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
				<div className="blog-listing-header">
					<RichText
						tagName={ HeadingTag }
						className="heading-4 block-title mb-0"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Add Title...', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s32" aria-hidden="true"></div>
					<div className="blog-filters">
						<div className="blog-filters__dropdown">
							<label className="blog-filters__label text-small-semibold">
								{ __( 'Filter by Tag', 'ambrygen-web' ) }
							</label>
							<div className="is-style-gl-s8" aria-hidden="true"></div>
							<select 
								className="blog-filters__select text-md-medium"
								value={ selectedTagId || '0' }
								onChange={ handleTagChange }
							>
								<option value="0">{ __( 'All Tags', 'ambrygen-web' ) }</option>
								{ tags && tags.map( tag => (
									<option key={ tag.id } value={ tag.id }>{ tag.name }</option>
								) ) }
							</select>
						</div>
						<div className="blog-filters__tabs-wrap">
							<div className="horizontal-tabs tabs__nav" role="tablist">
								{ categories && categories.map( cat => (
									<button
										key={ cat.id }
										type="button"
										className={ `tabs__tab text-md-Semibold tab-button ${ ( ! selectedTagId && cat.id === selectedCategoryId ) ? 'active is-active' : '' }` }
										role="tab"
										aria-selected={ ! selectedTagId && cat.id === selectedCategoryId }
										onClick={ () => handleCategoryClick( cat.id ) }
									>
										{ cat.name }
									</button>
								) ) }
							</div>
						</div>
						<div className="blog-filters__search search-bar-block">
							<div className="search-form">
								<input 
									type="text" 
									placeholder={ __( 'Search', 'ambrygen-web' ) } 
									readOnly 
								/>
								<button className="button" type="button" disabled>
									{ __( 'Search', 'ambrygen-web' ) }
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="is-style-gl-s40" aria-hidden="true"></div>

				<div className="ambrygen-ajax-pagination">
					<div className="ambrygen-ajax-pagination__content">
						{ isFetching && <Spinner /> }
						
						{ ! isFetching && postsWithFullData && postsWithFullData.length === 0 && (
							<p className="no-results-message text-center text-lg-reg">
								{ __( 'No blog posts found.', 'ambrygen-web' ) }
							</p>
						) }
						
						{ ! isFetching && postsWithFullData && postsWithFullData.length > 0 && (
							<div className="blog-listing">
								{ postsWithFullData.map( ( post ) => {
									const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
									const postTags = post._embedded?.['wp:term']?.[1] || [];
									const date = formatDate( post.date );
									
									// Get authors data matching frontend logic
									const authorsData = getPostAuthorsData( post );
									const hasAuthors = authorsData.length > 0;
									const authorNames = hasAuthors ? formatAuthorNames( authorsData ) : '';
									
									// Get excerpt - trim to 25 words matching frontend
									let excerpt = '';
									if ( post.excerpt?.rendered ) {
										excerpt = post.excerpt.rendered.replace( /<[^>]*>/g, '' );
										const words = excerpt.split( ' ' );
										if ( words.length > 25 ) {
											excerpt = words.slice( 0, 25 ).join( ' ' ) + '...';
										}
									}

									return (
										<div key={ post.id } className="blog-listing__card">
											<div className="blog-listing__image-wrap">
												{ featuredImage ? (
													<img 
														src={ featuredImage } 
														className="blog-listing__image" 
														alt="" 
													/>
												) : (
													<img 
														src={ window.ambrygenAssets?.blogDefaultImageUrl || window.ambrygenAssets?.defaultImageUrl } 
														className="blog-listing__image" 
														alt="" 
													/>
												) }
												<div className="blog-listing__date flag-details">
													<span>{ date }</span>
												</div>
											</div>

											<div className="blog-listing__content">
												<h3 className="text-lg-semibold blog-listing__title mb-0">
													{ post.title?.rendered || __( '(No Title)', 'ambrygen-web' ) }
												</h3>
												<div className="is-style-gl-s12" aria-hidden="true"></div>

												{/* Only show author block if webinar authors exist, matching frontend logic */}
												{ hasAuthors && (
													<div className="blog-listing__author-block">
														<div className="blog-listing__author-info">
															<span className="blog-listing__author-name text-small-semibold">
																{ authorNames }
															</span>
														</div>
													</div>
												) }

												<div className="is-style-gl-s12" aria-hidden="true"></div>
												<div className="blog-listing__body">
													<div className="body-s blog-listing__description">
														{ excerpt }
													</div>
													{ postTags.length > 0 && (
														<div className="body-s blog-listing__category">
															{ postTags.map( tag => (
																<div key={ tag.id } className="blog-listing__category__item">
																	{ tag.name }
																</div>
															) ) }
														</div>
													) }
												</div>
											</div>
										</div>
									);
								} ) }
							</div>
						) }

						{ ! isFetching && postsWithFullData && postsWithFullData.length >= postsPerPage && (
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
				<div className="is-style-gl-s50" aria-hidden="true"></div>
			</div>
		</Fragment>
	);
}