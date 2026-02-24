/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';

import { PanelBody } from '@wordpress/components';
import { t } from '../_shared/utils';
import { TagSelector, DEFAULT_IMAGES } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const { sectionTitle, headingTag } = attributes;
	const defaults = DEFAULT_IMAGES();

	const blockProps = useBlockProps( {
		className: 'genetic-cards',
	} );

	const TEMPLATE = [
		[
			'ambrygen/genetic-testing-card',
			{
				type: 'small',
				image: defaults?.placeholder?.url,
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
				image: defaults?.placeholder?.url,
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
				image: defaults?.placeholder?.url,
				title: __( 'Patient for Life ss', 'ambrygen-web' ),
				description: __(
					'Our promise to patients living with rare and undiagnosed conditions, today and in the future.',
					'ambrygen-web'
				),
				linkText: __( 'Explore the Program', 'ambrygen-web' ),
			},
		],
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ t( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName={ headingTag }
					className="heading-3 mb-0 block-title"
					value={ sectionTitle }
					allowedFormats={ [ 'core/bold', 'core/text-color' ] } // highlight only
					onChange={ ( value ) =>
						setAttributes( { sectionTitle: value } )
					}
					placeholder={ __( 'Section title…', 'ambrygen-web' ) }
				/>

				<div className="is-style-gl-s32"></div>

				<div className="genetic-cards__container">
					<InnerBlocks
						template={ TEMPLATE }
						templateLock="all"
						renderAppender={ false }
					/>
				</div>
			</div>
		</>
	);
}
