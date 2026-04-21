import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const CONTENT_TEMPLATE = [ [ 'core/paragraph', { content: '' } ] ];

export default function Edit( { attributes, setAttributes } ) {
	const { question, subHeading } = attributes;

	const blockProps = useBlockProps( {
		className: 'faq__item editor',
	} );

	return (
		<div { ...blockProps }>
			<div className="faq__header">
				{ /* These RichText fields are rendered as plain text in PHP. */ }
				<RichText
					tagName="div"
					className="faq__question text-lg-medium"
					value={ question }
					onChange={ ( value ) =>
						setAttributes( { question: value } )
					}
					placeholder={ __( 'FAQ Question', 'ambrygen-web' ) }
					withoutInteractiveFormatting={ true }
				/>

				{ /* These RichText fields are rendered as plain text in PHP. */ }
				<RichText
					tagName="div"
					className="block-sub-heading faq__sub-heading body2-semibold"
					value={ subHeading }
					onChange={ ( value ) =>
						setAttributes( { subHeading: value } )
					}
					placeholder={ __(
						'Sub heading (e.g. Most Common)',
						'ambrygen-web'
					) }
					withoutInteractiveFormatting={ true }
				/>

				<span className="faq__icon" aria-hidden="true"></span>
			</div>

			<div className="faq__answer">
				<InnerBlocks
					allowedBlocks={ [ 'core/paragraph', 'core/list' ] }
					template={ CONTENT_TEMPLATE }
					templateLock={ false }
					renderAppender={ InnerBlocks.ButtonBlockAppender }
				/>
			</div>
		</div>
	);
}
