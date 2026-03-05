import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';

import { PanelBody } from '@wordpress/components';
import { TagSelector } from '../_shared/components';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [ 'core/shortcode' ];

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	const { title = '', content, headingLevel = 'h2' } = attributes;

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						type="heading"
						value={ headingLevel }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="contact-form-block">
				<div className="heading-center center-align">
					<RichText
						tagName={ headingLevel }
						className={ `heading-3 block-title mb-0` }
						value={ title }
						allowedFormats={ [ 'core/text-color' ] }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __( 'Add Title…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s24" aria-hidden="true"></div>
					<div className="heading-content text-md-regular">
						<RichText
							tagName="div"
							value={ content }
							onChange={ ( value ) =>
								setAttributes( { content: value } )
							}
							multiline="p"
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
						/>
					</div>
				</div>

				<div className="contact-form-block__form">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ [ [ 'core/shortcode' ] ] }
					/>
				</div>
			</div>
		</div>
	);
}
