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
	Spinner,
	Button,
	SearchControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { sprintf } from '@wordpress/i18n';
import Swiper from 'swiper/bundle';
import { BlockExamplePreview, TagSelector } from '../_shared/components';

const TEAM_MEMBERS_PER_PAGE = 20;
const ITEM_BLOCK_NAME = 'ambrygen/multimedia-member-item';

const getPostTitle = (post) => {
	if (typeof post?.title === 'string') {
		return post.title;
	}

	return post?.title?.rendered || post?.title?.raw || '';
};

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		title,
		headingTag = 'h2',
		memberTypes = [],
		selectionMode = 'manual',
	} = attributes;
	const [memberSearchInput, setMemberSearchInput] = useState('');

	const { replaceInnerBlocks, insertBlocks, removeBlocks } =
		useDispatch('core/block-editor');

	if (blockId === 'multimedia-member-example') {
		return (
			<BlockExamplePreview
				className="multimedia-member-example-preview"
				imagePath="/assets/src/images/multimedia-member/preview.png"
			/>
		);
	}

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if ( !blockId ) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [clientId, blockId, setAttributes]);

	const memberTypeTerms = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', 'member_type', {
				per_page: -1,
				hide_empty: false,
			}),
		[]
	);

	const allMemberPosts = useSelect(
		(select) =>
			select('core').getEntityRecords('postType', 'our_team', {
				per_page: -1,
				post_status: 'publish',
				_fields: 'id,member_type',
			}),
		[]
	);
	const manualMemberPosts = useSelect(
		(select) => {
			if (selectionMode !== 'manual') {
				return [];
			}

			const query = {
				per_page: TEAM_MEMBERS_PER_PAGE,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
			};

			if (memberSearchInput.trim()) {
				query.search = memberSearchInput.trim();
			}

			return select('core').getEntityRecords(
				'postType',
				'our_team',
				query
			);
		},
		[selectionMode, memberSearchInput]
	);

	useEffect(() => {
		if (
			selectionMode !== 'taxonomy' ||
			!memberTypes.length ||
			!allMemberPosts
		) {
			return;
		}

		const filteredMemberPosts = allMemberPosts.filter((post) =>
			post.member_type?.some((id) => memberTypes.includes(id))
		);

		const newBlocks = filteredMemberPosts.map((post) =>
			createBlock('ambrygen/multimedia-member-item', {
				postId: post.id,
			})
		);

		replaceInnerBlocks(clientId, newBlocks, false);
	}, [
		selectionMode,
		memberTypes,
		allMemberPosts,
		clientId,
		replaceInnerBlocks,
	]);

	const containerRef = useRef(null);
	const swiperInstances = useRef([]);
	const blockProps = useBlockProps();
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId),
		[clientId]
	);
	const innerBlocksCount = innerBlocks.length;
	const selectedPostIds = useMemo(
		() =>
			innerBlocks
				.map((block) => Number(block.attributes?.postId) || 0)
				.filter(Boolean),
		[innerBlocks]
	);
	const selectedMemberPostsById = useSelect(
		(select) => {
			if (!selectedPostIds.length) {
				return {};
			}

			const posts = select('core').getEntityRecords(
				'postType',
				'our_team',
				{
					include: selectedPostIds,
					per_page: selectedPostIds.length,
					orderby: 'include',
					context: 'edit',
				}
			);

			if (!Array.isArray(posts)) {
				return {};
			}

			return posts.reduce((postsById, post) => {
				postsById[post.id] = post;
				return postsById;
			}, {});
		},
		[selectedPostIds]
	);
	const memberOptions = useMemo(() => {
		if (!Array.isArray(manualMemberPosts)) {
			return [];
		}

		return manualMemberPosts
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
	}, [manualMemberPosts, selectedPostIds]);
	const selectedMemberOptions = useMemo(
		() =>
			selectedPostIds.map((postId) => {
				const post = selectedMemberPostsById[postId];
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
		[selectedPostIds, selectedMemberPostsById]
	);
	const hasMemberOptions = memberOptions.length > 0;

	const toggleMemberBlock = (postId, isSelected) => {
		if (isSelected) {
			if (selectedPostIds.includes(postId)) {
				return;
			}

			insertBlocks(
				createBlock(ITEM_BLOCK_NAME, { postId }),
				innerBlocksCount,
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

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		const initSwipers = () => {
			if (!containerRef.current) {
				return;
			}
			const sliders = containerRef.current.querySelectorAll(
				'.multimedia-member-item__media-slider:not(.swiper-initialized)'
			);

			sliders.forEach((sliderElement) => {
				const slides =
					sliderElement.querySelectorAll('.swiper-slide');
				if (slides.length === 0) {
					return;
				}

				swiperInstances.current.push(
					new Swiper(sliderElement, {
						slidesPerView: 1,
						spaceBetween: 0,
						loop: slides.length > 1,
						navigation:
							slides.length > 1
								? {
									nextEl: sliderElement.querySelector(
										'.custom-next'
									),
									prevEl: sliderElement.querySelector(
										'.custom-prev'
									),
								}
								: false,
						pagination: false,
						observer: true,
						observeParents: true,
					})
				);
			});
		};

		const timer = setTimeout(initSwipers, 300);

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
			swiperInstances.current.forEach((instance) => {
				if (instance && typeof instance.destroy === 'function') {
					instance.destroy(true, true);
				}
			});
			swiperInstances.current = [];
		};
	}, [innerBlocksCount]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Heading Settings', 'ambrygen-web')}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						type="heading"
						value={headingTag}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Team Members', 'ambrygen-web')}
					initialOpen={false}
				>
					<p
						className="multimedia-member__member-count"
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

					{selectionMode === 'taxonomy' ? (
						<p className="multimedia-member__member-help">
							{__(
								'Members are managed by the selected member types.',
								'ambrygen-web'
							)}
						</p>
					) : (
						<MemberPicker
							isLoading={!manualMemberPosts}
							options={memberOptions}
							selectedMembers={selectedMemberOptions}
							searchValue={memberSearchInput}
							onSearchChange={setMemberSearchInput}
							onToggle={toggleMemberBlock}
							hasOptions={hasMemberOptions}
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__('Member Selection Mode', 'ambrygen-web')}
					initialOpen
				>
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
			</InspectorControls>

			<div {...blockProps} ref={containerRef}>
				<div className="multimedia-member">
					<div className="features-media__header block__rowflex">
						<div className='block__rowflex--col-left'>
							<RichText
								tagName={headingTag}
								className="block-title block__rowflex--heading-title heading-2 mb-0"
								value={title}
								allowedFormats={[
									'core/bold',
									'core/italic',
									'core/highlight',
									'core/text-color',
								]}
								onChange={(value) =>
									setAttributes({ title: value })
								}
								placeholder={__('Add Heading...', 'ambrygen-web')}
							/>
						</div>
					</div>

					<div className="is-style-gl-s32" aria-hidden="true"></div>

					<div className="multimedia-member__items">
						<InnerBlocks
							allowedBlocks={[ITEM_BLOCK_NAME]}
							orientation="horizontal"
							renderAppender={() => false}
						/>
					</div>

				</div>
			</div>
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
		<div className="multimedia-member__member-picker">
			{isLoading ? (
				<Spinner />
			) : (
				<>
					{selectedMembers.length > 0 && (
						<div className="multimedia-member__selected-members">
							<div className="multimedia-member__member-picker-label">
								{__('Selected Members', 'ambrygen-web')}
							</div>
							<div
								className="multimedia-member__selected-member-list"
								role="list"
								aria-label={__(
									'Selected team members',
									'ambrygen-web'
								)}
							>
								{selectedMembers.map((member) => (
									<div
										key={member.value}
										className="multimedia-member__selected-member"
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
					<div className="multimedia-member__member-picker-field">
						<SearchControl
							label={__('Add Team Member', 'ambrygen-web')}
							value={searchValue}
							onChange={onSearchChange}
							placeholder={__(
								'Search team members',
								'ambrygen-web'
							)}
						/>
						<p className="multimedia-member__member-help">
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
								className="multimedia-member__member-options"
								role="list"
								aria-label={__(
									'Available team members to add',
									'ambrygen-web'
								)}
							>
								{options.map((option) => (
									<div
										key={option.value}
										className="multimedia-member__member-option"
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
