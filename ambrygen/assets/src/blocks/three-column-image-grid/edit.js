import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { TagSelector } from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = [ 'ambrygen/three-column-image-grid-item' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { heading, description, headingTag } = attributes;
	const { blockId } = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( blockId !== expectedId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'three-column-image-grid our-approach',
	} );

	const HeadingTag = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].includes(
		headingTag
	)
		? headingTag
		: 'h2';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="our-approach__header block__rowflex">
					<RichText
						tagName={ HeadingTag }
						className={ `block-title block__rowflex--heading-title heading-3 mb-0` }
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						allowedFormats={ [ 'core/text-color' ] }
						placeholder={ __( 'Add Heading', 'ambrygen-web' ) }
					/>

					<div className="block__rowflex--block-content subtitle1-reg">
						<RichText
							tagName="div"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							multiline="p"
							placeholder={ __(
								'Add description…',
								'ambrygen-web'
							) }
						/>
					</div>
				</div>

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="our-approach__content">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ [
							[ 'ambrygen/three-column-image-grid-item' ],
							[ 'ambrygen/three-column-image-grid-item' ],
							[ 'ambrygen/three-column-image-grid-item' ],
						] }
						templateLock={ false }
					/>
				</div>
			</div>
		</>
	);
}
