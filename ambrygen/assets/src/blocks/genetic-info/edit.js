import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { isValidVideoUrl, getIframeSrc } from '../../utils/validation.js';
import { ImageUploader, TagSelector } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		headingTag,
		description,
		videoUrl,
		videoType,
		posterImage,
		playIcon,
		pauseIcon,
		iframeUrl,
		imageUrl,
	} = attributes;

	const blockProps = useBlockProps( { className: 'features-media' } );

	const iframeSrc = iframeUrl || getIframeSrc( videoUrl ) || '';

	// Helper to get URL from image object
	const getImageUrl = ( imgObj ) => ( imgObj?.url ? imgObj.url : '' );

	// ------------------------------
	// Inspector Controls
	// ------------------------------
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Video Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					{ /* Heading Tag Selector */ }
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( tag ) =>
							setAttributes( { headingTag: tag } )
						}
					/>

					{ /* Video Type Selector */ }
					<SelectControl
						label={ __( 'Video Type', 'ambrygen-web' ) }
						value={ videoType }
						options={ [
							{
								label: __(
									'Self Hosted (MP4)',
									'ambrygen-web'
								),
								value: 'mp4',
							},
							{
								label: __( 'YouTube / Vimeo', 'ambrygen-web' ),
								value: 'embed',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { videoType: value } )
						}
					/>

					{ /* Embed Video URL */ }
					{ videoType === 'embed' && (
						<>
							<TextControl
								label={ __(
									'Iframe URL (optional)',
									'ambrygen-web'
								) }
								value={ iframeUrl || '' }
								onChange={ ( value ) =>
									setAttributes( { iframeUrl: value } )
								}
							/>
						</>
					) }

					{ /* MP4 Upload */ }
					{ videoType === 'mp4' && (
						<>
							<ImageUploader
								url={ videoUrl }
								onSelect={ ( media ) =>
									setAttributes( { videoUrl: media.url } )
								}
								label={ __(
									'Upload / Replace Video',
									'ambrygen-web'
								) }
							/>

							<TextControl
								label={ __(
									'Self Hosted Url',
									'ambrygen-web'
								) }
								value={ videoUrl || '' }
								onChange={ ( value ) =>
									setAttributes( { videoUrl: value || '' } )
								}
								className={
									videoUrl && ! isValidVideoUrl( videoUrl )
										? 'has-error'
										: ''
								}
							/>
						</>
					) }

					{ /* Poster Image */ }
					<ImageUploader
						url={ getImageUrl( posterImage ) }
						id={ posterImage?.id || null }
						onSelect={ ( media ) =>
							setAttributes( {
								posterImage: { id: media.id, url: media.url },
							} )
						}
						onRemove={ () =>
							setAttributes( { posterImage: null } )
						}
						label={ __( 'Video Poster Image', 'ambrygen-web' ) }
					/>

					{ /* Play Icon */ }
					<ImageUploader
						url={ getImageUrl( playIcon ) }
						id={ playIcon?.id || null }
						onSelect={ ( media ) =>
							setAttributes( {
								playIcon: { id: media.id, url: media.url },
							} )
						}
						onRemove={ () => setAttributes( { playIcon: null } ) }
						label={ __( 'Play Icon Image', 'ambrygen-web' ) }
					/>

					{ /* Pause Icon */ }
					<ImageUploader
						url={ getImageUrl( pauseIcon ) }
						id={ pauseIcon?.id || null }
						onSelect={ ( media ) =>
							setAttributes( {
								pauseIcon: { id: media.id, url: media.url },
							} )
						}
						onRemove={ () => setAttributes( { pauseIcon: null } ) }
						label={ __( 'Pause Icon Image', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* ------------------------------
                Block Content
            ------------------------------ */ }
			<div { ...blockProps }>
				<div className="features-media__header block__rowflex">
					<RichText
						tagName={ headingTag || 'h2' }
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
						className="block-title block__rowflex--heading-title heading-2 mb-0 genetic-heading"
					/>

					<RichText
						tagName="p"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Genetic testing studies your genes…',
							'ambrygen-web'
						) }
						className="block__rowflex--block-content subtitle1-reg genetic-description"
					/>
				</div>

				{ /* Optional Feature Image */ }
				{ imageUrl && (
					<ImageUploader
						url={ imageUrl }
						onSelect={ ( media ) =>
							setAttributes( { imageUrl: media.url } )
						}
						onRemove={ () => setAttributes( { imageUrl: '' } ) }
						label={ __( 'Upload Feature Image', 'ambrygen-web' ) }
					/>
				) }

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				{ /* Video Embed */ }
				{ videoType === 'embed' && iframeSrc && (
					<div className="features-media__video media_video">
						<div className="features-media__video-wrapper features-media__video-wrapper--iframe">
							<iframe
								src={ iframeSrc }
								title={ __(
									'Genetic testing video',
									'ambrygen-web'
								) }
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="features-media__iframe"
							/>
						</div>

						<div className="play-icon-video">
							{ playIcon?.url && (
								<div className="play-icon">
									<img
										src={ playIcon.url }
										width="24"
										height="24"
										alt="Play"
									/>
								</div>
							) }
							{ pauseIcon?.url && (
								<div className="pause-icon">
									<img
										src={ pauseIcon.url }
										width="24"
										height="24"
										alt="Pause"
									/>
								</div>
							) }
						</div>
					</div>
				) }

				{ /* MP4 Video */ }
				{ videoType === 'mp4' && videoUrl && (
					<div className="features-media__video-wrapper">
						<video
							controls
							src={ videoUrl }
							poster={ posterImage?.url || '' }
							className="videos"
						/>
						<div className="play-icon-video">
							{ playIcon?.url && (
								<div className="play-icon">
									<img
										src={ playIcon.url }
										width="24"
										height="24"
										alt="Play"
									/>
								</div>
							) }
							{ pauseIcon?.url && (
								<div className="pause-icon">
									<img
										src={ pauseIcon.url }
										width="24"
										height="24"
										alt="Pause"
									/>
								</div>
							) }
						</div>
					</div>
				) }
			</div>
		</>
	);
}
