import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { label, templatePart } = attributes;

	return (
		<li
			{ ...useBlockProps.save( {
				className: 'has-mega-menu',
				'data-wp-interactive': 'ambrygen/megaMenu',
			} ) }
		>
			<button
				className="mega-menu__trigger"
				aria-expanded="false"
				data-wp-on--click="actions.toggle"
				data-wp-bind--aria-expanded="state.open"
			>
				{ label }
			</button>

			<div
				className="mega-menu__dropdown"
				data-wp-bind--hidden="!state.open"
			>
				<div
					className="mega-menu__content"
					data-template-part={ templatePart }
				></div>
			</div>
		</li>
	);
}
