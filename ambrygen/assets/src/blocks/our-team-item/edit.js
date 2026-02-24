import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Spinner, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { DEFAULT_IMAGES } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const defaults = DEFAULT_IMAGES();

	// Get all team members
	const teamMembers = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'our_team', {
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
						'our_team',
						postId,
						{
							_embed: true,
						}
				  )
				: null;
		},
		[ postId ]
	);

	// Get sibling selected IDs
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

	// Dropdown options excluding selected
	const options = teamMembers
		? teamMembers
				.filter( ( post ) => ! selectedIds.includes( post.id ) )
				.map( ( post ) => ( {
					label: post.title.rendered,
					value: post.id,
				} ) )
		: [];

	return (
		<div { ...useBlockProps( { className: 'our-team__card' } ) }>
			{ /* Loading */ }
			{ ! teamMembers && <Spinner /> }

			{ /* If no selection yet */ }
			{ ! postId && (
				<SelectControl
					label="Select Team Member"
					value=""
					options={ [
						{ label: 'Select a team member', value: '' },
						...options,
					] }
					onChange={ ( value ) =>
						setAttributes( {
							postId: parseInt( value, 10 ) || null,
						} )
					}
				/>
			) }

			{ /* Selected Member Preview */ }
			{ postId &&
				selectedPost &&
				( () => {
					// const imageUrl =
					// 	selectedPost?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]
					// 		?.source_url || fallbackImage;
					const imageUrl =
						selectedPost?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]
							?.source_url || defaults?.placeholder?.url;
					return (
						<>
							<div className="our-team__image-wrapper">
								<img
									src={ imageUrl }
									alt={ selectedPost.title.rendered }
									className="our-team__image"
								/>
							</div>

							<div className="our-team__info">
								<div className="our-team__name subtitle1-sbold">
									{ selectedPost.title.rendered }
									<div className="our-team__link"></div>
								</div>

								<div className="our-team__role body1">
									{ selectedPost.meta?.designation || '' }
								</div>
							</div>

							{ /* Actions */ }
							<div className="our-team__actions actions-button">
								<Button
									isSecondary
									onClick={ () =>
										setAttributes( { postId: null } )
									}
								>
									Change Member
								</Button>

								<Button
									isDestructive
									onClick={ () => removeBlock( clientId ) }
								>
									Remove Member
								</Button>
							</div>
						</>
					);
				} )() }
		</div>
	);
}
