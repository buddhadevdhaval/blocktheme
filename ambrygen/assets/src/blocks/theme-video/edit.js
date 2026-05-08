import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { useEffect, useMemo } from '@wordpress/element';
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
	CtaButtonField,
	BlockExamplePreview,
} from '../_shared/components';
import playIcon from '../../images/play-icon.svg';

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

const getEditorIframeSrc = ( url ) => {
	const embedSource = getEmbedSourceFromInput( url );

	if ( ! embedSource ) {
		return '';
	}

	if ( isAllowedEmbedUrl( embedSource ) ) {
		return embedSource;
	}

	return getIframeSrc( embedSource ) || '';
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		link,
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
		imageAlt = '',
		showImage = false,
		isHeaderVertical = false,
	} = attributes;

	const isExample = blockId === 'example-block-preview';
	const blockProps = useBlockProps( { className: 'features-media' } );
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, isExample, setAttributes ] );

	const iframeSrc = getEditorIframeSrc( iframeUrl );
	const hasPosterImage = Boolean( posterImage?.url );
	const imageMedia = useSelect(
		( select ) => ( imageId ? select( 'core' ).getMedia( imageId ) : null ),
		[ imageId ]
	);
	const imagePreviewUrl = imageMedia?.source_url || imageUrl || '';
	const displayUrl = imagePreviewUrl || defaults?.placeholder?.url || '';

	const getImageUrl = ( imgObj ) => ( imgObj?.url ? imgObj.url : '' );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="theme-video-example-preview"
				imagePath="/assets/src/images/theme-video/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( tag ) =>
							setAttributes( { headingTag: tag } )
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Video Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __(
							'Show image instead of video',
							'ambrygen-web'
						) }
						checked={ showImage }
						onChange={ ( value ) =>
							setAttributes( { showImage: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Vertical Header Layout', 'ambrygen-web' ) }
						checked={ !! isHeaderVertical }
						onChange={ ( value ) =>
							setAttributes( { isHeaderVertical: !! value } )
						}
					/>

					{ showImage && (
						<ImageUploader
							url={ imagePreviewUrl }
							onSelect={ ( media ) =>
								setAttributes( {
									imageId: media.id || 0,
									imageUrl: '',
									imageAlt: media.alt || '',
								} )
							}
							onRemove={ () =>
								setAttributes( {
									imageId: 0,
									imageUrl: '',
									imageAlt: '',
								} )
							}
							label={ __( 'Feature Image', 'ambrygen-web' ) }
						/>
					) }

					{ ! showImage && (
						<>
							<SelectControl
								label={ __( 'Video Type', 'ambrygen-web' ) }
								value={ videoType }
								options={ [
									{
										label: __(
											'Upload video (MP4)',
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
								] }
								onChange={ ( value ) =>
									setAttributes( { videoType: value } )
								}
							/>

							{ videoType === 'embed' && (
								<TextControl
									label={ __( 'Video URL', 'ambrygen-web' ) }
									value={ iframeUrl || '' }
									onChange={ ( value ) =>
										setAttributes( { iframeUrl: value } )
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
													videoUrl: media.url,
												} )
											}
											allowedTypes={ [ 'video' ] }
											value={ videoUrl }
											render={ ( { open } ) => (
												<Button
													variant="secondary"
													onClick={ open }
													style={ {
														marginBottom: '10px',
													} }
												>
													{ videoUrl
														? __(
																'Change Video',
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
											isLink
											isDestructive
											onClick={ () =>
												setAttributes( {
													videoUrl: '',
												} )
											}
											style={ {
												marginBottom: '15px',
												display: 'block',
											} }
										>
											{ __(
												'Remove Video',
												'ambrygen-web'
											) }
										</Button>
									) }

									<TextControl
										label={ __(
											'Video URL',
											'ambrygen-web'
										) }
										value={ videoUrl || '' }
										onChange={ ( value ) =>
											setAttributes( {
												videoUrl: value || '',
											} )
										}
										className={
											videoUrl &&
											! isValidVideoUrl( videoUrl )
												? 'has-error'
												: ''
										}
									/>
								</>
							) }

							<ImageUploader
								url={ getImageUrl( posterImage ) }
								id={ posterImage?.id || null }
								onSelect={ ( media ) =>
									setAttributes( {
										posterImage: {
											id: media.id,
											url: media.url,
											alt: media.alt || '',
										},
									} )
								}
								onRemove={ () =>
									setAttributes( { posterImage: null } )
								}
								label={ __(
									'Thumbnail Image',
									'ambrygen-web'
								) }
							/>
						</>
					) }

					<CtaButtonField
						label=""
						textLabel={ __( 'Link Text', 'ambrygen-web' ) }
						defaultVariant="primary"
						value={ link }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { link: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					className={ `features-media__header block__rowflex is-${
						isHeaderVertical ? 'vertical' : 'horizontal'
					}` }
				>
					<div className="block__rowflex--col-left">
						<RichText
							tagName={ headingTag || 'h2' }
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
							className="block-title block__rowflex--heading-title heading-2 mb-0 genetic-heading"
						/>
					</div>
					<div className="block__rowflex--block-content">
						{ showDescription && (
							<RichText
								tagName="p"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder={ __(
									'Add Description…',
									'ambrygen-web'
								) }
								className={ ` subtitle1-reg genetic-description${
									showDescription ? '' : ' is-hidden'
								}` }
							/>
						) }
						{ link?.text && link?.url && (
							<div className="block_rowflex-link">
								<a
									href={ link.url }
									className="site-btn is-style-site-text-btn has-right-arrow"
								>
									{ link.text }
								</a>
							</div>
						) }
					</div>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				{ showImage && displayUrl && (
					<div className="features-media has-image">
						<img
							src={ displayUrl }
							className="features-media__image"
							alt={ imagePreviewUrl ? imageAlt || '' : '' }
						/>
					</div>
				) }

				{ ! showImage && (
					<div className="features-media__video media_video">
						{ hasPosterImage && (
							<div className="videos__cards-item-thumbnail">
								<img
									src={ posterImage.url }
									alt={ posterImage?.alt || '' }
									className="videos__cards-item-thumbnail-img"
								/>
							</div>
						) }
						{ videoType === 'embed' && iframeSrc && (
							<>
								<div className="features-media__video-wrapper features-media__video-wrapper--iframe">
									<iframe
										src={ iframeSrc }
										title={ __(
											'Theme video',
											'ambrygen-web'
										) }
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										className="features-media__iframe"
										tabIndex="-1"
										aria-hidden="true"
									/>
								</div>

								<div className="play-icon-video">
									<div className="play-icon circle-icon">
										<img
											src={ playIcon }
											alt=""
											aria-hidden="true"
											className="play-icon__img"
										/>
									</div>
								</div>
							</>
						) }

						{ videoType === 'mp4' && videoUrl && (
							<div className="features-media__video-wrapper">
								<video
									src={ videoUrl }
									poster={ posterImage?.url || '' }
									className="videos"
									preload="metadata"
									tabIndex="-1"
									aria-hidden="true"
								/>
								<div className="play-icon-video">
									<div className="play-icon circle-icon">
										<img
											src={ playIcon }
											alt=""
											aria-hidden="true"
											className="play-icon__img"
										/>
									</div>
								</div>
							</div>
						) }
					</div>
				) }
			</div>
		</>
	);
}
