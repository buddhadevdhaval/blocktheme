import {
	InnerBlocks,
	RichText,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { TagSelector, BlockExamplePreview } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const { heading, headingTag, description, isLargeIcon, blockId } = attributes;

	if ( blockId === 'small-icon-grid-example' ) {
		return (
			<BlockExamplePreview
				imagePath="/assets/src/images/icon-grid/variation4.png"
			/>
	);
}

	const blockProps = useBlockProps( {
		className: `block-layout icon-grid ${ isLargeIcon ? 'style-large-icons' : '' }`,
		id: blockId,
	} );

	const TEMPLATE = [
		[ 'ambrygen/icon-grids-item', {} ],
		[ 'ambrygen/icon-grids-item', {} ],
		[ 'ambrygen/icon-grids-item', {} ],
	];

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Display Settings', 'ambrygen-web' ) }>
					<ToggleControl
						label={ __( 'Large Icons', 'ambrygen-web' ) }
						checked={ isLargeIcon }
						onChange={ ( value ) =>
							setAttributes( { isLargeIcon: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="icon-grid-block">
				<div className="icon-grid__header">
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-3 block-title mb-0"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder="Add Title..."
					/>
					<div className="is-style-gl-s20" aria-hidden="true"></div>
					<div className="text-xl-reg icon-grid__intro text-center">
						<RichText
							tagName="p"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder="Add Description..."
						/>
					</div>
				</div>

				<div className="is-style-gl-s64" aria-hidden="true"></div>
				<div className="icon-grid__list">
					<InnerBlocks
						allowedBlocks={ [ 'ambrygen/icon-grids-item' ] }
						template={ TEMPLATE }
						templateLock={ false }
					/>
				</div>
			</div>
		</div>
	);
}

