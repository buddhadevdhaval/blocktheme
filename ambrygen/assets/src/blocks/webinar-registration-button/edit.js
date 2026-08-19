import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ServerSideRender } from '../_shared/server-side-render';

export default function Edit( { attributes, setAttributes, context, name } ) {
	const blockProps = useBlockProps();
	const { newTab } = attributes;
	const previewPostId = context?.postId ? Number( context.postId ) : 0;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Button Settings', 'ambrygen-web' ) }>
					<ToggleControl
						label={ __( 'Open in new tab', 'ambrygen-web' ) }
						checked={ newTab }
						onChange={ ( val ) => setAttributes( { newTab: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block={ name }
					attributes={ {
						...attributes,
						previewPostId,
					} }
				/>
			</div>
		</>
	);
}
