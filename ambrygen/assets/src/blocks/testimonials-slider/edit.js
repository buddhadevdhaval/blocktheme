import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
	BlockExamplePreview,
	ImageUploader,
	TagSelector,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const ALLOWED_BLOCKS = [ 'ambrygen/testimonials-slider-item' ];
const TEMPLATE = [ [ 'ambrygen/testimonials-slider-item', {} ] ];

const createSliderItemBlock = ( testimonial = {} ) =>
	createBlock( 'ambrygen/testimonials-slider-item', {
		content: testimonial?.content || '',
		imageId: testimonial?.imageId || 0,
		imageUrl: testimonial?.imageUrl || '',
		imageAlt: testimonial?.imageAlt || '',
	} );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		headingTag = 'h2',
		testimonials = [],
		autoplay,
		showNavigation,
		showPagination,
		graphicLeftUrl,
		graphicLeftAlt,
		graphicRightUrl,
		graphicRightAlt,
	} = attributes;
	const isExample = blockId === 'testimonials-slider-example';
	const swiperRef = useRef( null );
	const [ activeSlideIndex, setActiveSlideIndex ] = useState( 0 );

	const { insertBlock, replaceInnerBlocks } = useDispatch(
		'core/block-editor'
	);
	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);
	const hasInnerBlocks = innerBlocks.length > 0;
	const hasMultipleSlides = innerBlocks.length > 1;
	const hasTitle = !! title;
	const hasLeftGraphic = !! graphicLeftUrl;
	const hasRightGraphic = !! graphicRightUrl;
	const hasGraphicImages = hasLeftGraphic || hasRightGraphic;

	useUniqueBlockId( {
		blockId,
		clientId,
		enabled: ! isExample,
		idPrefix: 'testimonials-slider',
		setAttributes,
	} );

	useEffect( () => {
		if ( hasInnerBlocks || ! testimonials.length ) {
			return;
		}

		replaceInnerBlocks(
			clientId,
			testimonials.map( createSliderItemBlock ),
			false
		);
		setAttributes( { testimonials: [] } );
	}, [
		clientId,
		hasInnerBlocks,
		replaceInnerBlocks,
		setAttributes,
		testimonials,
	] );

	useEffect( () => {
		const sliderElement = swiperRef.current;
		const sliderLayout = sliderElement?.querySelector(
			'.block-editor-block-list__layout'
		);

		if ( ! sliderLayout ) {
			return;
		}

		[ ...sliderLayout.children ].forEach( ( slideElement, index ) => {
			slideElement.classList.toggle(
				'is-editor-active-slide',
				index === activeSlideIndex
			);
			slideElement.classList.toggle(
				'is-editor-inactive-slide',
				index !== activeSlideIndex
			);
			slideElement.style.display =
				index === activeSlideIndex ? 'block' : 'none';
			slideElement.setAttribute(
				'aria-hidden',
				index === activeSlideIndex ? 'false' : 'true'
			);
		} );
	}, [ activeSlideIndex, innerBlocks ] );

	useEffect( () => {
		if ( ! innerBlocks.length ) {
			if ( activeSlideIndex !== 0 ) {
				setActiveSlideIndex( 0 );
			}
			return;
		}

		if ( activeSlideIndex > innerBlocks.length - 1 ) {
			setActiveSlideIndex( innerBlocks.length - 1 );
		}
	}, [ activeSlideIndex, innerBlocks ] );

	const blockProps = useBlockProps( {
		className: 'testimonial-slider block-layout',
		id: isExample ? undefined : blockId || undefined,
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="testimonials-example-preview"
				imagePath="/assets/src/images/testimonial-slider/preview.png"
			/>
		);
	}

	const addSliderItem = () => {
		const newSlideIndex = innerBlocks.length;

		insertBlock(
			createSliderItemBlock(),
			newSlideIndex,
			clientId,
			true
		);
		setActiveSlideIndex( newSlideIndex );
	};

	const showPreviousSlide = () => {
		if ( innerBlocks.length <= 1 ) {
			return;
		}

		setActiveSlideIndex( ( currentIndex ) =>
			currentIndex === 0 ? innerBlocks.length - 1 : currentIndex - 1
		);
	};

	const showNextSlide = () => {
		if ( innerBlocks.length <= 1 ) {
			return;
		}

		setActiveSlideIndex( ( currentIndex ) =>
			currentIndex === innerBlocks.length - 1 ? 0 : currentIndex + 1
		);
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="plus-alt2"
						label={ __( 'Add item', 'ambrygen-web' ) }
						onClick={ addSliderItem }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						type="heading"
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Slider Settings', 'ambrygen-web' ) }
					initialOpen={ true }
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

				<PanelBody
					title={ __( 'Graphic Image', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<ImageUploader
						url={ graphicLeftUrl }
						label={ __( 'Left Graphic Image', 'ambrygen-web' ) }
						onSelect={ ( media ) => {
							setAttributes( {
								graphicLeftId: media.id || 0,
								graphicLeftUrl: media.url || '',
								graphicLeftAlt: media.alt || media.title || '',
							} );
						} }
						onRemove={ () => {
							setAttributes( {
								graphicLeftId: 0,
								graphicLeftUrl: '',
								graphicLeftAlt: '',
							} );
						} }
					/>
					<ImageUploader
						url={ graphicRightUrl }
						label={ __( 'Right Graphic Image', 'ambrygen-web' ) }
						onSelect={ ( media ) => {
							setAttributes( {
								graphicRightId: media.id || 0,
								graphicRightUrl: media.url || '',
								graphicRightAlt: media.alt || media.title || '',
							} );
						} }
						onRemove={ () => {
							setAttributes( {
								graphicRightId: 0,
								graphicRightUrl: '',
								graphicRightAlt: '',
							} );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ hasGraphicImages && (
					<div className="graphic-images" aria-hidden="true">
						{ hasLeftGraphic && (
							<div className="graphic-images__overlay-left graphic-images__img-block">
								<img
									src={ graphicLeftUrl }
									className="overlay__img"
									alt={ graphicLeftAlt }
								/>
							</div>
						) }
						{ hasRightGraphic && (
							<div className="graphic-images__overlay-right graphic-images__img-block">
								<img
									src={ graphicRightUrl }
									className="overlay__img"
									alt={ graphicRightAlt }
								/>
							</div>
						) }
					</div>
				) }

				<div className="testimonial-slider__inner">
					<div className="testimonial-slider__header">
						<RichText
							tagName={ headingTag || 'h2' }
							className="heading-3 block-title mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						/>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<div className="testimonial-slider__swiper">
						<div ref={ swiperRef }>
							<InnerBlocks
								allowedBlocks={ ALLOWED_BLOCKS }
								template={ ! hasInnerBlocks ? TEMPLATE : undefined }
								renderAppender={ false }
							/>
						</div>

						{ showNavigation && hasMultipleSlides && (
							<div className="swiper-buttons">
								<button
									type="button"
									className="custom-prev"
									onClick={ showPreviousSlide }
								/>
								<button
									type="button"
									className="custom-next"
									onClick={ showNextSlide }
								/>
							</div>
						) }

						{ showPagination && (
							<div className="swiper-pagination testimonial-swiper-pagination swiper-pagination-bullets ">
								{ hasMultipleSlides &&
									innerBlocks.map( ( block, index ) => (
										<span
											key={ block.clientId }
											role="button"
											tabIndex={ 0 }
											className={ `swiper-pagination-bullet${
												index === activeSlideIndex
													? ' swiper-pagination-bullet-active'
													: ''
											}` }
											onClick={ () => setActiveSlideIndex( index ) }
											onKeyDown={ ( event ) => {
												if (
													event.key === 'Enter' ||
													event.key === ' '
												) {
													event.preventDefault();
													setActiveSlideIndex( index );
												}
											} }
											aria-label={ sprintf(
												/* translators: %d: testimonial slide number. */
												__( 'Go to testimonial %d', 'ambrygen-web' ),
												index + 1
											) }
											aria-current={
												index === activeSlideIndex
													? 'true'
													: undefined
											}
										></span>
									) ) }
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
