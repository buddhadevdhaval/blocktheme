import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { CtaButtonField } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const { cta = {} } = attributes;
	const { text = '', url = '' } = cta;
	const blockProps = useBlockProps( {
		className: 'download-list__item',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Link Settings', 'ambrygen-web' ) } initialOpen={true}>
					<CtaButtonField
						label={ __( 'Link Configuration', 'ambrygen-web' ) }
						value={ cta }
						onChange={ ( newValue ) =>
							setAttributes( {
								cta: {
									...cta,
									...newValue,
								},
							} )
						}
						showVariant={ false }
						textLabel={ __( 'Link Text', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<span className="download-list__item-text">
					{ text || __( 'Enter link text in sidebar…', 'ambrygen-web' ) }
				</span>
			</div>
		</>
	);
}
