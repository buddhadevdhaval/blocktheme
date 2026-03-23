import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Spinner, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { DEFAULT_IMAGES } from '../_shared/components';

const getMemberPreviewData = ( post, defaults ) => {
	const featuredMedia = post?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];

	return {
		imageUrl: featuredMedia?.source_url || defaults?.placeholder?.url,
		imageAlt: featuredMedia?.alt_text || post?.title?.rendered || '',
	};
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	// Get all team members
	// Query args are static, so no dependencies are required.
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
	const options = useMemo(
		() =>
			teamMembers
				? teamMembers
						.filter( ( post ) => ! selectedIds.includes( post.id ) )
						.map( ( post ) => ( {
							label: post.title.rendered,
							value: post.id,
						} ) )
				: [],
		[ teamMembers, selectedIds ]
	);

	return (
		<div { ...useBlockProps( { className: 'our-team__card' } ) }>
			{ /* Loading */ }
			{ ! teamMembers && <Spinner /> }

			{ /* If no selection yet */ }
			{ ! postId && (
				<SelectControl
					label={ __( 'Select Team Member', 'ambrygen-web' ) }
					value=""
					options={ [
						{
							label: __( 'Select a team member', 'ambrygen-web' ),
							value: '',
						},
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
					const { imageUrl, imageAlt } = getMemberPreviewData(
						selectedPost,
						defaults
					);
					return (
						<>
							<div className="our-team__image-wrapper">
								<img
									src={ imageUrl }
									alt={ imageAlt }
									className="our-team__image"
								/>
							</div>

							<div className="our-team__info">
								<div className="our-team__name subtitle1-sbold">
									{ selectedPost.title.rendered }
									<div
										className="our-team__link"
										aria-hidden="true"
									></div>
								</div>

								<div className="our-team__role body1">
									{ selectedPost.meta?.designation || '' }
								</div>
							</div>

							<div className="is-style-gl-s24"></div>

							{ /* Actions */ }
							<div className="our-team__actions actions-button">
								<Button
									variant="secondary"
									onClick={ () =>
										setAttributes( { postId: null } )
									}
								>
									{ __( 'Change Member', 'ambrygen-web' ) }
								</Button>

								<Button
									isDestructive
									onClick={ () => removeBlock( clientId ) }
								>
									{ __( 'Remove Member', 'ambrygen-web' ) }
								</Button>
							</div>
						</>
					);
				} )() }
		</div>
	);
}
