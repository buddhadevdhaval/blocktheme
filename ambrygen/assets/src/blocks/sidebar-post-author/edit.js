import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import SsrPreview from '../shared/ssr-preview';
import metadata from './block.json';

export default function Edit( { attributes, setAttributes } ) {
	const { postType } = useSelect( ( select ) => ( {
		postType: select( 'core/editor' ).getCurrentPostType(),
	} ), [] );

	const blockProps = useBlockProps();

	if ( postType && postType !== 'post' ) {
		return (
			<div { ...blockProps }>
				<div className="ambrygen-block-placeholder">
					{ __( 'This block is only available for Blog Posts.', 'ambrygen-web' ) }
				</div>
			</div>
		);
	}

	const { title } = attributes;

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Widget Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<SsrPreview
				attributes={ attributes }
				name={ metadata.name }
			/>
		</div>
	);
}
