import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Mega Menu Settings', 'ambrygen-vip-web' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Label', 'ambrygen-vip-web' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<strong>
					{ label || __( 'Mega Menu', 'ambrygen-vip-web' ) }
				</strong>
			</div>
		</>
	);
}
