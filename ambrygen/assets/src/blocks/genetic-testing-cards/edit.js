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
import { TagSelector } from '../_shared/components';
import { useEffect } from '@wordpress/element';

const TEMPLATE = [
	[
		'ambrygen/genetic-testing-card',
		{
			type: 'small',
		},
	],
	[
		'ambrygen/genetic-testing-card',
		{
			type: 'small',
		},
	],
	[
		'ambrygen/genetic-testing-card',
		{
			type: 'main',
		},
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, sectionTitle, headingTag } = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'genetic-cards',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName={ headingTag }
					className="heading-3 mb-0 block-title"
					value={ sectionTitle }
					allowedFormats={ [ 'core/text-color' ] } // highlight only
					onChange={ ( value ) =>
						setAttributes( { sectionTitle: value } )
					}
					placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
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
