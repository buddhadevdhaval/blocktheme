import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './style.scss';

export default function Edit( { attributes } ) {
	const blockProps = useBlockProps( {
		className: 'post-hero-media-editor-placeholder',
	} );

	return (
		<div { ...blockProps }>
			<div className="post-media-placeholder-content" style={{
				padding: '40px',
				background: '#f0f0f0',
				border: '2px dashed #ccc',
				textAlign: 'center',
				borderRadius: '8px'
			}}>
				<strong>{ __( 'Post Hero Media (Dynamic)', 'ambrygen-web' ) }</strong>
				<p style={{ margin: '8px 0 0', fontSize: '13px', color: '#666' }}>
					{ __( 'This block will automatically display the Video or Featured Image selected in the Post settings.', 'ambrygen-web' ) }
				</p>
			</div>
		</div>
	);
}
