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
	[ 'ambrygen/two-column-solution-card-item' ],
	[ 'ambrygen/two-column-solution-card-item' ],
];

export default function Edit( { attributes, setAttributes } ) {
	const { heading, headingTag, description } = attributes;

	const blockProps = useBlockProps( {
		className: 'cta-tiles-with-content',
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
				<div className="cta-tiles-with-content__header block__rowflex">
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-3 block-title mb-0 block__rowflex--heading-title"
						value={ heading }
						allowedFormats={ 'core/text-color' }
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
