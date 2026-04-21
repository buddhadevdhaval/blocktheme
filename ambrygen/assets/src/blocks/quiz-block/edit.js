import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	LinkControl,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { trash } from '@wordpress/icons';
import { Fragment, useEffect } from '@wordpress/element';
import { TagSelector } from '../_shared/components';

const createChecklistId = () =>
	`risk-item-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createChecklistItem = () => ( {
	id: createChecklistId(),
	text: '',
} );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		eyebrowText,
		heading,
		headingTag,
		cardTitle,
		cardSubtitle,
		checklistItems = [],
		noRiskTitle,
		noRiskText,
		atRiskTitle,
		atRiskIntro,
		atRiskText,
		atRiskFootnote,
		buttons = [],
	} = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
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

	const updateButton = ( index, field, value ) => {
		const nextButtons = Array.isArray( buttons ) ? [ ...buttons ] : [];
		nextButtons[ index ] = {
			...nextButtons[ index ],
			[ field ]: value,
		};
		setAttributes( { buttons: nextButtons } );
	};

	const primaryButton = buttons?.[ 0 ] || {};
	const secondaryButton = buttons?.[ 1 ] || {};
	const blockProps = useBlockProps( {
		className: 'block-layout risk-checklist',
	} );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Quiz Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
					<TextControl
						label={ __( 'No Risk Title', 'ambrygen-web' ) }
						value={ noRiskTitle || '' }
						onChange={ ( value ) =>
							setAttributes( { noRiskTitle: value } )
						}
					/>
					<TextControl
						label={ __( 'At Risk Title', 'ambrygen-web' ) }
						value={ atRiskTitle || '' }
						onChange={ ( value ) =>
							setAttributes( { atRiskTitle: value } )
						}
					/>
					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<PanelRow>
						<div style={ { width: '100%' } }>
							<strong>{ __( 'Primary Button', 'ambrygen-web' ) }</strong>
							<TextControl
								label={ __( 'Text', 'ambrygen-web' ) }
								value={ primaryButton.text || '' }
								onChange={ ( value ) =>
									updateButton( 0, 'text', value )
								}
							/>
							<TextControl
								label={ __( 'Aria Label', 'ambrygen-web' ) }
								value={ primaryButton.ariaLabel || '' }
								onChange={ ( value ) =>
									updateButton( 0, 'ariaLabel', value )
								}
							/>
							<LinkControl
								value={ { url: primaryButton.url || '' } }
								onChange={ ( value ) =>
									updateButton( 0, 'url', value?.url || '' )
								}
							/>
							<SelectControl
								label={ __( 'Button Style', 'ambrygen-web' ) }
								value={
									primaryButton.variant ||
									'site-btn is-style-site-trailing-icon'
								}
								options={ [
									{
										label: __( 'Trailing Icon', 'ambrygen-web' ),
										value: 'site-btn is-style-site-trailing-icon',
									},
									{
										label: __( 'Dark', 'ambrygen-web' ),
										value: 'site-btn',
									},
									{
										label: __( 'Light', 'ambrygen-web' ),
										value: 'site-btn is-style-site-tertiary-btn',
									},
								] }
								onChange={ ( value ) =>
									updateButton( 0, 'variant', value )
								}
							/>
						</div>
					</PanelRow>
					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<PanelRow>
						<div style={ { width: '100%' } }>
							<strong>{ __( 'Secondary Button', 'ambrygen-web' ) }</strong>
							<TextControl
								label={ __( 'Text', 'ambrygen-web' ) }
								value={ secondaryButton.text || '' }
								onChange={ ( value ) =>
									updateButton( 1, 'text', value )
								}
							/>
							<TextControl
								label={ __( 'Aria Label', 'ambrygen-web' ) }
								value={ secondaryButton.ariaLabel || '' }
								onChange={ ( value ) =>
									updateButton( 1, 'ariaLabel', value )
								}
							/>
							<LinkControl
								value={ { url: secondaryButton.url || '' } }
								onChange={ ( value ) =>
									updateButton( 1, 'url', value?.url || '' )
								}
							/>
							<SelectControl
								label={ __( 'Button Style', 'ambrygen-web' ) }
								value={
									secondaryButton.variant ||
									'site-btn is-style-site-trailing-icon'
								}
								options={ [
									{
										label: __( 'Trailing Icon', 'ambrygen-web' ),
										value: 'site-btn is-style-site-trailing-icon',
									},
									{
										label: __( 'Dark', 'ambrygen-web' ),
										value: 'site-btn',
									},
									{
										label: __( 'Light', 'ambrygen-web' ),
										value: 'site-btn is-style-site-tertiary-btn',
									},
								] }
								onChange={ ( value ) =>
									updateButton( 1, 'variant', value )
								}
							/>
						</div>
					</PanelRow>
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
						placeholder={ __( 'Add eyebrow text', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12" aria-hidden="true"></div>
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-4 block-title mb-0"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add heading', 'ambrygen-web' ) }
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
							placeholder={ __( 'Add card title', 'ambrygen-web' ) }
						/>
						<div className="is-style-gl-s8" aria-hidden="true"></div>
						<RichText
							tagName="div"
							className="subtitle2-sbold risk-checklist__card-subtitle"
							value={ cardSubtitle }
							onChange={ ( value ) =>
								setAttributes( { cardSubtitle: value } )
							}
							placeholder={ __( 'Add card subtitle', 'ambrygen-web' ) }
						/>
					</div>

					<div className="risk-checklist__card-body">
						<div className="counter-block__actions">
							<Button variant="primary" onClick={ addChecklistItem }>
								{ __( 'Add Checklist Item', 'ambrygen-web' ) }
							</Button>
						</div>

						<div className="risk-checklist__items">
							{ checklistItems.map( ( item, index ) => (
								<div className="risk-checklist__item" key={ item.id }>
									<div className="risk-checklist__item-toolbar">
										<strong>
											{ __( 'Item', 'ambrygen-web' ) } { index + 1 }
										</strong>
										<Button
											icon={ trash }
											size="small"
											isDestructive
											disabled={ checklistItems.length <= 1 }
											onClick={ () => removeChecklistItem( item.id ) }
											label={ __( 'Remove', 'ambrygen-web' ) }
										/>
									</div>
									<label className="risk-checklist__item-label">
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
												updateChecklistItem( item.id, value )
											}
											placeholder={ __(
												'Add checklist item text',
												'ambrygen-web'
											) }
										/>
									</label>
								</div>
							) ) }
						</div>

						<div className="is-style-gl-s24" aria-hidden="true"></div>

						<div className="risk-checklist__result risk-checklist__result--no-risk">
							<RichText
								tagName="div"
								className="body1-sbold risk-checklist__result-title"
								value={ noRiskTitle }
								onChange={ ( value ) =>
									setAttributes( { noRiskTitle: value } )
								}
								placeholder={ __( 'Add default result title', 'ambrygen-web' ) }
							/>
							<div className="is-style-gl-s8" aria-hidden="true"></div>
							<RichText
								tagName="p"
								className="body1 risk-checklist__result-text"
								value={ noRiskText }
								onChange={ ( value ) =>
									setAttributes( { noRiskText: value } )
								}
								placeholder={ __( 'Add default result text', 'ambrygen-web' ) }
							/>
						</div>

						<div className="risk-checklist__result risk-checklist__result--at-risk">
							<RichText
								tagName="div"
								className="body1-sbold risk-checklist__result-title"
								value={ atRiskTitle }
								onChange={ ( value ) =>
									setAttributes( { atRiskTitle: value } )
								}
								placeholder={ __( 'Add at-risk title', 'ambrygen-web' ) }
							/>
							<div className="is-style-gl-s24" aria-hidden="true"></div>
							<RichText
								tagName="p"
								value={ atRiskIntro }
								onChange={ ( value ) =>
									setAttributes( { atRiskIntro: value } )
								}
								placeholder={ __( 'Add at-risk intro', 'ambrygen-web' ) }
							/>
							<RichText
								tagName="p"
								value={ atRiskText }
								onChange={ ( value ) =>
									setAttributes( { atRiskText: value } )
								}
								placeholder={ __( 'Add at-risk text', 'ambrygen-web' ) }
							/>
							<RichText
								tagName="p"
								value={ atRiskFootnote }
								onChange={ ( value ) =>
									setAttributes( { atRiskFootnote: value } )
								}
								placeholder={ __( 'Add footnote', 'ambrygen-web' ) }
							/>
						</div>
					</div>
				</div>

				<div className="is-style-gl-s32" aria-hidden="true"></div>

				<div className="risk-checklist__cta">
					{ buttons.map( ( button, index ) =>
						button?.text ? (
							<a
								key={ index }
								href={ button.url || '#' }
								className={
									button.variant ||
									'site-btn is-style-site-trailing-icon'
								}
							>
								{ button.text }
							</a>
						) : null
					) }
				</div>
			</div>
		</Fragment>
	);
}
