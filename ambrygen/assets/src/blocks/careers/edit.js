import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Button,
	SearchControl,
	Spinner,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	ImageUploader,
	BlockExamplePreview,
	CtaButtonField,
	TagSelector,
} from '../_shared/components';
import { getIframeSrc } from '../../utils/validation.js';
import playIcon from '../../images/play-icon.svg';

const JOBS_PER_PAGE = 20;
const ITEM_BLOCK_NAME = 'ambrygen/job-list-item';

const normalizeImageObject = (media) => {
	if (!media?.url) {
		return null;
	}

	return {
		id: media.id || 0,
		url: media.url,
		alt: media.alt || '',
	};
};

const normalizeVideoObject = (media) => {
	if (!media?.url) {
		return null;
	}

	return {
		id: media.id || 0,
		url: media.url,
	};
};

const getPostTitle = (post) => {
	if (typeof post?.title === 'string') {
		return post.title;
	}

	return post?.title?.rendered || post?.title?.raw || '';
};

const getEmbedSourceFromInput = (url) => {
	if (!url || typeof url !== 'string') {
		return '';
	}

	const trimmedUrl = url.trim();
	const iframeSrcMatch = trimmedUrl.match(/src=["']([^"']+)["']/i);

	return iframeSrcMatch?.[1] || trimmedUrl;
};

const isAllowedEmbedUrl = (url) => {
	const embedSource = getEmbedSourceFromInput(url);

	if (!embedSource) {
		return false;
	}

	try {
		const parsedUrl = new URL(embedSource);
		const hostname = parsedUrl.hostname.replace(/^www\./, '');

		if (parsedUrl.protocol !== 'https:') {
			return false;
		}

		if (
			['youtube.com', 'youtube-nocookie.com', 'm.youtube.com'].includes(
				hostname
			) &&
			parsedUrl.pathname.startsWith('/embed/')
		) {
			const videoId = parsedUrl.pathname.split('/embed/')[1];

			return /^[a-zA-Z0-9_-]{11}$/.test(videoId || '');
		}

		if (
			hostname === 'player.vimeo.com' &&
			/^\/video\/\d+$/.test(parsedUrl.pathname)
		) {
			return true;
		}

		return false;
	} catch (error) {
		return false;
	}
};

const getNonAutoplayEmbedUrl = (url) => {
	if (!url) {
		return '';
	}

	try {
		const parsedUrl = new URL(url);

		parsedUrl.searchParams.delete('autoplay');

		return parsedUrl.toString();
	} catch (error) {
		return url;
	}
};

const getEditorIframeSrc = (url) => {
	const embedSource = getEmbedSourceFromInput(url);

	if (!embedSource) {
		return '';
	}

	if (isAllowedEmbedUrl(embedSource)) {
		return getNonAutoplayEmbedUrl(embedSource);
	}

	return getNonAutoplayEmbedUrl(getIframeSrc(embedSource) || '');
};

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		title,
		intro,
		headingLevel,
		videoUrl,
		videoObj,
		videoPoster,
		careerslink,
		videoType,
		link,
		joblocationicon,
		jobtypeicon,
	} = attributes;

	const [jobSearchInput, setJobSearchInput] = useState('');
	const { insertBlocks, removeBlocks } = useDispatch('core/block-editor');
	const iframeSrc = getEditorIframeSrc(videoUrl);
	const hasEditorVideo =
		(videoType === 'mp4' && videoObj?.url) ||
		(videoType === 'embed' && iframeSrc);
	const hasHeaderContent = Boolean(
		title || intro || (link?.text && link?.url)
	);
	const topLinkRel =
		link?.target === '_blank'
			? [link?.rel, 'noopener', 'noreferrer']
				.filter(Boolean)
				.join(' ')
			: link?.rel || '';
	const bottomLinkRel =
		careerslink?.target === '_blank'
			? [careerslink?.rel, 'noopener', 'noreferrer']
				.filter(Boolean)
				.join(' ')
			: careerslink?.rel || '';
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId),
		[clientId]
	);
	const selectedJobIds = useMemo(
		() =>
			innerBlocks
				.map((block) => Number(block.attributes?.postId) || 0)
				.filter(Boolean),
		[innerBlocks]
	);
	const selectedJobsById = useSelect(
		(select) => {
			if (!selectedJobIds.length) {
				return {};
			}

			const posts = select('core').getEntityRecords('postType', 'jobs', {
				include: selectedJobIds,
				per_page: selectedJobIds.length,
				orderby: 'include',
				context: 'edit',
			});

			if (!Array.isArray(posts)) {
				return {};
			}

			return posts.reduce((postsById, post) => {
				postsById[post.id] = post;
				return postsById;
			}, {});
		},
		[selectedJobIds]
	);
	const jobPosts = useSelect(
		(select) => {
			const query = {
				per_page: JOBS_PER_PAGE,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
			};

			if (jobSearchInput.trim()) {
				query.search = jobSearchInput.trim();
			}

			return select('core').getEntityRecords('postType', 'jobs', query);
		},
		[jobSearchInput]
	);
	const jobOptions = useMemo(() => {
		if (!Array.isArray(jobPosts)) {
			return [];
		}

		return jobPosts
			.filter((post) => !selectedJobIds.includes(post.id))
			.map((post) => {
				const title = decodeEntities(getPostTitle(post)).trim();

				return {
					label:
						title ||
						sprintf(
							/* translators: %d: job post ID. */
							__('Job #%d', 'ambrygen-web'),
							post.id
						),
					value: String(post.id),
				};
			});
	}, [jobPosts, selectedJobIds]);
	const selectedJobOptions = useMemo(
		() =>
			selectedJobIds.map((postId) => {
				const post = selectedJobsById[postId];
				const title = decodeEntities(getPostTitle(post)).trim();

				return {
					label:
						title ||
						sprintf(
							/* translators: %d: job post ID. */
							__('Job #%d', 'ambrygen-web'),
							postId
						),
					value: postId,
					isLoading: !post,
				};
			}),
		[selectedJobIds, selectedJobsById]
	);
	const hasJobOptions = jobOptions.length > 0;

	useEffect(() => {
		const clientIdSuffix = clientId.slice(0, 8);
		const expectedId = `section-${clientIdSuffix}`;

		if ( !blockId ) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [clientId, blockId, setAttributes]);

	const blockProps = useBlockProps({ className: 'careers-highlight' });

	const toggleJobBlock = (postId, isSelected) => {
		if (isSelected) {
			if (selectedJobIds.includes(postId)) {
				return;
			}

			insertBlocks(
				createBlock(ITEM_BLOCK_NAME, {
					postId,
				}),
				innerBlocks.length,
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

	if (blockId === 'careers-example') {
		return (
			<BlockExamplePreview
				className="cta-tiles-with-3-card-example-preview"
				imagePath="/assets/src/images/careers/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Heading Settings', 'ambrygen-web')} initialOpen={false}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingLevel || 'h2'}
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
						type="heading"
					/>
				</PanelBody>

				<PanelBody title={__('Video Settings', 'ambrygen-web')} initialOpen={true}>
					<SelectControl
						label={__('Video Type', 'ambrygen-web')}
						value={videoType}
						options={[
							{
								label: __(
									'Self Hosted (MP4)',
									'ambrygen-web'
								),
								value: 'mp4',
							},
							{
								label: __('YouTube / Vimeo', 'ambrygen-web'),
								value: 'embed',
							},
						]}
						onChange={(value) =>
							setAttributes({ videoType: value })
						}
					/>

					{videoType === 'mp4' && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										setAttributes({
											videoObj:
												normalizeVideoObject(media),
										})
									}
									allowedTypes={['video']}
									value={videoObj?.id}
									render={({ open }) => (
										<Button
											variant="secondary"
											onClick={open}
										>
											{videoObj?.url
												? __(
													'Change Video',
													'ambrygen-web'
												)
												: __(
													'Select / Upload Video',
													'ambrygen-web'
												)}
										</Button>
									)}
								/>
							</MediaUploadCheck>

							{videoObj?.url && (
								<p>{`${__('Selected:', 'ambrygen-web')} ${videoObj.url
									}`}</p>
							)}

							<Button
								variant="link"
								isDestructive
								onClick={() =>
									setAttributes({ videoObj: null })
								}
							>
								{__('Remove Video', 'ambrygen-web')}
							</Button>

							<ImageUploader
								label={__(
									'Video Poster Image',
									'ambrygen-web'
								)}
								url={videoPoster?.url}
								onSelect={(media) =>
									setAttributes({
										videoPoster:
											normalizeImageObject(media),
									})
								}
								onRemove={() =>
									setAttributes({ videoPoster: null })
								}
							/>
						</>
					)}

					{videoType === 'embed' && (
						<TextControl
							label={__(
								'YouTube or Vimeo URL',
								'ambrygen-web'
							)}
							help={__(
								'Supports youtube.com, youtu.be, vimeo.com',
								'ambrygen-web'
							)}
							value={videoUrl || ''}
							onChange={(value) =>
								setAttributes({ videoUrl: value })
							}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Link Settings', 'ambrygen-web')} initialOpen={false}>
					<CtaButtonField
						label={__('Top Link', 'ambrygen-web')}
						textLabel={__('Link Text', 'ambrygen-web')}
						defaultVariant="primary"
						value={link}
						showVariant={false}
						onChange={(value) =>
							setAttributes({ link: value })
						}
					/>
					<CtaButtonField
						label={__('Bottom Link', 'ambrygen-web')}
						textLabel={__('Link Text', 'ambrygen-web')}
						defaultVariant="primary"
						value={careerslink}
						showVariant={false}
						onChange={(value) =>
							setAttributes({ careerslink: value })
						}
					/>
				</PanelBody>

				<PanelBody title={__('Job Icon Settings', 'ambrygen-web')} initialOpen={false}>
					<ImageUploader
						label={__('Job Location Icon', 'ambrygen-web')}
						url={joblocationicon?.url}
						onSelect={(media) =>
							setAttributes({
								joblocationicon:
									normalizeImageObject(media),
							})
						}
						onRemove={() =>
							setAttributes({ joblocationicon: null })
						}
					/>
					<ImageUploader
						label={__('Job Type Icon', 'ambrygen-web')}
						url={jobtypeicon?.url}
						onSelect={(media) =>
							setAttributes({
								jobtypeicon: normalizeImageObject(media),
							})
						}
						onRemove={() =>
							setAttributes({ jobtypeicon: null })
						}
					/>
				</PanelBody>

				<PanelBody title={__('Jobs', 'ambrygen-web')} initialOpen={false}>
					<p
						className="careers-highlight__job-count"
						role="status"
						aria-live="polite"
						aria-atomic="true"
					>
						{sprintf(
							/* translators: %d: number of selected jobs. */
							__('%d job(s) selected', 'ambrygen-web'),
							selectedJobIds.length
						)}
					</p>
					<JobPicker
						isLoading={!jobPosts}
						options={jobOptions}
						selectedJobs={selectedJobOptions}
						searchValue={jobSearchInput}
						onSearchChange={setJobSearchInput}
						onToggle={toggleJobBlock}
						hasOptions={hasJobOptions}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="careers-highlight__header block__rowflex">
					<div className='block__rowflex--col-left'>
						<RichText
							tagName={headingLevel || 'h2'}
							value={title}
							placeholder={__('Add Heading...', 'ambrygen-web')}
							className="careers-highlight__title block__rowflex--heading-title heading-4 mb-0"
							onChange={(value) =>
								setAttributes({ title: value })
							}
							allowedFormats={[
								'core/bold',
								'core/italic',
								'core/text-color',
							]}
						/>
					</div>
					<div className="careers-highlight__intro block__rowflex--block-content subtitle1-reg">
						<RichText
							tagName="div"
							value={intro}
							placeholder={__(
								'Add Description...',
								'ambrygen-web'
							)}
							onChange={(value) =>
								setAttributes({ intro: value })
							}
						/>

						{link?.text && link?.url && (
							<div className="block_rowflex-link">
								<a
									href={link.url}
									className="site-btn is-style-site-text-btn has-right-arrow"
									target={link.target || undefined}
									rel={topLinkRel || undefined}
								>
									{link.text}
								</a>
							</div>
						)}
					</div>
				</div>
				{hasHeaderContent && <div className="is-style-gl-s50"></div>}

				<div className="careers-highlight__row">
					<div className="careers-highlight__left">
						<div className="custom-scroll-jobs">
							<div className="careers-highlight__jobs">
								<InnerBlocks
									allowedBlocks={[ITEM_BLOCK_NAME]}
									templateLock={false}
									renderAppender={() => false}
								/>
							</div>
						</div>

						{careerslink?.text && careerslink?.url && (
							<div className="block-btn">
								<div className="is-style-gl-s32"></div>
								<a
									href={careerslink.url}
									className="site-btn is-style-site-text-btn has-right-arrow"
									target={careerslink.target || undefined}
									rel={bottomLinkRel || undefined}
								>
									{careerslink.text}
								</a>
							</div>
						)}
					</div>

					<div className="careers-highlight__right">
						<div className="careers-highlight__media media_video" style={{ pointerEvents: 'none' }}>
							{videoType === 'mp4' && videoObj?.url && (
								<video
									className="videos"
									playsInline
									muted
									preload="metadata"
									loop
									poster={videoPoster?.url || ''}
									tabIndex="-1"
									aria-hidden="true"
								>
									<source
										src={videoObj.url}
										type="video/mp4"
									/>
								</video>
							)}
							{videoType === 'embed' && iframeSrc && (
								<div className="careers-highlight__media media_video video-embed">
									<iframe
										src={iframeSrc}
										title={__(
											'Embedded video',
											'ambrygen-web'
										)}
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										tabIndex="-1"
										aria-hidden="true"
									/>
								</div>
							)}
							{!hasEditorVideo && (
								<div className="videos-placeholder">
									{__(
										'Add video URL in block settings',
										'ambrygen-web'
									)}
								</div>
							)}
							{hasEditorVideo && (
								<button
									type="button"
									className="play-icon-video"
									aria-hidden="true"
									tabIndex={-1}
									style={{ pointerEvents: 'none' }}
								>
									<span
										className="play-icon circle-icon"
										aria-hidden="true"
									>
										<img
											src={playIcon}
											className="play-icon__img"
											alt=""
											aria-hidden="true"
										/>
									</span>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function JobPicker({
	isLoading,
	options,
	selectedJobs,
	searchValue,
	onSearchChange,
	onToggle,
	hasOptions,
}) {
	return (
		<div className="careers-highlight__job-picker">
			{isLoading ? (
				<Spinner />
			) : (
				<>
					{selectedJobs.length > 0 && (
						<div className="careers-highlight__selected-jobs">
							<div className="careers-highlight__job-picker-label">
								{__('Selected Jobs', 'ambrygen-web')}
							</div>
							<div
								className="careers-highlight__selected-job-list"
								role="list"
								aria-label={__('Selected jobs', 'ambrygen-web')}
							>
								{selectedJobs.map((job) => (
									<div
										key={job.value}
										className="careers-highlight__selected-job"
										role="listitem"
									>
										<span>
											{job.label}
											{job.isLoading && (
												<span className="screen-reader-text">
													{__(' loading', 'ambrygen-web')}
												</span>
											)}
										</span>
										<Button
											isDestructive
											variant="tertiary"
											size="small"
											onClick={() =>
												onToggle(job.value, false)
											}
										>
											{__('Remove', 'ambrygen-web')}
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="careers-highlight__job-picker-field">
						<SearchControl
							label={__('Add Job', 'ambrygen-web')}
							value={searchValue}
							onChange={onSearchChange}
							placeholder={__('Search jobs', 'ambrygen-web')}
						/>
						<p className="careers-highlight__job-help">
							{hasOptions
								? __(
									'Search and add jobs without loading the full job list.',
									'ambrygen-web'
								)
								: __(
									'No matching jobs are available to add.',
									'ambrygen-web'
								)}
						</p>
						{hasOptions && (
							<div
								className="careers-highlight__job-options"
								role="list"
								aria-label={__('Available jobs to add', 'ambrygen-web')}
							>
								{options.map((option) => (
									<div
										key={option.value}
										className="careers-highlight__job-option"
										role="listitem"
									>
										<span>{option.label}</span>
										<Button
											variant="secondary"
											size="small"
											onClick={() =>
												onToggle(
													parseInt(option.value, 10),
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
