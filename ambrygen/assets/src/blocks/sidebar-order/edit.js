import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { CtaButtonField, ImageUploader } from '../_shared/components';

const DEFAULT_ACTION_LINKS = [
	{
		id: 'order-a-sample-kit',
		text: 'Order A Sample Kit',
		url: '',
		target: '',
		rel: '',
	},
	{
		id: 'specimen-requirements',
		text: 'Specimen Requirements',
		url: '',
		target: '',
		rel: '',
	},
	{
		id: 'download-test-forms',
		text: 'Download Test Forms',
		url: '',
		target: '',
		rel: '',
	},
	{
		id: 'verify-insurance-coverage',
		text: 'Verify Insurance Coverage',
		url: '',
		target: '',
		rel: '',
	},
];

const normalizeActionLinks = ( ambrygenLinks = [] ) =>
	DEFAULT_ACTION_LINKS.map( ( defaultLink, index ) => ( {
		...defaultLink,
		...( ambrygenLinks?.[ index ] || {} ),
	} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		taglineLineOne,
		taglineLineTwo,
		boxTitle,
		boxSubtitle,
		backgroundImageUrl,
		primaryCta = {},
		actionLinks = DEFAULT_ACTION_LINKS,
	} = attributes;

	const normalizedActionLinks = normalizeActionLinks( actionLinks );

	const updateActionLink = ( linkId, updates ) => {
		const nextLinks = normalizedActionLinks.map( ( link ) =>
			link.id === linkId ? { ...link, ...updates } : link
		);

		setAttributes( { actionLinks: nextLinks } );
	};

	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Background Image', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						url={ backgroundImageUrl }
						label={ __( 'Widget Background', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								backgroundImageId: media?.id || 0,
								backgroundImageUrl: media?.url || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								backgroundImageId: 0,
								backgroundImageUrl: '',
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Primary Button', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<CtaButtonField
						label={ __( 'Primary CTA', 'ambrygen-web' ) }
						value={ {
							...primaryCta,
							variant:
								primaryCta?.variant ||
								'site-btn has-right-arrow',
						} }
						onChange={ ( value ) =>
							setAttributes( {
								primaryCta: {
									...value,
									variant: 'site-btn has-right-arrow',
								},
							} )
						}
						showVariant={ false }
						textPlaceholder={ __(
							'Login / Register',
							'ambrygen-web'
						) }
						showNewTab={ false }
						help=""
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Quick Links', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ normalizedActionLinks.map( ( link ) => (
						<div
							key={ link.id }
							style={ {
								paddingBottom: '16px',
								marginBottom: '16px',
								borderBottom: '1px solid #ddd',
							} }
						>
							<CtaButtonField
								label={
									link.text || __( 'Link', 'ambrygen-web' )
								}
								value={ {
									...link,
									variant: 'site-btn has-right-arrow',
								} }
								onChange={ ( value ) =>
									updateActionLink( link.id, {
										id: link.id,
										text: value.text || '',
										url: value.url || '',
										target: value.target || '',
										rel: value.rel || '',
									} )
								}
								showVariant={ false }
								textLabel={ __( 'Link Text', 'ambrygen-web' ) }
								showNewTab={ false }
								help=""
							/>
						</div>
					) ) }
				</PanelBody>
			</InspectorControls>

			<div className="sidebar-widget order-widget">
				{ backgroundImageUrl && (
					<div className="block-bg-image">
						<img src={ backgroundImageUrl } alt="" />
					</div>
				) }

				<div className="widget-content">
					<RichText
						tagName="h3"
						className="heading-6 mb-0 order-widget__title"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __( 'Add title…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12" aria-hidden="true"></div>

					<div className="order-widget__tagline body1">
						<RichText
							tagName="span"
							value={ taglineLineOne }
							onChange={ ( value ) =>
								setAttributes( {
									taglineLineOne: value,
								} )
							}
							placeholder={ __(
								'Add first tagline line…',
								'ambrygen-web'
							) }
						/>
						<RichText
							tagName="div"
							value={ taglineLineTwo }
							onChange={ ( value ) =>
								setAttributes( {
									taglineLineTwo: value,
								} )
							}
							placeholder={ __(
								'Add second tagline line…',
								'ambrygen-web'
							) }
						/>
					</div>

					<div className="is-style-gl-s12" aria-hidden="true"></div>

					<div className="order-widget__box">
						<RichText
							tagName="div"
							className="order-widget__box-title"
							value={ boxTitle }
							onChange={ ( value ) =>
								setAttributes( { boxTitle: value } )
							}
							placeholder={ __(
								'Add box title…',
								'ambrygen-web'
							) }
						/>
						<div
							className="is-style-gl-s4"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="body2-reg order-widget__box-subheading"
							value={ boxSubtitle }
							onChange={ ( value ) =>
								setAttributes( {
									boxSubtitle: value,
								} )
							}
							placeholder={ __(
								'Add box subtitle…',
								'ambrygen-web'
							) }
						/>
						<div
							className="is-style-gl-s24"
							aria-hidden="true"
						></div>
						<div className="site-btn has-right-arrow order-widget__btn">
							{ primaryCta?.text ||
								__( 'Login / Register', 'ambrygen-web' ) }
						</div>
					</div>

					<div className="is-style-gl-s24" aria-hidden="true"></div>

					<div className="order-widget__grid">
						{ normalizedActionLinks.map( ( link ) => (
							<div
								key={ link.id }
								className="order-widget__action text-xs-bold"
							>
								{ link.text }
							</div>
						) ) }
					</div>
				</div>
			</div>
		</div>
	);
}
