import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	Button,
} from '@wordpress/components';
import { getIframeSrc } from '../../utils/validation';
import { ImageUploader } from '../_shared/components';
import playIcon from '../../images/play-icon.svg';

const isAllowedEmbedUrl = ( url ) => {
	if ( ! url ) {
		return false;
	}

	try {
		const parsedUrl = new URL( url );

		if ( parsedUrl.protocol !== 'https:' ) {
			return false;
		}

		if (
			parsedUrl.hostname === 'www.youtube.com' &&
			parsedUrl.pathname.startsWith( '/embed/' )
		) {
			const videoId = parsedUrl.pathname.split( '/embed/' )[ 1 ];

			return /^[a-zA-Z0-9_-]{11}$/.test( videoId || '' );
		}

		if (
			parsedUrl.hostname === 'player.vimeo.com' &&
			/^\/video\/\d+$/.test( parsedUrl.pathname )
		) {
			return true;
		}

		return false;
	} catch ( error ) {
		return false;
	}
};

const getEditorIframeSrc = ( url ) => {
	if ( ! url ) {
		return '';
	}

	if ( isAllowedEmbedUrl( url ) ) {
		return url;
	}

	return getIframeSrc( url ) || '';
};

export default function Edit( { attributes, setAttributes, context } ) {
	const {
		title,
		description,
		videoType = 'embed',
		iframeUrl = '',
		videoUrl = '',
		posterImageId = 0,
		posterImageUrl = '',
	} = attributes;

	const videoGridVariation =
		context?.[ 'ambrygen/videoGridVariation' ] || 'default';
	const isFeaturesStyleVariation =
		videoGridVariation === 'variation-features' ||
		videoGridVariation === 'variation-3';
	const iframeSrc = getEditorIframeSrc( iframeUrl );
	const videoTitle = title || __( 'Video player', 'ambrygen-web' );
	const descriptionText = description.replace( /<[^>]+>/g, '' ).trim();
	let modalVideoType;
	let modalVideoSrc;

	if ( ! isFeaturesStyleVariation && iframeSrc ) {
		modalVideoType = 'embed';
		modalVideoSrc = iframeSrc;
	} else if (
		! isFeaturesStyleVariation &&
		videoType === 'mp4' &&
		videoUrl
	) {
		modalVideoType = 'mp4';
		modalVideoSrc = videoUrl;
	}

	const blockProps = useBlockProps( {
		className: isFeaturesStyleVariation
			? 'videos__cards-item'
			: 'video-grid-item videos__cards-item js-gsap-fade',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Video Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<SelectControl
						label={ __( 'Video Type', 'ambrygen-web' ) }
						value={ videoType }
						options={ [
							{
								label: __( 'YouTube / Vimeo', 'ambrygen-web' ),
								value: 'embed',
							},
							{
								label: __(
									'Self Hosted (MP4)',
									'ambrygen-web'
								),
								value: 'mp4',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								videoType: value,
							} )
						}
					/>

					{ videoType === 'embed' && (
						<TextControl
							label={ __( 'Video URL', 'ambrygen-web' ) }
							value={ iframeUrl }
							onChange={ ( value ) =>
								setAttributes( {
									iframeUrl: value,
								} )
							}
							help={ __(
								'Paste YouTube/Vimeo or iframe embed URL.',
								'ambrygen-web'
							) }
						/>
					) }

					{ videoType === 'mp4' && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											videoUrl: media.url || '',
										} )
									}
									allowedTypes={ [ 'video' ] }
									value={ videoUrl }
									render={ ( { open } ) => (
										<Button
											variant="secondary"
											onClick={ open }
										>
											{ videoUrl
												? __(
														'Replace Video',
														'ambrygen-web'
												  )
												: __(
														'Select / Upload Video',
														'ambrygen-web'
												  ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>

							{ videoUrl && (
								<Button
									variant="link"
									isDestructive
									onClick={ () =>
										setAttributes( {
											videoUrl: '',
										} )
									}
								>
									{ __( 'Remove Video', 'ambrygen-web' ) }
								</Button>
							) }

							<TextControl
								label={ __(
									'Self Hosted URL',
									'ambrygen-web'
								) }
								value={ videoUrl }
								onChange={ ( value ) =>
									setAttributes( {
										videoUrl: value || '',
									} )
								}
							/>
						</>
					) }

					<ImageUploader
						label={ __(
							'Thumbnail / Poster Image',
							'ambrygen-web'
						) }
						url={ posterImageUrl }
						id={ posterImageId }
						onSelect={ ( media ) =>
							setAttributes( {
								posterImageId: media.id || 0,
								posterImageUrl: media.url || '',
								posterImageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								posterImageId: 0,
								posterImageUrl: '',
								posterImageAlt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					className={
						isFeaturesStyleVariation
							? 'media_video js-gsap-fade'
							: 'features-media__video media_video'
					}
					data-video-type={ modalVideoType }
					data-video-src={ modalVideoSrc }
					data-video-title={
						! isFeaturesStyleVariation ? videoTitle : undefined
					}
					data-video-description={
						! isFeaturesStyleVariation ? descriptionText : undefined
					}
					data-video-poster={
						! isFeaturesStyleVariation && posterImageUrl
							? posterImageUrl
							: undefined
					}
				>
					{ isFeaturesStyleVariation ? (
						<>
							{ posterImageUrl && (
								<div className="videos__cards-item-thumbnail">
									<img
										src={ posterImageUrl }
										alt={
											title ||
											__(
												'Video thumbnail',
												'ambrygen-web'
											)
										}
										className="videos__cards-item-thumbnail-img"
									/>
								</div>
							) }
							<div className="features-media__video-wrapper--iframe">
								<iframe
									src={ iframeSrc || '' }
									title={ videoTitle }
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="features-media__iframe"
								/>
								<div className="play-icon-video">
									<div
										className="play-icon circle-icon"
										style={ {} }
									>
										<img
											src={ playIcon }
											className="play-icon__img"
											alt={ __(
												'Play Icon',
												'ambrygen-web'
											) }
										/>
									</div>
									<div
										className="pause-icon circle-icon"
										style={ { display: 'none' } }
									>
										<img
											src="/wp-content/uploads/2026/02/pause-icon.svg"
											className="pause-icon__img"
											alt={ __(
												'Pause Icon',
												'ambrygen-web'
											) }
										/>
									</div>
								</div>
							</div>
						</>
					) : (
						<>
							{ videoType === 'embed' && iframeSrc && (
								<div className="features-media__video-wrapper features-media__video-wrapper--iframe">
									<iframe
										src={ iframeSrc }
										title={ videoTitle }
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										className="features-media__iframe"
									/>
								</div>
							) }

							{ videoType === 'mp4' && videoUrl && (
								<div className="features-media__video-wrapper">
									<video
										className="videos"
										playsInline
										controls
										preload="metadata"
										src={ videoUrl }
										poster={ posterImageUrl || '' }
										aria-label={ videoTitle }
									/>
								</div>
							) }

							{ ( ( videoType === 'embed' && ! iframeSrc ) ||
								( videoType === 'mp4' && ! videoUrl ) ) && (
								<p className="text-small">
									{ __(
										'Add a video from the block settings.',
										'ambrygen-web'
									) }
								</p>
							) }

							{ ( iframeSrc || videoUrl ) && (
								<>
									{ posterImageUrl && (
										<div className="videos__cards-item-thumbnail">
											<img
												src={ posterImageUrl }
												alt={
													title ||
													__(
														'Video thumbnail',
														'ambrygen-web'
													)
												}
												className="videos__cards-item-thumbnail-img"
											/>
										</div>
									) }
									<button
										type="button"
										className="play-icon-video"
										aria-label={
											title
												? sprintf(
														/* translators: %s: video title. */
														__(
															'Open %s',
															'ambrygen-web'
														),
														title
												  )
												: __(
														'Open video',
														'ambrygen-web'
												  )
										}
									>
										<span
											className="play-icon circle-icon"
											aria-hidden="true"
										>
											<img
												src={ playIcon }
												className="play-icon__img"
												alt={ __(
													'Play Icon',
													'ambrygen-web'
												) }
											/>
										</span>
										<span
											className="pause-icon circle-icon"
											aria-hidden="true"
											style={ { display: 'none' } }
										>
											<img
												src="/wp-content/uploads/2026/02/pause-icon.svg"
												className="pause-icon__img"
												alt={ __(
													'Pause Icon',
													'ambrygen-web'
												) }
											/>
										</span>
									</button>
								</>
							) }
						</>
					) }
				</div>

				<div
					className="is-style-gl-s16"
					aria-hidden={ isFeaturesStyleVariation ? undefined : true }
				></div>
				<RichText
					tagName="div"
					className="subtitle2-sbold videos__cards-item-title"
					value={ title }
					onChange={ ( value ) =>
						setAttributes( {
							title: value,
						} )
					}
					allowedFormats={ [] }
					placeholder={ __( 'Add video title…', 'ambrygen-web' ) }
				/>
				<RichText
					tagName="div"
					className="subtitle2-sbold videos__cards-item-description"
					style={ { display: 'block' } }
					value={ description }
					onChange={ ( value ) =>
						setAttributes( {
							description: value,
						} )
					}
					allowedFormats={ [ 'core/link' ] }
					placeholder={ __(
						'Add video description…',
						'ambrygen-web'
					) }
				/>
			</div>
		</>
	);
}
