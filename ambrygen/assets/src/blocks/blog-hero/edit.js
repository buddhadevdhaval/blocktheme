import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	Button,
	BaseControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( {
		className: 'blog-hero-editor',
	} );

	return (
		<Fragment>
			<InspectorControls>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="blog-hero-placeholder">
					<h3>{ __( 'Blog Hero Block', 'ambrygen-web' ) }</h3>
					<p>
						{ __( 'This block dynamically displays the post title, tags, author, date, and share icons.', 'ambrygen-web' ) }
					</p>
					<p>
						<em>{ __( 'Media (Image/Video) is now managed via the Post Details options at the bottom of the editor.', 'ambrygen-web' ) }</em>
					</p>
				</div>
			</div>
		</Fragment>
	);
}
