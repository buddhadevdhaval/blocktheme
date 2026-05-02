import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { title, headingLevel } = attributes;

	return (
		<div { ...useBlockProps( { className: 'genetic-testing-accordion-admin' } ) }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Main Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
					/>
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
						onChange={ ( val ) => setAttributes( { headingLevel: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div className="genetic-testing-accordion__preview">
				<div className="genetic-testing-accordion__admin-header">
					<strong>{ __( 'Genetic Testing Accordion', 'ambrygen-web' ) }</strong>
					<p>{ __( 'Add genetic tests below. They will be grouped by category automatically on the frontend.', 'ambrygen-web' ) }</p>
				</div>
				<InnerBlocks
					allowedBlocks={ [ 'ambrygen/genetic-testing-accordion-item' ] }
					template={ [ [ 'ambrygen/genetic-testing-accordion-item' ] ] }
				/>
			</div>
		</div>
	);
}
