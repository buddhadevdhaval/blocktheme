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

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	const { posts, categories, isFetching } = useSelect( ( select ) => {
		const { getEntityRecords, isResolving } = select( 'core' );
		const queryArgs = {
			per_page: postsPerPage || 9,
			_embed: true,
		};

		return {
			posts: getEntityRecords( 'postType', 'post', queryArgs ),
			categories: getEntityRecords( 'taxonomy', 'category', { per_page: 5, hide_empty: true } ),
			isFetching: isResolving( 'core', 'getEntityRecords', [ 'postType', 'post', queryArgs ] ),
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
						label={ __( 'Heading Level', 'ambrygen-web' ) }
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
				<div className="container-1280 wrapper">
					<div className="latest-blogs__header">
						<RichText
							tagName={ TagName }
							className="heading-3 block-title mb-0"
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Add Title...', 'ambrygen-web' ) }
						/>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					{ /* Filter Section */ }
					<div className="category-filter-search category-filter-search--blog">
						<div className="category-filter-search__dropdown">
							<div className="filter-label text-small-semibold mb-2">{ __( 'FILTER BY TAG', 'ambrygen-web' ) }</div>
							<div className="tab-dropdown">
								<button className="dropdown-toggle" type="button">
									{ __( 'All Tags', 'ambrygen-web' ) }
								</button>
							</div>
						</div>

						<div className="category-filter-search__tabs">
							<div className="horizontal-tabs tabs__nav">
								<button className="tab-button active is-active tabs__tab text-md-Semibold">{ __( 'Ambry News', 'ambrygen-web' ) }</button>
								{ categories && categories.map( cat => (
									<button key={ cat.id } className="tab-button tabs__tab text-md-Semibold">{ cat.name }</button>
								) ) }
							</div>
						</div>

						<div className="category-filter-search__search">
							<div className="search-field-container">
								<input type="text" placeholder={ __( 'Search', 'ambrygen-web' ) } readOnly />
								<button className="search-submit" type="button"></button>
							</div>
						</div>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<div className="ambrygen-ajax-pagination__content">
						<div className="event-carousel__grid">
							{ isFetching && <Spinner /> }
							{ ! isFetching && posts && posts.map( ( post ) => {
								const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
								const author = post._embedded?.['author']?.[0];
								const date = new Date( post.date ).toLocaleDateString( 'en-US', {
									month: 'long',
									day: 'numeric',
									year: 'numeric'
								} );

								return (
									<div key={ post.id } className="event-carousel__card">
										<div className="event-carousel__image-wrap">
											<div className="event-carousel__image-link">
												{ featuredImage ? (
													<img src={ featuredImage } className="event-carousel__image" alt="" />
												) : (
													<div className="event-carousel__image placeholder"></div>
												) }
											</div>
											<div className="event-carousel__month-info">
												<span className="event-carousel__month">{ date }</span>
											</div>
										</div>

										<div className="event-carousel__body">
											<div className="is-style-gl-s16" aria-hidden="true"></div>
											<div className="event-carousel__static-content">
												<h3 className="event-carousel__card-title text-lg-semibold mb-0">
													<a href="#link" onClick={ ( e ) => e.preventDefault() }>
														{ post?.title?.rendered || __( '(No Title)', 'ambrygen-web' ) }
													</a>
												</h3>
												<div className="is-style-gl-s8" aria-hidden="true"></div>
												
												{ author && (
													<div className="event-carousel__author-block">
														{ author?.avatar_urls?.['96'] && (
															<div className="event-carousel__author-avatar">
																<img src={ author.avatar_urls['96'] } alt="" />
															</div>
														) }
														<div className="event-carousel__author-name text-small-semibold">
															{ author?.name }
														</div>
													</div>
												) }
											</div>

											<div className="is-style-gl-s16" aria-hidden="true"></div>

											<div className="event-carousel__content-wrap">
												<div className="event-carousel__details">
													<div className="body-s" dangerouslySetInnerHTML={ { __html: post?.excerpt?.rendered || '' } } />
												</div>
												<div className="event-carousel__description">
													<div className="event-carousel__tags" aria-hidden="true">
														<div className="event-carousel__tags lists-item-category">
															<div className="category-item">
																<span className="event-carousel__tag event-carousel__tag--success">
																	<div className="event-carousel__tag-dot"></div> { __( 'Sample Tag', 'ambrygen-web' ) }
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							} ) }
						</div>

						{ posts && posts.length >= postsPerPage && (
							<div className="load-more-wrap text-center mt-5">
								<button type="button" className="load-more-btn text-small-semibold">
									{ __( 'LOAD MORE', 'ambrygen-web' ) }
									<span className="load-more-icon"></span>
								</button>
							</div>
						) }
					</div>
				</div>
			</div>
		</Fragment>
	);
}
