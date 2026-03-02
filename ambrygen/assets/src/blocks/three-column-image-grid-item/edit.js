import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';

import { PanelBody } from '@wordpress/components';

import {
	ImageUploader,
	ImagePlaceholder,
	CtaButtonField,
	DEFAULT_IMAGES,
} from '../_shared/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { sectiontitle, description, imageUrl, cta } = attributes;

	const defaultImage = DEFAULT_IMAGES().placeholder.url;
	const displayImage = imageUrl || defaultImage;

	const blockProps = useBlockProps( {
		className: 'approach-card',
	} );

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
								imageId: undefined,
							} )
						}
					/>

					<CtaButtonField
						label={ __( 'CTA', 'ambrygen-web' ) }
						value={ cta }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { cta: value } )
						}
					/>
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
						<div
							className="is-style-gl-s24"
							aria-hidden="true"
						></div>

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
								className="approach-card__description body2-reg"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder={ __(
									'Card description…',
									'ambrygen-web'
								) }
							/>
						</div>
					</div>

					<div className="is-style-gl-s32" aria-hidden="true"></div>

					{ /* CTA Preview */ }
					{ cta?.text && (
						<div className="approach-card__cta-wrapper">
							<span className="approach-card__cta">
								{ cta.text }
							</span>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
