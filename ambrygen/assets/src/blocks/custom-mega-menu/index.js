import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import metadata from './block.json';
import Edit from './edit';
import save from './save';
import './style.scss';

const megaMenuIcon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" />
	</svg>
);

registerBlockType( metadata.name, {
	...metadata,
	icon: megaMenuIcon,
	edit: Edit,
	save,
} );

/**
 * Allow Mega Menu block inside Core Navigation
 * @param settings
 * @param name
 */
const allowMegaMenuInNavigation = ( settings, name ) => {
	if ( name !== 'core/navigation' ) {
		return settings;
	}

	return {
		...settings,
		allowedBlocks: [
			...( settings.allowedBlocks || [] ),
			'create-block/mega-menu-block',
		],
	};
};

addFilter(
	'blocks.registerBlockType',
	'ambrygen/mega-menu-in-navigation',
	allowMegaMenuInNavigation
);
