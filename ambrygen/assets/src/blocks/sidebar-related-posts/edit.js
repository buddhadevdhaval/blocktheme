import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes } ) {
	const { postType } = useSelect( ( select ) => ( {
		postType: select( 'core/editor' ).getCurrentPostType(),
	} ), [] );

	const blockProps = useBlockProps();

	if ( postType && postType !== 'post' ) {
		return (
			<div { ...blockProps }>
				<div className="ambrygen-block-placeholder">
					{ __( 'This block is only available for Blog Posts.', 'ambrygen-web' ) }
				</div>
			</div>
		);
	}

	const { title } = attributes;
	const relatedPosts = useSelect( ( select ) => {
		const { getCurrentPostId, getEditedEntityRecord } = select( 'core/editor' );
		const { getEntityRecords } = select( 'core' );
		const postId = getCurrentPostId();
		const currentPost = getEditedEntityRecord( 'postType', 'post', postId );
		const categoryIds = currentPost?.categories || [];

		if ( ! categoryIds.length ) {
			return [];
		}

		return getEntityRecords( 'postType', 'post', {
			categories: categoryIds,
			exclude: [ postId ],
			per_page: 3,
			orderby: 'date',
			order: 'desc',
			_embed: true,
		} ) || [];
	}, [] );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Widget Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="sidebar-widget related-posts">
				<div className="sidebar-widget__title subtitle2-medium">{ title }</div>
				<div className="related-posts__list">
					{ relatedPosts.length > 0 ? relatedPosts.map( ( post ) => {
						const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
						return (
							<div key={ post.id } className="related-posts__item">
								<div className="related-posts__image-wrap">
									{ featuredMedia?.source_url && (
										<img src={ featuredMedia.source_url } alt="" className="related-posts__image" />
									) }
								</div>
								<div className="related-posts__content">
									<h3 className="related-posts__heading">{ post.title?.rendered }</h3>
								</div>
							</div>
						);
					} ) : (
						<div className="related-posts__item ambrygen-block-placeholder">
							{ __( 'Related posts will appear here on the frontend.', 'ambrygen-web' ) }
						</div>
					) }
				</div>
			</div>
		</div>
	);
}
