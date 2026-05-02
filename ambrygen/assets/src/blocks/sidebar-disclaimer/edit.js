import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export default function Edit() {
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

	return (
		<div { ...blockProps }>
			<div className="sidebar-widget disclaimer-block">
				<p><strong>{ __( 'DISCLAIMER: THIS BLOG DOES NOT PROVIDE MEDICAL ADVICE', 'ambrygen-web' ) }</strong></p>
				<p>{ __( 'Disclaimer content from Theme Options will appear here on the frontend.', 'ambrygen-web' ) }</p>
			</div>
		</div>
	);
}
