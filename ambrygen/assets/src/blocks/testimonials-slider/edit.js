import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ImageUploader, TagSelector } from '../_shared/components';

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
		headingLevel = 'h2',
		testimonials = [],
		autoplay,
		showNavigation,
		showPagination,
		slidesPerView,
		graphicLeftId,
		graphicLeftUrl,
		graphicLeftAlt,
		graphicRightId,
		graphicRightUrl,
		graphicRightAlt,
	} = attributes;

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);
	const hasInnerBlocks = innerBlocks.length > 0;

	useEffect( () => {
		const expectedId = `testimonials-slider-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

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

	const blockProps = useBlockProps( {
		className: 'testimonial-slider',
		id: blockId || undefined,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
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
					title={ __( 'Slider Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<RangeControl
						label={ __( 'Slides Per View', 'ambrygen-web' ) }
						value={ slidesPerView }
						onChange={ ( value ) =>
							setAttributes( { slidesPerView: value || 1 } )
						}
						min={ 1 }
						max={ 3 }
					/>
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
					title={ __( 'Graphic Images', 'ambrygen-web' ) }
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
				<div className="graphic-images" aria-hidden="true">
					<div className="graphic-images__overlay-left graphic-images__img-block">
						{ graphicLeftUrl && (
							<img
								src={ graphicLeftUrl }
								className="overlay__img"
								alt={ graphicLeftAlt }
							/>
						) }
					</div>
					<div className="graphic-images__overlay-right graphic-images__img-block">
						{ graphicRightUrl && (
							<img
								src={ graphicRightUrl }
								className="overlay__img"
								alt={ graphicRightAlt }
							/>
						) }
					</div>
				</div>

				<div className="testimonial-slider__inner">
					<div className="testimonial-slider__header">
						<RichText
							tagName={ headingLevel }
							className="heading-3 block-title mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add title...', 'ambrygen-web' ) }
						/>
					</div>

					<div className="is-style-gl-s50"></div>

					<div className="testimonial-slider__swiper">
						<div className="testimonial-slider-wrapper swiper testimonial-swiper">
							<div className="swiper-wrapper">
								<InnerBlocks
									allowedBlocks={ ALLOWED_BLOCKS }
									template={ ! hasInnerBlocks ? TEMPLATE : undefined }
									renderAppender={
										InnerBlocks.ButtonBlockAppender
									}
								/>
							</div>
						</div>

						{ showNavigation && (
							<div className="swiper-buttons">
								<button type="button" className="custom-prev" />
								<button type="button" className="custom-next" />
							</div>
						) }

						{ showPagination && (
							<div className="swiper-pagination testimonial-swiper-pagination"></div>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
