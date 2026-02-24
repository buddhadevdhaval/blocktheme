import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { useRef } from '@wordpress/element';
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

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		intro,
		headingLevel,
		videoUrl,
		videoPoster,
		careerslink,
		playIcon,
		pauseIcon,
		jobtypeicon,
		joblocationicon,
		videoType,
		link,
	} = attributes;

	const TagName = headingLevel || 'h2';
	const videoRef = useRef( null );

	const handlePlayClick = () => {
		if ( videoRef.current ) {
			videoRef.current.play();
		}
	};
	const playIconUrl = playIcon?.url || '../assets/src/images/play-icon.svg';

	return (
		<>
			<InspectorControls>
				{ /* Heading settings */ }
				<PanelBody title="Heading Settings">
					<TagSelector
						label={ t( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				{ /* Video settings */ }
				{ /* <PanelBody title="Video Settings">
					<TextControl
						label="Video URL"
						value={videoUrl || ''}
						onChange={(value) => setAttributes({ videoUrl: value })}
					/>

					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => setAttributes({ videoPoster: media })}
							allowedTypes={['image']}
							value={videoPoster?.id}
							render={({ open }) => (
								<Button isSecondary onClick={open}>
									{videoPoster ? 'Change Poster Image' : 'Select Poster Image'}
								</Button>
							)}
						/>
					</MediaUploadCheck>
				</PanelBody>
				 */ }
				<PanelBody title="Video Settings">
					<SelectControl
						label="Video Type"
						value={ videoType }
						options={ [
							{ label: 'Self Hosted (MP4)', value: 'mp4' },
							{ label: 'YouTube / Vimeo', value: 'embed' },
						] }
						onChange={ ( value ) =>
							setAttributes( { videoType: value } )
						}
					/>

					{ videoType === 'mp4' && (
						<>
							<TextControl
								label="MP4 Video URL"
								help="Paste a direct .mp4 file URL"
								value={ videoUrl || '' }
								onChange={ ( value ) =>
									isValidUrl( value ) &&
									setAttributes( { videoUrl: value } )
								}
							/>

							{ /* <MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( { videoPoster: media } )
									}
									allowedTypes={ [ 'image' ] }
									value={ videoPoster?.id }
									render={ ( { open } ) => (
										<Button isSecondary onClick={ open }>
											{ videoPoster
												? 'Change Poster Image'
												: 'Select Poster Image' }
										</Button>
									) }
								/>
							</MediaUploadCheck> */ }
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
				</PanelBody>

				{ /* Play icon settings */ }
				<PanelBody title="Icons Setting" initialOpen={ false }>
					{ /* <MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( { playIcon: media } )
							}
							allowedTypes={ [ 'image' ] }
							value={ playIcon?.id || '' }
							render={ ( { open } ) => (
								<Button isSecondary onClick={ open }>
									{ playIcon
										? 'Change Play Icon'
										: 'Select Play Icon' }
								</Button>
							) }
						/>
					</MediaUploadCheck> */ }
					<ImageUploader
						label="Play Icon"
						url={ playIcon?.url }
						onSelect={ ( media ) =>
							setAttributes( { playIcon: media } )
						}
						onRemove={ () => setAttributes( { playIcon: null } ) }
					/>
					<ImageUploader
						label="Pause Icon"
						url={ pauseIcon?.url }
						onSelect={ ( media ) =>
							setAttributes( { pauseIcon: media } )
						}
						onRemove={ () => setAttributes( { pauseIcon: null } ) }
					/>
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
				</PanelBody>
				{ /* Careers link */ }
				<PanelBody title="Careers Link">
					<CtaButtonField
						label={ t( 'Top Link setting' ) }
						textLabel={ t( 'Link Text' ) }
						defaultVariant="primary"
						value={ link }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { link: value } )
						}
					/>
					<CtaButtonField
						label={ t( 'Bottom Link setting' ) }
						textLabel={ t( 'Link Text' ) }
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
					<TagName className="careers-highlight__title block__rowflex--heading-title heading-4 mb-0">
						<RichText
							tagName="div"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							allowedFormats={ [
								'core/bold',
								'core/italic',
								'core/text-color',
							] }
						/>
					</TagName>

					<div className="careers-highlight__intro block__rowflex--block-content subtitle1-reg">
						<RichText
							tagName="div"
							value={ intro }
							onChange={ ( value ) =>
								setAttributes( { intro: value } )
							}
						/>

						{ link?.text && (
							<div className="block_rowflex-link">
								<a
									href="#"
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
									href="#"
									className="site-btn is-style-site-text-btn has-icon"
								>
									{ careerslink.text }
								</a>
							</div>
						) }
					</div>

					<div className="careers-highlight__right">
						<div className="careers-highlight__media">
							{ videoType === 'mp4' && videoUrl && (
								<video
									ref={ videoRef }
									className="videos"
									playsInline
									muted
									preload="metadata"
									loop
									poster={ videoPoster?.url || '' }
								>
									<source src={ videoUrl } type="video/mp4" />
								</video>
							) }
							{ videoType === 'embed' &&
								getIframeSrc( videoUrl ) && (
									<div className="careers-highlight__media video-embed">
										<iframe
											src={ getIframeSrc( videoUrl ) }
											title="Embedded video"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									</div>
								) }
							{ ! videoUrl && (
								<div className="videos-placeholder">
									Add video URL in block settings
								</div>
							) }
							{ videoType === 'mp4' && (
								<div
									className="careers-highlight__play-icon-video"
									onClick={ handlePlayClick }
								>
									<div className="careers-highlight__play-icon">
										<img
											src={ playIconUrl }
											width="24"
											height="24"
											alt="Play"
										/>
									</div>
									<div className="careers-highlight__pause-icon">
										<img
											src={ pauseIcon }
											width="24"
											height="24"
											alt="Pause"
										/>
									</div>
									<div className="careers-highlight__pause-icon">
										<img
											src={ jobtypeicon }
											width="24"
											height="24"
											alt="Pause"
										/>
									</div>
									<div className="careers-highlight__pause-icon">
										<img
											src={ joblocationicon }
											width="24"
											height="24"
											alt="Pause"
										/>
									</div>
								</div>
							) }

							<div
								className="careers-highlight__play-icon-video"
								onClick={ handlePlayClick }
								style={ { cursor: 'pointer' } }
							>
								<div className="careers-highlight__play-icon">
									<img
										src={ playIconUrl }
										width="24"
										height="24"
										alt="Play"
									/>
								</div>
								<div className="careers-highlight__pause-icon">
									<img
										src={ pauseIcon }
										width="24"
										height="24"
										alt="Pause"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
