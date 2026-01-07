
import edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';

registerBlockType(metadata.name, {
    edit,
    save,
});
