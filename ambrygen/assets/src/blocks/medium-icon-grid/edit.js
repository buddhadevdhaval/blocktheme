import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { BlockExamplePreview, TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = [ 'ambrygen/medium-icon-grid-item' ];

const MEDIUM_ICON_GRID_TEMPLATE = [
	[
		'ambrygen/medium-icon-grid-item',
		{
			title: '',
			description: '',
		},
	],
	[
		'ambrygen/medium-icon-grid-item',
		{
			title: '',
			description: '',
		},
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		tagline,
		heading,
		headingTag = 'h2',
		description,
	} = attributes;
	const isExample = blockId === 'medium-icon-grid-example';

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, isExample, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'icon-card-grid',
		id: blockId || undefined,
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="medium-icon-grid-example-preview"
				imagePath="/assets/src/images/medium-icon-grid/preview.png"
			/>
		);
	}

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
						placeholder={ __( 'Add Eyebrow…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12"></div>
					<RichText
						tagName={ headingTag }
						className="heading-4 block-title mb-0 icon-card-grid__heading"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12"></div>
					<RichText
						tagName="div"
						className="body1 icon-card-grid__desc"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __( 'Add Description…', 'ambrygen-web' ) }
					/>
				</div>

				<div className="is-style-gl-s32"></div>

				<div className="icon-card-grid__grid">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ MEDIUM_ICON_GRID_TEMPLATE }
						templateLock={ false }
					/>
				</div>
			</div>
		</>
	);
}
