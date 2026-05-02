import { useBlockProps } from '@wordpress/block-editor';
import SsrPreview from '../shared/ssr-preview';

export default function Edit( props ) {
	const { attributes, context } = props;
	const previewPostId = Number( context?.postId || 0 );

	return (
		<SsrPreview
			{ ...props }
			attributes={ {
				...attributes,
				previewPostId,
			} }
		/>
	);
}
