import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

import {
	CtaButtonField,
	DEFAULT_IMAGES,
	ImageUploader,
} from '../_shared/components';

import playIcon from '../../images/play-icon.svg';

// Use the modern List block structure (list items are inner blocks).
const CONTENT_TEMPLATE = [
	[
		'core/list',
		{ ordered: false },
		[ [ 'core/list-item', { content: '' } ] ],
	],
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		imageAlt,
		imageUrl,
		title,
		subtitle,
		cta = {},
	} = attributes;
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const placeholderImage = defaults?.placeholder || {};
	const previewUrl = imageUrl || placeholderImage.url || '';
	const previewAlt =
		imageAlt || placeholderImage.alt || __( 'Card image', 'ambrygen-web' );
	const blockProps = useBlockProps( {
		className: 'ordering-options__card',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<PanelRow>
						<ImageUploader
							label={ __( 'Card Image', 'ambrygen-web' ) }
							url={ imageUrl }
							onSelect={ ( media ) =>
								setAttributes( {
									imageId: media.id,
									imageUrl: media.url,
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
						/>
					</PanelRow>

					<PanelRow>
						<BaseControl className="ordering-options-editor__cta-control">
							<CtaButtonField
								label={ __( 'CTA', 'ambrygen-web' ) }
								textLabel={ __(
									'Button Text',
									'ambrygen-web'
								) }
								showVariant={ false }
								value={ cta }
								onChange={ ( value ) =>
									setAttributes( { cta: value } )
								}
							/>
						</BaseControl>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="ordering-options__card-image">
					{ previewUrl ? (
						<img
							src={ previewUrl }
							alt={ previewAlt }
							loading="lazy"
						/>
					) : (
						<div className="ordering-options__image-placeholder">
							{ __( 'Add image', 'ambrygen-web' ) }
						</div>
					) }
				</div>

				<div className="ordering-options__card-body">
					<div className="ordering-options__card-content">
						<RichText
							tagName="h3"
							className="heading-5 ordering-options__card-title mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Card title...', 'ambrygen-web' ) }
							withoutInteractiveFormatting={ true }
						/>

						<RichText
							tagName="div"
							className="subtitle2-sbold ordering-options__card-subtitle"
							value={ subtitle }
							onChange={ ( value ) =>
								setAttributes( { subtitle: value } )
							}
							placeholder={ __(
								'Card subtitle...',
								'ambrygen-web'
							) }
							withoutInteractiveFormatting={ true }
						/>

						<div
							className="is-style-gl-s16"
							aria-hidden="true"
						></div>

						<div className="ordering-options__card-copy">
							<InnerBlocks
								allowedBlocks={ [
									'core/list',
									'core/paragraph',
								] }
								template={ CONTENT_TEMPLATE }
								templateLock={ false }
								renderAppender={
									InnerBlocks.ButtonBlockAppender
								}
							/>
						</div>

						<div
							className="is-style-gl-s16"
							aria-hidden="true"
						></div>
					</div>

					<div className="is-style-gl-s24" aria-hidden="true"></div>

					<div className="ordering-options__card-cta">
						<div
							className="site-btn is-style-site-trailing-icon"
							role="presentation"
						>
							{ cta?.text ||
								__( 'Add button text', 'ambrygen-web' ) }
						</div>
					</div>

					{ cta.isVideo && ( cta.videoUrl || cta.iframeUrl ) && (
						<div className="ordering-options__video-preview-backend" style={ { marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '15px' } }>
							<p style={ { fontSize: '12px', color: '#666', marginBottom: '8px' } }>{ __( 'Video Preview (Backend Only):', 'ambrygen-web' ) }</p>
							
							<div className="media_video js-gsap-fade">
								<div className={ cta.videoType === 'mp4' ? 'features-media__video-wrapper' : 'features-media__video-wrapper--iframe' } style={ { position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' } }>
									{ cta.videoType === 'mp4' && cta.videoUrl ? (
										<video
											src={ cta.videoUrl }
											style={ { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' } }
											muted
										/>
									) : (
										<iframe
											src={ cta.iframeUrl || '' }
											title="Video player"
											style={ { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' } }
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
											className="features-media__iframe"
										/>
									) }
									
									<div className="play-icon-video">
										<div className="play-icon circle-icon">
											<img src={ playIcon } className="play-icon__img" alt="Play Icon" />
										</div>
										<div className="pause-icon circle-icon" style={ { display: 'none' } }>
											<img src="/wp-content/uploads/2026/02/pause-icon.svg" className="pause-icon__img" alt="Pause Icon" />
										</div>
									</div>
								</div>

								<RichText
									tagName="div"
									className="subtitle2-sbold videos__cards-item-title"
									value={ videoTitle }
									onChange={ ( value ) => setAttributes( { videoTitle: value } ) }
									placeholder={ __( 'Add video title...', 'ambrygen-web' ) }
								/>

								<RichText
									tagName="div"
									className="subtitle2-sbold videos__cards-item-description"
									style={ { display: 'block' } }
									value={ description }
									onChange={ ( value ) => setAttributes( { description: value } ) }
									placeholder={ __( 'Add video description...', 'ambrygen-web' ) }
								/>

							</div>

							<div className="is-style-gl-s16"></div>
						</div>
					) }


				</div>
			</div>
		</>
	);
}
