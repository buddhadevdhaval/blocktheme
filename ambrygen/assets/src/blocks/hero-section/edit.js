/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

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
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	useBlockProps,
	URLInput,
} from '@wordpress/block-editor';

/**
 * WordPress UI components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
	BaseControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';

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
 * MediaUploadPanel Component
 *
 * Reusable component for handling media upload, preview, and removal.
 * Follows DRY principle and WordPress VIP best practices.
 *
 * @param {Object}   props             Component properties.
 * @param {string}   props.title       Panel title.
 * @param {string}   props.imageUrl    Current image URL.
 * @param {string}   props.imageAlt    Current image ALT text.
 * @param {number}   props.imageId     Current image ID.
 * @param {Function} props.onSelect    Callback when image is selected.
 * @param {Function} props.onRemove    Callback when image is removed.
 * @param {string}   props.selectLabel Label for the select button.
 * @param {string}   props.id          Unique ID for the control.
 * @return {JSX.Element} MediaUploadPanel component.
 */
function MediaUploadPanel({
	title,
	imageUrl,
	imageAlt,
	imageId,
	onSelect,
	onRemove,
	id,
	selectLabel = __('Select Image', 'ambrygen-web'),
}) {
	return (
		<PanelBody title={title} initialOpen={false}>
			<PanelRow>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelect}
						allowedTypes={['image']}
						value={imageId}
						render={({ open }) => (
							<BaseControl label={title} id={id}>
								{imageUrl ? (
									<>
										<div
											className="media-preview-wrapper"
											style={{ marginBottom: '10px' }}
										>
											<img
												src={imageUrl}
												alt={
													imageAlt ||
													__(
														'Image preview',
														'ambrygen-web'
													)
												}
												style={{
													maxWidth: '100%',
													height: 'auto',
													borderRadius: '8px',
												}}
											/>
										</div>
										<div
											style={{
												display: 'flex',
												gap: '8px',
											}}
										>
											<Button
												onClick={open}
												variant="secondary"
												isSmall
											>
												{__(
													'Replace',
													'ambrygen-web'
												)}
											</Button>
											<Button
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													onRemove();
												}}
												variant="link"
												isDestructive
											>
												{__(
													'Remove',
													'ambrygen-web'
												)}
											</Button>
										</div>
									</>
								) : (
									<Button
										onClick={open}
										variant="secondary"
									>
										{selectLabel}
									</Button>
								)}
							</BaseControl>
						)}
					/>
				</MediaUploadCheck>
			</PanelRow>
		</PanelBody>
	);
}

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
export default function Edit({ attributes, setAttributes }) {
	const { slides, showSliderNav, showSliderDots, autoplay, autoplayDelay } =
		attributes;

	const [currentSlide, setCurrentSlide] = useState(0);

	/**
	 * Updates a specific slide's property or properties.
	 *
	 * @param {number}        index        Slide index.
	 * @param {string|Object} keyOrUpdates Property key or object of updates.
	 * @param {*}             [value]      New value (if keyOrUpdates is a string).
	 */
	const updateSlide = useCallback(
		(index, keyOrUpdates, value) => {
			const newSlides = [...slides];
			if (typeof keyOrUpdates === 'string') {
				newSlides[index] = {
					...newSlides[index],
					[keyOrUpdates]: value,
				};
			} else {
				newSlides[index] = {
					...newSlides[index],
					...keyOrUpdates,
				};
			}
			setAttributes({ slides: newSlides });
		},
		[slides, setAttributes]
	);

	/**
	 * Adds a new slide.
	 */
	const addSlide = useCallback(() => {
		const newSlides = [
			...slides,
			{
				backgroundImage: '',
				backgroundImageId: 0,
				backgroundImageAlt: '',
				heading: '',
				content: '',
				tagline: '',
				buttonPrimaryText: 'Start Your Order',
				buttonPrimaryUrl: '#',
				buttonSecondaryText: 'Who We Are',
				buttonSecondaryUrl: '#',
			},
		];
		setAttributes({ slides: newSlides });
		setCurrentSlide(newSlides.length - 1);
	}, [slides, setAttributes]);

	/**
	 * Removes a slide.
	 *
	 * @param {number} index Slide index to remove.
	 */
	const removeSlide = useCallback(
		(index) => {
			if (slides.length <= 1) {
				return;
			}
			const newSlides = slides.filter((_, i) => i !== index);
			setAttributes({ slides: newSlides });
			if (currentSlide >= newSlides.length) {
				setCurrentSlide(newSlides.length - 1);
			}
		},
		[slides, currentSlide, setAttributes]
	);

	/**
	 * Handles background image selection for a slide.
	 *
	 * @param {number} index Slide index.
	 * @param {Object} media Selected media object.
	 */
	const onSelectSlideImage = useCallback(
		(index, media) => {
			const newSlides = [...slides];
			newSlides[index] = {
				...newSlides[index],
				backgroundImage: media.url,
				backgroundImageId: media.id,
				backgroundImageAlt: media.alt || '',
			};
			setAttributes({ slides: newSlides });
		},
		[slides, setAttributes]
	);

	const blockProps = useBlockProps({
		className: 'hero-section',
	});

	const slide = slides[currentSlide] || slides[0];

	return (
		<>
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody
						title={__('Slider Settings', 'ambrygen-web')}
						initialOpen={false}
					>
						<ToggleControl
							label={__(
								'Show Navigation Arrows',
								'ambrygen-web'
							)}
							checked={showSliderNav}
							onChange={(value) =>
								setAttributes({ showSliderNav: value })
							}
						/>
						<ToggleControl
							label={__(
								'Show Pagination Dots',
								'ambrygen-web'
							)}
							checked={showSliderDots}
							onChange={(value) =>
								setAttributes({ showSliderDots: value })
							}
						/>
						<ToggleControl
							label={__('Autoplay', 'ambrygen-web')}
							checked={autoplay}
							onChange={(value) =>
								setAttributes({ autoplay: value })
							}
						/>
						{autoplay && (
							<RangeControl
								label={__(
									'Autoplay Delay (ms)',
									'ambrygen-web'
								)}
								value={autoplayDelay}
								onChange={(value) =>
									setAttributes({ autoplayDelay: value })
								}
								min={1000}
								max={10000}
								step={500}
							/>
						)}
					</PanelBody>

					{slides.map((slideItem, index) => (
						<PanelBody
							key={index}
							title={__('Slide Settings', 'ambrygen-web')}
							initialOpen={index === currentSlide}
							onToggle={() => setCurrentSlide(index)}
						>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										onSelectSlideImage(index, media)
									}
									allowedTypes={['image']}
									value={slideItem.backgroundImageId}
									render={({ open }) => (
										<BaseControl
											label={__(
												'Background Image',
												'ambrygen-web'
											)}
											id={`hero-bg-image-${index}`}
										>
											{slideItem.backgroundImage ? (
												<>
													<div
														className="media-preview-wrapper"
														style={{
															marginBottom:
																'10px',
														}}
													>
														<img
															src={
																slideItem.backgroundImage
															}
															alt={
																slideItem.backgroundImageAlt ||
																__(
																	'Slide background',
																	'ambrygen-web'
																)
															}
															style={{
																maxWidth:
																	'100%',
																height: 'auto',
																borderRadius:
																	'8px',
															}}
														/>
													</div>
													<div
														style={{
															display: 'flex',
															gap: '8px',
														}}
													>
														<Button
															onClick={open}
															variant="secondary"
															isSmall
														>
															{__(
																'Replace',
																'ambrygen-web'
															)}
														</Button>
														<Button
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																updateSlide(
																	index,
																	{
																		backgroundImage:
																			'',
																		backgroundImageId: 0,
																		backgroundImageAlt:
																			'',
																	}
																);
															}}
															variant="link"
															isDestructive
															isSmall
														>
															{__(
																'Remove',
																'ambrygen-web'
															)}
														</Button>
													</div>
												</>
											) : (
												<Button
													onClick={open}
													variant="secondary"
												>
													{__(
														'Upload Image',
														'ambrygen-web'
													)}
												</Button>
											)}
										</BaseControl>
									)}
								/>
							</MediaUploadCheck>
							<MediaUploadPanel
								title={__(
									'Top Left Overlay',
									'ambrygen-web'
								)}
								id={`hero-overlay-1-${index}`}
								imageUrl={slideItem.overlayImage1}
								onSelect={(media) =>
									updateSlide(index, {
										overlayImage1: media.url,
										overlayImage1Id: media.id,
										overlayImage1Alt: media.alt || '',
									})
								}
								onRemove={() => {
									updateSlide(index, {
										overlayImage1: '',
										overlayImage1Id: 0,
										overlayImage1Alt: '',
									});
								}}
							/>

							<MediaUploadPanel
								title={__(
									'Bottom Right Overlay',
									'ambrygen-web'
								)}
								id={`hero-overlay-2-${index}`}
								imageUrl={slideItem.overlayImage2}
								onSelect={(media) =>
									updateSlide(index, {
										overlayImage2: media.url,
										overlayImage2Id: media.id,
										overlayImage2Alt: media.alt || '',
									})
								}
								onRemove={() => {
									updateSlide(index, {
										overlayImage2: '',
										overlayImage2Id: 0,
										overlayImage2Alt: '',
									});
								}}
							/>

							<BaseControl
								label={__('Primary Button', 'ambrygen-web')}
								id={`hero-primary-button-${index}`}
							>
								<TextControl
									value={slideItem.buttonPrimaryText}
									onChange={(value) =>
										updateSlide(
											index,
											'buttonPrimaryText',
											value
										)
									}
									placeholder={__(
										'Button Text',
										'ambrygen-web'
									)}
								/>
								<URLInput
									value={slideItem.buttonPrimaryUrl}
									onChange={(value) =>
										updateSlide(
											index,
											'buttonPrimaryUrl',
											value
										)
									}
								/>
							</BaseControl>

							<BaseControl
								label={__(
									'Secondary Button',
									'ambrygen-web'
								)}
								id={`hero-secondary-button-${index}`}
							>
								<TextControl
									value={slideItem.buttonSecondaryText}
									onChange={(value) =>
										updateSlide(
											index,
											'buttonSecondaryText',
											value
										)
									}
									placeholder={__(
										'Button Text',
										'ambrygen-web'
									)}
								/>
								<URLInput
									value={slideItem.buttonSecondaryUrl}
									onChange={(value) =>
										updateSlide(
											index,
											'buttonSecondaryUrl',
											value
										)
									}
								/>
							</BaseControl>

							{slides.length > 1 && (
								<Button
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										removeSlide(index);
									}}
									variant="link"
									isDestructive
									style={{ marginTop: '10px' }}
								>
									{__('Remove Slide', 'ambrygen-web')}
								</Button>
							)}
						</PanelBody>
					))}

					<PanelBody>
						<Button
							onClick={addSlide}
							variant="secondary"
							isLarge
						>
							{__('+ Add Slide', 'ambrygen-web')}
						</Button>
					</PanelBody>
				</InspectorControls>
				<div className="container-1340 ">

					<div className="hero-section__slider swiper">
						<div className="swiper-wrapper">
							<div className="hero-section__slide swiper-slide active">
								{slides.length > 1 && showSliderNav && (
									<div className="hero-section__slide-nav">
										<Button
											onClick={() =>
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
											{currentSlide + 1} /{' '}
											{slides.length}
										</span>
										<Button
											onClick={() =>
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
								)}
								<div className="hero-section__background">
									{slide.backgroundImage ? (
										<>
											<img
												src={
													slide.backgroundImage
												}
												alt={
													slide.backgroundImageAlt
												}
												className="hero-section__image"
											/>
											{slide.overlayImage1 && (
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
											)}
											{slide.overlayImage2 && (
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
											)}
										</>
									) : (
										<div className="hero-section__placeholder">
											{__(
												'Select a background image',
												'ambrygen-web'
											)}
										</div>
									)}
								</div>
								<div className='wrapper'>
									<div className="hero-section__content">
										<div className="hero-section__heading heading-2">
											<RichText
												tagName="div"
												value={slide.heading}
												onChange={(value) =>
													updateSlide(
														currentSlide,
														'heading',
														value
													)
												}
												placeholder={__(
													'Add Heading…',
													'ambrygen-web'
												)}
												aria-label={__(
													'Slide Heading',
													'ambrygen-web'
												)}
												allowedFormats={[
													'core/bold',
													'core/italic',
												]}
											/>
										</div>

										<div className="hero-section__description">
											<RichText
												tagName="p"
												value={slide.content}
												onChange={(value) =>
													updateSlide(
														currentSlide,
														'content',
														value
													)
												}
												placeholder={__(
													'Add Description',
													'ambrygen-web'
												)}
												aria-label={__(
													'Slide Description',
													'ambrygen-web'
												)}
												allowedFormats={[
													'core/bold',
													'core/italic',
													'core/link',
												]}
											/>
										</div>

										<div className="hero-section__tagline">
											<RichText
												tagName="p"
												value={slide.tagline}
												onChange={(value) =>
													updateSlide(
														currentSlide,
														'tagline',
														value
													)
												}
												placeholder={__(
													'Add Tagline…',
													'ambrygen-web'
												)}
												aria-label={__(
													'Slide Tagline',
													'ambrygen-web'
												)}
											/>
										</div>

										<div className="hero-section__actions">
											{slide.buttonSecondaryText && (
												<div className="hero-section__button site-btn is-style-site-tertiary-btn is-style-site-trailing-icon">
													{
														slide.buttonSecondaryText
													}
												</div>
											)}
											{slide.buttonPrimaryText && (
												<div className="hero-section__button site-btn is-style-site-trailing-icon">
													{slide.buttonPrimaryText}
												</div>
											)}
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
