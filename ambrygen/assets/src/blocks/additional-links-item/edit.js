import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import {
	ImageUploader,
	CtaButtonField,
	DEFAULT_IMAGES,
} from '../_shared/components';
import { useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { icon = {}, cta = {} } = attributes;
	const { text = '', url = '', target = '', rel = '' } = cta;
	const blockProps = useBlockProps( { className: 'additional-link__card' } );

	const defaults = DEFAULT_IMAGES();

	// Set default image on first load
	useEffect( () => {
		if ( ! icon?.url ) {
			if ( defaults.placeholder.url ) {
				setAttributes( {
					icon: {
						id: defaults.placeholder.id,
						url: defaults.placeholder.url,
						alt: defaults.placeholder.alt || '',
					},
				} );
			}
		}
	}, [] ); // run once

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
					{ /* Title */ }
					<CtaButtonField
						label="Link"
						value={ attributes.cta }
						onChange={ ( newValue ) =>
							setAttributes( {
								cta: {
									...cta,
									...newValue,
								},
							} )
						}
						showVariant={ false } // optional if you don't need style selector
					/>

					{ /* Icon upload */ }
					<ImageUploader
						label="Icon Image"
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
					{ icon?.url ? (
						<img
							src={ icon.url }
							alt={ icon.alt || '' }
							className="additional-link__logo"
						/>
					) : (
						defaults?.placeholder?.url && (
							<img
								src={ defaults.placeholder.url }
								alt={
									defaults.placeholder.alt || 'Default image'
								}
								className="additional-link__logo is-placeholder"
							/>
						)
					) }
				</div>

				{ text && (
					<div className="additional-link__card-content">
						{ url ? (
							<a
								href="#"
								className="additional-link__card-link"
								target={ target || undefined }
								rel={ rel || undefined }
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
