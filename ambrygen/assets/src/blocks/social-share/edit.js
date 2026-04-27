import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<div className="share-post">
				<div className="share-post__wrapper">
					<span className="share-post__label text-md-medium">{ __( 'Share:', 'ambrygen-web' ) }</span>
					<div className="share-post__icons">
						<span className="share-post__icon share-post__facebook" style={ { opacity: 0.5 } }>
							<div style={ { width: 24, height: 24, background: '#eee', borderRadius: '50%' } }></div>
						</span>
						<span className="share-post__icon share-post__twitter" style={ { opacity: 0.5 } }>
							<div style={ { width: 24, height: 24, background: '#eee', borderRadius: '50%' } }></div>
						</span>
						<span className="share-post__icon share-post__linkedin" style={ { opacity: 0.5 } }>
							<div style={ { width: 24, height: 24, background: '#eee', borderRadius: '50%' } }></div>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
