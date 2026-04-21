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
	Modal,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ImageUploader,
	CtaButtonField,
	TagSelector,
} from '../_shared/components';
import { isValidVideoUrl, getIframeSrc } from '../../utils/validation.js';
import playIcon from '../../images/play-icon.svg';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
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

	const [ isVideoModalOpen, setIsVideoModalOpen ] = useState( false );
	const iframeSrc = getIframeSrc( videoUrl );
	const hasEditorVideo =
		( videoType === 'mp4' && videoObj?.url ) ||
		( videoType === 'embed' && iframeSrc );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	useEffect( () => {
		setIsVideoModalOpen( false );
	}, [ iframeSrc, videoType, videoObj?.url ] );

	const getPlaySrc = ( src ) =>
		src.includes( 'autoplay=1' )
			? src
			: `${ src }${ src.includes( '?' ) ? '&' : '?' }autoplay=1`;

	const handlePlayClick = ( event ) => {
		if ( event ) {
			event.preventDefault();
		}
		setIsVideoModalOpen( true );
	};

	return (
		<>
			<InspectorControls>
				{ /* Heading settings */ }
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
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

					{ videoType === 'mp4' && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											videoObj: {
												id: media.id,
												url: media.url,
											},
										} )
									}
									allowedTypes={ [ 'video' ] }
									value={ videoObj?.id }
									render={ ( { open } ) => (
										<Button isSecondary onClick={ open }>
											{ videoObj?.url
												? 'Change Video'
												: 'Select / Upload Video' }
										</Button>
									) }
								/>
							</MediaUploadCheck>

							{ videoObj?.url && (
								<p>Selected: { videoObj.url }</p>
							) }

							<Button
								isLink
								isDestructive
								onClick={ () =>
									setAttributes( { videoObj: null } )
								}
							>
								Remove Video
							</Button>

							<ImageUploader
								label="Video Poster Image"
								url={ videoPoster?.url }
								onSelect={ ( media ) =>
									setAttributes( { videoPoster: media } )
								}
								onRemove={ () =>
									setAttributes( { videoPoster: null } )
								}
							/>
						</>
					) }

					{ videoType === 'embed' && (
						<TextControl
							label="YouTube or Vimeo URL"
							help="Supports youtube.com, youtu.be, vimeo.com"
							value={ videoUrl || '' }
							onChange={ ( value ) =>
								isValidVideoUrl( value ) &&
								setAttributes( { videoUrl: value } )
							}
						/>
					) }
					<ImageUploader
						label="Job Type Icon"
						url={ jobtypeicon?.url }
						onSelect={ ( media ) =>
							setAttributes( { jobtypeicon: media } )
						}
						onRemove={ () =>
							setAttributes( { jobtypeicon: null } )
						}
					/>
					<ImageUploader
						label="Job Location Icon"
						url={ joblocationicon?.url }
						onSelect={ ( media ) =>
							setAttributes( { joblocationicon: media } )
						}
						onRemove={ () =>
							setAttributes( { joblocationicon: null } )
						}
					/>
					<CtaButtonField
						label={ __( 'Top Link setting', 'ambrygen-web' ) }
						textLabel={ __( 'Link Text', 'ambrygen-web' ) }
						defaultVariant="primary"
						value={ link }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { link: value } )
						}
					/>
					<CtaButtonField
						label={ __( 'Bottom Link setting', 'ambrygen-web' ) }
						textLabel={ __( 'Link Text', 'ambrygen-web' ) }
						defaultVariant="primary"
						value={ careerslink }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { careerslink: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps( { className: 'careers-highlight' } ) }>
				<div className="careers-highlight__header block__rowflex">
					<RichText
						tagName={ headingLevel || 'h2' }
						value={ title }
						placeholder="Add Heading..."
						className="careers-highlight__title block__rowflex--heading-title heading-4 mb-0"
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/text-color',
						] }
					/>
					<div className="careers-highlight__intro block__rowflex--block-content subtitle1-reg">
						<RichText
							tagName="div"
							value={ intro }
							placeholder="Add Description..."
							onChange={ ( value ) =>
								setAttributes( { intro: value } )
							}
						/>

						{ link?.text && (
							<div className="block_rowflex-link">
								<a
									href={ link.url || '#' }
									className="site-btn is-style-site-text-btn has-icon"
								>
									{ link.text }
								</a>
							</div>
						) }
					</div>
				</div>
				<div className="is-style-gl-s50"></div>

				<div className="careers-highlight__row">
					<div className="careers-highlight__left">
						<div className="custom-scroll-jobs">
							<div className="careers-highlight__jobs">
								<InnerBlocks
									allowedBlocks={ [
										'ambrygen/job-list-item',
									] }
								/>
							</div>
						</div>

						{ careerslink?.text && (
							<div className="block-btn">
								<div className="is-style-gl-s32"></div>
								<a
									href={ careerslink.url || '#' }
									className="site-btn is-style-site-text-btn has-icon"
								>
									{ careerslink.text }
								</a>
							</div>
						) }
					</div>

					<div className="careers-highlight__right">
						<div className="careers-highlight__media  media_video">
							{ videoType === 'mp4' && videoObj?.url && (
								<video
									className="videos"
									playsInline
									muted
									preload="metadata"
									loop
									poster={ videoPoster?.url || '' }
								>
									<source
										src={ videoObj.url }
										type="video/mp4"
									/>
								</video>
							) }
							{ videoType === 'embed' && (
								<div className="careers-highlight__media  media_video video-embed">
									<iframe
										src={ iframeSrc }
										title="Embedded video"
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							) }
							{ ! hasEditorVideo && (
								<div className="videos-placeholder">
									Add video URL in block settings
								</div>
							) }
							{ hasEditorVideo && (
								<button
									type="button"
									className="play-icon-video"
									aria-label={ __(
										'Open video',
										'ambrygen-web'
									) }
									onClick={ handlePlayClick }
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
								</button>
							) }
						</div>
					</div>
				</div>
				{ isVideoModalOpen && (
					<Modal
						title={ __( 'Video', 'ambrygen-web' ) }
						className="modal-popup--video"
						onRequestClose={ () => setIsVideoModalOpen( false ) }
					>
						<div className="modal-content__video-wrapper">
							{ videoType === 'mp4' && videoObj?.url && (
								<video
									className="videos"
									controls
									autoPlay
									playsInline
									src={ videoObj.url }
									poster={ videoPoster?.url || '' }
								/>
							) }
							{ videoType === 'embed' && iframeSrc && (
								<iframe
									src={ getPlaySrc( iframeSrc ) }
									title={ __(
										'Embedded video',
										'ambrygen-web'
									) }
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							) }
						</div>
					</Modal>
				) }
			</div>
		</>
	);
}
