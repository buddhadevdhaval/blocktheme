import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	ImageUploader,
	ImagePlaceholder,
	DEFAULT_IMAGES,
	CtaButtonField,
} from '../_shared/components';
import { useMemo, useCallback } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		stepTitle,
		sectiontitle,
		description,
		imageUrl,
		imageAlt,
		cta = {},
		showFullImage,
	} = attributes;
	const resolvedStepTitle = stepTitle || sectiontitle || '';

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

	const handleImageSelect = useCallback(
		( media ) => {
			if ( ! media?.url ) {
				return;
			}

			setAttributes( {
				imageUrl: media.url,
				imageId: media.id || 0,
				imageAlt: media.alt || '',
			} );
		},
		[ setAttributes ]
	);
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
						url={ imageUrl || '' }
						onSelect={ handleImageSelect }
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: undefined,
								imageAlt: '',
							} )
						}
					/>
					<CtaButtonField
						label={ __( 'CTA Link Settings', 'ambrygen-web' ) }
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
					<div className="caption-semi-bold vertical-tabs__step-label block-description">
						{ `${ __( 'Step', 'ambrygen-web' ) } ${
							stepNumber + 1
						}` }
					</div>

					<RichText
						tagName="div"
						className="subtitle1-sbold vertical-tabs__title block-description"
						value={ resolvedStepTitle }
						onChange={ ( value ) =>
							setAttributes( {
								stepTitle: value,
								sectiontitle: '',
							} )
						}
						placeholder={ __( 'Add Step Title…', 'ambrygen-web' ) }
						allowedFormats={ [] }
					/>

					<RichText
						tagName="div"
						className="body1-regular vertical-tabs__desc block-description"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Add Step Description…',
							'ambrygen-web'
						) }
					/>
					{ cta?.url && (
						<>
							<div className="is-style-gl-s20"></div>
							<div className="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow">
								{ cta?.text || cta.url }
							</div>
						</>
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
