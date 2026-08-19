import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import Swiper from 'swiper/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Fragment, useEffect, useRef } from '@wordpress/element';
import {
	PanelBody,
	ComboboxControl,
	FormTokenField,
	Spinner,
	TextControl,
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

const MAX_POSTS = 20;
const noop = () => {};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const sliderRef = useRef( null );
	const swiperInstance = useRef( null );

	const { blockId, title, headingLevel, selectedPosts = [] } = attributes;

	const { postOptions, featuredPosts, authors, media, isFetching } =
		useSelect(
			( select ) => {
				const { getEntityRecords, isResolving } = select( 'core' );

				const allPostsArgs = {
					per_page: 100,
					status: 'publish',
				};

				const featuredPostsArgs = {
					include: selectedPosts.length > 0 ? selectedPosts : [ 0 ],
					_embed: true,
					per_page: selectedPosts.length || 1,
				};

				const fetchedPosts =
					selectedPosts.length > 0
						? getEntityRecords(
								'postType',
								'post',
								featuredPostsArgs
						  )
						: [];

				// Collect all linked author IDs and override image IDs from meta
				const authorIds = [];
				const mediaIds = [];

				if ( fetchedPosts && fetchedPosts.length > 0 ) {
					fetchedPosts.forEach( ( post ) => {
						const repeater = post.meta?.webinar_authors || [];
						repeater.forEach( ( row ) => {
							if ( row.linked_author ) {
								authorIds.push(
									parseInt( row.linked_author, 10 )
								);
							}
							if ( row.image_id ) {
								mediaIds.push( parseInt( row.image_id, 10 ) );
							}
						} );
					} );
				}

				const uniqueAuthorIds = [ ...new Set( authorIds ) ].filter(
					Boolean
				);
				const uniqueMediaIds = [ ...new Set( mediaIds ) ].filter(
					Boolean
				);

				return {
					postOptions:
						getEntityRecords( 'postType', 'post', allPostsArgs ) ||
						[],
					featuredPosts: fetchedPosts || [],
					authors:
						uniqueAuthorIds.length > 0
							? getEntityRecords( 'postType', 'author', {
									include: uniqueAuthorIds,
									per_page: -1,
							  } )
							: [],
					media:
						uniqueMediaIds.length > 0
							? getEntityRecords( 'postType', 'attachment', {
									include: uniqueMediaIds,
									per_page: -1,
							  } )
							: [],
					isFetching:
						selectedPosts.length > 0
							? isResolving( 'core', 'getEntityRecords', [
									'postType',
									'post',
									featuredPostsArgs,
							  ] )
							: false,
				};
			},
			[ selectedPosts ]
		);

	useEffect( () => {
		const expectedId = `featured-blogs-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	useEffect( () => {
		if ( isFetching || ! featuredPosts || featuredPosts.length <= 1 ) {
			return;
		}

		const initSwiper = () => {
			if ( ! sliderRef.current ) {
				return;
			}

			if ( swiperInstance.current ) {
				swiperInstance.current.destroy( true, true );
				swiperInstance.current = null;
			}

			swiperInstance.current = new Swiper( sliderRef.current, {
				slidesPerView: 1,
				spaceBetween: 30,
				loop: false,
				observer: true,
				observeParents: true,
				navigation: {
					nextEl: '.custom-next',
					prevEl: '.custom-prev',
				},
			} );
		};

		// Small timeout to ensure React has rendered the slides
		const timer = setTimeout( initSwiper, 100 );
		return () => clearTimeout( timer );
	}, [ featuredPosts, isFetching ] );

	const suggestions = postOptions.map(
		( post ) => post.title?.rendered || ''
	);

	const selectedPostTitles = selectedPosts.flatMap( ( id ) => {
		const post = postOptions.find( ( p ) => p.id === id );
		return post?.title?.rendered ? [ post.title.rendered ] : [];
	} );

	const onPostsChange = ( titles ) => {
		const newIds = titles.flatMap( ( postTitle ) => {
			const post = postOptions.find(
				( p ) => ( p.title?.rendered || '' ) === postTitle
			);
			return post ? [ post.id ] : [];
		} );
		setAttributes( { selectedPosts: newIds } );
	};

	const blockProps = useBlockProps( {
		className: 'featured-blogs-block',
	} );

	const TagName = headingLevel || 'h2';

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Block Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Block Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
					/>
					<ComboboxControl
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel }
						options={ HEADING_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Featured Blogs Selection', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<FormTokenField
						label={ __( 'Select Posts', 'ambrygen-web' ) }
						value={ selectedPostTitles }
						suggestions={ suggestions }
						onChange={ onPostsChange }
						maxLength={ MAX_POSTS }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ selectedPosts.length > 0 ? (
					<Fragment>
						<div
							className="is-style-gl-s50"
							aria-hidden="true"
						></div>
						<section className="container-1280">
							<div
								className="is-style-gl-s50"
								aria-hidden="true"
							></div>
							<div className="wrapper">
								<div className="blog-listing-header">
									<RichText
										tagName={ TagName }
										className="heading-4 block-title mb-0 text-center"
										value={ title }
										onChange={ ( value ) =>
											setAttributes( { title: value } )
										}
										placeholder={ __(
											'Title…',
											'ambrygen-web'
										) }
									/>
								</div>
								<div
									className="is-style-gl-s32"
									aria-hidden="true"
								></div>
								<div className="blog-featured-swiper-wrap">
									<div
										ref={ sliderRef }
										className="swiper blog-featured-swiper"
									>
										<div className="swiper-wrapper">
											{ isFetching && <Spinner /> }
											{ ! isFetching &&
												featuredPosts &&
												featuredPosts.length > 0 &&
												featuredPosts.map( ( post ) => {
													const featuredImage =
														post._embedded?.[
															'wp:featuredmedia'
														]?.[ 0 ]?.source_url;
													const tags =
														post._embedded?.[
															'wp:term'
														]?.[ 1 ] || [];
													const date = new Date(
														post.date
													).toLocaleDateString(
														'en-US',
														{
															month: 'long',
															day: 'numeric',
															year: 'numeric',
														}
													);

													// Process Authors from meta
													const repeater =
														post.meta
															?.webinar_authors ||
														[];
													const postAuthors = [];

													repeater.forEach(
														( row ) => {
															const authorId =
																parseInt(
																	row.linked_author,
																	10
																);
															const overrideImageId =
																parseInt(
																	row.image_id,
																	10
																);
															const overrideDesignation =
																row.designation;

															let authorName = '';
															let defaultImage =
																'';
															let defaultDesignation =
																'';

															if ( authorId ) {
																const authorPost =
																	(
																		authors ||
																		[]
																	).find(
																		( a ) =>
																			a.id ===
																			authorId
																	);
																if (
																	authorPost
																) {
																	authorName =
																		authorPost
																			.title
																			?.rendered;
																	defaultImage =
																		authorPost
																			._embedded?.[
																			'wp:featuredmedia'
																		]?.[ 0 ]
																			?.source_url;
																	// Fetch designation from author post meta (exposed in REST)
																	defaultDesignation =
																		authorPost
																			.meta
																			?.user_designation;
																}
															}

															if ( authorName ) {
																let finalImage =
																	defaultImage;
																if (
																	overrideImageId
																) {
																	const mediaItem =
																		(
																			media ||
																			[]
																		).find(
																			(
																				m
																			) =>
																				m.id ===
																				overrideImageId
																		);
																	if (
																		mediaItem
																	) {
																		finalImage =
																			mediaItem.source_url;
																	}
																}

																postAuthors.push(
																	{
																		name: authorName,
																		image: finalImage,
																		designation:
																			overrideDesignation ||
																			defaultDesignation,
																	}
																);
															}
														}
													);

													// Fallback to WP Author if no custom authors
													if (
														postAuthors.length === 0
													) {
														const wpAuthor =
															post._embedded
																?.author?.[ 0 ];
														if ( wpAuthor ) {
															postAuthors.push( {
																name: wpAuthor.name,
																image: wpAuthor
																	.avatar_urls?.[
																	'96'
																],
																designation: '',
															} );
														}
													}

													const combinedAuthorName =
														postAuthors
															.map(
																( author ) => {
																	let name =
																		author.name;
																	if (
																		author.designation
																	) {
																		name += `, ${ author.designation }`;
																	}
																	return name;
																}
															)
															.join( ' | ' );

													const firstAuthorImage =
														postAuthors[ 0 ]
															?.image || null;

													return (
														<div
															key={ post.id }
															className="swiper-slide"
														>
															<div className="blog-featured">
																<div className="blog-featured__image-col">
																	<div className="blog-featured__image-link">
																		{ featuredImage ? (
																			<img
																				src={
																					featuredImage
																				}
																				className="blog-featured__image"
																				alt=""
																			/>
																		) : (
																			<div className="blog-featured__image placeholder"></div>
																		) }
																	</div>
																</div>

																<div className="blog-featured__content-col">
																	<div className="blog-featured__category">
																		{ tags.map(
																			(
																				tag
																			) => (
																				<div
																					key={
																						tag.id
																					}
																					className="blog-featured__category__item"
																				>
																					{
																						tag.name
																					}
																				</div>
																			)
																		) }
																	</div>

																	<div
																		className="is-style-gl-s16"
																		aria-hidden="true"
																	></div>

																	<RichText
																		tagName={
																			TagName
																		}
																		className="heading-4 block-title mb-0"
																		value={
																			post
																				?.title
																				?.rendered ||
																			__(
																				'(No Title)',
																				'ambrygen-web'
																			)
																		}
																		onChange={
																			noop
																		}
																		placeholder={ __(
																			'Title…',
																			'ambrygen-web'
																		) }
																	/>

																	<div
																		className="is-style-gl-s16"
																		aria-hidden="true"
																	></div>

																	<div className="post-info">
																		{ postAuthors.length >
																			0 && (
																			<div className="blog-featured__author-block">
																				{ firstAuthorImage && (
																					<img
																						className="blog-featured__author-avatar"
																						src={
																							firstAuthorImage
																						}
																						alt=""
																						width="40"
																						height="40"
																					/>
																				) }
																				<div className="blog-featured__author-info">
																					<span className="blog-featured__author-name">
																						{
																							combinedAuthorName
																						}
																					</span>
																				</div>
																			</div>
																		) }

																		<div className="blog-featured__meta flag-details">
																			<div className="blog-featured__date flag-info flag-date-info">
																				<span className="blog-featured__meta-list-icon flag-icon"></span>
																				<span>
																					{
																						date
																					}
																				</span>
																			</div>
																		</div>
																	</div>

																	<div
																		className="is-style-gl-s16"
																		aria-hidden="true"
																	></div>

																	<div
																		className="blog-featured__description body1"
																		dangerouslySetInnerHTML={ {
																			__html:
																				post
																					?.excerpt
																					?.rendered ||
																				'',
																		} }
																	/>

																	<div className="post-btn">
																		<div className="site-btn has-right-arrow">
																			{ __(
																				'Read More',
																				'ambrygen-web'
																			) }
																		</div>
																	</div>
																</div>
															</div>
														</div>
													);
												} ) }
										</div>
									</div>

									{ featuredPosts &&
										featuredPosts.length > 1 && (
											<div className="swiper-buttons blog-featured__nav">
												<button
													type="button"
													className="custom-prev"
													aria-label={ __(
														'Previous article',
														'ambrygen-web'
													) }
												></button>
												<button
													type="button"
													className="custom-next"
													aria-label={ __(
														'Next article',
														'ambrygen-web'
													) }
												></button>
											</div>
										) }
								</div>
							</div>
							<div
								className="is-style-gl-s50"
								aria-hidden="true"
							></div>
						</section>
						<div
							className="is-style-gl-s50"
							aria-hidden="true"
						></div>
					</Fragment>
				) : (
					<div
						className="blog-featured-placeholder"
						style={ {
							padding: '40px',
							border: '2px dashed #ddd',
							textAlign: 'center',
							background: '#f9f9f9',
							color: '#666',
						} }
					>
						<p>
							{ __(
								'Featured Blogs Block: Select posts in the sidebar to see a preview.',
								'ambrygen-web'
							) }
						</p>
					</div>
				) }
			</div>
		</Fragment>
	);
}
