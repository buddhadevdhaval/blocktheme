import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { columns, items } = attributes;
	const blockProps = useBlockProps.save({
		className: `image-grid-block columns-${columns}`,
	});

	return (
		<div {...blockProps}>
			<div className="grid-wrapper savecodeonly">
				{items.map((item, index) => (
					<div className="grid-item" key={index}>
						{item.link ? (
							<a href={item.link}>
								<img src={item.imageUrl} alt={item.title} />
							</a>
						) : (
							<img src={item.imageUrl} alt={item.title} />
						)}
						{item.title && <h4>{item.title}</h4>}
					</div>
				))}
			</div>
		</div>
	);
}
