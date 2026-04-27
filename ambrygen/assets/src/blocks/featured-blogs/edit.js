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

export default function Edit( { attributes, setAttributes, clientId } ) {
	const sliderRef = useRef( null );
	const swiperInstance = useRef( null );

	const {
		blockId,
		title,
		headingLevel,
		selectedPosts = [],
	} = attributes;

	const { postOptions, featuredPosts, isFetching } = useSelect( ( select ) => {
		const { getEntityRecords, isResolving } = select( 'core' );

		const allPostsArgs = {
			per_page: 100,
			status: 'publish',
		};

		const featuredPostsArgs = {
			include: selectedPosts.length > 0 ? selectedPosts : [0],
			_embed: true,
			per_page: selectedPosts.length || 1,
		};

		return {
			postOptions: getEntityRecords( 'postType', 'post', allPostsArgs ) || [],
			featuredPosts: selectedPosts.length > 0
				? getEntityRecords( 'postType', 'post', featuredPostsArgs )
				: [],
			isFetching: selectedPosts.length > 0
				? isResolving( 'core', 'getEntityRecords', [ 'postType', 'post', featuredPostsArgs ] )
				: false,
		};
	}, [ selectedPosts ] );

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
					nextEl: '.cip-arrow--next',
					prevEl: '.cip-arrow--prev',
				},
			} );
		};

		// Small timeout to ensure React has rendered the slides
		const timer = setTimeout( initSwiper, 100 );
		return () => clearTimeout( timer );
	}, [ featuredPosts, isFetching ] );

	const suggestions = postOptions.map( ( post ) => post.title?.rendered || '' );

	const selectedPostTitles = selectedPosts
		.map( ( id ) => {
			const post = postOptions.find( ( p ) => p.id === id );
			return post ? ( post.title?.rendered || '' ) : null;
		} )
		.filter( Boolean );

	const onPostsChange = ( titles ) => {
		const newIds = titles
			.map( ( title ) => {
				const post = postOptions.find( ( p ) => ( p.title?.rendered || '' ) === title );
				return post ? post.id : null;
			} )
			.filter( Boolean );
		setAttributes( { selectedPosts: newIds } );
	};

	const blockProps = useBlockProps( {
		className: 'featured-blogs',
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
				<section className="wp-block-group container-1340 conference-in-progress-wrapper">
					<div className="wp-block-group wrapper">
						<div className="wp-block-group conferences-in-progress">
							<div className="is-style-gl-s50" aria-hidden="true"></div>

							<RichText
								tagName={ TagName }
								className="wp-block-heading conferences-in-progress__heading heading-3 mb-0"
								value={ title }
								onChange={ ( value ) => setAttributes( { title: value } ) }
								placeholder={ __( 'Add Title...', 'ambrygen-web' ) }
							/>

							<div className="is-style-gl-s50" aria-hidden="true"></div>

							<div className="conferences-in-progress__slider-wrap">
								<div ref={ sliderRef } className="wp-block-query swiper cip-swiper">
									<div className="wp-block-post-template swiper-wrapper">
										{ isFetching && <Spinner /> }
										{ ! isFetching && featuredPosts && featuredPosts.length > 0 ? (
											featuredPosts.map( ( post ) => {
												const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
												const author = post._embedded?.['author']?.[0];
												const date = new Date( post.date ).toLocaleDateString( 'en-US', {
													month: 'long',
													day: 'numeric',
													year: 'numeric'
												} );

								return (
									<div key={ post.id } className="wp-block-post swiper-slide">
										<div className="wp-block-group cip-card">
											<div className="wp-block-group cip-card__image-wrap">
												{ featuredImage ? (
													<img src={ featuredImage } className="cip-card__image" alt="" />
												) : (
													<div className="cip-card__image placeholder"></div>
												) }
											</div>

											<div className="cip-card__info">
												<div className="cip-card__tags">
													<span className="cip-card__tag cip-card__tag--success">
														<div className="cip-card__tag-dot"></div> { __( 'Featured', 'ambrygen-web' ) }
													</span>
												</div>

												<div className="cip-card__title-block">
													<h3 className="cip-card__title heading-4 mb-0">
														{ post?.title?.rendered || __( '(No Title)', 'ambrygen-web' ) }
													</h3>
												</div>

												{ author && (
													<div className="featured-blogs__card-meta mt-3 mb-3">
														{ author?.avatar_urls?.['96'] && (
															<div className="featured-blogs__card-author-avatar">
																<img src={ author.avatar_urls['96'] } alt="" />
															</div>
														) }
														<div className="featured-blogs__card-author-info">
															<span className="featured-blogs__card-author-name">
																{ author?.name }
															</span>
														</div>
													</div>
												) }

												<div className="cip-card__meta mb-3">
													<span className="cip-card__meta-text text-lg-reg">
														{ date }
													</span>
												</div>

												<div className="cip-card__description body1 mb-4" dangerouslySetInnerHTML={ { __html: post?.excerpt?.rendered || '' } } />

												<div className="cip-card__cta-wrap">
													<span className="cip-card__cta site-btn has-right-arrow">
														{ __( 'Read Article', 'ambrygen-web' ) }
													</span>
												</div>
											</div>
										</div>
									</div>
								);
											} )
										) : (
											! isFetching && <p>{ __( 'Select posts in the sidebar to see a preview.', 'ambrygen-web' ) }</p>
										) }
									</div>

									{ featuredPosts && featuredPosts.length > 1 && (
										<div className="conferences-in-progress__arrows">
											<button type="button" className="cip-arrow cip-arrow--prev" aria-label={ __( 'Previous blog', 'ambrygen-web' ) }></button>
											<button type="button" className="cip-arrow cip-arrow--next" aria-label={ __( 'Next blog', 'ambrygen-web' ) }></button>
										</div>
									)}
								</div>
							</div>

							<div className="is-style-gl-s50" aria-hidden="true"></div>
						</div>
					</div>
				</section>
			</div>
		</Fragment>
	);
}
