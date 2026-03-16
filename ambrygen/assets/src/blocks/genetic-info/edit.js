import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { useEffect, useRef, useState, useMemo } from '@wordpress/element';
import {
	PanelBody,
	SelectControl,
	TextControl,
	Button,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { isValidVideoUrl, getIframeSrc } from '../../utils/validation.js';
import {
	ImageUploader,
	TagSelector,
	DEFAULT_IMAGES,
} from '../_shared/components';

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		headingTag,
		description,
		showDescription = true,
		videoUrl,
		videoType,
		posterImage,
		iframeUrl,
		imageUrl,
		imageId = 0,
		showImage = false,
	} = attributes;

	const blockProps = useBlockProps({ className: 'features-media' });

	const iframeSrc = iframeUrl || getIframeSrc(videoUrl) || '';
	const [isPlaying, setIsPlaying] = useState(false);
	const [editorIframeSrc, setEditorIframeSrc] = useState(iframeSrc);
	const videoRef = useRef(null);
	const imageMedia = useSelect(
		(select) => (imageId ? select('core').getMedia(imageId) : null),
		[imageId]
	);
	const imagePreviewUrl = imageMedia?.source_url || imageUrl || '';

	const displayUrl = useMemo(() => {
		return imagePreviewUrl || DEFAULT_IMAGES().placeholder.url;
	}, [imagePreviewUrl]);

	useEffect(() => {
		setEditorIframeSrc(iframeSrc);
		setIsPlaying(false);
	}, [iframeSrc, videoType]);

	// Helper to get URL from image object
	const getImageUrl = (imgObj) => (imgObj?.url ? imgObj.url : '');
	const getPlaySrc = (src) =>
		src.includes('autoplay=1')
			? src
			: `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
	const getPauseSrc = (src) =>
		src
			.replace(/([?&])autoplay=1(&?)/, '$1')
			.replace(/[?&]$/, '')
			.replace('?&', '?');

	const onPlayClick = () => {
		if (videoType === 'mp4' && videoRef.current) {
			videoRef.current.play();
		}
		if (videoType === 'embed' && editorIframeSrc) {
			setEditorIframeSrc(getPlaySrc(editorIframeSrc));
		}
		setIsPlaying(true);
	};

	const onPauseClick = () => {
		if (videoType === 'mp4' && videoRef.current) {
			videoRef.current.pause();
		}
		if (videoType === 'embed' && editorIframeSrc) {
			setEditorIframeSrc(getPauseSrc(editorIframeSrc));
		}
		setIsPlaying(false);
	};

	// ------------------------------
	// Inspector Controls
	// ------------------------------
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Video Settings', 'ambrygen-web')}
					initialOpen={true}
				>
					{ /* Heading Tag Selector */}
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h2'}
						onChange={(tag) =>
							setAttributes({ headingTag: tag })
						}
					/>

					<ToggleControl
						label={__(
							'Show image instead of video',
							'ambrygen-web'
						)}
						checked={showImage}
						onChange={(value) =>
							setAttributes({ showImage: value })
						}
					/>
					<ToggleControl
						label={__(
							'Show Description',
							'ambrygen-web'
						)}
						checked={showDescription}
						onChange={(value) =>
							setAttributes({ showDescription: value })
						}
					/>

			
					{showImage && (
						<ImageUploader
							url={imagePreviewUrl}
							onSelect={(media) =>
								setAttributes({
									imageId: media.id || 0,
									imageUrl: '',
								})
							}
							onRemove={() =>
								setAttributes({
									imageId: 0,
									imageUrl: '',
								})
							}
							label={__('Feature Image', 'ambrygen-web')}
						/>
					)}

					{!showImage && (
						<>
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
										label: __(
											'YouTube / Vimeo',
											'ambrygen-web'
										),
										value: 'embed',
									},
								]}
								onChange={(value) =>
									setAttributes({ videoType: value })
								}
							/>

							{videoType === 'embed' && (
								<TextControl
									label={__(
										'Iframe URL (optional)',
										'ambrygen-web'
									)}
									value={iframeUrl || ''}
									onChange={(value) =>
										setAttributes({ iframeUrl: value })
									}
								/>
							)}

							{videoType === 'mp4' && (
								<>
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) =>
												setAttributes({
													videoUrl: media.url,
												})
											}
											allowedTypes={['video']}
											value={videoUrl}
											render={({ open }) => (
												<Button
													isSecondary
													onClick={open}
													style={{
														marginBottom: '10px',
													}}
												>
													{videoUrl
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

									{videoUrl && (
										<Button
											isLink
											isDestructive
											onClick={() =>
												setAttributes({
													videoUrl: '',
												})
											}
											style={{
												marginBottom: '15px',
												display: 'block',
											}}
										>
											{__(
												'Remove Video',
												'ambrygen-web'
											)}
										</Button>
									)}

									<TextControl
										label={__(
											'Self Hosted Url',
											'ambrygen-web'
										)}
										value={videoUrl || ''}
										onChange={(value) =>
											setAttributes({
												videoUrl: value || '',
											})
										}
										className={
											videoUrl &&
												!isValidVideoUrl(videoUrl)
												? 'has-error'
												: ''
										}
									/>
								</>
							)}

							<ImageUploader
								url={getImageUrl(posterImage)}
								id={posterImage?.id || null}
								onSelect={(media) =>
									setAttributes({
										posterImage: {
											id: media.id,
											url: media.url,
										},
									})
								}
								onRemove={() =>
									setAttributes({ posterImage: null })
								}
								label={__(
									'Video Poster Image',
									'ambrygen-web'
								)}
							/>

						</>
					)}
				</PanelBody>
			</InspectorControls>

			{ /* ------------------------------
                Block Content
            ------------------------------ */ }
			<div {...blockProps}>
				<div className="features-media__header block__rowflex">
					<RichText
						tagName={headingTag || 'h2'}
						value={heading}
						onChange={(value) =>
							setAttributes({ heading: value })
						}
						placeholder={__('Add Title…', 'ambrygen-web')}
						className="block-title block__rowflex--heading-title heading-2 mb-0 genetic-heading"
					/>
					{showDescription && (
						<RichText
							tagName="p"
							value={description}
							onChange={(value) =>
							setAttributes({ description: value })
						}
						placeholder={__('Add Description…', 'ambrygen-web')}
						className={`block__rowflex--block-content subtitle1-reg genetic-description${
							showDescription ? '' : ' is-hidden'
						}`}
					/>
					)}
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>


				{showImage && displayUrl && (
					<div className="features-media has-image">
						<img
							src={displayUrl}
							className="features-media__image"
							alt={
								imagePreviewUrl
									? __(
										'Genetic information image',
										'ambrygen-web'
									)
									: __(
										'Default placeholder image',
										'ambrygen-web'
									)
							}
						/>
					</div>
				)}



				<>
					{ /* Video Embed */}
					{!showImage && (
						<div className="features-media__video media_video">
							{!showImage &&
								videoType === 'embed' &&
								editorIframeSrc && (
									<>
										<div className="features-media__video-wrapper features-media__video-wrapper--iframe">
											<iframe
												src={editorIframeSrc}
												title={__(
													'Genetic testing video',
													'ambrygen-web'
												)}
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
												className="features-media__iframe"
											/>
										</div>

										<div className="play-icon-video">

											<button
												type="button"
												className="play-icon circle-icon"
												onClick={onPlayClick}
												style={{
													display: isPlaying
														? 'none'
														: '',
												}}
											>
												<img
													src="/wp-content/uploads/2026/02/play-icon1.svg"
													width="24"
													height="24"
													alt="Play"
													className='play-icon__img'
												/>
											</button>


											<button
												type="button"
												className="circle-icon pause-icon"
												onClick={onPauseClick}
												style={{
													display: isPlaying
														? ''
														: 'none',
												}}
												className='play-icon__img'
											>
												<img
													src="/wp-content/uploads/2026/02/pause-icon.svg"
													width="24"
													height="24"
													alt="Pause"
													className='pause-icon__img'
												/>
											</button>

										</div>
									</>
								)}

							{ /* MP4 Video */}
							{!showImage && videoType === 'mp4' && videoUrl && (
								<div className="features-media__video-wrapper">
									<video
										ref={videoRef}
										controls
										src={videoUrl}
										poster={posterImage?.url || ''}
										className="videos"
										onPlay={() => setIsPlaying(true)}
										onPause={() => setIsPlaying(false)}
										onEnded={() => setIsPlaying(false)}
									/>
									<div className="play-icon-video">
										<button
											type="button"
											className="play-icon circle-icon"
											onClick={onPlayClick}
											style={{
												display: isPlaying
													? 'none'
													: '',
											}}
										>
											<img
												src="/wp-content/uploads/2026/02/play-icon1.svg"
												width="24"
												height="24"
												alt="Play"
												className='play-icon__img'
											/>
										</button>


										<button
											type="button"
											className="pause-icon circle-icon"
											onClick={onPauseClick}
											style={{
												display: isPlaying
													? ''
													: 'none',
											}}
										>
											<img
												src="/wp-content/uploads/2026/02/pause-icon.svg"
												width="24"
												height="24"
												alt="Pause"
												className='pause-icon__img'
											/>
										</button>
									</div>
								</div>
							)}
						</div>
					)
					}
				</>

			</div>
		</>
	);
}
