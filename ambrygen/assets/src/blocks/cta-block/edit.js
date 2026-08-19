import {
	useBlockProps,
	InspectorControls,
	RichText,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = [ 'core/buttons', 'core/button' ];
const INNER_BLOCKS_TEMPLATE = [
	[
		'core/buttons',
		{
			layout: { type: 'flex', justifyContent: 'center' },
			className: 'blocks-btn two-btn-row',
		},
		[ [ 'core/button' ], [ 'core/button' ] ],
	],
];

export default function Edit( { attributes, setAttributes } ) {
	const { title, headingTag } = attributes;

	const blockProps = useBlockProps( {
		className: 'mid-page-cta text-center block-layout',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName={ headingTag || 'h2' }
					className="block-title mb-0 heading-3"
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder={ __( 'Enter CTA Title…', 'ambrygen-web' ) }
				/>

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ INNER_BLOCKS_TEMPLATE }
					templateLock={ false }
				/>
			</div>
		</>
	);
}
