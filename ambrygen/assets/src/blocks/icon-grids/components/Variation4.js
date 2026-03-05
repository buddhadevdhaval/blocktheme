import { InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Variation4( { attributes, setAttributes, template } ) {
	const { heading, headingTag, description } = attributes;

	return (
		<>
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
					template={ template }
					templateLock={ false }
				/>
			</div>
		</>
	);
}
