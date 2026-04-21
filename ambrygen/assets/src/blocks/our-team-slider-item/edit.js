import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Spinner, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { DEFAULT_IMAGES } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	/* ------------------------------------------------------------------
	 * Get all team members
	 * ------------------------------------------------------------------ */
	const teamMembers = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', 'our_team', {
				per_page: -1,
				post_status: 'publish',
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

			return select( 'core' ).getEntityRecord(
				'postType',
				'our_team',
				postId,
				{
					_embed: true,
					context: 'edit',
				}
			);
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
					label: decodeEntities( post.title.rendered ),
					value: String( post.id ),
				} ) )
		: [];

	return (
		<div { ...useBlockProps( { className: 'swiper-slide' } ) }>
			{ /* Loading */ }
			{ ! teamMembers && <Spinner /> }

			{ /* Dropdown for selecting member */ }
			{ ! postId && teamMembers && (
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
							postId: parseInt( value, 10 ) || 0,
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
									alt={ decodeEntities(
										selectedPost.title.rendered
									) }
									className="our-leadership__image"
									loading="lazy"
								/>
							</div>

							<div className="our-leadership__info">
								<div className="our-leadership__name subtitle1-sbold">
									{ decodeEntities(
										selectedPost.title.rendered
									) }
									<div
										className="our-leadership__link"
										aria-label={ __(
											'Profile link',
											'ambrygen-web'
										) }
									/>
								</div>

								<span className="our-leadership__role subtitle2">
									{ selectedPost.meta?.designation || '' }
								</span>
							</div>
							<div className="is-style-gl-s24"></div>

							{ /* Actions */ }
							<div className="our-team__actions actions-button">
								<Button
									variant="secondary"
									onClick={ () =>
										setAttributes( { postId: 0 } )
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
						</div>
					);
				} )() }
		</div>
	);
}
