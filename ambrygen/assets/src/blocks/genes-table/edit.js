import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		cardTitle,
		eyebrowText,
		placeholder,
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

	const resolvedBlockId = blockId || `section-${ clientId.slice( 0, 8 ) }`;
	const blockProps = useBlockProps( { className: 'gl-data-table genes-table block-layout' } );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Genes Table', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<p style={ { margin: 0, color: '#666', fontSize: '12px' } }>
						{ __(
							'Search placeholder, instruction text, and no results text can be edited directly in the block preview.',
							'ambrygen-web'
						) }
					</p>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="gl-data-table__card-header">
					<RichText
						tagName="h3"
						value={ cardTitle }
						onChange={ ( value ) => setAttributes( { cardTitle: value } ) }
						placeholder={ __( 'Card title...', 'ambrygen-web' ) }
						className="gl-data-table__card-title"
					/>
				</div>

				<div className="genes-table__search">
					<div className="eyebrow kicker-text">
						<RichText
							tagName="span"
							value={
								eyebrowText ||
								__( 'Search by genes, Test name, or Code', 'ambrygen-web' )
							}
							onChange={ ( value ) =>
								setAttributes( { eyebrowText: value } )
							}
							placeholder={ __( 'Eyebrow text...', 'ambrygen-web' ) }
							withoutInteractiveFormatting
						/>
					</div>
					<div className="is-style-gl-s12" aria-hidden="true"></div>
					<form className="genes-table__search-form">
						<label
							className="screen-reader-text"
							htmlFor={ `${ resolvedBlockId }-search` }
						>
							{ __( 'Search genes', 'ambrygen-web' ) }
						</label>
						<input
							id={ `${ resolvedBlockId }-search` }
							type="search"
							className="genes-table__search-input"
							name="symbols"
							placeholder={ undefined }
							disabled
						/>
						<div
							className="genes-table__search-input"
							aria-hidden="true"
						>
							<RichText
								tagName="span"
								value={
									placeholder ||
									__( 'Search genes...', 'ambrygen-web' )
								}
								onChange={ ( value ) =>
									setAttributes( { placeholder: value } )
								}
								placeholder={ __( 'Search placeholder...', 'ambrygen-web' ) }
								withoutInteractiveFormatting
							/>
						</div>
						<input
							type="submit"
							className="genes-table__search-button"
							value={ __( 'Search', 'ambrygen-web' ) }
							disabled
						/>
					</form>
					<div className="is-style-gl-s24" aria-hidden="true"></div>
					<div className="body1 genes-table__instruction">
						<RichText
							tagName="div"
							value={ instructionText || '' }
							onChange={ ( value ) =>
								setAttributes( { instructionText: value } )
							}
							placeholder={ __( 'Instruction text...', 'ambrygen-web' ) }
							withoutInteractiveFormatting
						/>
					</div>
				</div>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div className="gl-data-table__grid">
					<div className="gl-data-table__row gl-data-table__row--header">
						<div className="gl-data-table__cell">
							{ __( 'Gene', 'ambrygen-web' ) }
						</div>
						<div className="gl-data-table__cell">
							{ __( 'Isoform', 'ambrygen-web' ) }
						</div>
						<div className="gl-data-table__cell">
							{ __( 'Covered CDS Count', 'ambrygen-web' ) }
						</div>
						<div className="gl-data-table__cell">
							{ __( 'Total CDS', 'ambrygen-web' ) }
						</div>
						<div className="gl-data-table__cell">
							{ __( '% of CDS Covered', 'ambrygen-web' ) }
						</div>
					</div>

					<div className="gl-data-table__row">
						<div
							className="gl-data-table__cell gl-data-table__cell--name"
							data-label="Gene"
						>
							<RichText
								tagName="span"
								value={
									noResultsText ||
									__(
										'This block renders on the front end when the URL has ?symbols=TERMNAME',
										'ambrygen-web'
									)
								}
								onChange={ ( value ) =>
									setAttributes( { noResultsText: value } )
								}
								placeholder={ __( 'No results text...', 'ambrygen-web' ) }
								withoutInteractiveFormatting
							/>
						</div>
						<div className="gl-data-table__cell" data-label="Isoform">
							-
						</div>
						<div
							className="gl-data-table__cell"
							data-label="Covered CDS Count"
						>
							-
						</div>
						<div className="gl-data-table__cell" data-label="Total CDS">
							-
						</div>
						<div
							className="gl-data-table__cell"
							data-label="% of CDS Covered"
						>
							-
						</div>
					</div>
				</div>

				<div className="is-style-gl-s24" aria-hidden="true"></div>

				<div className="genes-table__footnote">
					<RichText
						tagName="p"
						value={ footnoteText || '' }
						onChange={ ( value ) =>
							setAttributes( { footnoteText: value } )
						}
						placeholder={ __( 'Footnote...', 'ambrygen-web' ) }
					/>
				</div>
			</div>
		</>
	);
}
