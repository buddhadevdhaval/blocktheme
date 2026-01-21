/**
 * WordPress dependencies for block editor functionality.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Save component for the Genetic Testing Cards block.
 *
 * @param {Object} props            Block properties.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
export default function Save( { attributes } ) {
	const {
		cardOneImage,
		cardOneImageAlt,
		cardOneTitle,
		cardOneDescription,
		cardOneLinkText,
		cardOneLinkUrl,
		cardTwoImage,
		cardTwoImageAlt,
		cardTwoTitle,
		cardTwoDescription,
		cardTwoLinkText,
		cardTwoLinkUrl,
		cardMainImage,
		cardMainImageAlt,
		cardMainTitle,
		cardMainDescription,
		cardMainLinkText,
		cardMainLinkUrl,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'genetic-cards',
	} );

	const renderCard = (
		image,
		alt,
		title,
		description,
		linkText,
		linkUrl,
		type = 'small'
	) => {
		const CardWrapper = linkUrl ? 'a' : 'div';
		const wrapperProps = linkUrl ? { href: linkUrl } : {};

		return (
			<CardWrapper
				{ ...wrapperProps }
				className={ `genetic-cards__card genetic-cards__card--${ type }` }
			>
				{ image && (
					<div
						className={ `genetic-cards__image-wrapper genetic-cards__image-wrapper--${ type }` }
					>
						<img src={ image } alt={ alt || '' } />
					</div>
				) }
				<div
					className={ `genetic-cards__content genetic-cards__content--${ type }` }
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
	};

	return (
		<div { ...blockProps }>
			<div className="genetic-cards__container">
				<div className="genetic-cards__column-left">
					{ renderCard(
						cardOneImage,
						cardOneImageAlt,
						cardOneTitle,
						cardOneDescription,
						cardOneLinkText,
						cardOneLinkUrl,
						'small'
					) }
					{ renderCard(
						cardTwoImage,
						cardTwoImageAlt,
						cardTwoTitle,
						cardTwoDescription,
						cardTwoLinkText,
						cardTwoLinkUrl,
						'small'
					) }
				</div>
				<div className="genetic-cards__column-right">
					{ renderCard(
						cardMainImage,
						cardMainImageAlt,
						cardMainTitle,
						cardMainDescription,
						cardMainLinkText,
						cardMainLinkUrl,
						'main'
					) }
				</div>
			</div>
		</div>
	);
}
