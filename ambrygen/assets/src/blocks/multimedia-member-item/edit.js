import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
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

const normalizeMemberMediaMeta = ( metaValue ) => {
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
			try {
				parsed = JSON.parse( trimmed );
			} catch {
				parsed = [];
			}
		}
	}

	const asArray = Array.isArray( parsed ) ? parsed : [ parsed ];

	return asArray.reduce( ( items, item ) => {
		const normalizedItem = {
			imageId: getIdFromUnknown( item ),
			imageUrl: getUrlFromUnknown( item ),
		};

		if ( normalizedItem.imageId || normalizedItem.imageUrl ) {
			items.push( normalizedItem );
		}

		return items;
	}, [] );
};

export default function Edit( { attributes } ) {
	const { postId } = attributes;
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	const selectedPost = useSelect(
		( select ) => {
			if ( ! postId ) {
				return null;
			}
			return select( 'core' ).getEntityRecord(
				'postType',
				'author',
				postId,
				{
					_embed: true,
				}
			);
		},
		[ postId ]
	);

	const memberMediaItems = useMemo(
		() =>
			normalizeMemberMediaMeta(
				selectedPost?.meta?.image_gallry ||
					selectedPost?.meta?.image_gallary
			),
		[ selectedPost?.meta?.image_gallry, selectedPost?.meta?.image_gallary ]
	);

	const memberMediaIds = useMemo(
		() =>
			memberMediaItems.reduce( ( ids, item ) => {
				if ( item.imageId ) {
					ids.push( item.imageId );
				}

				return ids;
			}, [] ),
		[ memberMediaItems ]
	);

	const resolution = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return memberMediaIds.map( ( id ) => getMedia( id ) );
		},
		[ memberMediaIds ]
	);

	const featuredMediaUrl =
		selectedPost?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url ||
		'';

	const finalMemberMedia = useMemo( () => {
		if ( memberMediaItems.length > 0 ) {
			const keyCounts = new Map();

			return memberMediaItems.flatMap( ( item, index ) => {
				const media = resolution[ index ];
				const url =
					item.imageUrl ||
					media?.source_url ||
					media?.sizes?.full?.url ||
					'';
				const alt = media?.alt_text || media?.title?.rendered || '';

				if ( ! url ) {
					return [];
				}

				const keyBase = item.imageId
					? `id-${ item.imageId }`
					: `url-${ url }`;
				const nextCount = ( keyCounts.get( keyBase ) || 0 ) + 1;
				keyCounts.set( keyBase, nextCount );

				return [
					{
						key:
							nextCount === 1
								? keyBase
								: `${ keyBase }-${ nextCount }`,
						url,
						alt: decodeEntities( alt ),
					},
				];
			} );
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
	}, [
		memberMediaItems,
		resolution,
		featuredMediaUrl,
		defaults,
		selectedPost,
	] );
	const hasMultipleMediaItems = finalMemberMedia.length > 1;
	const shouldShowNavigation = hasMultipleMediaItems;

	return (
		<div { ...useBlockProps( { className: 'multimedia-member__item' } ) }>
			{ postId && ! selectedPost && <Spinner /> }

			{ ! postId && (
				<p>
					{ __(
						'Select authors from the Multimedia Member block settings.',
						'ambrygen-web'
					) }
				</p>
			) }

			{ postId && selectedPost && (
				<>
					<div
						className="multimedia-member__card"
						style={ { marginBottom: '15px' } }
					>
						<div className="multimedia-member-item__media-slider swiper">
							<div className="swiper-wrapper">
								{ finalMemberMedia.map( ( item ) => (
									<div
										key={ item.key }
										className="swiper-slide multimedia-member__image"
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

						<div className="multimedia-member__overlay">
							<div className="multimedia-member__title heading-5 mb-0">
								{ decodeEntities(
									selectedPost.title.rendered
								) }
							</div>
							<div
								className="is-style-gl-s10"
								aria-hidden="true"
							></div>
							{ ( selectedPost.meta?.user_designation ||
								selectedPost.meta?.designation ) && (
								<span className="multimedia-member__role subtitle2">
									{ decodeEntities(
										selectedPost.meta?.user_designation ||
											selectedPost.meta?.designation ||
											''
									) }
								</span>
							) }
						</div>
					</div>
				</>
			) }
		</div>
	);
}
