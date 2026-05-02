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

	// Fetch real tags that have at least one post attached for the editor preview.
	const tags = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'post_tag', {
			per_page: 20,
			hide_empty: true,
			orderby: 'name',
			order: 'asc',
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
			<div className="sidebar-widget related-tags">
				<div className="sidebar-widget__title subtitle2-medium">{ title }</div>
				<div className="related-tags__list">
					{ tags.length > 0 ? tags.map( ( tag ) => (
						<a key={ tag.id } href={ tag.link } className="related-tags__item">
							{ tag.name }
						</a>
					) ) : (
						<div
							className="related-tags__item ambrygen-block-placeholder"
						>
							{ __( 'Tags will appear here on the frontend.', 'ambrygen-web' ) }
						</div>
					) }
				</div>
			</div>
		</div>
	);
}
