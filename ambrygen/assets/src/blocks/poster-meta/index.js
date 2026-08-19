import { registerBlockType, unregisterBlockType } from '@wordpress/blocks';
import { select, subscribe } from '@wordpress/data';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

const BLOCK_NAME = metadata.name;

registerBlockType( BLOCK_NAME, {
	edit: Edit,
	save,
} );

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

	if ( postType && postType !== 'poster' ) {
		unregisterBlockType( BLOCK_NAME );
		unsubscribe();
	}
} );
