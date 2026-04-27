import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps({
        className: 'genetic-testing-details-editor'
    });

	return (
		<div { ...blockProps }>
			<div style={{ 
                padding: '20px', 
                border: '2px dashed #ccc', 
                backgroundColor: '#f9f9f9',
                textAlign: 'center' 
            }}>
				<h3 style={{ margin: '0 0 10px 0' }}>{ __( 'Genetic Testing Details', 'ambrygen-web' ) }</h3>
				<p style={{ margin: 0, opacity: 0.7 }}>
                    { __( 'This block dynamically displays Intro, Consider, and Important sections from Post Meta.', 'ambrygen-web' ) }
                </p>
			</div>
		</div>
	);
}
