/**
 * WordPress dependencies for block editor functionality.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Chevron Right Icon Component
 */
const ChevronRightIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M7.5 15L12.5 10L7.5 5"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * Save component for the Hero Section block.
 *
 * Renders the saved block content on the frontend with:
 * - Logo overlay on background image
 * - Slider with multiple slides
 * - Per-slide: background image, heading, content, tagline, buttons
 * - Slider navigation (arrows and dots)
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props            Block properties.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
export default function Save( { attributes } ) {
	const {
		slides,
		showSliderNav,

		showSliderDots,
		autoplay,
		autoplayDelay,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'hero-section',
	} );

	return (
		<div { ...blockProps }>
			<div
				className="hero-section__slider swiper container-1340"
				data-swiper-config={ JSON.stringify( {
					autoplay: autoplay ? { delay: autoplayDelay } : false,
					navigation: showSliderNav,
					pagination: showSliderDots,
				} ) }
			>
				<div className="swiper-wrapper">
					{ slides.map( ( slide, index ) => (
						<div
							key={ index }
							className="hero-section__slide swiper-slide"
						>
							<div className="hero-section__background">
								{ slide.backgroundImage && (
									<>
										<img
											src={ slide.backgroundImage }
											alt={
												slide.backgroundImageAlt || ''
											}
											className="hero-section__image"
											loading={
												index === 0 ? 'eager' : 'lazy'
											}
										/>
										{ slide.overlayImage1 && (
											<div className="hero-section__overlay hero-section__overlay--1 hero-section__overlay--top">
												<img
													src={ slide.overlayImage1 }
													alt={
														slide.overlayImage1Alt ||
														''
													}
													loading="lazy"
												/>
											</div>
										) }
										{ slide.overlayImage2 && (
											<div className="hero-section__overlay hero-section__overlay--bottom">
												<img
													src={ slide.overlayImage2 }
													alt={
														slide.overlayImage2Alt ||
														''
													}
													loading="lazy"
												/>
											</div>
										) }
									</>
								) }
							</div>
							<div className="wrapper">
								<div className="hero-section__content">
									{ slide.heading && (
										<div className="hero-section__heading heading-2 mb-0">
											<RichText.Content
												value={ slide.heading }
											/>
										</div>
									) }

									{ slide.content && (
										<div className="hero-section__description">
											<RichText.Content
												tagName="p"
												value={ slide.content }
											/>
										</div>
									) }

									{ slide.tagline && (
										<div className="hero-section__tagline">
											<RichText.Content
												tagName="p"
												value={ slide.tagline }
											/>
										</div>
									) }

									<div className="hero-section__actions">
										{ slide.buttonSecondaryText && (
											<a
												href={
													slide.buttonSecondaryUrl
												}
												className="hero-section__button site-btn is-style-site-tertiary-btn is-style-site-trailing-icon"
											>
												{ slide.buttonSecondaryText }
											</a>
										) }

										{ slide.buttonPrimaryText && (
											<a
												href={ slide.buttonPrimaryUrl }
												className="hero-section__button site-btn is-style-site-trailing-icon"
											>
												{ slide.buttonPrimaryText }
											</a>
										) }
									</div>
								</div>
							</div>
						</div>
					) ) }
				</div>
				{ showSliderNav && (
					<>
						<div className="swiper-button-prev"></div>
						<div className="swiper-button-next"></div>
					</>
				) }
				{ showSliderDots && <div className="swiper-pagination"></div> }
			</div>
		</div>
	);
}
