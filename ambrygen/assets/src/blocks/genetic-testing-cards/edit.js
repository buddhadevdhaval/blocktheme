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
import { TagSelector, DEFAULT_IMAGES } from '../_shared/components';
import { useMemo } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { sectionTitle, headingTag } = attributes;
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	const blockProps = useBlockProps( {
		className: 'genetic-cards',
	} );

	const TEMPLATE = useMemo(
		() => [
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
					link: { text: __( 'Discover Classifi', 'ambrygen-web' ) },
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
					link: { text: __( 'Explore the Program', 'ambrygen-web' ) },
				},
			],
		],
		[ defaults ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
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
