import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { TagSelector } from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, title, intro, headingLevel } = attributes;
	const TagName = headingLevel || 'h2';

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	return (
		<>
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

			<div { ...useBlockProps( { className: 'wrapper' } ) }>
				<div className="our-team">
					<div className="our-team__header block__rowflex">
						<RichText
							tagName={ TagName }
							className="our-team__title block__rowflex--heading-title heading-3 mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							allowedFormats={ [
								'core/bold',
								'core/italic',
								'core/text-color',
							] }
							placeholder={ __( 'Add Title…', 'ambrygen-web' ) }
						/>

						<RichText
							tagName="div"
							className="our-team__intro block__rowflex--block-content subtitle1"
							value={ intro }
							onChange={ ( value ) =>
								setAttributes( { intro: value } )
							}
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
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
