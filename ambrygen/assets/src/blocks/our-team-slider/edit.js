import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import Swiper from 'swiper/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
	PanelBody,
	ToggleControl,
	CheckboxControl,
	Spinner,
	Button,
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TagSelector } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const sliderRef = useRef( null );
	const swiperInstance = useRef( null );

	const {
		blockId,
		title,
		intro,
		headingLevel = 'h2',
		memberTypes = [],
		selectionMode = 'manual',
		showNavigation = true,
		showPagination = true,
		autoplay = false,
		slidesPerView = 3,
	} = attributes;

	const { replaceInnerBlocks, insertBlock } =
		useDispatch( 'core/block-editor' );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	/* ----------------------------
	 * Data
	 * ---------------------------- */

	const memberTypeTerms = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'taxonomy', 'member_type', {
				per_page: -1,
				hide_empty: false,
			} ),
		[]
	);

	const allTeamPosts = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', 'our_team', {
				per_page: -1,
				post_status: 'publish',
			} ),
		[]
	);
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);

	/* ----------------------------
	 * Auto-insert child blocks (taxonomy mode)
	 * ---------------------------- */

	useEffect( () => {
		if (
			selectionMode !== 'taxonomy' ||
			! memberTypes.length ||
			! allTeamPosts
		) {
			return;
		}

		const filteredPosts = allTeamPosts.filter( ( post ) =>
			post.member_type?.some( ( id ) =>
				memberTypes.includes( Number( id ) )
			)
		);

		const newBlocks = filteredPosts.map( ( post ) =>
			createBlock( 'ambrygen/our-team-slider-item', {
				postId: post.id,
			} )
		);

		replaceInnerBlocks( clientId, newBlocks, false );
	}, [
		selectionMode,
		memberTypes,
		allTeamPosts,
		clientId,
		replaceInnerBlocks,
	] );

	useEffect( () => {
		let retryCount = 0;
		let animationFrameId;

		const initSwiper = () => {
			if ( ! sliderRef.current ) {
				return;
			}

			const sliderEl = sliderRef.current;

			// Ensure this is our slider only
			if ( ! sliderEl.classList.contains( 'our-leadership-slider' ) ) {
				return;
			}
			const sliderDiv = sliderEl.querySelector(
				'.block-editor-block-list__layout'
			);

			// If the layout container doesn't exist yet, retry a few times.
			// Swiper also needs children to be mounted so we check for sliderDiv.children.length
			if ( ! sliderDiv || sliderDiv.children.length === 0 ) {
				if ( retryCount < 20 ) {
					retryCount++;
					animationFrameId = requestAnimationFrame( initSwiper );
				}
				return;
			}

			const swiperContainer = sliderDiv.parentElement;

			// Manually add the wrapper classes to prevent Swiper from mutating the React DOM structure.
			// Swiper strictly expects .swiper-wrapper to be a direct child of .swiper container.
			swiperContainer.classList.add( 'swiper' );
			sliderDiv.classList.add( 'swiper-wrapper' );

			// Destroy existing instance if present
			if ( swiperInstance.current ) {
				swiperInstance.current.destroy( true, true );
				swiperInstance.current = null;
			}

			// Initialize Swiper on the parent container (swiperContainer) to keep React happy
			swiperInstance.current = new Swiper( swiperContainer, {
				slidesPerView: slidesPerView || 3,
				spaceBetween: 20,
				loop: false,
				observer: true,
				observeParents: true,
				resizeObserver: true,
				allowTouchMove: false,
				navigation: showNavigation
					? {
							nextEl: sliderEl.querySelector( '.custom-next' ),
							prevEl: sliderEl.querySelector( '.custom-prev' ),
					  }
					: false,
				pagination: showPagination
					? {
							el: sliderEl.querySelector( '.swiper-pagination' ),
							clickable: true,
					  }
					: false,
				autoplay: autoplay
					? {
							delay: 3000,
							disableOnInteraction: false,
					  }
					: false,
			} );
		};

		initSwiper();

		// Cleanup
		return () => {
			if ( animationFrameId ) {
				cancelAnimationFrame( animationFrameId );
			}
			if ( swiperInstance.current ) {
				swiperInstance.current.destroy( true, true );
				swiperInstance.current = null;
			}
		};
	}, [
		slidesPerView,
		showNavigation,
		showPagination,
		autoplay,
		innerBlocks,
	] );

	const TagName = headingLevel;

	/* ----------------------------
	 * Render
	 * ---------------------------- */

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						type="heading"
						value={ headingLevel }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Team Selection Mode', 'ambrygen-web' ) }
					initialOpen
				>
					<ToggleControl
						label={ __( 'Select by Member Type', 'ambrygen-web' ) }
						checked={ selectionMode === 'taxonomy' }
						onChange={ ( enabled ) =>
							setAttributes( {
								selectionMode: enabled ? 'taxonomy' : 'manual',
								memberTypes: [],
							} )
						}
					/>

					{ selectionMode === 'taxonomy' &&
						( ! memberTypeTerms ? (
							<Spinner />
						) : (
							memberTypeTerms.map( ( term ) => (
								<CheckboxControl
									key={ term.id }
									label={ term.name }
									checked={ memberTypes.includes( term.id ) }
									onChange={ ( checked ) =>
										setAttributes( {
											memberTypes: checked
												? [ ...memberTypes, term.id ]
												: memberTypes.filter(
														( id ) => id !== term.id
												  ),
										} )
									}
								/>
							) )
						) ) }
				</PanelBody>

				<PanelBody
					title={ __( 'Slider Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<ToggleControl
						label={ __( 'Show Navigation', 'ambrygen-web' ) }
						checked={ showNavigation }
						onChange={ ( value ) =>
							setAttributes( { showNavigation: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show Pagination', 'ambrygen-web' ) }
						checked={ showPagination }
						onChange={ ( value ) =>
							setAttributes( { showPagination: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Autoplay', 'ambrygen-web' ) }
						checked={ autoplay }
						onChange={ ( value ) =>
							setAttributes( { autoplay: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<div className="our-leadership">
					<div className="our-leadership__header block__rowflex">
						<TagName className="our-leadership__title block__rowflex--heading-title heading-3 mb-0">
							<RichText
								tagName="div"
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
							/>
						</TagName>

						<RichText
							tagName="div"
							className="our-leadership__intro block__rowflex--block-content subtitle1-reg"
							value={ intro }
							onChange={ ( value ) =>
								setAttributes( { intro: value } )
							}
						/>
					</div>

					{ /* Editor preview – NOT real swiper */ }
					<div
						ref={ sliderRef }
						className="our-leadership__editor-preview our-leadership-slider swiper"
					>
						{ /* <div className="our-leadership__editor-preview our-leadership__grid our-leadership-slider swiper"> */ }
						{ /* <div className="swiper-wrapper"> */ }

						<InnerBlocks
							allowedBlocks={ [
								'ambrygen/our-team-slider-item',
							] }
							orientation="horizontal"
							renderAppender={ () => false }
						/>
						{ /* </div> */ }

						{ showPagination && (
							<div className="swiper-pagination" />
						) }

						{ showNavigation && (
							<>
								<div className="swiper-buttons">
									<div className="custom-prev"></div>
									<div className="custom-next"></div>
								</div>
							</>
						) }
					</div>

					{ selectionMode !== 'taxonomy' && (
						<div
							className="our-team-slider__add-member"
							style={ { marginTop: '20px', textAlign: 'center' } }
						>
							<Button
								variant="primary"
								onClick={ () => {
									const newBlock = createBlock(
										'ambrygen/our-team-slider-item',
										{}
									);
									insertBlock(
										newBlock,
										undefined,
										clientId
									);
								} }
							>
								{ __( '+ Add Team Member', 'ambrygen-web' ) }
							</Button>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
