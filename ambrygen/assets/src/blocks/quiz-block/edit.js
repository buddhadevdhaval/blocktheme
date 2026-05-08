import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { trash } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';
import {
	BlockExamplePreview,
	CtaButtonField,
	TagSelector,
} from '../_shared/components';

const createChecklistId = () =>
	`risk-item-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createChecklistItem = () => ( {
	id: createChecklistId(),
	text: '',
} );

const BUTTON_VARIANT_MAP = {
	dark: 'site-btn',
	'is-style-site-tertiary-btn':
		'site-btn is-style-site-tertiary-btn has-right-arrow',
};

const getFieldButtonValue = ( button = {} ) => ( {
	...button,
	variant:
		button.variant === 'site-btn is-style-site-tertiary-btn has-right-arrow'
			? 'is-style-site-tertiary-btn'
			: 'dark',
} );

const getStoredButtonValue = ( value = {}, fallbackVariant = 'site-btn' ) => ( {
	...value,
	variant: BUTTON_VARIANT_MAP[ value.variant ] || fallbackVariant,
} );

const getButtonPreviewProps = ( button = {} ) => ( {
	href: button.url || undefined,
	className: button.variant || 'site-btn has-right-arrow',
	target: button.target || undefined,
	rel: button.rel || undefined,
} );

const hasButtonPreviewValue = ( button = {} ) =>
	Object.values( button ).some( ( value ) => Boolean( value ) );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		eyebrowText,
		heading,
		headingTag,
		cardTitle,
		cardSubtitle,
		checklistItems = [],
		noRiskText,
		atRiskText,
		buttons = [],
	} = attributes;

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;

		if ( !blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, setAttributes ] );

	useEffect( () => {
		const hasMissingIds = checklistItems.some( ( item ) => ! item?.id );

		if ( ! hasMissingIds ) {
			return;
		}

		setAttributes( {
			checklistItems: checklistItems.map( ( item ) => ( {
				...item,
				id: item?.id || createChecklistId(),
			} ) ),
		} );
	}, [ checklistItems, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'block-layout risk-checklist',
	} );

	if ( blockId === 'quiz-block-example' ) {
		return (
			<BlockExamplePreview
				className="quiz-block-example-preview"
				imagePath="/assets/src/images/quiz-block/preview.png"
			/>
		);
	}

	const updateChecklistItem = ( itemId, value ) => {
		setAttributes( {
			checklistItems: checklistItems.map( ( item ) =>
				item.id === itemId ? { ...item, text: value } : item
			),
		} );
	};

	const addChecklistItem = () => {
		setAttributes( {
			checklistItems: [ ...checklistItems, createChecklistItem() ],
		} );
	};

	const removeChecklistItem = ( itemId ) => {
		if ( checklistItems.length <= 1 ) {
			return;
		}

		setAttributes( {
			checklistItems: checklistItems.filter(
				( item ) => item.id !== itemId
			),
		} );
	};

	const primaryButton = buttons?.[ 0 ] || {};
	const secondaryButton = buttons?.[ 1 ] || {};
	const hasEyebrowText = Boolean( eyebrowText );
	const hasHeading = Boolean( heading );
	const hasCardTitle = Boolean( cardTitle );
	const hasCardSubtitle = Boolean( cardSubtitle );
	const hasNoRiskText = Boolean( noRiskText );
	const hasAtRiskText = Boolean( atRiskText );
	const ctaButtons = [
		{
			key: 'primary',
			button: primaryButton,
			fallbackText: __( 'Button 1', 'ambrygen-web' ),
		},
		{
			key: 'secondary',
			button: secondaryButton,
			fallbackText: __( 'Button 2', 'ambrygen-web' ),
		},
	];
	const hasButtons = ctaButtons.some( ( { button } ) =>
		hasButtonPreviewValue( button )
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) } initialOpen={ false }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody title={ __( 'Button Settings', 'ambrygen-web' ) } initialOpen={ true }>
					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<CtaButtonField
						label={ __( 'Primary Button', 'ambrygen-web' ) }
						value={ getFieldButtonValue( primaryButton ) }
						onChange={ ( value ) =>
							setAttributes( {
								buttons: [
									getStoredButtonValue( value, 'site-btn' ),
									secondaryButton,
								],
							} )
						}
						textLabel={ __( 'Text', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<CtaButtonField
						label={ __( 'Secondary Button', 'ambrygen-web' ) }
						value={ getFieldButtonValue( secondaryButton ) }
						onChange={ ( value ) =>
							setAttributes( {
								buttons: [
									primaryButton,
									getStoredButtonValue(
										value,
										'site-btn is-style-site-tertiary-btn has-right-arrow'
									),
								],
							} )
						}
						textLabel={ __( 'Text', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="risk-checklist__header">
					<RichText
						tagName="div"
						className="overline-text risk-checklist__eyebrow hero-kicker"
						value={ eyebrowText }
						onChange={ ( value ) =>
							setAttributes( { eyebrowText: value } )
						}
						placeholder={ __( 'Add Eyebrow…', 'ambrygen-web' ) }
					/>
					<div
						className="is-style-gl-s12"
						aria-hidden="true"
					></div>
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-4 block-title mb-0"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
					/>
				</div>

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="risk-checklist__card">
					<div className="risk-checklist__card-header">
						<RichText
							tagName="h3"
							className="heading-5 risk-checklist__card-title mb-0"
							value={ cardTitle }
							onChange={ ( value ) =>
								setAttributes( { cardTitle: value } )
							}
							placeholder={ __(
								'Add Card Title…',
								'ambrygen-web'
							) }
						/>
						<div
							className="is-style-gl-s8"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="subtitle2-sbold risk-checklist__card-subtitle"
							value={ cardSubtitle }
							onChange={ ( value ) =>
								setAttributes( { cardSubtitle: value } )
							}
							placeholder={ __(
								'Add Card Short Description…',
								'ambrygen-web'
							) }
						/>
					</div>

					<div className="risk-checklist__card-body">
						<div className="risk-checklist__actions">
							<Button
								variant="primary"
								onClick={ addChecklistItem }
							>
								{ __( 'Add Checklist Item', 'ambrygen-web' ) }
							</Button>
							<div
								className="is-style-gl-s32"
								aria-hidden="true"
							></div>
						</div>

						<div className="risk-checklist__items">
							{ checklistItems.map( ( item, index ) => (
								<div
									className="risk-checklist__item"
									key={ item.id }
								>
									<div className="risk-checklist__item-toolbar">
										<div className="subtitle2-sbold risk-checklist__item-toolbar-title">
											{ __( 'Item', 'ambrygen-web' ) }{ ' ' }
											{ index + 1 }
										</div>
										<Button
											icon={ trash }
											size="small"
											isDestructive
											disabled={
												checklistItems.length <= 1
											}
											onClick={ () =>
												removeChecklistItem( item.id )
											}
											label={ __(
												'Remove',
												'ambrygen-web'
											) }
										/>
									</div>
									<div className="risk-checklist__item-label">
										<input
											type="checkbox"
											className="risk-checklist__checkbox"
											disabled
										/>
										<span
											className="risk-checklist__checkbox-custom"
											aria-hidden="true"
										></span>
										<RichText
											tagName="span"
											className="body1 risk-checklist__item-text"
											value={ item.text || '' }
											onChange={ ( value ) =>
												updateChecklistItem(
													item.id,
													value
												)
											}
											placeholder={ __(
												'Checklist Item Text',
												'ambrygen-web'
											) }
										/>
									</div>
								</div>
							) ) }
						</div>

						<div
							className="is-style-gl-s24"
							aria-hidden="true"
						></div>

						<div className="risk-checklist__result risk-checklist__result--no-risk">
							<RichText
								tagName="p"
								className="body1 risk-checklist__result-text"
								value={ noRiskText }
								onChange={ ( value ) =>
									setAttributes( { noRiskText: value } )
								}
								placeholder={ __(
									'Add Instructions…',
									'ambrygen-web'
								) }
							/>
						</div>

						<div
							className="is-style-gl-s24"
							aria-hidden="true"
						></div>

						<div className="risk-checklist__result risk-checklist__result--at-risk">
							<RichText
								tagName="p"
								className="body1 risk-checklist__result-text"
								value={ atRiskText }
								onChange={ ( value ) =>
									setAttributes( { atRiskText: value } )
								}
								placeholder={ __(
									'Add Risk Instructions…',
									'ambrygen-web'
								) }
							/>
						</div>
					</div>
				</div>

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="risk-checklist__cta">
					{ ctaButtons.map( ( { key, button, fallbackText } ) =>
						hasButtonPreviewValue( button ) ? (
							<a
								key={ key }
								{ ...getButtonPreviewProps( button ) }
							>
								{ button.text || fallbackText }
							</a>
						) : null
					) }
				</div>
			</div>
		</>
	);
}
