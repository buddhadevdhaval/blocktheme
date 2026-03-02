/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */

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
} from '@wordpress/components';

import {
	TagSelector,
	ImageUploader,
	CtaButtonField,
} from '../_shared/components';
import { t } from '../_shared/utils';

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
	const {
		slides,
		showSliderNav,
		showSliderDots,
		autoplay,
		autoplayDelay,
		primarybutton,
		secondarybutton,
	} = attributes;

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
				backgroundImage: '',
				backgroundImageId: 0,
				backgroundImageAlt: '',
				heading: '',
				eyebrow: '',
				headingTag: '',
				content: '',
				buttonPrimaryText: 'Start Your Order',
				buttonPrimaryUrl: '#',
				primarybutton,
				secondarybutton,
				buttonSecondaryText: 'Who We Are',
				buttonSecondaryUrl: '#',
			},
		];
		setAttributes( { slides: newSlides } );
		setCurrentSlide( newSlides.length - 1 );
	}, [ slides, setAttributes, primarybutton, secondarybutton ] );

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
			<div { ...blockProps }>
				<InspectorControls>
					<PanelBody
						title={ t( 'Slider Settings' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ t( 'Show Navigation Arrows' ) }
							checked={ showSliderNav }
							onChange={ ( value ) =>
								setAttributes( { showSliderNav: value } )
							}
						/>
						<ToggleControl
							label={ t( 'Show Pagination Dots' ) }
							checked={ showSliderDots }
							onChange={ ( value ) =>
								setAttributes( { showSliderDots: value } )
							}
						/>
						<ToggleControl
							label={ t( 'Autoplay' ) }
							checked={ autoplay }
							onChange={ ( value ) =>
								setAttributes( { autoplay: value } )
							}
						/>

						{ autoplay && (
							<RangeControl
								label={ t( 'Autoplay Delay (Milliseconds)' ) }
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
							key={ index }
							title={ t( `Slide ${ index + 1 }` ) }
							initialOpen={ index === currentSlide }
							onToggle={ () => setCurrentSlide( index ) }
						>
							{ slides.length > 1 && (
								<div
									style={ {
										display: 'flex',
										justifyContent: 'flex-end',
										gap: '8px',
										marginTop: '10px',
									} }
								>
									{ /* Move Slide Up */ }
									<Button
										isSmall
										disabled={ index === 0 }
										onClick={ ( e ) => {
											e.preventDefault();
											e.stopPropagation();
											moveSlide( index, -1 ); // Move up
										} }
									>
										{ t( 'Move Up' ) }
									</Button>

									{ /* Move Slide Down */ }
									<Button
										isSmall
										disabled={ index === slides.length - 1 }
										onClick={ ( e ) => {
											e.preventDefault();
											e.stopPropagation();
											moveSlide( index, 1 ); // Move down
										} }
									>
										{ t( 'Move Down' ) }
									</Button>
								</div>
							) }

							<ImageUploader
								label={ t( 'Background Image' ) }
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
								label={ t( 'Top Left Overlay' ) }
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
								label={ t( 'Bottom Right Overlay' ) }
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

							<PanelBody
								label={ t( 'Primary Button' ) }
								id={ `hero-primary-button-${ index }` }
							>
								<TagSelector
									label={ t( 'Heading Tag' ) }
									value={ slideItem.headingTag || 'h2' }
									onChange={ ( value ) =>
										updateSlide(
											index,
											'headingTag',
											value
										)
									}
								/>

								<CtaButtonField
									label={ t( 'Primary Button' ) }
									value={ slideItem.primarybutton || {} }
									onChange={ ( value ) =>
										updateSlide(
											index,
											'primarybutton',
											value
										)
									}
								/>
							</PanelBody>

							<PanelBody
								label={ t( 'Secondary Button' ) }
								id={ `hero-secondary-button-${ index }` }
							>
								<CtaButtonField
									label={ t( 'Secondary Button' ) }
									value={ slideItem.secondarybutton || {} }
									onChange={ ( value ) =>
										updateSlide(
											index,
											'secondarybutton',
											value
										)
									}
								/>
							</PanelBody>

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
										style={ { marginTop: '10px' } }
									>
										{ t( 'Remove Slide' ) }
									</Button>
								</>
							) }
						</PanelBody>
					) ) }

					<PanelBody>
						<Button
							onClick={ addSlide }
							variant="secondary"
							isLarge
						>
							{ t( '+ Add Slide' ) }
						</Button>
					</PanelBody>
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
											<img
												src={
													window?.ambrygenAssets
														?.defaultImageUrl
												}
												alt={ t(
													'Default background image'
												) }
												className="hero-section__image"
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
												placeholder={ t(
													'Add Eyebrow Text'
												) }
												aria-label={ t(
													'Slide Heading'
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
											placeholder={ t( 'Add Heading…' ) }
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
												placeholder={ t(
													'Add Description'
												) }
												aria-label={ t(
													'Slide Description'
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
