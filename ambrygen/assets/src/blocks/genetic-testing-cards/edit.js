/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Core block editor components for building the block interface.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Edit component for the Genetic Testing Cards block.
 *
 * @return {JSX.Element} Block editor interface.
 */
export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'genetic-cards',
	} );

	const TEMPLATE = [
		[
			'ambrygen/genetic-testing-card',
			{
				type: 'small',
				title: __(
					'Considering genetic testing for yourself or a family member?',
					'ambrygen-web'
				),
				description: __(
					'At Ambry Genetics, we want to empower you to navigate your healthcare with confidence.',
					'ambrygen-web'
				),
			},
		],
		[
			'ambrygen/genetic-testing-card',
			{
				type: 'small',
				title: __( 'Classifi', 'ambrygen-web' ),
				description: __(
					'How Ambry transforms raw genetic data into actionable clinical insights.',
					'ambrygen-web'
				),
				linkText: __( 'Discover Classifi', 'ambrygen-web' ),
			},
		],
		[
			'ambrygen/genetic-testing-card',
			{
				type: 'main',
				title: __( 'Patient for Life', 'ambrygen-web' ),
				description: __(
					'Our promise to patients living with rare and undiagnosed conditions, today and in the future.',
					'ambrygen-web'
				),
				linkText: __( 'Explore the Program', 'ambrygen-web' ),
			},
		],
	];

	return (
		<div { ...blockProps }>
			<div className="genetic-cards__container">
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="all"
					renderAppender={ false }
				/>
			</div>
		</div>
	);
}
