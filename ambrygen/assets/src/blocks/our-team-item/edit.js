import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { SelectControl, Spinner, Button, ComboboxControl, PanelBody } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { DEFAULT_IMAGES } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId = 0 } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const [ searchInput, setSearchInput ] = useState( '' );
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const hasSelectedPost = Boolean( postId );

	// Search for team members (authors) based on searchInput
	const teamMembers = useSelect( ( select ) => {
		const query = {
			per_page: 20,
			orderby: 'title',
			post_status: 'publish',
			order: 'asc',
		};

		if ( searchInput ) {
			query.search = searchInput;
		}

		return select( 'core' ).getEntityRecords( 'postType', 'author', query );
	}, [ searchInput ] );

	// Get current selected post details
	const selectedPost = useSelect(
		( select ) => {
			return postId
				? select( 'core' ).getEntityRecord(
						'postType',
						'author',
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

	// Searchable options (mapped from REST results)
	const options = useMemo( () => {
		if ( ! teamMembers ) return [];
		return teamMembers
			.filter( ( post ) => ! selectedIds.includes( post.id ) )
			.map( ( post ) => ( {
				label: decodeEntities( post.title.rendered ),
				value: post.id,
			} ) );
	}, [ teamMembers, selectedIds ] );

	return (
		<div { ...useBlockProps( { className: 'our-team__card' } ) }>
			<InspectorControls>
				<PanelBody title={ __( 'Team Member Settings', 'ambrygen-web' ) }>
					<ComboboxControl
						label={ __( 'Select Member', 'ambrygen-web' ) }
						value={ postId || null }
						options={ options }
						onFilterValueChange={ ( value ) => setSearchInput( value ) }
						onChange={ ( value ) =>
							setAttributes( {
								postId: parseInt( value, 10 ) || 0,
							} )
						}
						help={ __( 'Search by name to find a team member.', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* If no selection yet */ }
			{ ! hasSelectedPost && (
				<div className="our-team__selection-placeholder">
					<ComboboxControl
						label={ __( 'Search Team Member', 'ambrygen-web' ) }
						value=""
						options={ options }
						onFilterValueChange={ ( value ) => setSearchInput( value ) }
						onChange={ ( value ) =>
							setAttributes( {
								postId: parseInt( value, 10 ) || 0,
							} )
						}
					/>
					{ ! teamMembers && <Spinner /> }
				</div>
			) }

			{ /* Selected Member Preview */ }
			{ hasSelectedPost &&
				selectedPost &&
				( () => {
					const imageUrl =
						selectedPost?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]
							?.source_url || defaults?.placeholder?.url;
					return (
						<>
							<div className="our-team__image-wrapper">
								<img
									src={ imageUrl }
									alt={ decodeEntities(
										selectedPost.title.rendered
									) }
									className="our-team__image"
								/>
							</div>

							<div className="our-team__info">
								<div className="our-team__name subtitle1-sbold">
									{ decodeEntities(
										selectedPost.title.rendered
									) }
									<div className="our-team__link"></div>
								</div>

								<div className="our-team__role body1">
									{ selectedPost.meta?.user_designation || '' }
								</div>
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
						</>
					);
				} )() }
		</div>
	);
}
