import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps({
        className: 'genetic-testing-genes-editor'
    });

	return (
		<div { ...blockProps }>
			<div style={{ 
                padding: '20px', 
                border: '2px dashed #ccc', 
                backgroundColor: '#f9f9f9',
                textAlign: 'center' 
            }}>
				<h3 style={{ margin: '0 0 10px 0' }}>{ __( 'Genetic Testing Genes', 'ambrygen-web' ) }</h3>
				<p style={{ margin: 0, opacity: 0.7 }}>
                    { __( 'This block dynamically displays the Genes Analyzed accordion for linked products.', 'ambrygen-web' ) }
                </p>
			</div>
		</div>
	);
}
