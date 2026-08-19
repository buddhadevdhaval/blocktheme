import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

export default function Edit( { attributes, setAttributes, context } ) {
	const { title } = attributes;
	const blockProps = useBlockProps();

	const { postId: contextPostId } = context;

	const { fallbackPost } = useSelect( ( select ) => {
		const posts = select( 'core' ).getEntityRecords( 'postType', 'post', {
			per_page: 1,
			status: 'publish',
		} );
		return {
			fallbackPost: posts?.[ 0 ],
		};
	}, [] );

	const activePostId = contextPostId || fallbackPost?.id;

	const { tags, isLoading } = useSelect(
		( select ) => {
			if ( ! activePostId ) {
				return { tags: [], isLoading: true };
			}

			const { getEntityRecord, getEntityRecords, isResolving } =
				select( 'core' );

			const post = getEntityRecord( 'postType', 'post', activePostId );
			const tagIds = post?.tags || [];

			if ( ! tagIds.length ) {
				return { tags: [], isLoading: false };
			}

			const query = {
				include: tagIds,
				per_page: -1,
			};

			const fetchedTags = getEntityRecords(
				'taxonomy',
				'post_tag',
				query
			);

			return {
				tags: fetchedTags || [],
				isLoading: isResolving( 'core', 'getEntityRecords', [
					'taxonomy',
					'post_tag',
					query,
				] ),
			};
		},
		[ activePostId ]
	);

	let tagsContent = (
		<div className="related-tags__item ambrygen-block-placeholder">
			{ __( 'No tags found for this post.', 'ambrygen-web' ) }
		</div>
	);

	if ( isLoading ) {
		tagsContent = (
			<div style={ { textAlign: 'center', padding: '20px' } }>
				<Spinner />
				<p>{ __( 'Loading tagsâ€¦', 'ambrygen-web' ) }</p>
			</div>
		);
	} else if ( tags.length > 0 ) {
		tagsContent = tags.map( ( tag ) => (
			<span key={ tag.id } className="related-tags__item">
				{ decodeEntities( tag.name ) }
			</span>
		) );
	}

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Widget Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="sidebar-widget related-tags">
				<div className="sidebar-widget__title subtitle2-medium">
					{ title || __( 'Find Articles by Tags', 'ambrygen-web' ) }
				</div>

				<div className="related-tags__list">{ tagsContent }</div>
			</div>
		</div>
	);
}
