import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Spinner, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );

	// Get all genetic testing posts
	const posts = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'genetic-testing', {
			per_page: -1,
			orderby: 'title',
			post_status: 'publish',
			order: 'asc',
		} );
	}, [] );

	// Get current selected post details
	const selectedPost = useSelect(
		( select ) => {
			return postId
				? select( 'core' ).getEntityRecord(
						'postType',
						'genetic-testing',
						postId
				  )
				: null;
		},
		[ postId ]
	);

	// Get sibling selected IDs to avoid duplicates in the same instance
	const selectedIds = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const parentId = blockEditor.getBlockRootClientId( clientId );
			const siblings = blockEditor.getBlocks( parentId );

			return siblings
				.map( ( block ) => block.attributes?.postId )
				.filter( ( id ) => id && id !== postId );
		},
		[ clientId, postId ]
	);

	const options = posts
		? posts
				.filter( ( p ) => ! selectedIds.includes( p.id ) )
				.map( ( p ) => ( {
					label: p.title.rendered,
					value: p.id,
				} ) )
		: [];

	return (
		<div { ...useBlockProps( { className: 'genetic-testing-selection__item' } ) }>
			{ ! posts && <Spinner /> }

			{ ! postId && (
				<SelectControl
					label={ __( 'Select Genetic Test', 'ambrygen-web' ) }
					value=""
					options={ [
						{ label: __( 'Choose...', 'ambrygen-web' ), value: '' },
						...options,
					] }
					onChange={ ( value ) =>
						setAttributes( {
							postId: parseInt( value, 10 ) || null,
						} )
					}
				/>
			) }

			{ postId && selectedPost && (
				<div className="genetic-testing-selection__selected">
					<div className="genetic-testing-selection__name">
						<strong>Selected:</strong> { selectedPost.title.rendered }
					</div>
					<div className="genetic-testing-selection__actions">
						<Button
							isSecondary
							size="small"
							onClick={ () => setAttributes( { postId: null } ) }
						>
							{ __( 'Change', 'ambrygen-web' ) }
						</Button>
						<Button
							isDestructive
							size="small"
							onClick={ () => removeBlock( clientId ) }
						>
							{ __( 'Remove', 'ambrygen-web' ) }
						</Button>
					</div>
				</div>
			) }
		</div>
	);
}
