import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const CONTENT_TEMPLATE = [ [ 'core/paragraph', { content: '' } ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { heading, itemId, isDefaultActive } = attributes;
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	useEffect( () => {
		const expectedItemId = `tabs-content-item-${ clientId.slice( 0, 8 ) }`;

		if ( itemId !== expectedItemId ) {
			setAttributes( { itemId: expectedItemId } );
		}
	}, [ clientId, itemId, setAttributes ] );

	const { isFirstItem, hasAnyDefaultActive, rootClientId, activeTabId } =
		useSelect(
			( select ) => {
				const editorSelect = select( 'core/block-editor' );

				if (
					! editorSelect?.getBlockRootClientId ||
					! editorSelect?.getBlockOrder
				) {
					return {
						isFirstItem: false,
						hasAnyDefaultActive: false,
						rootClientId: null,
						activeTabId: '',
					};
				}

				const rootId = editorSelect.getBlockRootClientId( clientId );

				if ( ! rootId ) {
					return {
						isFirstItem: false,
						hasAnyDefaultActive: false,
						rootClientId: null,
						activeTabId: '',
					};
				}

				const order = editorSelect.getBlockOrder( rootId );
				const rootBlock = editorSelect.getBlock( rootId );
				const currentActiveTabId = rootBlock?.attributes?.activeTabId || '';

				if ( ! Array.isArray( order ) || order.length === 0 ) {
					return {
						isFirstItem: false,
						hasAnyDefaultActive: false,
						rootClientId: rootId,
						activeTabId: currentActiveTabId,
					};
				}

				const hasAnyDefault = order.some( ( id ) => {
					const block = editorSelect.getBlock?.( id );
					return !! block?.attributes?.isDefaultActive;
				} );

				return {
					isFirstItem: order[ 0 ] === clientId,
					hasAnyDefaultActive: hasAnyDefault,
					rootClientId: rootId,
					activeTabId: currentActiveTabId,
				};
			},
			[ clientId ]
		);

	const shouldShowActive = Boolean(
		( activeTabId && activeTabId === clientId ) ||
			( ! activeTabId &&
				( isDefaultActive || ( isFirstItem && ! hasAnyDefaultActive ) ) )
	);

	const handleHeaderClick = () => {
		if ( rootClientId ) {
			updateBlockAttributes( rootClientId, {
				activeTabId: clientId,
			} );
		}
	};

	const blockProps = useBlockProps( {
		className: `tabs-table-content__item${
			shouldShowActive ? ' is-active' : ''
		}`,
		id: itemId || undefined,
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
				<div
					className="tabs-table-content__header"
					onClick={ handleHeaderClick }
					onKeyDown={ ( event ) => {
						if ( event.key === 'Enter' || event.key === ' ' ) {
							event.preventDefault();
							handleHeaderClick();
						}
					} }
					role="button"
					tabIndex={ 0 }
					aria-expanded={ shouldShowActive }
				>
					<RichText
						tagName="div"
						className="subtitle1-sbold tabs-table-content__title"
						value={ heading }
						onChange={ ( value ) => setAttributes( { heading: value } ) }
						placeholder={ __( 'Tab heading...', 'ambrygen-web' ) }
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
								'core/heading',
								'core/spacer',
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
