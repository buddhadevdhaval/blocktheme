import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		cardTitle,
		taxonomy,
		placeholder,
		defaultSymbols,
		instructionText,
		noResultsText,
		footnoteText,
	} = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;
		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, setAttributes ] );

	const blockProps = useBlockProps( { className: 'gl-data-table genes-table' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Genes Table', 'ambrygen-web' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Taxonomy (slug)', 'ambrygen-web' ) }
						value={ taxonomy || 'gene' }
						onChange={ ( value ) => setAttributes( { taxonomy: value } ) }
					/>
					<TextControl
						label={ __( 'Search placeholder', 'ambrygen-web' ) }
						value={ placeholder || '' }
						onChange={ ( value ) => setAttributes( { placeholder: value } ) }
					/>
					<TextControl
						label={ __( 'Default genes (comma-separated)', 'ambrygen-web' ) }
						help={ __(
							'Used when the URL does not have ?symbols=...',
							'ambrygen-web'
						) }
						value={ defaultSymbols || '' }
						onChange={ ( value ) =>
							setAttributes( { defaultSymbols: value } )
						}
					/>
					<TextControl
						label={ __( 'Instruction text', 'ambrygen-web' ) }
						value={ instructionText || '' }
						onChange={ ( value ) =>
							setAttributes( { instructionText: value } )
						}
					/>
					<TextControl
						label={ __( 'No results text', 'ambrygen-web' ) }
						value={ noResultsText || '' }
						onChange={ ( value ) =>
							setAttributes( { noResultsText: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="gl-data-table__card-header">
					<RichText
						tagName="h3"
						value={ cardTitle }
						onChange={ ( value ) => setAttributes( { cardTitle: value } ) }
						placeholder={ __( 'Card title…', 'ambrygen-web' ) }
						className="gl-data-table__card-title"
					/>
				</div>

				<div className="genes-table__search">
					<input
						type="search"
						className="genes-table__search-input"
						placeholder={ placeholder || __( 'Search genes…', 'ambrygen-web' ) }
						disabled
					/>
				</div>

				<div className="gl-data-table__grid">
					<div className="gl-data-table__row gl-data-table__row--header">
						<div className="gl-data-table__cell">{ __( 'Gene', 'ambrygen-web' ) }</div>
						<div className="gl-data-table__cell">{ __( 'Isoform', 'ambrygen-web' ) }</div>
						<div className="gl-data-table__cell">{ __( 'Covered CDS Count', 'ambrygen-web' ) }</div>
						<div className="gl-data-table__cell">{ __( 'Symbols', 'ambrygen-web' ) }</div>
					</div>

					<div className="gl-data-table__row">
						<div className="gl-data-table__cell gl-data-table__cell--name" data-label="Gene">
							{ __(
								'This block renders on the front end when the URL has ?symbols=TERMNAME',
								'ambrygen-web'
							) }
						</div>
						<div className="gl-data-table__cell" data-label="Isoform">—</div>
						<div className="gl-data-table__cell" data-label="Covered CDS Count">—</div>
						<div className="gl-data-table__cell" data-label="Symbols">—</div>
					</div>
				</div>

				<div className="genes-table__footnote">
					<RichText
						tagName="p"
						value={ footnoteText || '' }
						onChange={ ( value ) =>
							setAttributes( { footnoteText: value } )
						}
						placeholder={ __(
							'Footnote…',
							'ambrygen-web'
						) }
					/>
				</div>
			</div>
		</>
	);
}
