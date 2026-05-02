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

const normalizeActionLinks = ( ambrygen_links = [] ) =>
	DEFAULT_ACTION_LINKS.map( ( ambrygen_default_link, ambrygen_index ) => ( {
		...ambrygen_default_link,
		...( ambrygen_links?.[ ambrygen_index ] || {} ),
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

	const ambrygen_normalized_action_links =
		normalizeActionLinks( actionLinks );

	const updateActionLink = ( ambrygen_link_id, ambrygen_updates ) => {
		const ambrygen_next_links = ambrygen_normalized_action_links.map(
			( ambrygen_link ) =>
				ambrygen_link.id === ambrygen_link_id
					? { ...ambrygen_link, ...ambrygen_updates }
					: ambrygen_link
		);

		setAttributes( { actionLinks: ambrygen_next_links } );
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
						onSelect={ ( ambrygen_media ) =>
							setAttributes( {
								backgroundImageId: ambrygen_media?.id || 0,
								backgroundImageUrl:
									ambrygen_media?.url || '',
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
						onChange={ ( ambrygen_value ) =>
							setAttributes( {
								primaryCta: {
									...ambrygen_value,
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
					{ ambrygen_normalized_action_links.map(
						( ambrygen_link ) => (
							<div
								key={ ambrygen_link.id }
								style={ {
									paddingBottom: '16px',
									marginBottom: '16px',
									borderBottom: '1px solid #ddd',
								} }
							>
								<CtaButtonField
									label={ ambrygen_link.text || __( 'Link', 'ambrygen-web' ) }
									value={ {
										...ambrygen_link,
										variant: 'site-btn has-right-arrow',
									} }
									onChange={ ( ambrygen_value ) =>
										updateActionLink( ambrygen_link.id, {
											id: ambrygen_link.id,
											text: ambrygen_value.text || '',
											url: ambrygen_value.url || '',
											target: ambrygen_value.target || '',
											rel: ambrygen_value.rel || '',
										} )
									}
									showVariant={ false }
									textLabel={ __( 'Link Text', 'ambrygen-web' ) }
									showNewTab={ false }
									help=""
								/>
							</div>
						)
					) }
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
						onChange={ ( ambrygen_value ) =>
							setAttributes( { title: ambrygen_value } )
						}
						placeholder={ __( 'Add title...', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s12" aria-hidden="true"></div>

					<div className="order-widget__tagline body1">
						<RichText
							tagName="span"
							value={ taglineLineOne }
							onChange={ ( ambrygen_value ) =>
								setAttributes( {
									taglineLineOne: ambrygen_value,
								} )
							}
							placeholder={ __(
								'Add first tagline line...',
								'ambrygen-web'
							) }
						/>
						<RichText
							tagName="div"
							value={ taglineLineTwo }
							onChange={ ( ambrygen_value ) =>
								setAttributes( {
									taglineLineTwo: ambrygen_value,
								} )
							}
							placeholder={ __(
								'Add second tagline line...',
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
							onChange={ ( ambrygen_value ) =>
								setAttributes( { boxTitle: ambrygen_value } )
							}
							placeholder={ __(
								'Add box title...',
								'ambrygen-web'
							) }
						/>
						<div className="is-style-gl-s4" aria-hidden="true"></div>
						<RichText
							tagName="div"
							className="body2-reg order-widget__box-subheading"
							value={ boxSubtitle }
							onChange={ ( ambrygen_value ) =>
								setAttributes( {
									boxSubtitle: ambrygen_value,
								} )
							}
							placeholder={ __(
								'Add box subtitle...',
								'ambrygen-web'
							) }
						/>
						<div className="is-style-gl-s24" aria-hidden="true"></div>
						<div className="site-btn has-right-arrow order-widget__btn">
							{ primaryCta?.text || __( 'Login / Register', 'ambrygen-web' ) }
						</div>
					</div>

					<div className="is-style-gl-s24" aria-hidden="true"></div>

					<div className="order-widget__grid">
						{ ambrygen_normalized_action_links.map(
							( ambrygen_link ) => (
								<div
									key={ ambrygen_link.id }
									className="order-widget__action text-xs-bold"
								>
									{ ambrygen_link.text }
								</div>
							)
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
