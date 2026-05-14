import { useEffect } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

export default function Edit( {
	attributes,
	setAttributes,
} ) {
	const {
		termlinktext,
		title = '',
		selectedTerm = null,
	} = attributes;

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

	const blockProps = useBlockProps( {
		className: 'item-card',
	} );

	const selectedTermName = selectedTermData?.name
		? decodeEntities( selectedTermData.name )
		: title;
	const selectedTermLink = selectedTermData?.link || '#';

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
						</div>
					</>
				) }
			</div>
		</>
	);
}
