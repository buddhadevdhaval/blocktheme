import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { title } = attributes;

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Sidebar Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div
				className="genetic-linked-authors-placeholder"
				style={ {
					padding: '20px',
					border: '1px dashed #ccc',
					textAlign: 'center',
				} }
			>
				<strong>[Genetic Linked Authors]</strong>
				<p>{ title || 'Authors' }</p>
				<small>
					Displays authors linked via &quot;Linked Posts&quot; meta.
				</small>
			</div>
		</div>
	);
}
