import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	CheckboxControl,
	SelectControl,
	Spinner,
	Button,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import Swiper from 'swiper/bundle';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		title,
		intro,
		headingLevel = 'h2',
		memberTypes = [],
		selectionMode = 'manual',
		showNavigation = true,
		showPagination = false,
		autoplay = false,
	} = attributes;

	const { replaceInnerBlocks, insertBlock } =
		useDispatch('core/block-editor');

	const memberTypeTerms = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', 'member_type', {
				per_page: -1,
				hide_empty: false,
			}),
		[]
	);

	const allTeamPosts = useSelect(
		(select) =>
			select('core').getEntityRecords('postType', 'our_team', {
				per_page: -1,
				post_status: 'publish',
				_fields: 'id,member_type',
			}),
		[]
	);

	useEffect(() => {
		if (
			selectionMode !== 'taxonomy' ||
			!memberTypes.length ||
			!allTeamPosts
		) {
			return;
		}

		const filteredPosts = allTeamPosts.filter((post) =>
			post.member_type?.some((id) => memberTypes.includes(id))
		);

		const newBlocks = filteredPosts.map((post) =>
			createBlock('ambrygen/image-gallery-slider-item', {
				postId: post.id,
			})
		);

		replaceInnerBlocks(clientId, newBlocks, false);
	}, [
		selectionMode,
		memberTypes,
		allTeamPosts,
		clientId,
		replaceInnerBlocks,
	]);

	const containerRef = useRef(null);
	const swiperInstances = useRef([]);
	const innerBlocksCount = useSelect((select) => select('core/block-editor').getBlocks(clientId).length, [clientId]);

	useEffect(() => {
		if (!containerRef.current) return;

		const initSwipers = () => {
			if (!containerRef.current) return;
			const sliders = containerRef.current.querySelectorAll('.image-gallery-slider-item__media-slider:not(.swiper-initialized)');

			sliders.forEach((sliderElement) => {
				const slides = sliderElement.querySelectorAll('.swiper-slide');
				if (slides.length === 0) return; // Wait until slides are loaded

				swiperInstances.current.push(
					new Swiper(sliderElement, {
						slidesPerView: 1,
						spaceBetween: 0,
						loop: true,
						autoplay: autoplay ? { delay: 3000 } : false,
						navigation: showNavigation
							? {
								nextEl: sliderElement.querySelector('.custom-next'),
								prevEl: sliderElement.querySelector('.custom-prev'),
							}
							: false,
						pagination: showPagination
							? {
								el: sliderElement.querySelector('.swiper-pagination'),
								clickable: true,
							}
							: false,
						observer: true,
						observeParents: true,
					})
				);
			});
		};

		// Initial check
		const timer = setTimeout(initSwipers, 300);

		// Watch for async render updates from child blocks fetching API data
		const observer = new MutationObserver(() => {
			initSwipers();
		});

		observer.observe(containerRef.current, {
			childList: true,
			subtree: true,
		});

		return () => {
			clearTimeout(timer);
			observer.disconnect();
			swiperInstances.current.forEach(instance => {
				if (instance && typeof instance.destroy === 'function') {
					instance.destroy(true, true);
				}
			});
			swiperInstances.current = [];
		};
	}, [innerBlocksCount, showNavigation, showPagination, autoplay]);

	const TagName = headingLevel;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Heading Settings', 'ambrygen-web')}>
					<SelectControl
						label={__('Heading Level', 'ambrygen-web')}
						value={headingLevel}
						options={[
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						]}
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
					/>
				</PanelBody>

				<PanelBody title={__('Team Selection Mode', 'ambrygen-web')} initialOpen>
					<ToggleControl
						label={__('Select by Member Type', 'ambrygen-web')}
						checked={selectionMode === 'taxonomy'}
						onChange={(enabled) =>
							setAttributes({
								selectionMode: enabled ? 'taxonomy' : 'manual',
								memberTypes: [],
							})
						}
					/>

					{selectionMode === 'taxonomy' &&
						(!memberTypeTerms ? (
							<Spinner />
						) : (
							memberTypeTerms.map((term) => (
								<CheckboxControl
									key={term.id}
									label={term.name}
									checked={memberTypes.includes(term.id)}
									onChange={(checked) =>
										setAttributes({
											memberTypes: checked
												? [...memberTypes, term.id]
												: memberTypes.filter(
													(id) => id !== term.id
												),
										})
									}
								/>
							))
						))}
				</PanelBody>

				<PanelBody title={__('Image Slider Settings', 'ambrygen-web')} initialOpen>
					<ToggleControl
						label={__('Show Navigation', 'ambrygen-web')}
						checked={showNavigation}
						onChange={(value) =>
							setAttributes({ showNavigation: value })
						}
					/>

					<ToggleControl
						label={__('Show Pagination', 'ambrygen-web')}
						checked={showPagination}
						onChange={(value) =>
							setAttributes({ showPagination: value })
						}
					/>

					<ToggleControl
						label={__('Autoplay', 'ambrygen-web')}
						checked={autoplay}
						onChange={(value) =>
							setAttributes({ autoplay: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()} ref={containerRef}>
				<div className="image-gallery-slider">
					<div className="image-gallery-slider__header heading-center center-align">
						<RichText
							tagName={headingLevel}
							className="image-gallery-slider__title heading-2 mb-0 block-title"
							value={title}
							onChange={(value) =>
								setAttributes({ title: value })
							}
							placeholder={__('Add title...', 'ambrygen-web')}
						/>

						<div className="is-style-gl-s16" aria-hidden="true"></div>
						<RichText
							tagName="div"
							className="image-gallery-slider__intro subtitle1-reg"
							value={intro}
							onChange={(value) =>
								setAttributes({ intro: value })
							}
							placeholder={__('Add intro...', 'ambrygen-web')}
						/>
					</div>

					<div className="is-style-gl-s32" aria-hidden="true"></div>

					<div className="image-gallery-slider__items">
						<InnerBlocks
							allowedBlocks={['ambrygen/image-gallery-slider-item']}
							orientation="horizontal"
							renderAppender={() => false}
						/>
					</div>

					{selectionMode !== 'taxonomy' && (
						<div
							className="image-gallery-slider__add-item"
							style={{ marginTop: '20px', textAlign: 'center' }}
						>
							<Button
								variant="primary"
								onClick={() => {
									const newBlock = createBlock(
										'ambrygen/image-gallery-slider-item',
										{}
									);
									insertBlock(newBlock, undefined, clientId);
								}}
							>
								{__('+ Add Gallery Item', 'ambrygen-web')}
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
