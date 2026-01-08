import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { heading, headingTag, imageUrl, imagePosition } = attributes;
	const blockProps = useBlockProps.save({
		className: `left-right-block ${imagePosition}`,
	});

	return (
		<div {...blockProps}>
			<div className="content-wrapper">

				{/* Left image */}
				<div className="image-wrapper">
					{imagePosition === 'left' && imageUrl && (
						<img src={imageUrl} alt="" />
					)}
				</div>

				{/* Text */}
				<div className="text-wrapper">
					<RichText.Content tagName={headingTag} value={heading} />
					<InnerBlocks.Content />
				</div>

				{/* Right image */}
				<div className="image-wrapper">
					{imagePosition === 'right' && imageUrl && (
						<img src={imageUrl} alt="" />
					)}
				</div>

			</div>
		</div>
	);
}
