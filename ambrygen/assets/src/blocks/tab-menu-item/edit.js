import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

import {
	PanelBody,
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { label, targetId, isActiveTab } = attributes;

	const sectionOptions = useSelect( ( select ) => {
		const { getBlocks } = select( 'core/block-editor' );

		const getAllBlocks = ( blocks ) => {
			return blocks.reduce( ( acc, block ) => {
				acc.push( block );

				if ( block.innerBlocks?.length ) {
					acc.push( ...getAllBlocks( block.innerBlocks ) );
				}

				return acc;
			}, [] );
		};

		const allBlocks = getAllBlocks( getBlocks() );

		return [
			{ label: 'Select Section', value: '' },
			...allBlocks
				.filter( ( block ) => block.attributes?.blockId )
				.map( ( block ) => {
					const blockType = wp.blocks.getBlockType( block.name );
					const blockTitle = blockType?.title || block.name;
					const stripHTML = ( str ) =>
						str ? str.replace( /<[^>]+>/g, '' ) : '';
					const heading =
						stripHTML( block.attributes?.heading ) ||
						stripHTML( block.attributes?.title ) ||
						null;

					return {
						label: heading
							? `${ blockTitle } – ${ heading }`
							: `${ blockTitle } – ${ block.attributes.blockId }`,
						value: block.attributes.blockId,
					};
				} ),
		];
	} );

	const blockProps = useBlockProps( {
		className: `tab-button ${ isActiveTab ? 'active' : '' }`,
	} );
	const { getBlockRootClientId, getBlocks } =
		wp.data.select( 'core/block-editor' );
	const { updateBlockAttributes } = wp.data.dispatch( 'core/block-editor' );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Tab Settings">
					<TextControl
						label="Tab Label"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>

					<ToggleControl
						label="Set as Default Active Tab"
						checked={ isActiveTab }
						onChange={ ( value ) => {
							const parentId = getBlockRootClientId( clientId );
							const siblingBlocks = getBlocks( parentId );

							// Remove active from all siblings
							siblingBlocks.forEach( ( block ) => {
								if ( block.name === 'ambrygen/tab-item' ) {
									updateBlockAttributes( block.clientId, {
										isActiveTab: false,
									} );
								}
							} );

							// Set current block active
							updateBlockAttributes( clientId, {
								isActiveTab: value,
							} );
						} }
					/>
					<SelectControl
						label="Scroll To Section"
						value={ targetId }
						options={ sectionOptions }
						onChange={ ( value ) =>
							setAttributes( { targetId: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<button type="button" { ...blockProps }>
				{ label }
			</button>
		</>
	);
}
