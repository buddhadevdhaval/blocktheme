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
	if ( select( 'core/edit-site' )?.getEditedPostType?.() ) {
		unsubscribe();
		return;
	}

	const editPost = select( 'core/editor' );

	if ( ! editPost?.getCurrentPostType ) {
		return;
	}

	const postType = editPost.getCurrentPostType();

	if ( postType && postType !== 'conferences' ) {
		unregisterBlockType( BLOCK_NAME );
		unsubscribe();
	}
} );
