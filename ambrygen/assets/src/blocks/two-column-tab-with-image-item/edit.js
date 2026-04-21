import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	ImageUploader,
	ImagePlaceholder,
	DEFAULT_IMAGES,
	CtaButtonField,
} from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		sectiontitle,
		description,
		imageUrl,
		imageAlt,
		cta = {},
		showFullImage,
	} = attributes;

	const stepNumber = useSelect(
		( select ) => {
			const { getBlockIndex } = select( 'core/block-editor' );
			return getBlockIndex( clientId );
		},
		[ clientId ]
	);

	const defaultPlaceholder = useMemo(
		() => DEFAULT_IMAGES()?.placeholder || {},
		[]
	);

	const blockProps = useBlockProps( {
		className: `vertical-tabs__item${
			showFullImage ? ' show-full-image' : ''
		}`,
	} );
	const previewImageUrl = imageUrl || defaultPlaceholder.url;
	const previewImageAlt = imageAlt || defaultPlaceholder.alt || '';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Image', 'ambrygen-web' ) }
					initialOpen
				>
					<ToggleControl
						label={ __( 'Show full image', 'ambrygen-web' ) }
						checked={ !! showFullImage }
						onChange={ ( value ) =>
							setAttributes( { showFullImage: value } )
						}
					/>
					<ImageUploader
						label={ __( 'Card Image', 'ambrygen-web' ) }
						url={ imageUrl || defaultPlaceholder.url }
						onSelect={ ( media ) =>
							setAttributes( {
								imageUrl: media.url,
								imageId: media.id,
								imageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: undefined,
								imageAlt: '',
							} )
						}
					/>
					<CtaButtonField
						label={ __( 'Description Link', 'ambrygen-web' ) }
						value={ cta }
						onChange={ ( value ) =>
							setAttributes( {
								cta: {
									...cta,
									...value,
								},
							} )
						}
						showVariant={ false }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="vertical-tabs__header">
					<RichText
						tagName="div"
						className="caption-semi-bold vertical-tabs__step-label"
						value={
							attributes.customStepLabel
								? attributes.customStepLabel
								: `${ __( 'Step', 'ambrygen-web' ) } ${
										stepNumber + 1
								  }`
						}
						onChange={ ( value ) =>
							setAttributes( { customStepLabel: value } )
						}
						placeholder={ `${ __( 'Step', 'ambrygen-web' ) } ${
							stepNumber + 1
						}` }
						allowedFormats={ [] }
					/>

					<RichText
						tagName="div"
						className="subtitle1-sbold vertical-tabs__title"
						value={ sectiontitle }
						onChange={ ( value ) =>
							setAttributes( { sectiontitle: value } )
						}
						placeholder={ __( 'Step Title', 'ambrygen-web' ) }
						allowedFormats={ [] }
					/>

					<RichText
						tagName="div"
						className="body1-regular vertical-tabs__desc"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Step description…',
							'ambrygen-web'
						) }
					/>
					<div className="is-style-gl-s20"></div>
					{ cta?.url && (
						<a
							href={ cta.url }
							className="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up"
							onClick={ ( event ) => event.preventDefault() }
							target={ cta?.target || undefined }
							rel={ cta?.rel || undefined }
						>
							{ cta?.text || cta.url }
						</a>
					) }
				</div>

				<div className="vertical-tabs__content">
					<div className="vertical-tabs__image-wrapper">
						{ previewImageUrl ? (
							<img
								className="vertical-tabs__image"
								src={ previewImageUrl }
								alt={ previewImageAlt }
							/>
						) : (
							<ImagePlaceholder />
						) }
					</div>
				</div>
			</div>
		</>
	);
}
