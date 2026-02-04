import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';

import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = [ 'core/shortcode' ];

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	const {
		title = 'Get in',
		highlightText = 'Touch',
		content,
		headingLevel = 'h2',
	} = attributes;

	const HeadingTag = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].includes(
		headingLevel
	)
		? headingLevel
		: 'h2';

	// Seed content only if missing (block.json default becomes source)
	useEffect( () => {
		if ( ! content?.trim() ) {
			setAttributes( { content: attributes.content } );
		}
	}, [ content, attributes.content, setAttributes ] );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
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

			<div className="contact-form-block">
				<div className="heading-center center-align">
					<HeadingTag className="heading-3 block-title mb-0">
						<RichText
							tagName="span"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Get in', 'ambrygen-web' ) }
						/>{ ' ' }
						<span>
							<RichText
								tagName="span"
								value={ highlightText }
								onChange={ ( value ) =>
									setAttributes( { highlightText: value } )
								}
								placeholder={ __( 'Touch', 'ambrygen-web' ) }
							/>
						</span>
					</HeadingTag>

					<div className="is-style-gl-s24"></div>

					<RichText
						tagName="div"
						className="heading-content text-md-regular"
						value={ content }
						onChange={ ( value ) =>
							setAttributes( { content: value } )
						}
						multiline="p"
					/>
				</div>

				<div className="contact-form-block__form">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ [
							[
								'core/shortcode',
								{ text: '[gravityform id="1"]' },
							],
						] }
					/>
				</div>
			</div>
		</div>
	);
}
