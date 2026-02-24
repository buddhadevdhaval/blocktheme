import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { TagSelector } from '../_shared/components';
import { t } from '../_shared/utils';
const TEMPLATE = [
	[ 'ambrygen/two-column-tab-with-image-item' ],
	[ 'ambrygen/two-column-tab-with-image-item' ],
	[ 'ambrygen/two-column-tab-with-image-item' ],
	[ 'ambrygen/two-column-tab-with-image-item' ],
];

export default function Edit( { attributes, setAttributes } ) {
	const { heading, headingTag, description } = attributes;

	const blockProps = useBlockProps( {
		className: 'vertical-tabs-block order-testing-block',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ t( 'Heading Settings' ) } initialOpen>
					<TagSelector
						label={ t( 'Heading Tag' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						includeTextTags={ false }
					/>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="vertical-tabs-block__header block__rowflex">
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-3 block-title mb-0 block__rowflex--heading-title"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ t( 'Section Title' ) }
					/>

					<div className="block__rowflex--block-content subtitle-1-regular">
						<RichText
							tagName="div"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ t( 'Section Description' ) }
						/>
					</div>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="vertical-tabs">
					<InnerBlocks
						allowedBlocks={ [
							'ambrygen/two-column-tab-with-image-item',
						] }
						template={ TEMPLATE }
					/>
				</div>
			</section>
		</>
	);
}
