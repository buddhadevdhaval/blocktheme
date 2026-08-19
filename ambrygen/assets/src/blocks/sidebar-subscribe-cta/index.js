import { registerBlockType, updateBlockType } from '@wordpress/blocks';
import { select, subscribe } from '@wordpress/data';
import metadata from './block.json';
import Edit from './edit';

const BLOCK_NAME = metadata.name;

registerBlockType( BLOCK_NAME, {
	edit: Edit,
	save: () => null,
} );

/**
 * Handle block visibility in the inserter based on post type.
 * Instead of unregistering (which breaks existing content), we hide it from the inserter.
 */
const unsubscribe = subscribe( () => {
	const editSite = select( 'core/edit-site' );

	if ( editSite?.getEditedPostType?.() ) {
		unsubscribe();
		return;
	}

	const editPost = select( 'core/editor' );

	if ( ! editPost?.getCurrentPostType ) {
		return;
	}

	const postType = editPost.getCurrentPostType();

	if ( postType ) {
		const isAllowed = postType === 'post';
		const blockType = select( 'core/blocks' ).getBlockType( BLOCK_NAME );

		if (
			typeof updateBlockType === 'function' &&
			blockType &&
			blockType.supports?.inserter !== isAllowed
		) {
			updateBlockType( BLOCK_NAME, {
				supports: {
					...blockType.supports,
					inserter: isAllowed,
				},
			} );
		}
	}
} );
