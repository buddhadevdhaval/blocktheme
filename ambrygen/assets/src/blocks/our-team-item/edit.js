import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	Spinner,
	Button,
	ComboboxControl,
	PanelBody,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { DEFAULT_IMAGES } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId = 0 } = attributes;
	const selectedPostId = Number( postId ) || 0;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const [ searchInput, setSearchInput ] = useState( '' );
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const hasSelectedPost = Boolean( selectedPostId );
	const parentVariation = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const parentId = blockEditor.getBlockRootClientId( clientId );
			const parentBlock = parentId
				? blockEditor.getBlock( parentId )
				: null;

			return parentBlock?.attributes?.variation || 'grid-view';
		},
		[ clientId ]
	);
	const isSliderView = parentVariation === 'slider-view';
	const classPrefix = isSliderView ? 'our-leadership' : 'our-team';

	// Search for team members based on searchInput.
	const teamMembers = useSelect( ( select ) => {
		const query = {
			per_page: 20,
			orderby: 'title',
			status: 'publish',
			order: 'asc',
		};

		if ( searchInput ) {
			query.search = searchInput;
		}

		return select( 'core' ).getEntityRecords(
			'postType',
			'our_team',
			query
		);
	}, [ searchInput ] );

	// Get current selected post details.
	const selectedPost = useSelect(
		( select ) => {
			if ( ! selectedPostId ) {
				return null;
			}

			const teamPost = select( 'core' ).getEntityRecord(
				'postType',
				'our_team',
				selectedPostId,
				{
					_embed: true,
					context: 'edit',
				}
			);

			if ( teamPost ) {
				return teamPost;
			}

			return null;
		},
		[ selectedPostId ]
	);

	// Get sibling selected IDs.
	const selectedIds = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const parentId = blockEditor.getBlockRootClientId( clientId );
			const siblings = blockEditor.getBlocks( parentId );

			return siblings
				.map( ( block ) => Number( block.attributes?.postId ) || 0 )
				.filter( ( id ) => id && id !== selectedPostId );
		},
		[ clientId, selectedPostId ]
	);

	// Searchable options mapped from REST results.
	const options = useMemo( () => {
		if ( ! teamMembers ) {
			return [];
		}

		return teamMembers
			.filter( ( post ) => ! selectedIds.includes( post.id ) )
			.map( ( post ) => ( {
				label: decodeEntities(
					post?.title?.rendered || post?.title?.raw || ''
				),
				value: post.id,
			} ) );
	}, [ teamMembers, selectedIds ] );

	const blockProps = useBlockProps( {
		className: isSliderView ? 'swiper-slide' : 'our-team__card',
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Team Member Settings', 'ambrygen-web' ) }
				>
					<ComboboxControl
						label={
							hasSelectedPost
								? __( 'Change Member', 'ambrygen-web' )
								: __( 'Select Member', 'ambrygen-web' )
						}
						value={ selectedPostId || null }
						options={ options }
						onFilterValueChange={ ( value ) =>
							setSearchInput( value )
						}
						onChange={ ( value ) =>
							setAttributes( {
								postId: parseInt( value, 10 ) || 0,
							} )
						}
						help={ __(
							'Search by name to find a team member.',
							'ambrygen-web'
						) }
					/>
					{ hasSelectedPost && (
						<Button
							isDestructive
							variant="secondary"
							onClick={ () => removeBlock( clientId ) }
						>
							{ __( 'Remove Member', 'ambrygen-web' ) }
						</Button>
					) }
				</PanelBody>
			</InspectorControls>

			{ /* If no selection yet */ }
			{ ! hasSelectedPost && (
				<div className="our-team__selection-placeholder">
					<ComboboxControl
						label={ __( 'Search Team Member', 'ambrygen-web' ) }
						value=""
						options={ options }
						onFilterValueChange={ ( value ) =>
							setSearchInput( value )
						}
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
					const designation =
						selectedPost.meta?.user_designation ||
						selectedPost.meta?.designation ||
						'';

					const cardContent = (
						<>
							<div className={ `${ classPrefix }__image-wrapper` }>
								<img
									src={ imageUrl }
									alt={ decodeEntities(
										selectedPost.title.rendered
									) }
									className={ `${ classPrefix }__image` }
								/>
							</div>

							<div className={ `${ classPrefix }__info` }>
								<div
									className={ `${ classPrefix }__name subtitle1-sbold` }
								>
									{ decodeEntities(
										selectedPost.title.rendered
									) }
									<div
										className={ `${ classPrefix }__link` }
									></div>
								</div>

								<div
									className={ `${ classPrefix }__role ${
										isSliderView ? 'subtitle2' : 'body1'
									}` }
								>
									{ designation }
								</div>
							</div>
						</>
					);

					return isSliderView ? (
						<div className="our-leadership__card">
							{ cardContent }
						</div>
					) : (
						cardContent
					);
				} )() }
		</div>
	);
}
