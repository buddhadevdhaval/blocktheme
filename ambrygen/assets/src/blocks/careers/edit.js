import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import {
	ImageUploader,
	CtaButtonField,
	TagSelector,
} from '../_shared/components';
import { t } from '../_shared/utils';
import {
	isValidUrl,
	isValidVideoUrl,
	getIframeSrc,
} from '../../utils/validation.js';

export default function Edit({ attributes, setAttributes }) {
	const {
		title,
		intro,
		headingLevel,
		videoUrl,
		videoObj,
		videoPoster,
		careerslink,
		jobtypeicon,
		joblocationicon,
		videoType,
		link,
	} = attributes;

	const TagName = headingLevel || 'h2';
	const videoRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const iframeSrc = getIframeSrc(videoUrl);
	const [editorIframeSrc, setEditorIframeSrc] = useState(iframeSrc);

	useEffect(() => {
		setEditorIframeSrc(iframeSrc);
		setIsPlaying(false);
	}, [iframeSrc, videoType]);

	const getPlaySrc = (src) =>
		src.includes('autoplay=1')
			? src
			: `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;

	const getPauseSrc = (src) =>
		src
			.replace(/([?&])autoplay=1(&?)/, '$1')
			.replace(/[?&]$/, '')
			.replace('?&', '?');

	const handlePlayClick = (event) => {
		if (event) {
			event.preventDefault();
		}
		if (videoType === 'mp4' && videoRef.current) {
			videoRef.current.play();
		}
		if (videoType === 'embed' && editorIframeSrc) {
			setEditorIframeSrc(getPlaySrc(editorIframeSrc));
		}
		setIsPlaying(true);
	};

	const handlePauseClick = (event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (videoType === 'mp4' && videoRef.current) {
			videoRef.current.pause();
		}
		if (videoType === 'embed' && editorIframeSrc) {
			setEditorIframeSrc(getPauseSrc(editorIframeSrc));
		}
		setIsPlaying(false);
	};

	return (
		<>
			<InspectorControls>
				{ /* Heading settings */}
				<PanelBody title="Heading Settings">
					<TagSelector
						label={t('Heading Tag', 'ambrygen-web')}
						value={headingLevel || 'h2'}
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
					/>
					<SelectControl
						label="Video Type"
						value={videoType}
						options={[
							{ label: 'Self Hosted (MP4)', value: 'mp4' },
							{ label: 'YouTube / Vimeo', value: 'embed' },
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
											videoObj: {
												id: media.id,
												url: media.url,
											},
										})
									}
									allowedTypes={['video']}
									value={videoObj?.id}
									render={({ open }) => (
										<Button isSecondary onClick={open}>
											{videoObj?.url
												? 'Change Video'
												: 'Select / Upload Video'}
										</Button>
									)}
								/>
							</MediaUploadCheck>

							{videoObj?.url && (
								<p>Selected: {videoObj.url}</p>
							)}

							<Button
								isLink
								isDestructive
								onClick={() =>
									setAttributes({ videoObj: null })
								}
							>
								Remove Video
							</Button>

							<ImageUploader
								label="Video Poster Image"
								url={videoPoster?.url}
								onSelect={(media) =>
									setAttributes({ videoPoster: media })
								}
								onRemove={() =>
									setAttributes({ videoPoster: null })
								}
							/>
						</>
					)}

					{videoType === 'embed' && (
						<TextControl
							label="YouTube or Vimeo URL"
							help="Supports youtube.com, youtu.be, vimeo.com"
							value={videoUrl || ''}
							onChange={(value) =>
								isValidVideoUrl(value) &&
								setAttributes({ videoUrl: value })
							}
						/>
					)}
					<ImageUploader
						label="Job Type Icon"
						url={jobtypeicon?.url}
						onSelect={(media) =>
							setAttributes({ jobtypeicon: media })
						}
						onRemove={() =>
							setAttributes({ jobtypeicon: null })
						}
					/>
					<ImageUploader
						label="Job Location Icon"
						url={joblocationicon?.url}
						onSelect={(media) =>
							setAttributes({ joblocationicon: media })
						}
						onRemove={() =>
							setAttributes({ joblocationicon: null })
						}
					/>
					<CtaButtonField
						label={t('Top Link setting')}
						textLabel={t('Link Text')}
						defaultVariant="primary"
						value={link}
						showVariant={false}
						onChange={(value) =>
							setAttributes({ link: value })
						}
					/>
					<CtaButtonField
						label={t('Bottom Link setting')}
						textLabel={t('Link Text')}
						defaultVariant="primary"
						value={careerslink}
						showVariant={false}
						onChange={(value) =>
							setAttributes({ careerslink: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps({ className: 'careers-highlight' })}>
				<div className="careers-highlight__header block__rowflex">
					<RichText
						tagName={headingLevel || 'h2'}
						value={title}
						placeholder="Add Title..."
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
					<div className="careers-highlight__intro block__rowflex--block-content subtitle1-reg">
						<RichText
							tagName="div"
							value={intro}
							placeholder="Add Description..."
							onChange={(value) =>
								setAttributes({ intro: value })
							}
						/>

						{link?.text && (
							<div className="block_rowflex-link">
								<a
									href={link.url || '#'}
									className="site-btn is-style-site-text-btn has-icon"
								>
									{link.text}
								</a>
							</div>
						)}
					</div>
				</div>
				<div className="is-style-gl-s50"></div>

				<div className="careers-highlight__row">
					<div className="careers-highlight__left">
						<div className="custom-scroll-jobs">
							<div className="careers-highlight__jobs">
								<InnerBlocks
									allowedBlocks={[
										'ambrygen/job-list-item',
									]}
								/>
							</div>
						</div>

						{careerslink?.text && (
							<div className="block-btn">
								<div className="is-style-gl-s32"></div>
								<a
									href={careerslink.url || '#'}
									className="site-btn is-style-site-text-btn has-icon"
								>
									{careerslink.text}
								</a>
							</div>
						)}
					</div>

					<div className="careers-highlight__right">
						<div className="careers-highlight__media  media_video">
							{videoType === 'mp4' && videoObj?.url && (
								<video
									ref={videoRef}
									className="videos"
									playsInline
									muted
									preload="metadata"
									loop
									poster={videoPoster?.url || ''}
									onPlay={() => setIsPlaying(true)}
									onPause={() => setIsPlaying(false)}
									onEnded={() => setIsPlaying(false)}
								>
									<source
										src={videoObj.url}
										type="video/mp4"
									/>
								</video>
							)}
							{videoType === 'embed' && (
								<div className="careers-highlight__media  media_video video-embed">
									<iframe
										src={iframeSrc}
										title="Embedded video"
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							)}
							{!videoUrl && (
								<div className="videos-placeholder">
									Add video URL in block settings
								</div>
							)}
							{videoUrl && (
								<div className="play-icon-video">
									<button
										type="button"
										className="play-icon circle-icon"
										onClick={handlePlayClick}
										style={{
											display: isPlaying ? 'none' : '',
										}}
									>
										<img
											src="/wp-content/uploads/2026/02/play-icon1.svg"
											className="play-icon__img"
											width="24"
											height="24"
											alt="Play"
										/>
									</button>
									<button
										type="button"
										className="pause-icon circle-icon"
										onClick={handlePauseClick}
										style={{
											display: isPlaying ? '' : 'none',
										}}
									>
										<img
											src="/wp-content/uploads/2026/02/pause-icon.svg"
											className="pause-icon__img"
											width="24"
											height="24"
											alt="Pause"
										/>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
