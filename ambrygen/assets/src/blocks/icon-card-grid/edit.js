import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	BlockExamplePreview,
	TagSelector,
} from '../_shared/components';

function hasVisibleContent( value ) {
	if ( ! value ) {
		return false;
	}

	return value.replace( /<[^>]+>/g, '' ).trim().length > 0;
}

const ALLOWED_BLOCKS = [ 'ambrygen/icon-card-grid-item' ];

const TEMPLATE = [
	[
		'ambrygen/icon-card-grid-item',
		{
			title: '',
			description: '',
		},
	],
	[
		'ambrygen/icon-card-grid-item',
		{
			title: '',
			description: '',
		},
	]
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { insertBlock } = useDispatch( 'core/block-editor' );
	const {
		blockId,
		tagline,
		heading,
		headingTag = 'h2',
		description,
	} = attributes;
	const hasTagline = hasVisibleContent( tagline );
	const hasHeading = hasVisibleContent( heading );
	const hasDescription = hasVisibleContent( description );
	const hasHeader = hasTagline || hasHeading || hasDescription;
	const hasCards = useSelect(
		( select ) =>
			( select( 'core/block-editor' ).getBlockOrder( clientId ) || [] ).length > 0,
		[ clientId ]
	);

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'icon-card-grid',
	} );

	if ( blockId === 'icon-card-grid-example' ) {
		return (
			<BlockExamplePreview
				className="icon-card-grid-example-preview"
				imagePath="/assets/src/images/medium-icon-grid/preview.png"
			/>
		);
	}

	const addCard = () => {
		const newBlock = createBlock( 'ambrygen/icon-card-grid-item', {} );

		insertBlock( newBlock, undefined, clientId );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
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
						placeholder={ __( 'Add Eyebrow...', 'ambrygen-web' ) }
					/>
					{ hasTagline && ( hasHeading || hasDescription ) && (
						<div className="is-style-gl-s12"></div>
					) }
					<RichText
						tagName={ headingTag }
						className="heading-4 block-title mb-0 icon-card-grid__heading"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>
					{ hasHeading && hasDescription && (
						<div className="is-style-gl-s12"></div>
					) }
					<RichText
						tagName="div"
						className="body1 icon-card-grid__desc"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __( 'Add Description...', 'ambrygen-web' ) }
					/>
				</div>

				{ hasHeader && hasCards && (
					<div className="is-style-gl-s32"></div>
				) }

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
						{ __( '+ Add New Card', 'ambrygen-web' ) }
					</Button>
				</div>
			</div>
		</>
	);
}


