import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TagSelector } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, kicker, title, headingTag } = attributes;

	useEffect( () => {
		const expectedId = `link-list-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'download-list',
		id: blockId,
	} );

	const ITEMS_ALLOWED_BLOCKS = [ 'ambrygen/link-item' ];

	const ITEMS_TEMPLATE = [ [ 'ambrygen/link-item', { cta: { text: 'Download Brochure' } } ] ];

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						type="heading"
						onChange={ ( val ) => setAttributes( { headingTag: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div className="download-list__inner">
				<div className="download-list__header-area mb-24">
					<RichText
						tagName="div"
						className="download-list__kicker hero-kicker"
						value={ kicker }
						placeholder={ __( 'Enter kicker...', 'ambrygen-web' ) }
						onChange={ ( val ) => setAttributes( { kicker: val } ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
					<div className="is-style-gl-s12" aria-hidden="true"></div>
					<RichText
						tagName={ headingTag }
						className="download-list__title heading-3 block-title mb-0"
						value={ title }
						placeholder={ __( 'Enter title...', 'ambrygen-web' ) }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				</div>

				<div className="download-list__items">
					<InnerBlocks
						allowedBlocks={ ITEMS_ALLOWED_BLOCKS }
						template={ ITEMS_TEMPLATE }
						templateLock={ false }
						renderAppender={ InnerBlocks.ButtonBlockAppender }
					/>
				</div>
			</div>
		</div>
	);
}
