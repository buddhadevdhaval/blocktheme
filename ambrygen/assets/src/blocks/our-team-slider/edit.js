import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import Swiper from 'swiper/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
	PanelBody,
	ToggleControl,
	CheckboxControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const sliderRef = useRef( null );
	const swiperInstance = useRef( null );

	const {
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

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

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
			post.member_type?.some( ( id ) => memberTypes.includes( id ) )
		);

		const newBlocks = filteredPosts.map( ( post ) =>
			wp.blocks.createBlock( 'ambrygen/our-team-slider-item', {
				postId: post.id,
			} )
		);

		replaceInnerBlocks( clientId, newBlocks, false );
	}, [ selectionMode, memberTypes, allTeamPosts ] );

	useEffect( () => {
		const timeout = setTimeout( () => {
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

			// Destroy existing instance if present
			if ( swiperInstance.current ) {
				swiperInstance.current.destroy( true, true );
				swiperInstance.current = null;
			}

			// Initialize Swiper
			swiperInstance.current = new Swiper( sliderDiv, {
				slidesPerView: slidesPerView || 3,
				spaceBetween: 20,
				loop: false,
				createElements: true,
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
		}, 2000 ); // 30000ms = 30 seconds

		// // Cleanup
		return () => {
			clearTimeout( timeout );
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
				<PanelBody title="Heading Settings">
					<SelectControl
						label="Heading Level"
						value={ headingLevel }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						] }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				<PanelBody title="Team Selection Mode" initialOpen>
					<ToggleControl
						label="Select by Member Type"
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

				<PanelBody title="Slider Settings" initialOpen>
					<ToggleControl
						label="Show Navigation"
						checked={ showNavigation }
						onChange={ ( value ) =>
							setAttributes( { showNavigation: value } )
						}
					/>
					<ToggleControl
						label="Show Pagination"
						checked={ showPagination }
						onChange={ ( value ) =>
							setAttributes( { showPagination: value } )
						}
					/>
					<ToggleControl
						label="Autoplay"
						checked={ autoplay }
						onChange={ ( value ) =>
							setAttributes( { autoplay: value } )
						}
					/>
					<SelectControl
						label="Slides Per View"
						value={ slidesPerView }
						options={ [
							{ label: '1', value: 1 },
							{ label: '2', value: 2 },
							{ label: '3', value: 3 },
							{ label: '4', value: 4 },
							{ label: '5', value: 5 },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								slidesPerView: Number( value ),
							} )
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
							renderAppender={ InnerBlocks.ButtonBlockAppender }
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
				</div>
			</div>
		</>
	);
}
