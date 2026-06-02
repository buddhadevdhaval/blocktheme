import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { search } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ search }
				label={ __( 'Search Results', 'ambrygen-web' ) }
				instructions={ __(
					'This block renders the search results listing on the frontend search template.',
					'ambrygen-web'
				) }
			/>
		</div>
	);
}
