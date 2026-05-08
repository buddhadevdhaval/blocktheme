import { useEffect } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
} ) {
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const {
		termlinktext,
		title = '',
		selectedTerm = null,
	} = attributes;

	const terms = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'taxonomy', 'poster_category', {
				per_page: 100,
				hide_empty: false,
				orderby: 'name',
				order: 'asc',
			} ),
		[]
	);

	const selectedTermIds = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const parentId = blockEditor.getBlockRootClientId( clientId );
			const siblings = blockEditor.getBlocks( parentId );

			return siblings
				.map( ( block ) => Number( block.attributes?.selectedTerm || 0 ) )
				.filter( ( id ) => id > 0 && id !== Number( selectedTerm || 0 ) );
		},
		[ clientId, selectedTerm ]
	);

	const { selectedTermData, imageUrl } = useSelect(
		( select ) => {
			if ( ! selectedTerm ) {
				return { selectedTermData: null, imageUrl: null };
			}

			const term = select( 'core' ).getEntityRecord(
				'taxonomy',
				'poster_category',
				selectedTerm
			);
			let sourceUrl = null;

			if ( term?.meta?.term_image ) {
				const media = select( 'core' ).getMedia( term.meta.term_image );
				sourceUrl = media?.source_url || null;
			}

			return {
				selectedTermData: term ?? null,
				imageUrl: sourceUrl,
			};
		},
		[ selectedTerm ]
	);

	useEffect( () => {
		if ( ! selectedTermData?.name ) {
			return;
		}

		const liveTermName = decodeEntities( selectedTermData.name );
		if ( title !== liveTermName ) {
			setAttributes( { title: liveTermName } );
		}
	}, [ selectedTermData, title, setAttributes ] );

	const onSelectTerm = ( termId ) => {
		if ( ! terms ) {
			return;
		}

		const term = terms.find( ( item ) => item.id === Number( termId ) );

		if ( ! term ) {
			return;
		}

		setAttributes( {
			selectedTerm: term.id,
			title: decodeEntities( term.name ),
			category: decodeEntities( term.slug ),
			termData: {
				count: term.count,
				image: term.meta?.term_image || '',
			},
		} );
	};

	const blockProps = useBlockProps( {
		className: 'item-card',
	} );

	const selectedTermName = selectedTermData?.name
		? decodeEntities( selectedTermData.name )
		: title;
	const selectedTermLink = selectedTermData?.link || '#';
	const availableTerms = terms
		? terms.filter( ( term ) => ! selectedTermIds.includes( term.id ) )
		: null;
	const hasAvailableTerms = Boolean( availableTerms?.length );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
					<TextControl
						label={ __( 'Button Text', 'ambrygen-web' ) }
						value={ termlinktext }
						onChange={ ( value ) =>
							setAttributes( {
								termlinktext: value || 'View Test',
							} )
						}
						placeholder={ __( 'View Test', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! selectedTerm && (
					<>
						{ ! terms && <Spinner /> }

						{ availableTerms && (
							<SelectControl
								label="Select Category"
								value=""
								options={ [
									...( hasAvailableTerms
										? [
												{
													label: 'Select Category',
													value: '',
												},
												...availableTerms.map( ( term ) => ( {
													label: decodeEntities( term.name ),
													value: term.id,
												} ) ),
										  ]
										: [
												{
													label: 'No categories available',
													value: '',
												},
										  ] ),
								] }
								disabled={ ! hasAvailableTerms }
								onChange={ ( value ) => {
									onSelectTerm( value );
								} }
							/>
						) }
					</>
				) }

				{ Boolean( selectedTerm ) && (
					<>
						{ imageUrl && (
							<div className="item-card__icon">
								<img src={ imageUrl } alt="" />
							</div>
						) }

						<div className="item-card__content">
							<div className="item-card__info">
								<div className="item-card__category body2-medium">
									{ selectedTermName }
								</div>

								{ selectedTermData?.count !== undefined &&
									selectedTermData?.count !== null && (
										<div className="item-card__title subtitle2-sbold">
											{ selectedTermData.count } Tests
										</div>
									) }

								<div className="is-style-gl-s8" aria-hidden="true"></div>
							</div>
							<a
								className="site-btn is-style-site-text-btn has-right-arrow text-14"
								href={ selectedTermLink }
								onClick={ ( e ) => e.preventDefault() }
							>
								{ termlinktext || __( 'View Test', 'ambrygen-web' ) }
							</a>
							<div
								className="is-style-gl-s24"
								aria-hidden="true"
							></div>
							<div className="info-list__actions actions-button">
								<Button
									isSecondary
									onClick={ () => {
										setAttributes( {
											selectedTerm: 0,
										} );
									} }
								>
									Change
								</Button>

								<Button
									isDestructive
									onClick={ () => removeBlock( clientId ) }
								>
									Remove
								</Button>
							</div>
						</div>
					</>
				) }
			</div>
		</>
	);
}
