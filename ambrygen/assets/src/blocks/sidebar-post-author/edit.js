import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes, context } ) {
	const { title } = attributes;
	const blockProps = useBlockProps();

	const { postId: contextPostId } = context;

	// Detect editor context
	const { currentPostId, isTemplateEditor } = useSelect( ( select ) => {
		const editor = select( 'core/editor' );
		const siteEditor = select( 'core/edit-site' );

		return {
			currentPostId: editor?.getCurrentPostId?.(),
			isTemplateEditor: !! siteEditor?.getEditedPostType?.(),
		};
	}, [] );

	const activePostId = contextPostId || currentPostId;

	// 🔴 If no post context → show placeholder
	if ( ! activePostId ) {
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

				<div className="sidebar-widget post-author-block">
					<div className="sidebar-widget__title subtitle2-medium">
						{ title || __( 'Author', 'ambrygen-web' ) }
					</div>

					<div
						className="ambrygen-block-placeholder"
						style={ { padding: '30px', textAlign: 'center' } }
					>
						{ __(
							'Author information will appear here when viewing a blog post.',
							'ambrygen-web'
						) }
					</div>
				</div>

				{ isTemplateEditor && (
					<Notice status="info" isDismissible={ false }>
						{ __(
							'Preview is not available in template editor.',
							'ambrygen-web'
						) }
					</Notice>
				) }
			</div>
		);
	}

	// ✅ Optional: Fake preview (for better UX)
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

			<div className="sidebar-widget post-author-block">
				<div className="sidebar-widget__title subtitle2-medium">
					{ title || __( 'Author', 'ambrygen-web' ) }
				</div>

				<div className="post-author">
					<div className="post-author__avatar">
						<div
							className="post-author__image"
							style={ {
								width: '100px',
								height: '100px',
								background: '#eee',
								borderRadius: '50%',
							} }
						/>
					</div>

					<div className="post-author__name">
						{ __( 'Author Name, Designation', 'ambrygen-web' ) }
					</div>
				</div>

				<div className="is-style-gl-s12" />

				<div className="post-author__content text-small">
					{ __(
						'Author bio will appear here. This is a preview for editor only.',
						'ambrygen-web'
					) }
				</div>
			</div>
		</div>
	);
}
