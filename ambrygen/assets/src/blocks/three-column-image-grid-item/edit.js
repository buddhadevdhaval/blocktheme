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
	PanelRow,
	BaseControl,
} from '@wordpress/components';

import {
	ImageUploader,
	ImagePlaceholder,
	CtaButtonField,
	DEFAULT_IMAGES,
	ItemHeader,
	PanelItem,
	Field,
} from '../_shared/components';
import { useArrayHandlers } from '../_shared/utils';
import { __ } from '@wordpress/i18n';

// Use same icon as ordering options if possible or standard play icon
import playIcon from '../../images/play-icon.svg';

const DEFAULT_FILE = {
	fileId: 0,
	fileUrl: '',
	fileName: '',
	sizeType: 'small',
};

export default function Edit( { attributes, setAttributes, context } ) {
	const {
		sectiontitle,
		description,
		imageUrl,
		cta = {},
		files,
		videoTitle,
		videoContent,
		formTitle,
		formContent,
	} = attributes;

	const blockVariation = context?.[ 'ambrygen/threeColumnVariation' ];
	const isVariationThree = blockVariation === 'variation-three';
	const descriptionClass = isVariationThree ? 'body1' : 'body2-reg';
	const hasTextContent =
		sectiontitle || description || ( files && files.length > 0 );

	const defaultImage = DEFAULT_IMAGES().placeholder.url;
	const displayImage = imageUrl || defaultImage;

	const blockProps = useBlockProps( {
		className: 'approach-card',
	} );

	const { update, add, remove, move } = useArrayHandlers(
		setAttributes,
		'files'
	);

	const updateFileMedia = ( index, media ) => {
		setAttributes( ( prev ) => {
			const nextFiles = [ ...( prev.files || [] ) ];
			nextFiles[ index ] = {
				...nextFiles[ index ],
				fileUrl: media?.url || '',
				fileId: media?.id || 0,
				fileName:
					media?.title ||
					media?.filename ||
					nextFiles[ index ]?.fileName ||
					'',
			};
			return { files: nextFiles };
		} );
	};

	const clearFileMedia = ( index ) => {
		setAttributes( ( prev ) => {
			const nextFiles = [ ...( prev.files || [] ) ];
			nextFiles[ index ] = {
				...nextFiles[ index ],
				fileUrl: '',
				fileId: 0,
			};
			return { files: nextFiles };
		} );
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
						url={ imageUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								imageUrl: media.url,
								imageId: media.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: 0,
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
									'CTA Link Settings',
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
									label={ __( 'Button Text', 'ambrygen-web' ) }
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
									label={ __( 'Button Text', 'ambrygen-web' ) }
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

					{ ( files || [] ).map( ( fileItem, index ) => (
						<PanelItem key={ index }>
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

							<Field
								label={ __(
									'File Name (optional)',
									'ambrygen-web'
								) }
								value={ fileItem.fileName || '' }
								onChange={ ( value ) =>
									update( index, 'fileName', value )
								}
								onClick={ ( e ) => e.stopPropagation() }
							/>

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
						onClick={ () => add( DEFAULT_FILE ) }
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
								<img src={ displayImage } alt="" />
							) : (
								<ImagePlaceholder
									text={ __(
										'No image set',
										'ambrygen-web'
									) }
								/>
							) }
						</div>
						{ hasTextContent && (
							<div
								className="is-style-gl-s24"
								aria-hidden="true"
							></div>
						) }

						<div className="approach-card__text-content">
							<RichText
								tagName="h3"
								className="approach-card__title heading-5 mb-0"
								value={ sectiontitle }
								onChange={ ( value ) =>
									setAttributes( { sectiontitle: value } )
								}
								placeholder={ __(
									'Card Title',
									'ambrygen-web'
								) }
								allowedFormats={ [ 'core/text-color' ] }
							/>

							<RichText
								tagName="div"
								className={ `approach-card__description ${ descriptionClass }` }
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder={ __(
									'Card description…',
									'ambrygen-web'
								) }
							/>
							{ /* Show files if available */ }
							{ files?.length > 0 && (
								<div className="approach-card__files">
									{ files.map( ( file, index ) => {
										const extension = file?.fileUrl
											?.split( '.' )
											.pop()
											?.toUpperCase();

										return (
											<div
												key={ index }
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

					{ cta?.text && hasTextContent && (
						<div
							className="is-style-gl-s32"
							aria-hidden="true"
						></div>
					) }

					{ /* CTA Preview */ }
					{ cta?.text && (
						<div className="approach-card__cta-wrapper">
							<div
								className={ `approach-card__cta ${
									cta.variant || 'dark'
								} ${
									cta.isVideo
										? 'is-style-site-trailing-icon'
										: ''
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
												src={ cta.iframeUrl || '' }
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
													alt="Play Icon"
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
								<div
									className="body2-reg mb-3"
									dangerouslySetInnerHTML={ {
										__html: formContent,
									} }
								/>
							</div>
						) }
				</div>
			</div>
		</>
	);
}
