import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Spinner, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { DEFAULT_IMAGES } from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

const getIdFromUnknown = ( value ) => {
	if ( typeof value === 'number' ) {
		return value;
	}
	if ( typeof value === 'string' && /^\d+$/.test( value.trim() ) ) {
		return parseInt( value.trim(), 10 );
	}
	if ( value && typeof value === 'object' ) {
		const raw = value.id || value.ID || value.attachment_id || 0;
		return getIdFromUnknown( raw );
	}
	return 0;
};

const getUrlFromUnknown = ( value ) => {
	if ( typeof value === 'string' && /^https?:\/\//.test( value ) ) {
		return value;
	}
	if ( value && typeof value === 'object' ) {
		return (
			value.url ||
			value.source_url ||
			value.full_url ||
			value?.sizes?.full?.url ||
			''
		);
	}
	return '';
};

const normalizeGalleryMetaImages = ( metaValue ) => {
	let parsed = metaValue;

	if ( typeof parsed === 'string' ) {
		const trimmed = parsed.trim();

		if ( /^\d+(\s*,\s*\d+)+$/.test( trimmed ) ) {
			parsed = trimmed.split( ',' ).map( ( item ) => item.trim() );
		} else if ( /^\d+$/.test( trimmed ) ) {
			parsed = [ trimmed ];
		} else if ( trimmed.includes( ',' ) ) {
			parsed = trimmed
				.split( ',' )
				.map( ( item ) => item.trim() )
				.filter( ( item ) => /^\d+$/.test( item ) );
		} else if (
			( trimmed.startsWith( '[' ) && trimmed.endsWith( ']' ) ) ||
			( trimmed.startsWith( '{' ) && trimmed.endsWith( '}' ) )
		) {
			parsed = JSON.parse( trimmed );
		}
	}

	const asArray = Array.isArray( parsed ) ? parsed : [ parsed ];

	return asArray
		.map( ( item ) => ( {
			imageId: getIdFromUnknown( item ),
			imageUrl: getUrlFromUnknown( item ),
		} ) )
		.filter( ( item ) => item.imageId || item.imageUrl );
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	const teamMembers = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', 'our_team', {
				per_page: -1,
				post_status: 'publish',
				orderby: 'title',
				order: 'asc',
				_fields: 'id,title,meta',
			} ),
		[]
	);

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

	const selectedIds = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const parentId = blockEditor.getBlockRootClientId( clientId );
			if ( ! parentId ) {
				return [];
			}
			const siblings = blockEditor.getBlocks( parentId );
			return siblings
				.map( ( block ) => block.attributes?.postId )
				.filter( ( id ) => id && id !== postId );
		},
		[ clientId, postId ]
	);

	const options = teamMembers
		? teamMembers
				.filter( ( post ) => ! selectedIds.includes( post.id ) )
				.map( ( post ) => ( {
					label: decodeEntities( post.title.rendered ),
					value: post.id,
				} ) )
		: [];

	const galleryItems = useMemo(
		() =>
			normalizeGalleryMetaImages(
				selectedPost?.meta?.image_gallry ||
					selectedPost?.meta?.image_gallary
			),
		[ selectedPost?.meta?.image_gallry, selectedPost?.meta?.image_gallary ]
	);

	const galleryMediaIds = useMemo(
		() => galleryItems.map( ( item ) => item.imageId ).filter( Boolean ),
		[ galleryItems ]
	);

	const resolution = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return galleryMediaIds.map( ( id ) => getMedia( id ) );
		},
		[ galleryMediaIds ]
	);

	const featuredMediaUrl =
		selectedPost?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url ||
		'';

	const finalGallery = useMemo( () => {
		if ( galleryItems.length > 0 ) {
			const keyCounts = new Map();

			return galleryItems
				.map( ( item, index ) => {
					const media = resolution[ index ];
					const url =
						item.imageUrl ||
						media?.source_url ||
						media?.sizes?.full?.url ||
						'';
					const alt = media?.alt_text || media?.title?.rendered || '';

					if ( ! url ) {
						return null;
					}

					const keyBase = item.imageId
						? `id-${ item.imageId }`
						: `url-${ url }`;
					const nextCount = ( keyCounts.get( keyBase ) || 0 ) + 1;
					keyCounts.set( keyBase, nextCount );

					return {
						key:
							nextCount === 1
								? keyBase
								: `${ keyBase }-${ nextCount }`,
						url,
						alt: decodeEntities( alt ),
					};
				} )
				.filter( Boolean );
		}

		const fallbackUrl = featuredMediaUrl || defaults?.placeholder?.url;
		if ( ! fallbackUrl ) {
			return [];
		}

		const fallbackAlt =
			selectedPost?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.alt_text;

		return [
			{
				key: 'fallback-image',
				url: fallbackUrl,
				alt: decodeEntities( fallbackAlt || '' ),
			},
		];
	}, [ galleryItems, resolution, featuredMediaUrl, defaults, selectedPost ] );
	const hasMultipleGalleryItems = finalGallery.length > 1;
	const shouldShowNavigation = hasMultipleGalleryItems;

	return (
		<div
			{ ...useBlockProps( { className: 'image-gallery-slider__item' } ) }
		>
			{ ! teamMembers && <Spinner /> }

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
							postId: parseInt( value, 10 ) || null,
						} )
					}
				/>
			) }

			{ postId && selectedPost && (
				<>
					<div
						className="image-gallery-slider__card"
						style={ { marginBottom: '15px' } }
					>
						<div className="image-gallery-slider-item__media-slider swiper">
							<div className="swiper-wrapper">
								{ finalGallery.map( ( item ) => (
									<div
										key={ item.key }
										className="swiper-slide image-gallery-slider__image"
									>
										<img
											src={ item.url }
											alt={ item.alt || '' }
										/>
									</div>
								) ) }
							</div>

							{ shouldShowNavigation && (
								<div className="swiper-buttons">
									<button
										type="button"
										className="custom-prev"
										aria-label={ __(
											'Previous Slide',
											'ambrygen-web'
										) }
									></button>
									<button
										type="button"
										className="custom-next"
										aria-label={ __(
											'Next Slide',
											'ambrygen-web'
										) }
									></button>
								</div>
							) }
						</div>

						<div className="image-gallery-slider__overlay">
							<div className="image-gallery-slider__title heading-5 mb-0">
								{ decodeEntities(
									selectedPost.title.rendered
								) }
							</div>
							<div
								className="is-style-gl-s10"
								aria-hidden="true"
							></div>
							<span className="image-gallery-slider__role subtitle2">
								{ decodeEntities(
									selectedPost.meta?.designation || ''
								) }
							</span>
						</div>
					</div>

					<div
						className="image-gallery-slider-item__actions"
						style={ {
							marginTop: '12px',
							padding: '10px',
							background: '#f0f0f0',
							border: '1px solid #ccc',
						} }
					>
						<div className="image-gallery-slider__meta body2-reg">
							<strong>
								{ __( 'Admin Settings', 'ambrygen-web' ) }
							</strong>{ ' ' }
							( { galleryItems.length }{ ' ' }
							{ __( 'gallery items total', 'ambrygen-web' ) } )
						</div>
						<div className="actions-button">
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
					</div>
				</>
			) }
		</div>
	);
}
