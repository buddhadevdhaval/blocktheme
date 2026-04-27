import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: () => {
        const blockProps = useBlockProps({
            className: 'webinar-additional-info-placeholder'
        });

        return (
            <div {...blockProps}>
                <div style={{
                    padding: '20px',
                    border: '1px dashed #ccc',
                    textAlign: 'center',
                    background: '#f9f9f9'
                }}>
                    <strong>Webinar Additional Info (Dynamic)</strong>
                    <p>Content is managed via Theme Options and visibility is toggled in post meta.</p>
                </div>
            </div>
        );
    },
    save: () => null,
});
