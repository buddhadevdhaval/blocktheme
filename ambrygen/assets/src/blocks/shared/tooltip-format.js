import {
	registerFormatType,
	getActiveFormat,
	applyFormat,
	removeFormat,
} from '@wordpress/rich-text';
import {
	RichTextToolbarButton,
	LinkControl,
} from '@wordpress/block-editor';
import {
	Modal,
	TextControl,
	Button,
	Notice,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const FORMAT_TYPE = 'ambrygen/tooltip';
const TOOLTIP_REGISTERED_KEY = '__ambrygenTooltipRegistered';

function stripNestedTooltipMarkup( html ) {
	if ( ! html ) {
		return '';
	}

	const template = document.createElement( 'template' );
	template.innerHTML = html;

	template.content
		.querySelectorAll( '.ambrygen-tooltip' )
		.forEach( ( el ) => {
			const parent = el.parentNode;
			if ( ! parent ) {
				return;
			}
			while ( el.firstChild ) {
				parent.insertBefore( el.firstChild, el );
			}
			parent.removeChild( el );
		} );

	return template.innerHTML;
}

function stripHtml( html ) {
	if ( ! html ) {
		return '';
	}

	return String( html )
		.replace( /<[^>]*>/g, '' )
		.replace( /&nbsp;/g, ' ' )
		.trim();
}

function encodeBase64Unicode( value ) {
	if ( ! value ) {
		return '';
	}

	const utf8 = encodeURIComponent( String( value ) ).replace(
		/%([0-9A-F]{2})/g,
		( match, hex ) => String.fromCharCode( parseInt( hex, 16 ) )
	);

	return window.btoa( utf8 );
}

function decodeBase64Unicode( value ) {
	if ( ! value ) {
		return '';
	}

	try {
		const binary = window.atob( String( value ) );
		const bytes = Array.from(
			binary,
			( c ) => '%' + c.charCodeAt( 0 ).toString( 16 ).padStart( 2, '0' )
		).join( '' );
		return decodeURIComponent( bytes );
	} catch ( e ) {
		return '';
	}
}

function generateTooltipId() {
	return `tt-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;
}

function TooltipFormatEdit( { value, onChange } ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ tooltipTitle, setTooltipTitle ] = useState( '' );
	const [ tooltipDescription, setTooltipDescription ] = useState( '' );
	const [ tooltipId, setTooltipId ] = useState( '' );
	const [ isLinkModalOpen, setIsLinkModalOpen ] = useState( false );
	const [ pendingLink, setPendingLink ] = useState( {
		url: '',
		title: '',
		opensInNewTab: false,
	} );

	const editorRef = useRef( null );
	const savedSelectionRef = useRef( null );

	const activeFormat = getActiveFormat( value, FORMAT_TYPE );

	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}

		const formatAtOpen = getActiveFormat( value, FORMAT_TYPE );

		setTooltipTitle(
			formatAtOpen?.attributes?.[ 'data-tooltip-title' ] || ''
		);

		setTooltipId( formatAtOpen?.attributes?.[ 'data-tooltip-id' ] || '' );

		const b64 = formatAtOpen?.attributes?.[ 'data-tooltip-b64' ] || '';
		const decoded = b64 ? decodeBase64Unicode( b64 ) : '';

		const content =
			decoded || formatAtOpen?.attributes?.[ 'data-tooltip' ] || '';

		setTooltipDescription( content );

		setTimeout( () => {
			if ( editorRef.current ) {
				editorRef.current.innerHTML = content;
			}
		}, 0 );
	}, [ isOpen, value ] );

	const syncEditorContent = () => {
		if ( editorRef.current ) {
			setTooltipDescription( editorRef.current.innerHTML );
		}
	};

	const saveSelection = () => {
		const selection = window.getSelection();
		if ( ! selection || selection.rangeCount === 0 || ! editorRef.current ) {
			return;
		}

		const range = selection.getRangeAt( 0 );
		const container = range.commonAncestorContainer;
		const isInside =
			container === editorRef.current ||
			( container.nodeType === Node.ELEMENT_NODE &&
				editorRef.current.contains( container ) ) ||
			( container.nodeType === Node.TEXT_NODE &&
				editorRef.current.contains( container.parentNode ) );

		if ( isInside ) {
			savedSelectionRef.current = range.cloneRange();
		}
	};

	const restoreSelection = () => {
		const selection = window.getSelection();
		if ( ! selection || ! savedSelectionRef.current ) {
			return;
		}

		selection.removeAllRanges();
		selection.addRange( savedSelectionRef.current );
	};

	const exec = ( command, commandValue = null ) => {
		if ( ! editorRef.current ) {
			return;
		}

		editorRef.current.focus();
		restoreSelection();
		document.execCommand( command, false, commandValue );
		syncEditorContent();
	};

	const applyPendingLink = () => {
		if ( ! pendingLink?.url ) {
			setIsLinkModalOpen( false );
			return;
		}

		exec( 'createLink', pendingLink.url );

		if ( editorRef.current ) {
			const selection = window.getSelection();
			if ( selection && selection.anchorNode ) {
				let node = selection.anchorNode;
				if ( node.nodeType === 3 ) {
					node = node.parentNode;
				}

				const anchor =
					node?.closest?.( 'a' ) ||
					( node?.tagName === 'A' ? node : null );

				if ( anchor ) {
					if ( pendingLink.opensInNewTab ) {
						anchor.setAttribute( 'target', '_blank' );
						anchor.setAttribute( 'rel', 'noopener noreferrer' );
					} else {
						anchor.removeAttribute( 'target' );
						anchor.removeAttribute( 'rel' );
					}

					if ( pendingLink.title ) {
						anchor.setAttribute( 'title', pendingLink.title );
					} else {
						anchor.removeAttribute( 'title' );
					}
				}
			}
		}

		syncEditorContent();
		setIsLinkModalOpen( false );
	};

	const applyTooltip = () => {
		const rawHtml = editorRef.current ? editorRef.current.innerHTML : '';
		const cleanedDescription = stripNestedTooltipMarkup( rawHtml || '' );

		const tooltipB64 = cleanedDescription
			? encodeBase64Unicode( cleanedDescription )
			: '';
		const tooltipTextFallback = stripHtml( cleanedDescription );
		const nextTooltipId = tooltipId || generateTooltipId();

		const nextFormat = applyFormat( value, {
			type: FORMAT_TYPE,
			attributes: {
				title: tooltipTitle,
				class: 'ambrygen-tooltip',
				'data-tooltip-title': tooltipTitle,
				'data-tooltip-id': nextTooltipId,
				'data-tooltip-b64': tooltipB64,
				'data-tooltip': tooltipTextFallback,
			},
		} );

		onChange( nextFormat );
		setIsOpen( false );
	};

	const removeTooltip = () => {
		onChange( removeFormat( value, FORMAT_TYPE ) );
		setIsOpen( false );
	};

	return (
		<>
			<RichTextToolbarButton
				icon="editor-help"
				title={ __( 'Tooltip', 'ambrygen-web' ) }
				onClick={ () => setIsOpen( true ) }
				isActive={ !! activeFormat }
			/>

			{ isOpen && (
				<Modal
					title={
						activeFormat
							? __( 'Edit tooltip', 'ambrygen-web' )
							: __( 'Add tooltip', 'ambrygen-web' )
					}
					onRequestClose={ () => setIsOpen( false ) }
					className="ambrygen-tooltip-modal"
				>
					<Notice status="info" isDismissible={ false }>
						{ __(
							'Write the content that should appear inside the tooltip.',
							'ambrygen-web'
						) }
					</Notice>

					<div style={ { marginTop: '16px' } }>
						<TextControl
							label={ __( 'Title (optional)', 'ambrygen-web' ) }
							help={ __(
								'Add a short heading if you want.',
								'ambrygen-web'
							) }
							value={ tooltipTitle }
							onChange={ setTooltipTitle }
							placeholder={ __( 'Example: Helpful tip', 'ambrygen-web' ) }
						/>
					</div>

					<div style={ { marginTop: '16px' } }>
						<p style={ { marginBottom: '8px', fontWeight: 600 } }>
							{ __( 'Tooltip content', 'ambrygen-web' ) }
						</p>

						<p
							style={ {
								marginBottom: '8px',
								fontSize: '12px',
								color: '#757575',
							} }
						>
							{ __(
								'Type content directly here. Use the buttons for bold, italic, and links.',
								'ambrygen-web'
							) }
						</p>

						<div
							style={ {
								border: '1px solid #ddd',
								borderRadius: '6px',
								background: '#fff',
								overflow: 'hidden',
							} }
						>
							<div
								style={ {
									borderBottom: '1px solid #ddd',
									padding: '8px',
									background: '#f6f7f7',
								} }
							>
								<ToolbarGroup>
									<ToolbarButton
										icon="editor-bold"
										label={ __( 'Bold', 'ambrygen-web' ) }
										onMouseDown={ ( event ) => event.preventDefault() }
										onClick={ () => exec( 'bold' ) }
									/>
									<ToolbarButton
										icon="editor-italic"
										label={ __( 'Italic', 'ambrygen-web' ) }
										onMouseDown={ ( event ) => event.preventDefault() }
										onClick={ () => exec( 'italic' ) }
									/>
									<ToolbarButton
										icon="admin-links"
										label={ __( 'Link', 'ambrygen-web' ) }
										onMouseDown={ ( event ) => event.preventDefault() }
										onClick={ () => {
											saveSelection();
											setPendingLink( {
												url: '',
												title: '',
												opensInNewTab: false,
											} );
											setIsLinkModalOpen( true );
										} }
									/>
									<ToolbarButton
										icon="editor-unlink"
										label={ __( 'Remove link', 'ambrygen-web' ) }
										onMouseDown={ ( event ) => event.preventDefault() }
										onClick={ () => exec( 'unlink' ) }
									/>
								</ToolbarGroup>
							</div>

							<div
								ref={ editorRef }
								contentEditable
								suppressContentEditableWarning
								onInput={ syncEditorContent }
								onBlur={ syncEditorContent }
								onMouseUp={ saveSelection }
								onKeyUp={ saveSelection }
								onFocus={ saveSelection }
								data-placeholder={ __(
									'Write tooltip content here…',
									'ambrygen-web'
								) }
								style={ {
									minHeight: '140px',
									padding: '12px',
									outline: 'none',
								} }
							/>
						</div>
					</div>

					{ isLinkModalOpen && (
						<Modal
							title={ __( 'Insert link', 'ambrygen-web' ) }
							onRequestClose={ () => setIsLinkModalOpen( false ) }
						>
							<LinkControl
								value={ pendingLink }
								onChange={ ( nextValue ) =>
									setPendingLink( {
										url: nextValue?.url || '',
										title: nextValue?.title || '',
										opensInNewTab:
											nextValue?.opensInNewTab || false,
									} )
								}
								settings={ [
									{
										id: 'opensInNewTab',
										title: __(
											'Open in new tab',
											'ambrygen-web'
										),
									},
								] }
								withCreateSuggestion={ false }
							/>

							<div
								style={ {
									display: 'flex',
									gap: '8px',
									marginTop: '16px',
									justifyContent: 'flex-end',
								} }
							>
								<Button
									variant="primary"
									onClick={ applyPendingLink }
									disabled={ ! pendingLink?.url }
								>
									{ __( 'Insert link', 'ambrygen-web' ) }
								</Button>
								<Button
									variant="secondary"
									onClick={ () => setIsLinkModalOpen( false ) }
								>
									{ __( 'Cancel', 'ambrygen-web' ) }
								</Button>
							</div>
						</Modal>
					) }

					<div
						style={ {
							display: 'flex',
							gap: '8px',
							marginTop: '20px',
							flexWrap: 'wrap',
						} }
					>
						<Button variant="primary" onClick={ applyTooltip }>
							{ activeFormat
								? __( 'Update tooltip', 'ambrygen-web' )
								: __( 'Save tooltip', 'ambrygen-web' ) }
						</Button>

						{ activeFormat && (
							<Button
								variant="secondary"
								isDestructive
								onClick={ removeTooltip }
							>
								{ __( 'Remove tooltip', 'ambrygen-web' ) }
							</Button>
						) }

						<Button
							variant="secondary"
							onClick={ () => setIsOpen( false ) }
						>
							{ __( 'Cancel', 'ambrygen-web' ) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
}

if ( ! globalThis[ TOOLTIP_REGISTERED_KEY ] ) {
	registerFormatType( FORMAT_TYPE, {
		title: __( 'Tooltip', 'ambrygen-web' ),
		tagName: 'span',
		className: 'ambrygen-tooltip',
		attributes: {
			title: 'title',
			'data-tooltip-title': 'data-tooltip-title',
			'data-tooltip': 'data-tooltip',
			'data-tooltip-b64': 'data-tooltip-b64',
			'data-tooltip-id': 'data-tooltip-id',
		},
		edit: TooltipFormatEdit,
	} );

	globalThis[ TOOLTIP_REGISTERED_KEY ] = true;
}
