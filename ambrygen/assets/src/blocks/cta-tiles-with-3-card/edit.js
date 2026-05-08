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
import { BlockExamplePreview, TagSelector } from '../_shared/components';
import { useEffect } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';

const ALLOWED_BLOCKS = [ 'ambrygen/cta-tiles-with-3-card-item' ];

const TEMPLATE = [
	[
		'ambrygen/cta-tiles-with-3-card-item',
		{
			type: 'small',
		},
	],
	[
		'ambrygen/cta-tiles-with-3-card-item',
		{
			type: 'small',
		},
	],
	[
		'ambrygen/cta-tiles-with-3-card-item',
		{
			type: 'main',
		},
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, sectionTitle, headingTag } = attributes;
	const isExample = blockId === 'cta-tiles-with-3-card-example';

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, isExample, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'cta-tiles-with-3-card',
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="cta-tiles-with-3-card-example-preview"
				imagePath='/assets/src/images/cta-tiles-with-3-card/default-image.png'
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
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

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="cta-tiles-with-3-card__container">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
						templateLock="all"
						renderAppender={ false }
					/>
				</div>
			</div>
		</>
	);
}

