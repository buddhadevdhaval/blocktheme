import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import {
	TagSelector,
	BlockExamplePreview,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [ 'ambrygen/multimedia-assets-item' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		heading,
		headingTag,
		blockId,
	} = attributes;
	const isExample = blockId === 'example-block-preview';

	useUniqueBlockId( {
		blockId,
		clientId,
		enabled: ! isExample,
		setAttributes,
	} );

	const blockProps = useBlockProps( {
		className: `block-layout multimedia-assets our-approach`,
	} );

	const HeadingTag = headingTag || 'h2';

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="example-block-preview"
				imagePath="/assets/src/images/multimedia-assets/preview.png"				
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div
					className="our-approach__header block__rowflex is-vertical"
				>
					<div className="block-title mb-0 block__rowflex--heading-title js-gsap-fade our-approach__header__left">
						<RichText
							tagName={ HeadingTag }
							className={ `block-title block__rowflex--heading-title heading-3 mb-0` }
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							allowedFormats={ [ 'core/text-color' ] }
							placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						/>
					</div>
				</div>

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="our-approach__content">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ [
							[ 'ambrygen/multimedia-assets-item' ],
							[ 'ambrygen/multimedia-assets-item' ],
							[ 'ambrygen/multimedia-assets-item' ],
						] }
						templateLock="all"
					/>
				</div>
			</div>
		</>
	);
}
