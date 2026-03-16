/**
 * React hooks for performance optimization.
 *
 * @see https://react.dev/reference/react
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Core block editor components for building the block interface.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import {
	BlockControls,
	MediaPlaceholder,
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * WordPress UI components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import {
	Button,
	PanelBody,
	RangeControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	TagSelector,
	ImageUploader,
	CtaButtonField,
} from '../_shared/components';

/**
 * Edit component for the Hero Section block.
 *
 * Renders the block interface in the editor with:
 * - Logo overlay configuration
 * - Slider with repeater fields for multiple slides
 * - Per-slide: background image, heading, content, tagline, buttons
 * - Slider settings (navigation, dots, autoplay)
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Block editor interface element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { slides, showSliderNav, showSliderDots, autoplay, autoplayDelay } =
		attributes;

	const [ currentSlide, setCurrentSlide ] = useState( 0 );

	/**
	 * Updates a specific slide's property or properties.
	 *
	 * @param {number}        index        Slide index.
	 * @param {string|Object} keyOrUpdates Property key or object of updates.
	 * @param {*}             [value]      New value (if keyOrUpdates is a string).
	 */
	const updateSlide = useCallback(
		( index, keyOrUpdates, value ) => {
			const newSlides = [ ...slides ];
			if ( typeof keyOrUpdates === 'string' ) {
				newSlides[ index ] = {
					...newSlides[ index ],
					[ keyOrUpdates ]: value,
				};
			} else {
				newSlides[ index ] = {
					...newSlides[ index ],
					...keyOrUpdates,
				};
			}
			setAttributes( { slides: newSlides } );
		},
		[ slides, setAttributes ]
	);

	/**
	 * Adds a new slide.
	 */
	const addSlide = useCallback( () => {
		const newSlides = [
			...slides,
			{
				id:
					typeof crypto?.randomUUID === 'function'
						? crypto.randomUUID()
						: `${ Date.now() }-${ Math.random()
								.toString( 36 )
								.slice( 2 ) }`,
				backgroundImage: '',
				backgroundImageId: 0,
				backgroundImageAlt: '',
				heading: '',
				eyebrow: '',
				headingTag: 'h2',
				content: '',
				tagline: '',
				buttonPrimaryText: 'Start Your Order',
				buttonPrimaryUrl: '#',
				primarybutton: {
					url: '',
					text: '',
					target: '',
					rel: '',
					variant: '',
				},
				secondarybutton: {
					url: '',
					text: '',
					target: '',
					rel: '',
					variant: '',
				},
				buttonSecondaryText: 'Who We Are',
				buttonSecondaryUrl: '#',
			},
		];
		setAttributes( { slides: newSlides } );
		setCurrentSlide( newSlides.length - 1 );
	}, [ slides, setAttributes ] );

	/**
	 * Removes a slide.
	 *
	 * @param {number} index Slide index to remove.
	 */
	const removeSlide = useCallback(
		( index ) => {
			if ( slides.length <= 1 ) {
				return;
			}
			const newSlides = slides.filter( ( _, i ) => i !== index );
			setAttributes( { slides: newSlides } );
			if ( currentSlide >= newSlides.length ) {
				setCurrentSlide( newSlides.length - 1 );
			}
		},
		[ slides, currentSlide, setAttributes ]
	);

	const moveSlide = useCallback(
		( index, direction ) => {
			const newIndex = index + direction;

			if ( newIndex < 0 || newIndex >= slides.length ) {
				return;
			}

			const newSlides = [ ...slides ];
			const temp = newSlides[ index ];

			newSlides[ index ] = newSlides[ newIndex ];
			newSlides[ newIndex ] = temp;

			setAttributes( { slides: newSlides } );
			setCurrentSlide( newIndex );
		},
		[ slides, setAttributes ]
	);

	const blockProps = useBlockProps( {
		className: 'hero-section',
	} );

	const slide = slides[ currentSlide ] || slides[ 0 ];

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="plus-alt2"
						label={ __( 'Add Slide', 'ambrygen-web' ) }
						onClick={ addSlide }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...blockProps }>
				<InspectorControls>
					<PanelBody
						title={ __( 'Slider Settings', 'ambrygen-web' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __(
								'Show Navigation Arrows',
								'ambrygen-web'
							) }
							checked={ showSliderNav }
							onChange={ ( value ) =>
								setAttributes( { showSliderNav: value } )
							}
						/>
						<ToggleControl
							label={ __(
								'Show Pagination Dots',
								'ambrygen-web'
							) }
							checked={ showSliderDots }
							onChange={ ( value ) =>
								setAttributes( { showSliderDots: value } )
							}
						/>
						<ToggleControl
							label={ __( 'Autoplay', 'ambrygen-web' ) }
							checked={ autoplay }
							onChange={ ( value ) =>
								setAttributes( { autoplay: value } )
							}
						/>

						{ autoplay && (
							<RangeControl
								label={ __(
									'Autoplay Delay (Milliseconds)',
									'ambrygen-web'
								) }
								value={ autoplayDelay }
								onChange={ ( value ) =>
									setAttributes( { autoplayDelay: value } )
								}
								min={ 1000 }
								max={ 10000 }
								step={ 500 }
							/>
						) }
					</PanelBody>

					{ slides.map( ( slideItem, index ) => (
						<PanelBody
							key={ slideItem.id ?? index }
							title={ `${ __( 'Slide', 'ambrygen-web' ) } ${
								index + 1
							}` }
							initialOpen={ index === currentSlide }
							onToggle={ () => setCurrentSlide( index ) }
						>
							{ slides.length > 1 && (
								<div className="hero-section__slide-controls">
									{ /* Move Slide Up */ }
									<Button
										size="small"
										disabled={ index === 0 }
										onClick={ ( e ) => {
											e.preventDefault();
											e.stopPropagation();
											moveSlide( index, -1 ); // Move up
										} }
									>
										{ __( 'Move Up', 'ambrygen-web' ) }
									</Button>

									{ /* Move Slide Down */ }
									<Button
										size="small"
										disabled={ index === slides.length - 1 }
										onClick={ ( e ) => {
											e.preventDefault();
											e.stopPropagation();
											moveSlide( index, 1 ); // Move down
										} }
									>
										{ __( 'Move Down', 'ambrygen-web' ) }
									</Button>
								</div>
							) }

							<ImageUploader
								label={ __(
									'Background Image',
									'ambrygen-web'
								) }
								url={ slideItem.backgroundImage }
								onSelect={ ( media ) =>
									updateSlide( index, {
										backgroundImage: media.url,
										backgroundImageId: media.id,
										backgroundImageAlt: media.alt || '',
									} )
								}
								onRemove={ () =>
									updateSlide( index, {
										backgroundImage: '',
										backgroundImageId: 0,
										backgroundImageAlt: '',
									} )
								}
							/>

							<ImageUploader
								label={ __(
									'Top Left Overlay',
									'ambrygen-web'
								) }
								url={ slideItem.overlayImage1 }
								onSelect={ ( media ) =>
									updateSlide( index, {
										overlayImage1: media.url,
										overlayImage1Id: media.id,
										overlayImage1Alt: media.alt || '',
									} )
								}
								onRemove={ () =>
									updateSlide( index, {
										overlayImage1: '',
										overlayImage1Id: 0,
										overlayImage1Alt: '',
									} )
								}
							/>
							<ImageUploader
								label={ __(
									'Bottom Right Overlay',
									'ambrygen-web'
								) }
								url={ slideItem.overlayImage2 }
								onSelect={ ( media ) =>
									updateSlide( index, {
										overlayImage2: media.url,
										overlayImage2Id: media.id,
										overlayImage2Alt: media.alt || '',
									} )
								}
								onRemove={ () =>
									updateSlide( index, {
										overlayImage2: '',
										overlayImage2Id: 0,
										overlayImage2Alt: '',
									} )
								}
							/>

							{ /* <PanelBody
								title={ __( 'Heading Settings', 'ambrygen-web' ) }
								id={ `hero-heading-settings-${ index }` }
							></PanelBody> */ }
							<TagSelector
								label={ __( 'Heading Tag', 'ambrygen-web' ) }
								value={ slideItem.headingTag || 'h2' }
								onChange={ ( value ) =>
									updateSlide( index, 'headingTag', value )
								}
								type="heading"
							/>

							{ /* <PanelBody
								title={ __( 'Primary Button', 'ambrygen-web' ) }
								id={ `hero-primary-button-${ index }` }
							></PanelBody> */ }
							<CtaButtonField
								label={ __( 'Primary Button', 'ambrygen-web' ) }
								value={ slideItem.primarybutton || {} }
								onChange={ ( value ) =>
									updateSlide( index, 'primarybutton', value )
								}
							/>

							{ /* <PanelBody
								title={ __( 'Secondary Button', 'ambrygen-web' ) }
								id={ `hero-secondary-button-${ index }` }
							></PanelBody> */ }
							<CtaButtonField
								label={ __(
									'Secondary Button',
									'ambrygen-web'
								) }
								value={ slideItem.secondarybutton || {} }
								onChange={ ( value ) =>
									updateSlide(
										index,
										'secondarybutton',
										value
									)
								}
							/>

							{ slides.length > 1 && (
								<>
									<Button
										onClick={ ( e ) => {
											e.preventDefault();
											e.stopPropagation();
											removeSlide( index );
										} }
										variant="link"
										isDestructive
										className="hero-section__remove-slide"
									>
										{ __( 'Remove Slide', 'ambrygen-web' ) }
									</Button>
								</>
							) }
						</PanelBody>
					) ) }
				</InspectorControls>
				<div className="container-1340 ">
					<div className="hero-section__slider swiper">
						<div className="swiper-wrapper">
							<div className="hero-section__slide swiper-slide active">
								{ slides.length > 1 && showSliderNav && (
									<div className="hero-section__slide-nav">
										<Button
											onClick={ () =>
												setCurrentSlide(
													currentSlide > 0
														? currentSlide - 1
														: slides.length - 1
												)
											}
											variant="secondary"
											aria-label={ __(
												'Previous slide',
												'ambrygen-web'
											) }
										>
											&larr;
										</Button>
										<span>
											{ currentSlide + 1 } /{ ' ' }
											{ slides.length }
										</span>
										<Button
											onClick={ () =>
												setCurrentSlide(
													currentSlide <
														slides.length - 1
														? currentSlide + 1
														: 0
												)
											}
											variant="secondary"
											aria-label={ __(
												'Next slide',
												'ambrygen-web'
											) }
										>
											&rarr;
										</Button>
									</div>
								) }
								<div className="hero-section__background">
									{ slide.backgroundImage ? (
										<>
											<img
												src={ slide.backgroundImage }
												alt={ slide.backgroundImageAlt }
												className="hero-section__image"
											/>
											{ slide.overlayImage1 && (
												<div className="hero-section__overlay hero-section__overlay--1 hero-section__overlay--top">
													<img
														src={
															slide.overlayImage1
														}
														alt={
															slide.overlayImage1Alt ||
															''
														}
													/>
												</div>
											) }
											{ slide.overlayImage2 && (
												<div className="hero-section__overlay hero-section__overlay--bottom">
													<img
														src={
															slide.overlayImage2
														}
														alt={
															slide.overlayImage2Alt ||
															''
														}
													/>
												</div>
											) }
										</>
									) : (
										<div className="hero-section__placeholder">
											<MediaPlaceholder
												icon="format-image"
												labels={ {
													title: __(
														'Background Image',
														'ambrygen-web'
													),
													instructions: __(
														'Upload or select a background image for this slide.',
														'ambrygen-web'
													),
												} }
												onSelect={ ( media ) =>
													updateSlide( currentSlide, {
														backgroundImage:
															media.url,
														backgroundImageId:
															media.id,
														backgroundImageAlt:
															media.alt || '',
													} )
												}
												accept="image/*"
												allowedTypes={ [ 'image' ] }
											/>
										</div>
									) }
								</div>
								<div className="wrapper">
									<div className="hero-section__content">
										<div className="hero__eyebrow hero-kicker">
											<RichText
												tagName="div"
												value={ slide.eyebrow }
												onChange={ ( value ) =>
													updateSlide(
														currentSlide,
														'eyebrow',
														value
													)
												}
												placeholder={ __(
													'Add Eyebrow Text',
													'ambrygen-web'
												) }
												aria-label={ __(
													'Slide Heading',
													'ambrygen-web'
												) }
												allowedFormats={ [
													'core/bold',
													'core/italic',
												] }
											/>
										</div>
										<div
											className="is-style-gl-s24"
											aria-hidden="true"
										></div>

										<RichText
											tagName={ slide.headingTag || 'h1' }
											className="hero-section__heading heading-2 mb-0"
											value={ slide.heading }
											onChange={ ( value ) =>
												updateSlide(
													currentSlide,
													'heading',
													value
												)
											}
											placeholder={ __(
												'Add Heading…',
												'ambrygen-web'
											) }
											allowedFormats={ [
												'core/bold',
												'core/italic',
												'core/mark',
												'core/text-color',
											] }
										/>

										<div
											className="is-style-gl-s24"
											aria-hidden="true"
										></div>
										<div className="hero-section__description">
											<RichText
												tagName="p"
												value={ slide.content }
												onChange={ ( value ) =>
													updateSlide(
														currentSlide,
														'content',
														value
													)
												}
												placeholder={ __(
													'Add Description',
													'ambrygen-web'
												) }
												aria-label={ __(
													'Slide Description',
													'ambrygen-web'
												) }
												allowedFormats={ [
													'core/bold',
													'core/italic',
													'core/link',
												] }
											/>
										</div>
										<div
											className="is-style-gl-s24"
											aria-hidden="true"
										></div>
										<div className="hero-section__tagline">
											<RichText
												tagName="p"
												value={ slide.tagline }
												onChange={ ( value ) =>
													updateSlide(
														currentSlide,
														'tagline',
														value
													)
												}
												placeholder={ __(
													'Add Tagline',
													'ambrygen-web'
												) }
												allowedFormats={ [
													'core/bold',
													'core/italic',
													'core/link',
												] }
											/>
										</div>
										<div
											className="is-style-gl-s24"
											aria-hidden="true"
										></div>
										<div className="hero-section__actions">
											{ slide.primarybutton?.text && (
												<div
													className={ `hero-section__button site-btn ${
														slide.primarybutton
															.variant || ''
													}` }
												>
													{ slide.primarybutton.text }
												</div>
											) }
											{ slide.secondarybutton?.text && (
												<div
													className={ `hero-section__button site-btn ${
														slide.secondarybutton
															.variant || ''
													}` }
												>
													{
														slide.secondarybutton
															.text
													}
												</div>
											) }
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
