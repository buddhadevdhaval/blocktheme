import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button, PanelBody } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = [ 'ambrygen/icon-card-grid-item' ];

const TEMPLATE = [
	[
		'ambrygen/icon-card-grid-item',
		{
			title: 'Unexplained neurological symptoms',
			description:
				'A family member has seizures, developmental delays, movement disorders, or other neurological symptoms without clear diagnosis',
		},
	],
	[
		'ambrygen/icon-card-grid-item',
		{
			title: 'Child with developmental delay or autism',
			description:
				'A child is experiencing developmental regression, intellectual disability, or has received an autism spectrum disorder diagnosis',
		},
	],
	[
		'ambrygen/icon-card-grid-item',
		{
			title: 'Family history of neurological disorder',
			description:
				'Multiple family members across generations have been diagnosed with a similar neurological condition',
		},
	],
	[
		'ambrygen/icon-card-grid-item',
		{
			title: 'Seeking clarity on treatment options',
			description:
				'Knowing the specific gene involved could help guide medication choice, dietary therapy, or other management decisions',
		},
	],
	[
		'ambrygen/icon-card-grid-item',
		{
			title: 'Family planning considerations',
			description:
				'You or a partner carry a known neurological gene variant, or have had a child with a disorder and want to understand recurrence risk',
		},
	],
	[
		'ambrygen/icon-card-grid-item',
		{
			title: 'Avoiding additional invasive testing',
			description:
				'Genetic results may help confirm or rule out a diagnosis without requiring additional biopsies, imaging, or other invasive procedures',
		},
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { insertBlock } = useDispatch( 'core/block-editor' );
	const {
		blockId,
		tagline,
		heading,
		headingLevel = 'h2',
		description,
	} = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'icon-card-grid',
	} );

	const addCard = () => {
		const newBlock = createBlock( 'ambrygen/icon-card-grid-item', {} );

		insertBlock( newBlock, undefined, clientId );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Content Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						type="heading"
						value={ headingLevel }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="icon-card-grid__header">
					<RichText
						tagName="div"
						className="hero-kicker icon-card-grid__tagline"
						value={ tagline }
						onChange={ ( value ) =>
							setAttributes( { tagline: value } )
						}
						placeholder={ __( 'Add tagline…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12"></div>
					<RichText
						tagName={ headingLevel }
						className="heading-4 block-title mb-0 icon-card-grid__heading"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add heading…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12"></div>
					<RichText
						tagName="div"
						className="body1 icon-card-grid__desc"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __( 'Add description…', 'ambrygen-web' ) }
					/>
				</div>

				<div className="is-style-gl-s32"></div>

				<div className="icon-card-grid__grid">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
						renderAppender={ () => false }
					/>
				</div>

				<div
					className="icon-card-grid__add-item"
					style={ { marginTop: '20px', textAlign: 'center' } }
				>
					<Button variant="primary" onClick={ addCard }>
						{ __( '+ Add Card', 'ambrygen-web' ) }
					</Button>
				</div>
			</div>
		</>
	);
}
