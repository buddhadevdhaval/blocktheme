import { useEffect } from '@wordpress/element';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId } = attributes;

	useEffect( () => {
		const expectedId = `sticky-tabs-${ clientId.slice( 0, 8 ) }`;

		if ( blockId !== expectedId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'secondary-sticky-tabs',
	} );

	return (
		<div { ...blockProps } id={ blockId }>
			<div className="horizontal-tabs">
				<InnerBlocks
					allowedBlocks={ [ 'ambrygen/secondary-sticky-tab-item' ] }
				/>
			</div>
		</div>
	);
}
