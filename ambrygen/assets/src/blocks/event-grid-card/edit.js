import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder, Spinner } from '@wordpress/components';
import { ServerSideRender } from '@wordpress/server-side-render';

export default function Edit( { attributes, context, name } ) {
	const blockProps = useBlockProps();
	const previewPostId = Number( attributes?.previewPostId || context?.postId || 0 );

	if ( ! previewPostId ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					label="Event Grid Card"
					instructions="This block shows a conference card preview when used inside a Query Loop."
				/>
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			<ServerSideRender
				block={ name }
				attributes={ { ...attributes, previewPostId } }
				LoadingResponsePlaceholder={ () => <Spinner /> }
				EmptyResponsePlaceholder={ () => (
					<Placeholder
						label="Event Grid Card"
						instructions="No event data is available for this item yet."
					/>
				) }
			/>
		</div>
	);
}
