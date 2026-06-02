import { __ } from '@wordpress/i18n';
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
import pauseIcon from '../../images/pause-icon.svg';

const getEmbedSourceFromInput = ( url ) => {
	if ( ! url || typeof url !== 'string' ) {
		return '';
	}

	const trimmedUrl = url.trim();
	const iframeSrcMatch = trimmedUrl.match( /src=["']([^"']+)["']/i );

	return iframeSrcMatch?.[ 1 ] || trimmedUrl;
};

const isAllowedEmbedUrl = ( url ) => {
	const embedSource = getEmbedSourceFromInput( url );

	if ( ! embedSource ) {
		return false;
	}

	try {
		const parsedUrl = new URL( embedSource );
		const hostname = parsedUrl.hostname.replace( /^www\./, '' );

		if ( parsedUrl.protocol !== 'https:' ) {
			return false;
		}

		if (
			[ 'youtube.com', 'youtube-nocookie.com', 'm.youtube.com' ].includes(
				hostname
			) &&
			parsedUrl.pathname.startsWith( '/embed/' )
		) {
			const videoId = parsedUrl.pathname.split( '/embed/' )[ 1 ];

			return /^[a-zA-Z0-9_-]{11}$/.test( videoId || '' );
		}

		if (
			hostname === 'player.vimeo.com' &&
			/^\/video\/\d+$/.test( parsedUrl.pathname )
		) {
			return true;
		}

		return false;
	} catch ( error ) {
		return false;
	}
};

const getNonAutoplayEmbedUrl = ( url ) => {
	if ( ! url ) {
		return '';
	}

	try {
		const parsedUrl = new URL( url );

		parsedUrl.searchParams.delete( 'autoplay' );

		return parsedUrl.toString();
	} catch ( error ) {
		return url;
	}
};

const getEditorIframeSrc = ( url ) => {
	const embedSource = getEmbedSourceFromInput( url );

	if ( ! embedSource ) {
		return '';
	}

	if ( isAllowedEmbedUrl( embedSource ) ) {
		return getNonAutoplayEmbedUrl( embedSource );
	}

	return getNonAutoplayEmbedUrl( getIframeSrc( embedSource ) || '' );
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		description,
		videoType = 'embed',
		iframeUrl = '',
		videoUrl = '',
		posterImageId = 0,
		posterImageUrl = '',
		posterImageAlt = '',
	} = attributes;

	const iframeSrc = getEditorIframeSrc( iframeUrl );
	const videoTitle = title || __( 'Video player', 'ambrygen-web' );
	const hasEmbedVideo = videoType === 'embed' && Boolean( iframeSrc );
	const hasMp4Video = videoType === 'mp4' && Boolean( videoUrl );
	const hasPosterImage = Boolean( posterImageUrl );

	const blockProps = useBlockProps( {
		className: 'videos__cards-item',
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
								label: __( 'Upload video (MP4)', 'ambrygen-web' ),
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
												? __( 'Replace Video', 'ambrygen-web' )
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
								label={ __( 'Video URL', 'ambrygen-web' ) }
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
						label={ __( 'Thumbnail Image', 'ambrygen-web' ) }
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
				<div className="media_video">
					{ hasPosterImage && (
						<div className="videos__cards-item-thumbnail">
							<img
								src={ posterImageUrl }
								alt={
									posterImageAlt ||
									title ||
									__( 'Video thumbnail', 'ambrygen-web' )
								}
								className="videos__cards-item-thumbnail-img"
							/>
						</div>
					) }
					{ hasEmbedVideo && (
						<div className="features-media__video-wrapper--iframe">
							<iframe
								src={ iframeSrc }
								title={ videoTitle }
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="features-media__iframe"
								tabIndex="-1"
								aria-hidden="true"
							/>
							<div className="play-icon-video">
								<div className="play-icon circle-icon">
									<img
										src={ playIcon }
										className="play-icon__img"
										alt=""
									/>
								</div>
								<div
									className="pause-icon circle-icon"
									style={ { display: 'none' } }
								>
									<img
										src={ pauseIcon }
										className="pause-icon__img"
										alt=""
									/>
								</div>
							</div>
						</div>
					) }
					{ hasMp4Video && (
						<div className="features-media__video-wrapper">
							<video
								className="videos"
								playsInline
								preload="metadata"
								src={ videoUrl }
								poster={ posterImageUrl || undefined }
								aria-label={ videoTitle }
								tabIndex="-1"
								aria-hidden="true"
							/>
							<div className="play-icon-video">
								<div className="play-icon circle-icon">
									<img
										src={ playIcon }
										className="play-icon__img"
										alt=""
									/>
								</div>
								<div
									className="pause-icon circle-icon"
									style={ { display: 'none' } }
								>
									<img
										src={ pauseIcon }
										className="pause-icon__img"
										alt=""
									/>
								</div>
							</div>
						</div>
					) }
				</div>

				<div className="is-style-gl-s16" aria-hidden="true"></div>
				<RichText
					tagName="div"
					className="subtitle2-sbold videos__cards-item-title block-description"
					value={ title }
					onChange={ ( value ) =>
						setAttributes( {
							title: value,
						} )
					}
					allowedFormats={ [] }
					placeholder={ __( 'Add video title...', 'ambrygen-web' ) }
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
						'Add video description...',
						'ambrygen-web'
					) }
				/>
			</div>
		</>
	);
}
