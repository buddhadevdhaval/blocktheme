import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save() {
	return (
		<section { ...useBlockProps.save() } className="icon-grids">
			<InnerBlocks.Content />
		</section>
	);
}
