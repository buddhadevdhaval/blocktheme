import { useBlockProps } from '@wordpress/block-editor';
import { ServerSideRender } from '@wordpress/server-side-render';

export default function Edit( { attributes, context, name } ) {
	const blockProps = useBlockProps();
	const previewPostId = context?.postId ? Number( context.postId ) : 0;

	return (
		<div { ...blockProps }>
			<ServerSideRender
				block={ name }
				attributes={ {
					...attributes,
					previewPostId,
				} }
			/>
		</div>
	);
}
