import { useEffect } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	URLInput,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
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
		customName = '',
		customCount = '',
		customLink = {},
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

	const fallbackTermName = selectedTermData?.name
		? decodeEntities( selectedTermData.name )
		: title;
	const displayName = customName || fallbackTermName;
	const displayCount =
		customCount !== '' && customCount !== null
			? customCount
			: selectedTermData?.count;
	const displayLink = customLink?.url || selectedTermData?.link || '#';

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
					<TextControl
						label={ __( 'Custom Name', 'ambrygen-web' ) }
						value={ customName }
						onChange={ ( value ) =>
							setAttributes( {
								customName: value,
							} )
						}
						placeholder={ fallbackTermName || __( 'Category name', 'ambrygen-web' ) }
						help={ __(
							'Leave empty to use the selected category name.',
							'ambrygen-web'
						) }
					/>
					<TextControl
						label={ __( 'Custom Count', 'ambrygen-web' ) }
						value={ customCount }
						onChange={ ( value ) =>
							setAttributes( {
								customCount: value,
							} )
						}
						placeholder={
							selectedTermData?.count !== undefined &&
							selectedTermData?.count !== null
								? String( selectedTermData.count )
								: __( '0', 'ambrygen-web' )
						}
						help={ __(
							'Leave empty to use the selected category count.',
							'ambrygen-web'
						) }
					/>
					<div className="components-base-control">
						<label className="components-base-control__label">
							{ __( 'Custom Link', 'ambrygen-web' ) }
						</label>
						<URLInput
							value={ customLink?.url || '' }
							onChange={ ( url ) =>
								setAttributes( {
									customLink: {
										...customLink,
										url: url || '',
									},
								} )
							}
						/>
					</div>
					<ToggleControl
						label={ __( 'Open custom link in new tab', 'ambrygen-web' ) }
						checked={ Boolean( customLink?.opensInNewTab ) }
						onChange={ ( value ) =>
							setAttributes( {
								customLink: {
									...customLink,
									opensInNewTab: value,
								},
							} )
						}
					/>
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
									{ displayName }
								</div>

								{ displayCount !== undefined &&
									displayCount !== null &&
									displayCount !== '' && (
										<div className="item-card__title subtitle2-sbold">
											{ displayCount } Tests
										</div>
									) }

								<div className="is-style-gl-s8" aria-hidden="true"></div>
							</div>
							<a
								className="site-btn is-style-site-text-btn has-right-arrow text-14"
								href={ displayLink }
								target={ customLink?.opensInNewTab ? '_blank' : undefined }
								rel={ customLink?.opensInNewTab ? 'noopener noreferrer' : undefined }
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
