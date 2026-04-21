import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { TagSelector } from '../_shared/components';

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
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						value={ headingLevel }
						type="heading"
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
								placeholder={ __(
									'Add Heading…',
									'ambrygen-web'
								) }
							/>
						</TagName>

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
