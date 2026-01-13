import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { heading, headingTag, imageUrl, imageId, imageAlt, imagePosition } =
		attributes;
	const blockProps = useBlockProps.save( {
		className: `left-right-block ${ imagePosition }`,
	} );

	return (
		<div { ...blockProps }>
			<div className="content-wrapper">
				{ /* Left image wrapper */ }
				<div className="image-wrapper">
					{ imagePosition === 'left' && imageUrl && (
						<img
							src={ imageUrl }
							alt={ imageAlt || heading || '' }
							data-image-id={ imageId }
							className="responsive-image"
						/>
					) }
				</div>

				{ /* Text wrapper */ }
				<div className="text-wrapper">
					<RichText.Content
						tagName={ headingTag }
						value={ heading }
					/>
					<InnerBlocks.Content />
				</div>

				{ /* Right image wrapper */ }
				<div className="image-wrapper">
					{ imagePosition === 'right' && imageUrl && (
						<img
							src={ imageUrl }
							alt={ imageAlt || heading || '' }
							data-image-id={ imageId }
							className="responsive-image"
						/>
					) }
				</div>
			</div>
		</div>
	);
}
