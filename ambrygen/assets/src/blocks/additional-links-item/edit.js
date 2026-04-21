import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import {
	ImageUploader,
	CtaButtonField,
	DEFAULT_IMAGES,
} from '../_shared/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const isValidHttpUrl = ( value ) => /^https?:\/\//i.test( value || '' );

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
	const safeUrl = isValidHttpUrl( url ) ? url : '';
	const linkRel = getLinkRel( target, rel );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					{ /* Title */ }
					<CtaButtonField
						label={ __( 'Link', 'ambrygen-web' ) }
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

					{ /* Icon upload */ }
					<ImageUploader
						label={ __( 'Image', 'ambrygen-web' ) }
						url={ icon?.url }
						onSelect={ ( media ) =>
							setAttributes( {
								icon: {
									id: media.id,
									url: media.url,
									alt: media.alt || media.title || '',
								},
							} )
						}
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

			{ /* Front-end preview */ }
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
							<a
								href={ safeUrl }
								className="additional-link__card-link"
								target={ target || undefined }
								rel={ linkRel || undefined }
								style={ { pointerEvents: 'none' } }
							>
								{ text }
							</a>
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
