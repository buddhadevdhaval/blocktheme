import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '../_shared/server-side-render';

export default function Edit( { attributes, context, name } ) {
	const blockProps = useBlockProps();
	const previewPostId = Number( context?.postId || 0 );

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
