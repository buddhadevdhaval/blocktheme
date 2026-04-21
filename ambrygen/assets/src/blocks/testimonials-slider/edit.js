import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import {
	Button,
	PanelBody,
	ToggleControl,
	RangeControl,
	ComboboxControl,
} from '@wordpress/components';

import {
	ImageUploader,
	ItemHeader,
} from '../_shared/components';

const DEFAULT_TESTIMONIAL = {
	content: '',
	imageId: 0,
	imageUrl: '',
	imageAlt: '',
};

const HEADING_OPTIONS = [
	{ label: 'H1', value: 'h1' },
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
	{ label: 'H5', value: 'h5' },
	{ label: 'H6', value: 'h6' },
];

const MAX_TESTIMONIALS = 20;

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		headingLevel,
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

	useEffect( () => {
		const expectedId = `testimonials-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: '',
	} );

	const updateTestimonial = ( index, key, value ) => {
		const nextTestimonials = [ ...testimonials ];
		nextTestimonials[ index ] = {
			...nextTestimonials[ index ],
			[ key ]: value,
		};
		setAttributes( { testimonials: nextTestimonials } );
	};

	const addTestimonial = () => {
		if ( testimonials.length >= MAX_TESTIMONIALS ) {
			return;
		}

		setAttributes( {
			testimonials: [ ...testimonials, { ...DEFAULT_TESTIMONIAL } ],
		} );
	};

	const removeTestimonial = ( index ) => {
		if ( testimonials.length <= 1 ) {
			return;
		}

		setAttributes( {
			testimonials: testimonials.filter( ( _, testimonialIndex ) => testimonialIndex !== index ),
		} );
	};

	const moveTestimonial = ( index, direction ) => {
		const newIndex = index + direction;

		if ( newIndex < 0 || newIndex >= testimonials.length ) {
			return;
		}

		const nextTestimonials = [ ...testimonials ];
		[ nextTestimonials[ index ], nextTestimonials[ newIndex ] ] = [
			nextTestimonials[ newIndex ],
			nextTestimonials[ index ],
		];
		setAttributes( { testimonials: nextTestimonials } );
	};

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
					<div style={ { marginBottom: '16px' } }></div>
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

				<PanelBody
					title={ __( 'Testimonials', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					{ testimonials.map( ( testimonial, index ) => (
						<div
							key={ `testimonial-${ index }` }
							style={ {
								marginBottom: '16px',
								padding: '12px',
								border: '1px solid #ddd',
								borderRadius: '4px',
							} }
						>
							<ItemHeader
								index={ index }
								label={ testimonial.content ? __( 'Testimonial', 'ambrygen-web' ) : __( 'Untitled', 'ambrygen-web' ) }
								total={ testimonials.length }
								onMove={ moveTestimonial }
								onRemove={ removeTestimonial }
								minCount={ 1 }
							/>

							<RichText
								tagName="p"
								className="mb-4"
								label={ __( 'Testimonial Content', 'ambrygen-web' ) }
								placeholder={ __( 'Enter testimonial text...', 'ambrygen-web' ) }
								value={ testimonial.content }
								onChange={ ( value ) =>
									updateTestimonial( index, 'content', value )
								}
							/>

							<ImageUploader
								url={ testimonial.imageUrl }
								label={ __( 'Logo', 'ambrygen-web' ) }
								onSelect={ ( media ) => {
									const nextTestimonials = [ ...testimonials ];
									nextTestimonials[ index ] = {
										...nextTestimonials[ index ],
										imageId: media.id || 0,
										imageUrl: media.url || '',
										imageAlt: media.alt || media.title || '',
									};
									setAttributes( { testimonials: nextTestimonials } );
								} }
								onRemove={ () => {
									const nextTestimonials = [ ...testimonials ];
									nextTestimonials[ index ] = {
										...nextTestimonials[ index ],
										imageId: 0,
										imageUrl: '',
										imageAlt: '',
									};
									setAttributes( { testimonials: nextTestimonials } );
								} }
							/>
						</div>
					) ) }

					<Button
						variant="secondary"
						onClick={ addTestimonial }
						disabled={ testimonials.length >= MAX_TESTIMONIALS }
					>
						{ __( 'Add Testimonial', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="is-style-gl-s72"></div>
				<div className="graphic-images" aria-hidden="true">
					<div className="graphic-images__overlay-left graphic-images__img-block">
						{ graphicLeftUrl && (
							<img src={ graphicLeftUrl } className="overlay__img" alt={ graphicLeftAlt } />
						) }
					</div>
					<div className="graphic-images__overlay-right graphic-images__img-block">
						{ graphicRightUrl && (
							<img src={ graphicRightUrl } className="overlay__img" alt={ graphicRightAlt } />
						) }
					</div>
				</div>
				<div className="testimonial-slider__inner">
					<div className="testimonial-slider__header">
						<RichText
							tagName="h2"
							className="heading-3 block-title mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add title...', 'ambrygen-web' ) }
						/>
					</div>
					<div className="is-style-gl-s50"></div>
					{ testimonials.length > 0 && (
						<div className="testimonial-slider__swiper">
							<div className="testimonial-slider-wrapper swiper testimonial-swiper">
								<div className="swiper-wrapper">
									{ testimonials.map( ( testimonial, index ) => (
										<div key={ index } className="swiper-slide">
											<div className="testimonial-slider__card">
												{ testimonial.content && (
													<div className="testimonial-slider__quote heading-5 mb-0">
														{ testimonial.content }
													</div>
												) }
												<div className="is-style-gl-s24"></div>
												{ testimonial.imageUrl && (
													<div className="testimonial-slider__logo">
														<img src={ testimonial.imageUrl } alt={ testimonial.imageAlt } />
													</div>
												) }
											</div>
										</div>
									) ) }
								</div>
							</div>
							<div className="swiper-pagination testimonial-swiper-pagination"></div>
						</div>
					) }
				</div>
				<div className="is-style-gl-s72"></div>
			</div>
		</Fragment>
	);
}
