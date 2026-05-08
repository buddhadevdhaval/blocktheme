import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit() {
	const blockProps = useBlockProps();

	const { postType, isTemplateEditor } = useSelect((select) => {
		const editor = select('core/editor');
		const siteEditor = select('core/edit-site');

		return {
			postType: editor?.getCurrentPostType?.(),
			isTemplateEditor: !!siteEditor?.getEditedPostType?.(),
		};
	}, []);

	// Restrict usage
	if (postType && postType !== 'post' && !isTemplateEditor) {
		return (
			<div {...blockProps}>
				<Notice status="warning" isDismissible={false}>
					{__('This block is only available for Blog Posts.', 'ambrygen-web')}
				</Notice>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<div className="sidebar-widget disclaimer-block">
				<p>
					<strong>
						{__('DISCLAIMER: THIS BLOG DOES NOT PROVIDE MEDICAL ADVICE', 'ambrygen-web')}
					</strong>
				</p>

				<p>
					{__(
						'The content on this website is for informational purposes only and is not intended as medical advice. Please consult a qualified healthcare provider for diagnosis and treatment.',
						'ambrygen-web'
					)}
				</p>
			</div>
		</div>
	);
}