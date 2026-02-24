import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Spinner, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { DEFAULT_IMAGES } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const defaults = DEFAULT_IMAGES();

	/* ------------------------------------------------------------------
	 * Get all team members
	 * ------------------------------------------------------------------ */
	const teamMembers = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', 'our_team', {
				per_page: -1,
				orderby: 'title',
				order: 'asc',
			} ),
		[]
	);

	/* ------------------------------------------------------------------
	 * Get selected post details
	 * ------------------------------------------------------------------ */
	const selectedPost = useSelect(
		( select ) => {
			if ( ! postId ) {
				return null;
			}

			const posts = select( 'core' ).getEntityRecords(
				'postType',
				'our_team',
				{
					per_page: -1,
					_embed: true,
				}
			);

			return posts?.find( ( post ) => post.id === postId ) || null;
		},
		[ postId ]
	);

	/* ------------------------------------------------------------------
	 * Prevent duplicate selections
	 * ------------------------------------------------------------------ */
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

	/* ------------------------------------------------------------------
	 * Dropdown options
	 * ------------------------------------------------------------------ */
	const options = teamMembers
		? teamMembers
				.filter( ( post ) => ! selectedIds.includes( post.id ) )
				.map( ( post ) => ( {
					label: post.title.rendered,
					value: post.id,
				} ) )
		: [];

	return (
		<div { ...useBlockProps( { className: 'swiper-slide' } ) }>
			{ /* Loading */ }
			{ ! teamMembers && <Spinner /> }

			{ /* Dropdown for selecting member */ }
			{ ! postId && teamMembers && (
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

			{ /* Render selected member */ }
			{ postId &&
				selectedPost &&
				( () => {
					const imageUrl =
						selectedPost?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]
							?.source_url || defaults?.placeholder?.url;

					return (
						<div className="our-leadership__card">
							<div className="our-leadership__image-wrapper">
								<img
									src={ imageUrl }
									alt={ selectedPost.title.rendered }
									className="our-leadership__image"
									loading="lazy"
								/>
							</div>

							<div className="our-leadership__info">
								<div className="our-leadership__name subtitle1-sbold">
									{ selectedPost.title.rendered }
									<div
										className="our-leadership__link"
										aria-label="Profile link"
									/>
								</div>

								<span className="our-leadership__role subtitle2">
									{ selectedPost.meta?.designation || '' }
								</span>
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
						</div>
					);
				} )() }
		</div>
	);
}
