import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';

import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { BlockExamplePreview, TagSelector } from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = [ 'core/shortcode' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const blockProps = useBlockProps( {
		className: 'theme-form-block',
	} );

	const {
		blockId,
		title = '',
		content,
		headingTag = 'h2',
		formMode = 'shortcode',
		formUrl = '',
	} = attributes;

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
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						type="heading"
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Form Settings', 'ambrygen-web' ) }>
					<SelectControl
						label={ __( 'Form Mode', 'ambrygen-web' ) }
						value={ formMode }
						options={ [
							{
								label: __( 'Shortcode', 'ambrygen-web' ),
								value: 'shortcode',
							},
							{
								label: __( 'Hosted Iframe', 'ambrygen-web' ),
								value: 'iframe',
							},
							{
								label: __( 'HTML Contact Form', 'ambrygen-web' ),
								value: 'html',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { formMode: value } )
						}
					/>
					{ formMode === 'iframe' && (
						<TextControl
							label={ __( 'Form URL', 'ambrygen-web' ) }
							value={ formUrl || '' }
							onChange={ ( value ) =>
								setAttributes( { formUrl: value } )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div className="heading-center center-align">
				<RichText
					tagName={ headingTag }
					className="heading-3 block-title mb-0"
					value={ title }
					allowedFormats={ [ 'core/text-color' ] }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
				/>

				<div className="is-style-gl-s24" aria-hidden="true"></div>

				<div className="heading-content text-md-regular">
					<RichText
						tagName="p"
						multiline="p"
						value={ content }
						onChange={ ( value ) =>
							setAttributes( { content: value } )
						}
						placeholder={ __( 'Add Description...', 'ambrygen-web' ) }
					/>
				</div>
			</div>

			<div className="theme-form-block__form">
				{ formMode === 'shortcode' ? (
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ [ [ 'core/shortcode' ] ] }
						templateLock="all"
					/>
				) : (
					<p className="mb-0">
						{ formMode === 'html'
							? __(
									'The embedded HTML contact form will render on the frontend.',
									'ambrygen-web'
							  )
							: __(
									'The hosted iframe form will render on the frontend.',
									'ambrygen-web'
							  ) }
					</p>
				) }
			</div>
		</div>
	);
}
