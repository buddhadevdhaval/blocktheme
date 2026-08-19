import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '../_shared/server-side-render';
import metadata from './block.json';

export default function Edit( { attributes } ) {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<ServerSideRender
				block={ metadata.name }
				attributes={ attributes }
			/>
		</div>
	);
}
