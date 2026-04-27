import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { useEffect, useState, useMemo } from '@wordpress/element';
import {
	PanelBody,
	SelectControl,
	TextControl,
	Button,
	ToggleControl,
	Modal,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { isValidVideoUrl, getIframeSrc } from '../../utils/validation.js';
import {
	ImageUploader,
	TagSelector,
	DEFAULT_IMAGES,
	CtaButtonField,
} from '../_shared/components';
import playIcon from '../../images/play-icon.svg';

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
		showImage = false,
		isHeaderVertical = false,
	} = attributes;

	const blockProps = useBlockProps( { className: 'features-media' } );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const iframeSrc = iframeUrl || getIframeSrc( videoUrl ) || '';
	const [ isVideoModalOpen, setIsVideoModalOpen ] = useState( false );
	const hasEditorVideo =
		! showImage &&
		( ( videoType === 'embed' && iframeSrc ) ||
			( videoType === 'mp4' && videoUrl ) );
	const imageMedia = useSelect(
		( select ) => ( imageId ? select( 'core' ).getMedia( imageId ) : null ),
		[ imageId ]
	);
	const imagePreviewUrl = imageMedia?.source_url || imageUrl || '';

	const displayUrl = useMemo( () => {
		return imagePreviewUrl || DEFAULT_IMAGES().placeholder.url;
	}, [ imagePreviewUrl ] );

	useEffect( () => {
		setIsVideoModalOpen( false );
	}, [ iframeSrc, videoType, videoUrl ] );

	// Helper to get URL from image object
	const getImageUrl = ( imgObj ) => ( imgObj?.url ? imgObj.url : '' );
	const getPlaySrc = ( src ) =>
		src.includes( 'autoplay=1' )
			? src
			: `${ src }${ src.includes( '?' ) ? '&' : '?' }autoplay=1`;

	const onPlayClick = () => {
		setIsVideoModalOpen( true );
	};

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
						type='heading'
					/>

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
						label={ __( 'Show Description', 'ambrygen-web' ) }
						checked={ showDescription }
						onChange={ ( value ) =>
							setAttributes( { showDescription: value } )
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
								} )
							}
							onRemove={ () =>
								setAttributes( {
									imageId: 0,
									imageUrl: '',
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
								] }
								onChange={ ( value ) =>
									setAttributes( { videoType: value } )
								}
							/>

							{ videoType === 'embed' && (
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
													isSecondary
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
											'Self Hosted Url',
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
										},
									} )
								}
								onRemove={ () =>
									setAttributes( { posterImage: null } )
								}
								label={ __(
									'Video Poster Image',
									'ambrygen-web'
								) }
							/>
						</>
					) }

					<CtaButtonField
						label={ __( 'Link Settings', 'ambrygen-web' ) }
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

			{ /* ------------------------------
                Block Content
            ------------------------------ */ }
			<div { ...blockProps }>
				<div
					className={ `features-media__header block__rowflex is-${
						isHeaderVertical ? 'vertical' : 'horizontal'
					}` }
				>
					<RichText
						tagName={ headingTag || 'h2' }
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
						className="block-title block__rowflex--heading-title heading-2 mb-0 genetic-heading"
					/>
					<div className='block__rowflex--block-content'>
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
					{ link?.text && (
						<div className="block_rowflex-link">
							<a
								href={ link.url || '#' }
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
							alt={
								imagePreviewUrl
									? __(
											'Theme video image',
											'ambrygen-web'
									  )
									: __(
											'Default placeholder image',
											'ambrygen-web'
									  )
							}
						/>
					</div>
				) }

				<>
					{ /* Video Embed */ }
					{ ! showImage && (
						<div className="features-media__video media_video">
							{ ! showImage &&
								videoType === 'embed' &&
								iframeSrc && (
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
											/>
										</div>

										<div className="play-icon-video">
											<button
												type="button"
												className="play-icon circle-icon"
												onClick={ onPlayClick }
											>
												<img
													src={ playIcon }
													alt={ __(
														'Play Icon',
														'ambrygen-web'
													) }
													className="play-icon__img"
												/>
											</button>
										</div>
									</>
								) }

							{ /* MP4 Video */ }
							{ ! showImage &&
								videoType === 'mp4' &&
								videoUrl && (
									<div className="features-media__video-wrapper">
										<video
											controls
											src={ videoUrl }
											poster={ posterImage?.url || '' }
											className="videos"
										/>
										<div className="play-icon-video">
											<button
												type="button"
												className="play-icon circle-icon"
												onClick={ onPlayClick }
											>
												<img
													src={ playIcon }
													alt={ __(
														'Play Icon',
														'ambrygen-web'
													) }
													className="play-icon__img"
												/>
											</button>
										</div>
									</div>
								) }
						</div>
					) }
				</>
				{ isVideoModalOpen && hasEditorVideo && (
					<Modal
						title={ __( 'Video', 'ambrygen-web' ) }
						className="modal-popup--video"
						onRequestClose={ () => setIsVideoModalOpen( false ) }
					>
						<div className="modal-content__video-wrapper">
							{ videoType === 'mp4' && videoUrl && (
								<video
									className="videos"
									controls
									autoPlay
									playsInline
									src={ videoUrl }
									poster={ posterImage?.url || '' }
								/>
							) }
							{ videoType === 'embed' && iframeSrc && (
								<iframe
									src={ getPlaySrc( iframeSrc ) }
									title={ __(
										'Theme video',
										'ambrygen-web'
									) }
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="features-media__iframe"
								/>
							) }
						</div>
					</Modal>
				) }
			</div>
		</>
	);
}
