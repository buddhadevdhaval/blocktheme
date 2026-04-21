import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, headingLevel, intro, title } = attributes;
	const TagName = headingLevel || 'h2';

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, setAttributes ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<SelectControl
						label={ __( 'Heading Level', 'ambrygen-web' ) }
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

			<div { ...useBlockProps() }>
				<div className="collaborators">
					<div className="collaborators__header block__rowflex">
						<TagName className="collaborators__title block__rowflex--heading-title heading-3 mb-0">
							<RichText
								tagName="span"
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
								placeholder={ __(
									'Add Title…',
									'ambrygen-web'
								) }
							/>
						</TagName>

						<RichText
							tagName="div"
							className="collaborators__intro block__rowflex--block-content subtitle1"
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

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<div className="collaborators__list">
						<InnerBlocks
							allowedBlocks={ [ 'ambrygen/collaborator-item' ] }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
