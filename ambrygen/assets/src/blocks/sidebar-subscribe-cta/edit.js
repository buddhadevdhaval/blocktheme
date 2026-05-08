import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes } ) {
	const { postType, isTemplateEditor } = useSelect( ( select ) => {
		const { getCurrentPostType } = select( 'core/editor' ) || {};
		const { getEditedPostType } = select( 'core/edit-site' ) || {};
		
		// Check if we're in site editor (template editor)
		const isInSiteEditor = !! select( 'core/edit-site' )?.getEditedPostType?.();
		
		return {
			postType: getCurrentPostType ? getCurrentPostType() : null,
			isTemplateEditor: isInSiteEditor,
		};
	}, [] );

	const blockProps = useBlockProps();
	
	// Show notice if not in blog post context (but allow in template editor)
	if ( postType && postType !== 'post' && ! isTemplateEditor ) {
		return (
			<div { ...blockProps }>
				<Notice status="warning" isDismissible={ false }>
					{ __( 'This block is only available for Blog Posts.', 'ambrygen-web' ) }
				</Notice>
			</div>
		);
	}

	const { title, subtitle } = attributes;

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
					<TextareaControl
						label={ __( 'Subtitle', 'ambrygen-web' ) }
						value={ subtitle }
						onChange={ ( value ) => setAttributes( { subtitle: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="sidebar-widget subscribe-card-cta">
				<div className="subscribe-card-cta__content">
					<div className="subscribe-card-cta__title heading-5 mb-0">{ title || __( 'Love this article?', 'ambrygen-web' ) }</div>
					<div className="subscribe-card-cta__subtitle">{ subtitle || __( 'Get stories just like it, delivered right to you.', 'ambrygen-web' ) }</div>
				</div>
				<div className="subscribe-card-cta__form">
					<input 
						type="email" 
						className="subscribe-card-cta__input" 
						placeholder={ __( 'olivia@xyz.com', 'ambrygen-web' ) } 
						readOnly 
					/>
					<button type="button" className="subscribe-card-cta__submit site-btn">
						{ __( 'Sign Up Now', 'ambrygen-web' ) }
					</button>
				</div>
				{ isTemplateEditor && (
					<Notice status="info" isDismissible={ false }>
						{ __( 'Template preview: The subscribe form will be active on the frontend.', 'ambrygen-web' ) }
					</Notice>
				) }
			</div>
		</div>
	);
}