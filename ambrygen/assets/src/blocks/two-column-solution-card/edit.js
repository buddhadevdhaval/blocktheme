import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { BlockExamplePreview, TagSelector } from '../_shared/components';

const TEMPLATE = [
	[ 'ambrygen/two-column-solution-card-item' ],
	[ 'ambrygen/two-column-solution-card-item' ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, heading, headingTag, description } = attributes;
	const hasHeaderContent = Boolean( heading || description );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'cta-tiles-with-content',
	} );

	if ( blockId === 'two-column-solution-card-example' ) {
		return (
			<BlockExamplePreview
				className="two-column-solution-card-example-preview"
				imagePath="/assets/src/images/two-card-column/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						type="heading"
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="cta-tiles-with-content__header block__rowflex">
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-3 block-title mb-0 block__rowflex--heading-title"
						value={ heading }
						allowedFormats={ [ 'core/text-color' ] }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
					/>

					<div className="block__rowflex--block-content subtitle-1-regular">
						<RichText
							tagName="div"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
						/>
					</div>
				</div>

				{ hasHeaderContent && (
					<div className="is-style-gl-s50" aria-hidden="true"></div>
				) }

				<div className="cta-tiles-with-content__grid">
					<InnerBlocks
						allowedBlocks={ [
							'ambrygen/two-column-solution-card-item',
						] }
						template={ TEMPLATE }
					/>
				</div>
			</section>
		</>
	);
}
