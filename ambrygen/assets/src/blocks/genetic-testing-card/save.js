/**
 * WordPress dependencies for block editor functionality.
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Save component for the Genetic Testing Card block.
 *
 * @param {Object} props            Block properties.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
export default function Save( { attributes } ) {
	const { image, imageAlt, title, description, linkText, linkUrl, type } =
		attributes;

	const blockProps = useBlockProps.save( {
		className: `genetic-cards__card genetic-cards__card--${ type }`,
	} );

	const CardWrapper = linkUrl ? 'a' : 'div';
	const wrapperProps = linkUrl ? { href: linkUrl } : {};

	return (
		<CardWrapper { ...wrapperProps } { ...blockProps }>
			{ image && (
				<div
					className={ `genetic-cards__image-wrapper genetic-cards__image-wrapper--${ type }` }
				>
					<img src={ image } alt={ imageAlt || '' } />
				</div>
			) }
			<div
				className={ `genetic-cards__content ${
					type === 'main' ? 'genetic-cards__content--main' : ''
				}` }
			>
				{ title && (
					<RichText.Content
						tagName="h3"
						className="genetic-cards__title"
						value={ title }
					/>
				) }
				{ description && (
					<RichText.Content
						tagName="p"
						className="genetic-cards__description"
						value={ description }
					/>
				) }
				{ linkText && (
					<div className="genetic-cards__link">
						{ linkText }
						<span className="icon" aria-hidden="true">
							&rarr;
						</span>
					</div>
				) }
			</div>
		</CardWrapper>
	);
}
