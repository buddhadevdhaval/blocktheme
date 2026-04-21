import {
	InnerBlocks,
	RichText,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const CONTENT_TEMPLATE = [ [ 'core/paragraph', { content: '' } ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { heading, isDefaultActive } = attributes;

	const { isFirstItem, hasAnyDefaultActive } = useSelect(
		( select ) => {
			const editorSelect = select( 'core/block-editor' );
			if ( ! editorSelect?.getBlockRootClientId || ! editorSelect?.getBlockOrder ) {
				return { isFirstItem: false, hasAnyDefaultActive: false };
			}

			const rootClientId = editorSelect.getBlockRootClientId( clientId );
			if ( ! rootClientId ) {
				return { isFirstItem: false, hasAnyDefaultActive: false };
			}

			const order = editorSelect.getBlockOrder( rootClientId );
			if ( ! Array.isArray( order ) || order.length === 0 ) {
				return { isFirstItem: false, hasAnyDefaultActive: false };
			}

			const hasAnyDefault = order.some( ( id ) => {
				const block = editorSelect.getBlock?.( id );
				return !! block?.attributes?.isDefaultActive;
			} );

			return { isFirstItem: order[ 0 ] === clientId, hasAnyDefaultActive: hasAnyDefault };
		},
		[ clientId ]
	);

	const shouldShowActive = Boolean(
		isDefaultActive || ( isFirstItem && ! hasAnyDefaultActive )
	);

	const blockProps = useBlockProps( {
		className: `tabs-table-content__item${
			shouldShowActive ? ' is-active' : ''
		}`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tab Settings', 'ambrygen-web' ) } initialOpen>
					<ToggleControl
						label={ __( 'Default active tab', 'ambrygen-web' ) }
						checked={ !! isDefaultActive }
						onChange={ ( next ) =>
							setAttributes( { isDefaultActive: !! next } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="tabs-table-content__header">
					<RichText
						tagName="div"
						className="subtitle1-sbold tabs-table-content__title"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Tab heading…', 'ambrygen-web' ) }
						withoutInteractiveFormatting={ true }
					/>
				</div>

				<div className="tabs-table-content__content">
					<div className="tabs-table-content__image-wrapper">
						<InnerBlocks
							allowedBlocks={ [
								'core/paragraph',
								'core/list',
								'core/buttons',
								'core/button',
								'core/image',
							] }
							template={ CONTENT_TEMPLATE }
							templateLock={ false }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
