import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import {
	ImageUploader,
	CtaButtonField,
	DEFAULT_IMAGES,
} from '../_shared/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const getSafePreviewUrl = ( value ) => {
	const url = ( value || '' ).trim();

	if ( ! url ) {
		return '';
	}

	if ( /^(https?:|mailto:|tel:)/i.test( url ) || url.startsWith( '/' ) ) {
		return url;
	}

	return '';
};

const getLinkRel = ( target, rel ) => {
	const relParts = ( rel || '' ).split( ' ' ).filter( Boolean );

	if ( target === '_blank' ) {
		relParts.push( 'noopener', 'noreferrer' );
	}

	return [ ...new Set( relParts ) ].join( ' ' );
};

export default function Edit( { attributes, setAttributes } ) {
	const { icon = {}, cta = {} } = attributes;
	const { text = '', url = '', target = '', rel = '' } = cta;
	const blockProps = useBlockProps( { className: 'additional-link__card' } );

	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const placeholder = defaults?.placeholder || {};
	const displayIcon = icon?.url ? icon : placeholder;
	const safeUrl = getSafePreviewUrl( url );
	const linkRel = getLinkRel( target, rel );
	const handleImageSelect = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			icon: {
				id: media.id || 0,
				url: media.url,
				alt: media.alt || media.title || '',
			},
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<CtaButtonField
						label={ __( '', 'ambrygen-web' ) }
						value={ cta }
						onChange={ ( newValue ) =>
							setAttributes( {
								cta: {
									...cta,
									...newValue,
								},
							} )
						}
						textPlaceholder={ __(
							'Enter link text…',
							'ambrygen-web'
						) }
						showVariant={ false }
					/>

					<ImageUploader
						label={ __( 'Image', 'ambrygen-web' ) }
						url={ icon?.url }
						onSelect={ handleImageSelect }
						onRemove={ () =>
							setAttributes( {
								icon: {
									id: 0,
									url: '',
									alt: '',
								},
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="additional-link__card-image">
					{ displayIcon?.url && (
						<img
							src={ displayIcon.url }
							alt={ icon?.url ? displayIcon.alt || '' : '' }
							className={ `additional-link__logo${
								icon?.url ? '' : ' is-placeholder'
							}` }
							loading="lazy"
						/>
					) }
				</div>

				{ text && (
					<div className="additional-link__card-content">
						{ safeUrl ? (
							<div
								href={ safeUrl }
								className="additional-link__card-link"
								target={ target || undefined }
								rel={ linkRel || undefined }
								style={ { pointerEvents: 'none' } }
							>
								{ text }
							</div>
						) : (
							<div className="additional-link__card-link">
								{ text }
							</div>
						) }
					</div>
				) }
			</div>
		</>
	);
}
