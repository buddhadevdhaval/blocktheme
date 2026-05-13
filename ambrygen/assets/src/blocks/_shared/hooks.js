import { useEffect } from '@wordpress/element';

const getAllBlocks = ( blocks ) =>
	blocks.reduce( ( acc, block ) => {
		acc.push( block );
		if ( block.innerBlocks?.length ) {
			acc.push( ...getAllBlocks( block.innerBlocks ) );
		}
		return acc;
	}, [] );

/**
 * Ensures each block instance keeps a unique blockId, including after duplication.
 *
 * @param {Object}   args               Hook arguments.
 * @param {string}   args.blockId       Current blockId attribute.
 * @param {string}   args.clientId      Editor clientId for the block instance.
 * @param {boolean}  args.enabled       Whether the hook should manage the blockId.
 * @param {string}   args.idPrefix      Prefix used when generating a new blockId.
 * @param {Function} args.setAttributes Block setAttributes function.
 */
export function useUniqueBlockId( {
	blockId,
	clientId,
	enabled = true,
	idPrefix = 'section',
	setAttributes,
} ) {
	useEffect( () => {
		if ( ! enabled ) {
			return;
		}

		const hasDuplicateId = ( () => {
			if ( ! blockId ) {
				return false;
			}

			const { getBlocks } = wp.data.select( 'core/block-editor' );

			return getAllBlocks( getBlocks() ).some(
				( block ) =>
					block.clientId !== clientId &&
					block.attributes?.blockId === blockId
			);
		} )();

		if ( ! blockId || hasDuplicateId ) {
			setAttributes( {
				blockId: `${ idPrefix }-${ clientId.slice( 0, 8 ) }`,
			} );
		}
	}, [ clientId, blockId, enabled, idPrefix, setAttributes ] );
}
