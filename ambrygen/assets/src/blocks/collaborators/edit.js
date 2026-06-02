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
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
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
				<div className="block-layout timeline-block collaborators">
					<div className="timeline-block__header collaborators__header">
						<TagName className="heading-3 block-title mb-0 collaborators__title block-title">
							<RichText
								tagName="span"
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
								placeholder={ __(
									'Add Heading…',
									'ambrygen-web'
								) }
							/>
						</TagName>

						<div className="is-style-gl-s24" aria-hidden="true"></div>

						<RichText
							tagName="div"
							className="text-md-regular block-description collaborators__intro block-description"
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

					<div className="is-style-gl-s24" aria-hidden="true"></div>

					<div className="timeline-block__items collaborators__list">
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

