import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { label } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			<button className="mega-menu__trigger">{ label }</button>

			<div className="mega-menu__panel">
				{ /* Static content or InnerBlocks can go here */ }
			</div>
		</div>
	);
}
