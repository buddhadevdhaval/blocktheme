import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, SelectControl, Notice } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { label, templatePart } = attributes;

	return (
		<div { ...useBlockProps() }>
			<TextControl
				label={ __( 'Menu Label', 'ambrygen' ) }
				value={ label }
				onChange={ ( value ) => setAttributes( { label: value } ) }
			/>

			<SelectControl
				label={ __( 'Mega Menu Template Part', 'ambrygen' ) }
				value={ templatePart }
				options={ [
					{
						label: __( 'Select Template Part', 'ambrygen' ),
						value: '',
					},
					{
						label: 'Mega Menu – Providers',
						value: 'mega-menu-providers',
					},
					{
						label: 'Mega Menu – Resources',
						value: 'mega-menu-resources',
					},
				] }
				onChange={ ( value ) =>
					setAttributes( { templatePart: value } )
				}
			/>

			<Notice status="info" isDismissible={ false }>
				{ __(
					'Mega menu content is rendered on the frontend.',
					'ambrygen'
				) }
			</Notice>
		</div>
	);
}
