import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { TagSelector } from '../_shared/components';
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
	}, [ clientId ] );

	const blockProps = useBlockProps( {
		className: 'three-column-image-grid our-approach',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Heading Settings" initialOpen={ true }>
					<TagSelector
						label="Heading Tag"
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="our-approach__header block__rowflex">
					<RichText
						tagName={ headingTag || 'h2' }
						className="block-title block__rowflex--heading-title heading-3 mb-0"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder="Add Heading"
					/>

					<div className="block__rowflex--block-content subtitle1-reg">
						<RichText
							tagName="p"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder="Add description..."
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
