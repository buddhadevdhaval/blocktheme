import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Spinner, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes, context }) {
	const { title } = attributes;
	const blockProps = useBlockProps();

	const { postId: contextPostId } = context;

	// 🔥 Fallback post for Site Editor
	const { fallbackPost } = useSelect((select) => {
		const posts = select('core').getEntityRecords('postType', 'post', {
			per_page: 1,
			status: 'publish',
		});
		return {
			fallbackPost: posts?.[0],
		};
	}, []);

	const activePostId = contextPostId || fallbackPost?.id;

	const { relatedPosts, isLoading } = useSelect((select) => {
		if (!activePostId) {
			return { relatedPosts: [], isLoading: true };
		}

		const { getEntityRecord, getEntityRecords, isResolving } = select('core');

		const currentPost = getEntityRecord('postType', 'post', activePostId);
		const categoryIds = currentPost?.categories || [];

		if (!categoryIds.length) {
			return { relatedPosts: [], isLoading: false };
		}

		const query = {
			per_page: 3,
			categories: categoryIds,
			exclude: [activePostId],
			orderby: 'date',
			order: 'desc',
			_embed: true,
		};

		const posts = getEntityRecords('postType', 'post', query);

		return {
			relatedPosts: posts || [],
			isLoading: isResolving('core', 'getEntityRecords', ['postType', 'post', query]),
		};
	}, [activePostId]);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Settings', 'ambrygen-web')}>
					<TextControl
						label={__('Widget Title', 'ambrygen-web')}
						value={title}
						onChange={(value) => setAttributes({ title: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="sidebar-widget related-posts">
				<div className="sidebar-widget__title subtitle2-medium">
					{title || __('Related Articles', 'ambrygen-web')}
				</div>

				<div className="related-posts__list">
					{isLoading ? (
						<div style={{ textAlign: 'center', padding: '20px' }}>
							<Spinner />
							<p>{__('Loading related posts...', 'ambrygen-web')}</p>
						</div>
					) : relatedPosts.length > 0 ? (
						relatedPosts.map((post) => {
							const media = post._embedded?.['wp:featuredmedia']?.[0];

							return (
								<a
									key={post.id}
									href={post.link}
									className="related-posts__item"
									onClick={(e) => e.preventDefault()} // ✅ prevent navigation
								>
									<div className="related-posts__image-wrap">
										{media?.source_url ? (
											<img
												src={media.source_url}
												alt=""
												className="related-posts__image"
											/>
										) : (
											<div
												className="related-posts__image related-posts__image--placeholder"
												style={{ background: '#f0f0f0', width: '100%', height: '100%' }}
											/>
										)}
									</div>

									<div className="related-posts__content">
										<h3
											className="related-posts__heading"
											dangerouslySetInnerHTML={{
												__html: post.title?.rendered || __('(No Title)', 'ambrygen-web'),
											}}
										/>
									</div>
								</a>
							);
						})
					) : (
						<div className="related-posts__item ambrygen-block-placeholder">
							{__('No related posts found.', 'ambrygen-web')}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}