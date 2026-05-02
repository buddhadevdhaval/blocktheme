import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { TagSelector } from '../_shared/components';

const TEMPLATE = [ [ 'ambrygen/timeline-item' ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, title, description, headingTag } = attributes;
	const blockProps = useBlockProps( {
		className: 'block-layout timeline-block',
	} );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="timeline-block__header">
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-3 block-title mb-0"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __(
							'Six steps from sample to report',
							'ambrygen-web'
						) }
					/>
					<div className="is-style-gl-s24" aria-hidden="true"></div>
					<RichText
						tagName="div"
						className="text-md-regular block-description"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Add timeline description',
							'ambrygen-web'
						) }
					/>
				</div>

				<div className="is-style-gl-s24" aria-hidden="true"></div>

				<div className="timeline-block__items">
					<InnerBlocks
						allowedBlocks={ [ 'ambrygen/timeline-item' ] }
						template={ TEMPLATE }
						templateLock={ false }
						renderAppender={ InnerBlocks.ButtonBlockAppender }
					/>
				</div>
			</div>
		</>
	);
}

