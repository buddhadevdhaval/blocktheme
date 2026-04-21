import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = [ 'ambrygen/webinars-item' ];
const TEMPLATE = [ [ 'ambrygen/webinars-item' ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, title } = attributes;

	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( { blockId: `webinars-${ clientId.slice( 0, 8 ) }` } );
		}
	}, [ blockId, clientId, setAttributes ] );

	const blockProps = useBlockProps( { className: 'webinars' } );

	return (
		<>
			<div { ...blockProps }>
				<div className="webinars__header">
					<RichText
						tagName="h2"
						className="webinars__title heading-3"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Add Title…', 'ambrygen-web' ) }
					/>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="wp-block-query">
					<div className="event-carousel__grid webinar__grid wp-block-post-template">
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
							orientation="horizontal"
						/>
					</div>
					
					<div className="is-style-gl-s50" aria-hidden="true"></div>
				</div>
			</div>
		</>
	);
}
