import SsrPreview from '../shared/ssr-preview';

export default function Edit( props ) {
	const { attributes, context } = props;
	const previewPostId = context?.postId ? Number( context.postId ) : 0;

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
