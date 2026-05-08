import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import SsrPreview from '../shared/ssr-preview';

registerBlockType(metadata.name, {
    edit: (props) => {
        return <SsrPreview {...props} name={metadata.name} />;
    },
    save: () => null,
});
