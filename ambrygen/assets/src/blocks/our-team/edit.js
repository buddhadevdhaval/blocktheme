import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	CheckboxControl,
	Notice,
	PanelBody,
	SearchControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __, sprintf } from '@wordpress/i18n';
import {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { TagSelector } from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

const LAYOUT_VARIANTS = [
	{
		label: __('Grid View', 'ambrygen-web'),
		value: 'grid-view',
		image: getThemeAssetUrl('/assets/src/images/our-team/grid-view.png'),
	},
	{
		label: __('Slider View', 'ambrygen-web'),
		value: 'slider-view',
		image: getThemeAssetUrl(
			'/assets/src/images/our-team/slider-view.png'
		),
	},
];

const TEAM_MEMBERS_PER_PAGE = 20;
const WP_REST_MAX_PER_PAGE = 100;
const MAX_TEAM_MEMBER_TYPE_PAGES = 2; // Reduced to 2 (200 members) to prevent Gutenberg from crashing when rendering InnerBlocks.
const MAX_SWIPER_INIT_RETRIES = 20;
const SWIPER_SPACE_BETWEEN = 20;
const AUTOPLAY_DELAY = 3000;
const SEARCH_DEBOUNCE_MS = 300;

const normalizeVariation = (variation) =>
	variation === 'slider-view' ? 'slider-view' : 'grid-view';

const ITEM_BLOCK_NAME = 'ambrygen/our-team-item';

const chunkIds = (ids, size = WP_REST_MAX_PER_PAGE) => {
	const chunks = [];

	for (let index = 0; index < ids.length; index += size) {
		chunks.push(ids.slice(index, index + size));
	}

	return chunks;
};

const getPostTitle = (post) => {
	if (typeof post?.title === 'string') {
		return post.title;
	}

	return post?.title?.rendered || post?.title?.raw || '';
};

/**
 * Edit component for the Our Team block.
 *
 * @param {Object}   props               The block properties.
 * @param {Object}   props.attributes    The block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @param {string}   props.clientId      The block client ID.
 * @return {JSX.Element} The edit component rendering.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const sliderRef = useRef(null);
	const swiperInstance = useRef(null);
	const [memberSearchInput, setMemberSearchInput] = useState('');
	const [debouncedMemberSearchInput, setDebouncedMemberSearchInput] =
		useState('');

	const {
		blockId,
		title,
		intro,
		headingLevel = 'h2',
		variation = 'grid-view',
		memberTypes = [],
		selectionMode = 'manual',
		showNavigation = true,
		showPagination = true,
		autoplay = false,
	} = attributes;

	const normalizedVariation = normalizeVariation(variation);
	const isSliderView = normalizedVariation === 'slider-view';
	const deferredSelectionMode = useDeferredValue(selectionMode);
	const deferredMemberTypes = useDeferredValue(memberTypes);
	const TagName = headingLevel || 'h2';
	const blockProps = useBlockProps({
		className: isSliderView ? undefined : 'wrapper',
	});
	const allowedBlocks = ['ambrygen/our-team-item'];
	const blockClass = isSliderView ? 'our-leadership' : 'our-team';
	const { replaceInnerBlocks, insertBlocks, removeBlocks } =
		useDispatch('core/block-editor');

	const memberTypeTerms = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', 'member_type', {
				per_page: WP_REST_MAX_PER_PAGE,
				hide_empty: false,
				_fields: 'id,name',
			}),
		[]
	);

	const manualTeamPosts = useSelect(
		(select) => {
			if (isSliderView && selectionMode === 'taxonomy') {
				return [];
			}

			const query = {
				per_page: TEAM_MEMBERS_PER_PAGE,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
				_fields: 'id,title',
			};

			if (debouncedMemberSearchInput) {
				query.search = debouncedMemberSearchInput;
			}

			return select('core').getEntityRecords(
				'postType',
				'author',
				query
			);
		},
		[isSliderView, selectionMode, debouncedMemberSearchInput]
	);

	const taxonomyTeamPosts = useSelect(
		(select) => {
			if (
				!isSliderView ||
				deferredSelectionMode !== 'taxonomy' ||
				!deferredMemberTypes.length
			) {
				return [];
			}

			const posts = [];

			for (let page = 1; page <= MAX_TEAM_MEMBER_TYPE_PAGES; page++) {
				const pagePosts = select('core').getEntityRecords(
					'postType',
					'author',
					{
						per_page: WP_REST_MAX_PER_PAGE,
						page,
						status: 'publish',
						member_type: deferredMemberTypes,
						_fields: 'id',
					}
				);

				if (!Array.isArray(pagePosts)) {
					return page === 1 ? null : posts;
				}

				posts.push(...pagePosts);

				if (pagePosts.length < WP_REST_MAX_PER_PAGE) {
					break;
				}
			}

			return posts;
		},
		[isSliderView, deferredSelectionMode, deferredMemberTypes]
	);

	const isResolvingTaxonomyPosts = useSelect(
		(select) => {
			if (
				!isSliderView ||
				deferredSelectionMode !== 'taxonomy' ||
				!deferredMemberTypes.length
			) {
				return false;
			}

			const { isResolving } = select('core/data');

			for (let page = 1; page <= MAX_TEAM_MEMBER_TYPE_PAGES; page++) {
				const query = {
					per_page: WP_REST_MAX_PER_PAGE,
					page,
					status: 'publish',
					member_type: deferredMemberTypes,
					_fields: 'id',
				};

				if (
					isResolving('core', 'getEntityRecords', [
						'postType',
						'author',
						query,
					])
				) {
					return true;
				}
			}

			return false;
		},
		[isSliderView, deferredSelectionMode, deferredMemberTypes]
	);

	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId),
		[clientId]
	);
	const selectedPostIds = useMemo(
		() =>
			innerBlocks
				.map((block) => Number(block.attributes?.postId) || 0)
				.filter(Boolean),
		[innerBlocks]
	);
	const hasReachedMemberTypeLimit =
		Array.isArray(taxonomyTeamPosts) &&
		taxonomyTeamPosts.length >=
		MAX_TEAM_MEMBER_TYPE_PAGES * WP_REST_MAX_PER_PAGE;
	const resolvedPostsCache = useRef({});

	const selectedTeamPostsById = useSelect(
		(select) => {
			if (!selectedPostIds.length) {
				return {};
			}

			const currentBatch = chunkIds(selectedPostIds).reduce(
				(postsById, postIds) => {
					const posts = select('core').getEntityRecords(
						'postType',
						'author',
						{
							include: postIds,
							per_page: postIds.length,
							orderby: 'include',
							context: 'edit',
							_fields: 'id,title',
						}
					);

					if (Array.isArray(posts)) {
						posts.forEach((post) => {
							postsById[post.id] = post;
							resolvedPostsCache.current[post.id] = post; // Save to persistent cache
						});
					}

					return postsById;
				},
				{}
			);

			// Merge current results with previously resolved posts to prevent flashing!
			return {
				...resolvedPostsCache.current,
				...currentBatch,
			};
		},
		[selectedPostIds]
	);
	const innerBlockCount = innerBlocks.length;
	const hasInnerBlocks = innerBlockCount > 0;
	const memberOptions = useMemo(() => {
		if (!manualTeamPosts) {
			return [];
		}

		return manualTeamPosts
			.filter((post) => !selectedPostIds.includes(post.id))
			.map((post) => {
				const title = decodeEntities(getPostTitle(post)).trim();

				return {
					label:
						title ||
						sprintf(
							/* translators: %d: team member post ID. */
							__('Team Member #%d', 'ambrygen-web'),
							post.id
						),
					value: String(post.id),
				};
			});
	}, [manualTeamPosts, selectedPostIds]);
	const selectedMemberOptions = useMemo(
		() =>
			selectedPostIds.map((postId) => {
				const post = selectedTeamPostsById[postId];
				const title = decodeEntities(getPostTitle(post)).trim();

				return {
					label:
						title ||
						sprintf(
							/* translators: %d: team member post ID. */
							__('Team Member #%d', 'ambrygen-web'),
							postId
						),
					value: postId,
					isLoading: !post,
				};
			}),
		[selectedPostIds, selectedTeamPostsById]
	);
	const hasMemberOptions = memberOptions.length > 0;

	const toggleMemberBlock = (postId, isSelected) => {
		if (isSelected) {
			if (selectedPostIds.includes(postId)) {
				return;
			}

			insertBlocks(
				createBlock(ITEM_BLOCK_NAME, {
					postId,
				}),
				innerBlockCount,
				clientId,
				false
			);
			return;
		}

		const blocksToRemove = innerBlocks
			.filter(
				(block) =>
					(Number(block.attributes?.postId) || 0) === postId
			)
			.map((block) => block.clientId);

		if (blocksToRemove.length) {
			removeBlocks(blocksToRemove, false);
		}
	};

	const resetSliderPreview = useCallback(() => {
		if (swiperInstance.current) {
			swiperInstance.current.destroy(true, true);
			swiperInstance.current = null;
		}

		const sliderEl = sliderRef.current;
		const sliderDiv = sliderEl?.querySelector(
			'.block-editor-block-list__layout'
		);

		sliderEl?.classList.remove('swiper');
		sliderDiv?.classList.remove('swiper-wrapper');
		sliderDiv?.removeAttribute('style');
		sliderDiv
			?.querySelectorAll('.swiper-slide')
			.forEach((slide) => slide.removeAttribute('style'));
	}, []);

	const changeVariation = (value) => {
		const nextVariation = normalizeVariation(value);

		if (nextVariation === normalizedVariation) {
			return;
		}

		resetSliderPreview();

		const convertedBlocks = innerBlocks
			.map((block) => Number(block.attributes?.postId) || 0)
			.filter(Boolean)
			.map((postId) =>
				createBlock(ITEM_BLOCK_NAME, {
					postId,
				})
			);

		replaceInnerBlocks(clientId, convertedBlocks, false);
		setAttributes({
			variation: nextVariation,
			selectionMode: 'manual',
			memberTypes: [],
		});
		setMemberSearchInput('');
	};

	useEffect(() => {
		const clientIdSuffix = clientId.slice(0, 8);
		const expectedId = `section-${clientIdSuffix}`;

		if (!blockId) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [clientId, blockId, setAttributes]);

	useEffect(() => {
		const timeoutId = setTimeout(
			() => setDebouncedMemberSearchInput(memberSearchInput.trim()),
			SEARCH_DEBOUNCE_MS
		);

		return () => clearTimeout(timeoutId);
	}, [memberSearchInput]);

	useEffect(() => {
		if (
			!isSliderView ||
			deferredSelectionMode !== 'taxonomy' ||
			!deferredMemberTypes.length ||
			!taxonomyTeamPosts ||
			isResolvingTaxonomyPosts
		) {
			return;
		}

		const currentPostIds = innerBlocks
			.map((block) => Number(block.attributes?.postId) || 0)
			.filter(Boolean);
		const newPostIds = taxonomyTeamPosts.map((post) => post.id);

		if (
			currentPostIds.length === newPostIds.length &&
			currentPostIds.every((id, index) => id === newPostIds[index])
		) {
			return; // No change needed, prevent destructive unmount!
		}

		const newBlocks = newPostIds.map((postId) =>
			createBlock(ITEM_BLOCK_NAME, { postId })
		);

		replaceInnerBlocks(clientId, newBlocks, false);
	}, [
		isSliderView,
		deferredSelectionMode,
		deferredMemberTypes,
		taxonomyTeamPosts,
		isResolvingTaxonomyPosts,
		clientId,
		innerBlocks,
		replaceInnerBlocks,
	]);

	useEffect(() => {
		if (!isSliderView || !hasInnerBlocks) {
			return;
		}

		let retryCount = 0;
		let animationFrameIds = [];
		let isMounted = true;

		const initSwiper = async () => {
			if (!sliderRef.current) {
				return;
			}

			const sliderEl = sliderRef.current;
			const sliderDiv = sliderEl.querySelector(
				'.block-editor-block-list__layout'
			);

			if (!sliderDiv || sliderDiv.children.length === 0) {
				if (retryCount < MAX_SWIPER_INIT_RETRIES) {
					retryCount++;
					animationFrameIds.push(
						requestAnimationFrame(initSwiper)
					);
				}
				return;
			}

			let Swiper;

			try {
				({ default: Swiper } = await import('swiper/bundle'));
			} catch {
				return;
			}

			if (!isMounted) {
				return;
			}

			const swiperContainer = sliderDiv.parentElement;
			swiperContainer.classList.add('swiper');
			sliderDiv.classList.add('swiper-wrapper');

			if (swiperInstance.current) {
				swiperInstance.current.destroy(true, true);
				swiperInstance.current = null;
			}

			swiperInstance.current = new Swiper(swiperContainer, {
				slidesPerView: 3,
				spaceBetween: SWIPER_SPACE_BETWEEN,
				loop: false,
				observer: true,
				observeParents: true,
				resizeObserver: true,
				allowTouchMove: false,
				navigation: showNavigation
					? {
						nextEl: sliderEl.querySelector('.custom-next'),
						prevEl: sliderEl.querySelector('.custom-prev'),
					}
					: false,
				pagination: showPagination
					? {
						el: sliderEl.querySelector('.swiper-pagination'),
						clickable: true,
					}
					: false,
				autoplay: autoplay
					? {
						delay: AUTOPLAY_DELAY,
						disableOnInteraction: false,
					}
					: false,
			});
		};

		initSwiper();

		return () => {
			isMounted = false;
			animationFrameIds.forEach(cancelAnimationFrame);
			animationFrameIds = [];

			resetSliderPreview();
		};
	}, [
		isSliderView,
		showNavigation,
		showPagination,
		autoplay,
		hasInnerBlocks,
		resetSliderPreview,
	]);

	useEffect(() => {
		if (!isSliderView || !swiperInstance.current) {
			return;
		}

		const animationFrameId = requestAnimationFrame(() => {
			const swiper = swiperInstance.current;

			if (!swiper || swiper.destroyed) {
				return;
			}

			swiper.update();
			swiper.pagination?.render?.();
			swiper.pagination?.update?.();
			swiper.navigation?.update?.();
		});

		return () => cancelAnimationFrame(animationFrameId);
	}, [isSliderView, innerBlockCount]);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Layout Variation', 'ambrygen-web')}
					initialOpen
				>
					<div
						className="layout-variant-selector"
						role="radiogroup"
						aria-label={__(
							'Layout Variation',
							'ambrygen-web'
						)}
					>
						{LAYOUT_VARIANTS.map((item) => (
							<button
								key={item.value}
								type="button"
								role="radio"
								className={`variant-button ${normalizedVariation === item.value
										? 'is-selected'
										: ''
									}`}
								aria-checked={
									normalizedVariation === item.value
								}
								aria-label={sprintf(
									/* translators: %s: layout variation label. */
									__(
										'Select %s layout',
										'ambrygen-web'
									),
									item.label
								)}
								onClick={() =>
									changeVariation(item.value)
								}
							>
								<img
									src={item.image}
									alt=""
									aria-hidden="true"
								/>
								<span>{item.label}</span>
							</button>
						))}
					</div>
				</PanelBody>

				<PanelBody
					title={__('Heading Settings', 'ambrygen-web')}
					initialOpen={false}
				>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingLevel}
						type="heading"
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Team Members', 'ambrygen-web')}
					initialOpen={false}
				>
					<p
						className="our-team__member-count"
						role="status"
						aria-live="polite"
						aria-atomic="true"
					>
						{sprintf(
							/* translators: %d: number of selected team members. */
							__('%d member(s) selected', 'ambrygen-web'),
							selectedPostIds.length
						)}
					</p>

					{isSliderView && selectionMode === 'taxonomy' ? (
						<>
							<p className="our-team__member-help">
								{__(
									'Members are managed by the selected member types.',
									'ambrygen-web'
								)}
							</p>
							{hasReachedMemberTypeLimit && (
								<Notice
									status="warning"
									isDismissible={false}
								>
									{sprintf(
										/* translators: %d: maximum number of team members loaded by member type. */
										__(
											'Only the first %d matching members are loaded. Use manual selection for a smaller curated list.',
											'ambrygen-web'
										),
										MAX_TEAM_MEMBER_TYPE_PAGES *
										WP_REST_MAX_PER_PAGE
									)}
								</Notice>
							)}
						</>
					) : (
						<MemberPicker
							isLoading={!manualTeamPosts}
							options={memberOptions}
							selectedMembers={selectedMemberOptions}
							searchValue={memberSearchInput}
							onSearchChange={setMemberSearchInput}
							onToggle={toggleMemberBlock}
							hasOptions={hasMemberOptions}
						/>
					)}
				</PanelBody>

				{isSliderView && (
					<>
						<PanelBody
							title={__(
								'Team Selection Mode',
								'ambrygen-web'
							)}
							initialOpen={false}
						>
							<ToggleControl
								label={__(
									'Select by Member Type',
									'ambrygen-web'
								)}
								checked={selectionMode === 'taxonomy'}
								onChange={(enabled) =>
									setAttributes({
										selectionMode: enabled
											? 'taxonomy'
											: 'manual',
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
											checked={memberTypes.includes(
												term.id
											)}
											onChange={(checked) =>
												setAttributes({
													memberTypes: checked
														? [
															...memberTypes,
															term.id,
														]
														: memberTypes.filter(
															(id) =>
																id !==
																term.id
														),
												})
											}
										/>
									))
								))}
						</PanelBody>

						<PanelBody
							title={__('Slider Settings', 'ambrygen-web')}
							initialOpen={false}
						>
							<ToggleControl
								label={__(
									'Show Navigation',
									'ambrygen-web'
								)}
								checked={showNavigation}
								onChange={(value) =>
									setAttributes({ showNavigation: value })
								}
							/>
							<ToggleControl
								label={__(
									'Show Pagination',
									'ambrygen-web'
								)}
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
					</>
				)}
			</InspectorControls>

			<div {...blockProps}>
				<div className={blockClass}>
					<div className={`${blockClass}__header block__rowflex`}>
						<div className="block__rowflex--col-left">
						<TagName
							className={`${blockClass}__title block__rowflex--heading-title heading-3 mb-0`}
						>
							<RichText
								tagName="div"
								value={title}
								onChange={(value) =>
									setAttributes({ title: value })
								}
								allowedFormats={[
									'core/bold',
									'core/italic',
									'core/text-color',
								]}
								placeholder={__(
									'Add Heading...',
									'ambrygen-web'
								)}
							/>
						</TagName>
					</div>

					<RichText
						tagName="div"
						className={`${blockClass}__intro block__rowflex--block-content ${isSliderView ? 'subtitle1-reg' : 'subtitle1'
							}`}
						value={intro}
						onChange={(value) =>
							setAttributes({ intro: value })
						}
						placeholder={__(
							'Add Description...',
							'ambrygen-web'
						)}
					/>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				{isSliderView ? (
					<div
						key="slider-view"
						ref={sliderRef}
						className="our-leadership__editor-preview our-leadership-slider swiper"
					>
						<InnerBlocks
							allowedBlocks={allowedBlocks}
							orientation="horizontal"
							renderAppender={() => false}
						/>

						{showPagination && (
							<div className="swiper-pagination" />
						)}

						{showNavigation && (
							<div className="swiper-buttons">
								<button
									type="button"
									className="custom-prev"
									aria-label={__(
										'Previous slide',
										'ambrygen-web'
									)}
								></button>
								<button
									type="button"
									className="custom-next"
									aria-label={__(
										'Next slide',
										'ambrygen-web'
									)}
								></button>
							</div>
						)}
					</div>
				) : (
					<div key="grid-view" className="our-team__grid">
						<InnerBlocks
							allowedBlocks={allowedBlocks}
							renderAppender={() => false}
						/>
					</div>
				)}
			</div>
		</div >
		</>
	);
}

function MemberPicker({
	isLoading,
	options,
	selectedMembers,
	searchValue,
	onSearchChange,
	onToggle,
	hasOptions,
}) {
	return (
		<div className="our-team__member-picker">
			{isLoading ? (
				<Spinner />
			) : (
				<>
					{selectedMembers.length > 0 && (
						<div className="our-team__selected-members">
							<div className="our-team__member-picker-label">
								{__('Selected Members', 'ambrygen-web')}
							</div>
							<div
								className="our-team__selected-member-list"
								role="list"
								aria-label={__(
									'Selected team members',
									'ambrygen-web'
								)}
							>
								{selectedMembers.map((member) => (
									<div
										key={member.value}
										className="our-team__selected-member"
										role="listitem"
									>
										<span>
											{member.label}
											{member.isLoading && (
												<span className="screen-reader-text">
													{__(
														' loading',
														'ambrygen-web'
													)}
												</span>
											)}
										</span>
										<Button
											isDestructive
											variant="tertiary"
											size="small"
											onClick={() =>
												onToggle(
													member.value,
													false
												)
											}
										>
											{__('Remove', 'ambrygen-web')}
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="our-team__member-picker-field">
						<SearchControl
							label={__('Add Team Member', 'ambrygen-web')}
							value={searchValue}
							onChange={onSearchChange}
							placeholder={__(
								'Search team members',
								'ambrygen-web'
							)}
						/>
						<p className="our-team__member-help">
							{hasOptions
								? __(
									'Search and add members without loading the full team list.',
									'ambrygen-web'
								)
								: __(
									'No matching team members are available to add.',
									'ambrygen-web'
								)}
						</p>
						{hasOptions && (
							<div
								className="our-team__member-options"
								role="list"
								aria-label={__(
									'Available team members to add',
									'ambrygen-web'
								)}
							>
								{options.map((option) => (
									<div
										key={option.value}
										className="our-team__member-option"
										role="listitem"
									>
										<span>{option.label}</span>
										<Button
											variant="secondary"
											size="small"
											onClick={() =>
												onToggle(
													parseInt(
														option.value,
														10
													),
													true
												)
											}
										>
											{__('Add', 'ambrygen-web')}
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
