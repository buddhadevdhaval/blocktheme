import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';

import { PanelBody } from '@wordpress/components';
import { BlockExamplePreview, TagSelector } from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = [ 'core/shortcode' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const blockProps = useBlockProps( {
		className: 'theme-form-block',
	} );

	const { blockId, title = '', content, headingTag = 'h2' } = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	if ( blockId === 'theme-form-example' ) {
		return (
			<BlockExamplePreview
				className="theme-form-example-preview"
				imagePath="/assets/src/images/theme-form/preview.png"
			/>
		);
	}

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
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="heading-center center-align">
				<RichText
					tagName={ headingTag }
					className="heading-3 block-title mb-0"
					value={ title }
					allowedFormats={ [ 'core/text-color' ] }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
				/>

				<div className="is-style-gl-s24" aria-hidden="true"></div>
				<div className="heading-content text-md-regular">
					   <RichText
						   tagName="div"
						   value={ content }
						   onChange={ ( value ) =>
							   setAttributes( { content: value } )
						   }
						   __unstableMultilineTag="p"
						   placeholder={ __( 'Add Description…', 'ambrygen-web' ) }
					   />
				</div>
			</div>

			<div className="theme-form-block__form">
				   <InnerBlocks
					   allowedBlocks={ ALLOWED_BLOCKS }
					   template={ [ [ 'core/shortcode' ] ] }
					   templateLock="all"
				   />
			</div>
		</div>
	);
}
