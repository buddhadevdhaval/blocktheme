import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

import {
	PanelBody,
	Button,
	SelectControl,
	ToggleControl,
	TextControl,
	BaseControl,
} from '@wordpress/components';

import {
	ImageUploader,
	ImagePlaceholder,
	CtaButtonField,
	DEFAULT_IMAGES,
	ItemHeader,
	PanelItem,
} from '../_shared/components';
import { useArrayHandlers } from '../_shared/utils';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo } from '@wordpress/element';
import { getIframeSrc } from '../../utils/validation.js';

// Use same icon as ordering options if possible or standard play icon
import playIcon from '../../images/play-icon.svg';

const createFileId = () =>
	`file-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 9 ) }`;

const DEFAULT_FILE = {
	id: '',
	fileId: 0,
	fileUrl: '',
	fileName: '',
	sizeType: 'small',
};

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
		sectiontitle,
		imageId,
		imageUrl,
		imageAlt,
		cta = {},
		files,
		videoTitle,
		videoContent,
		formTitle,
		formContent,
	} = attributes;

	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const normalizedFiles = useMemo(
		() =>
			( files || [] ).map( ( file ) => ( {
				...file,
				id: file?.id || createFileId(),
			} ) ),
		[ files ]
	);
	const validFiles = useMemo(
		() =>
			normalizedFiles.filter(
				( file ) => file?.fileUrl && file.fileUrl.trim()
			),
		[ normalizedFiles ]
	);
	const defaultImage = defaults?.placeholder?.url || '';
	const defaultImageId = defaults?.placeholder?.id || 0;
	const isDefaultImage =
		imageUrl === defaultImage && imageId === defaultImageId;
	const displayImage = imageUrl || defaultImage;
	const displayImageAlt = imageUrl ? imageAlt || '' : '';
	const videoPreviewSrc = getEditorIframeSrc( cta.iframeUrl || '' );

	useEffect( () => {
		if (
			normalizedFiles.length > 0 &&
			normalizedFiles.some(
				( file, index ) => file.id !== files?.[ index ]?.id
			)
		) {
			setAttributes( { files: normalizedFiles } );
		}
	}, [ files, normalizedFiles, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'approach-card',
	} );

	const { update, add, remove, move } = useArrayHandlers(
		setAttributes,
		'files'
	);

	const updateImage = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			imageUrl: media.url,
			imageId: media.id || 0,
			imageAlt: media.alt || '',
		} );
	};

	const updateFileMedia = ( index, media ) => {
		if ( ! media?.url ) {
			return;
		}

		const nextFiles = [ ...( files || [] ) ];
		nextFiles[ index ] = {
			...nextFiles[ index ],
			fileUrl: media.url,
			fileId: media.id || 0,
			fileName:
				media.title ||
				media.filename ||
				nextFiles[ index ]?.fileName ||
				'',
		};

		setAttributes( { files: nextFiles } );
	};

	const clearFileMedia = ( index ) => {
		const nextFiles = [ ...( files || [] ) ];
		nextFiles[ index ] = {
			...nextFiles[ index ],
			fileUrl: '',
			fileId: 0,
		};

		setAttributes( { files: nextFiles } );
	};

	return (
		<>
			{ /* Sidebar Controls */ }
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						label={ __( 'Card Image', 'ambrygen-web' ) }
						url={ isDefaultImage ? '' : imageUrl }
						onSelect={ updateImage }
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: 0,
								imageAlt: '',
							} )
						}
					/>

					<div
						className="is-style-gl-s16"
						style={ { height: '16px' } }
					></div>

					<BaseControl className="ordering-options-editor__cta-control">
						<ToggleControl
							label={ __( 'Enable Popup?', 'ambrygen-web' ) }
							checked={ !! cta.isPopup }
							onChange={ ( value ) =>
								setAttributes( {
									cta: {
										...cta,
										isPopup: value,
									},
								} )
							}
						/>

						{ !! cta.isPopup && (
							<SelectControl
								label={ __( 'Popup Type', 'ambrygen-web' ) }
								value={ cta.popupType || 'video' }
								options={ [
									{
										label: __( 'Video', 'ambrygen-web' ),
										value: 'video',
									},
									{
										label: __( 'Form', 'ambrygen-web' ),
										value: 'form',
									},
								] }
								onChange={ ( value ) =>
									setAttributes( {
										cta: {
											...cta,
											popupType: value,
										},
									} )
								}
							/>
						) }

						{ ! cta.isPopup && (
							<CtaButtonField
								label={ __(
									'',
									'ambrygen-web'
								) }
								value={ cta }
								showVariant={ true }
								onChange={ ( value ) =>
									setAttributes( { cta: value } )
								}
							/>
						) }

						{ !! cta.isPopup && cta.popupType === 'video' && (
							<div
								style={ {
									marginTop: '16px',
									paddingTop: '16px',
									borderTop: '1px solid #ccc',
								} }
							>
								<p
									style={ {
										marginBottom: '8px',
										fontWeight: '500',
									} }
								>
									{ __( 'Video Settings', 'ambrygen-web' ) }
								</p>

								<TextControl
									label={ __(
										'Button Text',
										'ambrygen-web'
									) }
									value={ cta.text || '' }
									onChange={ ( value ) =>
										setAttributes( {
											cta: { ...cta, text: value },
										} )
									}
								/>

								<SelectControl
									label={ __( 'Video Type', 'ambrygen-web' ) }
									value={ cta.videoType || 'embed' }
									options={ [
										{
											label: __(
												'Embed (Youtube/Vimeo)',
												'ambrygen-web'
											),
											value: 'embed',
										},
										{
											label: __(
												'MP4 File',
												'ambrygen-web'
											),
											value: 'mp4',
										},
									] }
									onChange={ ( value ) =>
										setAttributes( {
											cta: { ...cta, videoType: value },
										} )
									}
								/>

								{ cta.videoType === 'mp4' ? (
									<div style={ { marginBottom: '16px' } }>
										<MediaUploadCheck>
											<MediaUpload
												onSelect={ ( media ) =>
													setAttributes( {
														cta: {
															...cta,
															videoUrl:
																media.url || '',
														},
													} )
												}
												allowedTypes={ [ 'video' ] }
												value={ cta.videoUrl }
												render={ ( { open } ) => (
													<Button
														variant="secondary"
														onClick={ open }
														style={ {
															width: '100%',
															justifyContent:
																'center',
															marginBottom: '8px',
														} }
													>
														{ cta.videoUrl
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
										<TextControl
											label={ __(
												'MP4 Video URL',
												'ambrygen-web'
											) }
											value={ cta.videoUrl || '' }
											onChange={ ( value ) =>
												setAttributes( {
													cta: {
														...cta,
														videoUrl: value,
													},
												} )
											}
										/>
									</div>
								) : (
									<TextControl
										label={ __(
											'Embed URL',
											'ambrygen-web'
										) }
										value={ cta.iframeUrl || '' }
										onChange={ ( value ) =>
											setAttributes( {
												cta: {
													...cta,
													iframeUrl: value,
												},
											} )
										}
										help={ __(
											'Paste YouTube/Vimeo or iframe embed URL.',
											'ambrygen-web'
										) }
									/>
								) }
							</div>
						) }

						{ !! cta.isPopup && cta.popupType === 'form' && (
							<div
								style={ {
									marginTop: '16px',
									paddingTop: '16px',
									borderTop: '1px solid #ccc',
								} }
							>
								<p
									style={ {
										marginBottom: '8px',
										fontWeight: '500',
									} }
								>
									{ __( 'Form Settings', 'ambrygen-web' ) }
								</p>

								<TextControl
									label={ __(
										'Button Text',
										'ambrygen-web'
									) }
									value={ cta.text || '' }
									onChange={ ( value ) =>
										setAttributes( {
											cta: { ...cta, text: value },
										} )
									}
								/>

								<TextControl
									label={ __( 'Form Title', 'ambrygen-web' ) }
									value={ formTitle || '' }
									onChange={ ( value ) =>
										setAttributes( { formTitle: value } )
									}
								/>

								<RichText
									tagName="div"
									value={ formContent || '' }
									onChange={ ( value ) =>
										setAttributes( { formContent: value } )
									}
									placeholder={ __(
										'Form Content...',
										'ambrygen-web'
									) }
									className="form-content-editor"
								/>
							</div>
						) }
					</BaseControl>
				</PanelBody>

				<PanelBody
					title={ __( 'File Downloads', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<p className="components-base-control__help">
						{ __(
							'Add files to show a download link with size type.',
							'ambrygen-web'
						) }
					</p>

					{ ( files || [] ).length === 0 && (
						<p className="components-base-control__help">
							{ __( 'No files added yet.', 'ambrygen-web' ) }
						</p>
					) }

					{ normalizedFiles.map( ( fileItem, index ) => (
						<PanelItem key={ fileItem.id }>
							<ItemHeader
								index={ index }
								label={ fileItem.fileName || fileItem.fileUrl }
								total={ ( files || [] ).length }
								onMove={ ( i, dir ) => move( i, dir ) }
								onRemove={ ( i ) => remove( i, 0 ) }
								minCount={ 0 }
							/>

							<div style={ { marginBottom: '8px' } }>
								<MediaUploadCheck>
									<MediaUpload
										allowedTypes={ [
											'application',
											'text',
											'audio',
											'video',
										] }
										onSelect={ ( media ) =>
											updateFileMedia( index, media )
										}
										render={ ( { open } ) => (
											<Button
												variant="secondary"
												onClick={ ( e ) => {
													e.stopPropagation();
													open();
												} }
											>
												{ fileItem.fileUrl
													? __(
															'Replace File',
															'ambrygen-web'
													  )
													: __(
															'Select File',
															'ambrygen-web'
													  ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								{ fileItem.fileUrl && (
									<Button
										variant="secondary"
										isDestructive
										onClick={ ( e ) => {
											e.stopPropagation();
											clearFileMedia( index );
										} }
										style={ { marginLeft: '8px' } }
									>
										{ __( 'Remove File', 'ambrygen-web' ) }
									</Button>
								) }
							</div>

							<SelectControl
								label={ __( 'File Size Type', 'ambrygen-web' ) }
								value={ fileItem.sizeType || 'small' }
								options={ [
									{
										label: __( 'Small', 'ambrygen-web' ),
										value: 'small',
									},
									{
										label: __( 'Large', 'ambrygen-web' ),
										value: 'large',
									},
								] }
								onChange={ ( value ) =>
									update( index, 'sizeType', value )
								}
							/>
						</PanelItem>
					) ) }

					<Button
						variant="primary"
						onClick={ () =>
							add( { ...DEFAULT_FILE, id: createFileId() } )
						}
						style={ { width: '100%', justifyContent: 'center' } }
					>
						{ __( 'Add File', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			{ /* Editor Canvas */ }
			<div { ...blockProps }>
				<div className="approach-card__inner">
					<div className="approach-card__image-wrapper">
						<div className="approach-card__image">
							{ displayImage ? (
								<img
									src={ displayImage }
									alt={ displayImageAlt }
								/>
							) : (
								<ImagePlaceholder
									text={ __(
										'No image set',
										'ambrygen-web'
									) }
								/>
							) }
						</div>
						<div
							className="is-style-gl-s24"
							aria-hidden="true"
						></div>

						<div className="approach-card__text-content">
							<RichText
								tagName="h3"
								className="approach-card__title heading-5 mb-0 block-inside-title"
								value={ sectiontitle }
								onChange={ ( value ) =>
									setAttributes( { sectiontitle: value } )
								}
								placeholder={ __(
									'Add Title...',
									'ambrygen-web'
								) }
								allowedFormats={ [ 'core/text-color' ] }
							/>

							{ /* Show files if available */ }
							{ validFiles.length > 0 && (
								<div className="approach-card__files mt-2">
									{ validFiles.map( ( file ) => {
										const extension = file?.fileUrl
											?.split( '.' )
											.pop()
											?.toUpperCase();

										return (
											<div
												key={ file.id }
												className="approach-card__file"
											>
												{ extension && (
													<span className="file-type">
														({ extension })
													</span>
												) }
											</div>
										);
									} ) }
								</div>
							) }
						</div>
					</div>

					<div
						className="is-style-gl-s32"
						aria-hidden="true"
					></div>

					{ /* CTA Preview */ }
					{ cta?.text && (
						<div className="approach-card__cta-wrapper">
							<div
								className={ `approach-card__cta ${
									cta.variant || 'dark'
								} site-btn ${
									cta.isPopup && cta.popupType === 'video'
										? 'has-video-arrow has-right-arrow'
										: ''
								}${
									cta.isPopup && cta.popupType === 'form'
										? ' has-form-arrow has-right-arrow'
										: ''
								}${
									! cta.isPopup ? ' has-right-arrow' : ''
								}` }
								role="presentation"
							>
								{ cta.text }
							</div>
						</div>
					) }

					{ /* Video Preview (Backend Only) */ }
					{ !! cta.isPopup &&
						cta.popupType === 'video' &&
						( cta.videoUrl || cta.iframeUrl ) && (
							<div
								className="ordering-options__video-preview-backend"
								style={ {
									marginTop: '20px',
									borderTop: '1px dashed #ccc',
									paddingTop: '15px',
								} }
							>
								<p
									style={ {
										fontSize: '12px',
										color: '#666',
										marginBottom: '8px',
									} }
								>
									{ __(
										'Video Popup Preview',
										'ambrygen-web'
									) }
								</p>

								<RichText
									tagName="div"
									className="heading-6 mb-2"
									value={ videoTitle }
									onChange={ ( value ) =>
										setAttributes( { videoTitle: value } )
									}
									placeholder={ __(
										'Video Title (Popup)',
										'ambrygen-web'
									) }
								/>

								<RichText
									tagName="div"
									className="body2-reg mb-3"
									value={ videoContent }
									onChange={ ( value ) =>
										setAttributes( { videoContent: value } )
									}
									placeholder={ __(
										'Video Content (Popup)',
										'ambrygen-web'
									) }
								/>

								<div className="has-video-arrow js-gsap-fade">
									<div
										className={
											cta.videoType === 'mp4'
												? 'features-media__video-wrapper'
												: 'features-media__video-wrapper--iframe'
										}
										style={ {
											position: 'relative',
											width: '100%',
											paddingTop: '56.25%',
											background: '#000',
										} }
									>
										{ cta.videoType === 'mp4' &&
										cta.videoUrl ? (
											<video
												src={ cta.videoUrl }
												style={ {
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													objectFit: 'cover',
												} }
												autoPlay
												loop
												muted
												playsInline
											/>
										) : (
											<iframe
												src={ videoPreviewSrc }
												title="Video player"
												style={ {
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													border: 'none',
												} }
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
												className="features-media__iframe"
											/>
										) }

										<div className="play-icon-video">
											<div className="play-icon circle-icon">
												<img
													src={ playIcon }
													className="play-icon__img"
													alt=""
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						) }
					{ /* Form Preview (Backend Only) */ }
					{ !! cta.isPopup &&
						cta.popupType === 'form' &&
						( formTitle || formContent ) && (
							<div
								className="ordering-options__form-preview-backend"
								style={ {
									marginTop: '20px',
									borderTop: '1px dashed #ccc',
									paddingTop: '15px',
								} }
							>
								<p
									style={ {
										fontSize: '12px',
										color: '#666',
										marginBottom: '8px',
									} }
								>
									{ __(
										'Form Popup Preview',
										'ambrygen-web'
									) }
								</p>

								<div className="heading-6 mb-2">
									{ formTitle }
								</div>
								<RichText.Content
									tagName="div"
									className="body2-reg mb-3"
									value={ formContent }
								/>
							</div>
						) }
				</div>
			</div>
		</>
	);
}
