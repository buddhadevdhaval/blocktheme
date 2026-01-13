import { useBlockProps } from '@wordpress/block-editor';

// Import validation utilities
import { isValidUrl } from '../../utils/validation.js';

export default function Save( { attributes } ) {
	const { columns, items } = attributes;
	const blockProps = useBlockProps.save( {
		className: `image-grid-block columns-${ columns }`,
	} );

	return (
		<div { ...blockProps }>
			<div
				className="grid-wrapper savecodeonly"
				role="grid"
				aria-label="Image gallery"
			>
				{ items.map( ( item, index ) => (
					<div className="grid-item" key={ index } role="gridcell">
						{ item.link && isValidUrl( item.link ) ? (
							<a
								href={ item.link }
								aria-label={
									item.title
										? `View more about ${ item.title }`
										: `View image ${ index + 1 }`
								}
							>
								<img
									src={ item.imageUrl }
									alt={
										item.title ||
										`Grid image ${ index + 1 }`
									}
									loading="lazy"
								/>
							</a>
						) : (
							<img
								src={ item.imageUrl }
								alt={
									item.title || `Grid image ${ index + 1 }`
								}
								loading="lazy"
							/>
						) }
						{ item.title && (
							<h4 className="grid-item-title">{ item.title }</h4>
						) }
					</div>
				) ) }
			</div>
		</div>
	);
}
