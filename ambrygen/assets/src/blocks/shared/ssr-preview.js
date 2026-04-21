import { useBlockProps } from '@wordpress/block-editor';
import { ServerSideRender } from '@wordpress/server-side-render';

export default function SsrPreview( { attributes, name } ) {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<ServerSideRender
				block={ name }
				attributes={ attributes }
			/>
		</div>
	);
}
