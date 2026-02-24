import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { title, intro, headingLevel } = attributes;
	const TagName = headingLevel || 'h2';

	return (
		<>
			<InspectorControls>
				<PanelBody title="Heading Settings">
					<SelectControl
						label="Heading Level"
						value={ headingLevel }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						] }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps( { className: 'wrapper' } ) }>
				<div className="our-team">
					<div className="our-team__header block__rowflex">
						<TagName className="our-team__title block__rowflex--heading-title heading-3 mb-0">
							<RichText
								tagName="span"
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
								allowedFormats={ [
									'core/bold',
									'core/italic',
									'core/text-color',
								] }
							/>
						</TagName>

						<RichText
							tagName="div"
							className="our-team__intro block__rowflex--block-content subtitle1"
							value={ intro }
							onChange={ ( value ) =>
								setAttributes( { intro: value } )
							}
						/>
					</div>

					<div className="is-style-gl-s50"></div>

					<div className="our-team__grid">
						<InnerBlocks
							allowedBlocks={ [ 'ambrygen/our-team-item' ] }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
