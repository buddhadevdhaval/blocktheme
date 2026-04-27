import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
    return (
        <div {...useBlockProps()}>
            <div className="genetic-testing-block-placeholder" style={{
                padding: '20px',
                border: '1px dashed #ccc',
                backgroundColor: '#f9f9f9',
                textAlign: 'center'
            }}>
                <strong>{__('Genetic Testing Description', 'ambrygen-web')}</strong>
                <p style={{ margin: '5px 0 0' }}>{__('Content and heading will appear if post content is present.', 'ambrygen-web')}</p>
            </div>
        </div>
    );
}
