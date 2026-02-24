import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getThemeAssetUrl } from '../../utils/assets';
import { useEffect } from '@wordpress/element';

import { TagSelector, CtaButtonField } from '../_shared/components';

const TEMPLATE = [
	[
		'ambrygen/icon-grids-item',
		{
			title: '',
			links: [
				{ label: '', url: '' },
				{ label: '', url: '' },
				{ label: '', url: '' },
			],
		},
	],
	[
		'ambrygen/icon-grids-item',
		{
			title: '',
			links: [
				{ label: '', url: '' },
				{ label: '', url: '' },
			],
		},
	],
	[
		'ambrygen/icon-grids-item',
		{
			title: '',
			links: [ { label: '', url: '' } ],
		},
	],
];

const TEMPLATE_SINGLE = [
	[
		'ambrygen/icon-grids-item',
		{
			title: '',
			links: [ { label: '', url: '' } ],
		},
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId } = attributes;

	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( {
				blockId: `section-${ clientId.slice( 0, 8 ) }`,
			} );
		}
	}, [] );

	const {
		variation = 'default',
		heading,
		headingTag,
		description,
		link,
	} = attributes;
	// const blockProps = useBlockProps( {
	// 	className: `info-list__row info-list-block  ${ variation }`,
	// } );
	const blockProps = useBlockProps( {
		className: ` ${
			variation === 'our-testing-menu'
				? ' our-testing-menu'
				: 'info-list__row info-list-block'
		}`,
	} );
	const selectedTemplate =
		variation === 'our-testing-menu' ? TEMPLATE_SINGLE : TEMPLATE;

	useEffect( () => {
		if ( ! attributes.variation ) {
			setAttributes( { variation: 'icon-grid' } );
		}
	}, [] );

	const VARIANTS = [
		{
			label: 'Default',
			value: 'icon-grid',
			image: getThemeAssetUrl(
				'/assets/src/images/icon-grid/variation1.png'
			),
		},
		{
			label: 'Icon grid with count',
			value: 'our-testing-menu',
			image: getThemeAssetUrl(
				'/assets/src/images/icon-grid/variation2.png'
			),
		},
		{
			label: 'Variation 3',
			value: 'variation-3',
			image: getThemeAssetUrl(
				'/assets/src/images/icon-grid/variation3.png'
			),
		},
		{
			label: 'Variation 4',
			value: 'variation-4',
			image: getThemeAssetUrl(
				'/assets/src/images/icon-grid/variation4.png'
			),
		},
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout Variation', 'ambrygen-web' ) }>
					<div className="layout-variant-selector">
						{ VARIANTS.map( ( variant ) => (
							<button
								key={ variant.value }
								type="button"
								className={ `variant-button ${
									variation === variant.value
										? 'is-selected'
										: ''
								}` }
								onClick={ () =>
									setAttributes( {
										variation: variant.value,
									} )
								}
							>
								<img
									src={ variant.image }
									alt={ variant.label }
								/>
								<span>{ variant.label }</span>
							</button>
						) ) }
					</div>
					{ variation === 'our-testing-menu' && (
						<>
							<TagSelector
								label={ __( 'Heading Tag', 'ambrygen-web' ) }
								value={ headingTag || 'h2' }
								onChange={ ( value ) =>
									setAttributes( { headingTag: value } )
								}
							/>

							<CtaButtonField
								label={ __( 'Link setting' ) }
								textLabel={ __( 'Link Text' ) }
								defaultVariant="primary"
								value={ link }
								showVariant={ false }
								onChange={ ( value ) =>
									setAttributes( { link: value } )
								}
							/>
						</>
					) }

					{ variation === 'variation-4' && (
						<section className="icon-grid">
							<div className="icon-grid__header">
								<RichText
									tagName={ headingTag || 'h2' }
									className="heading-3 block-title mb-0"
									value={ heading }
									onChange={ ( value ) =>
										setAttributes( { heading: value } )
									}
									placeholder="Enter Heading..."
								/>

								<div
									className="is-style-gl-s20"
									aria-hidden="true"
								></div>

								<div className="text-xl-reg icon-grid__intro text-center">
									<RichText
										tagName="p"
										value={ description }
										onChange={ ( value ) =>
											setAttributes( {
												description: value,
											} )
										}
										placeholder="Enter description..."
									/>
								</div>
							</div>

							<div
								className="is-style-gl-s64"
								aria-hidden="true"
							></div>

							<div className="icon-grid__list">
								<InnerBlocks
									allowedBlocks={ [
										'ambrygen/icon-grids-item',
									] }
									template={ selectedTemplate }
									templateLock={ false }
								/>
							</div>
						</section>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ variation === 'our-testing-menu' && (
					<div className="our-testing-menu__header block__rowflex">
						<RichText
							tagName={ headingTag || 'h2' }
							className="block-title block__rowflex--heading-title heading-3 mb-0"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder="Enter Heading..."
						/>

						<div className="block__rowflex--block-content subtitle1-reg">
							<RichText
								tagName="p"
								value={ attributes.description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder="Enter description..."
							/>

							<div className="block_rowflex-link">
								{ link?.url && link?.text && (
									<a
										href={ link.url }
										target={ link.target || undefined }
										rel={ link.rel || undefined }
										className="site-btn is-style-site-text-btn has-icon icon-arrow-up"
									>
										{ link.text }
									</a>
								) }
							</div>
						</div>
						<div
							className="is-style-gl-s50"
							aria-hidden="true"
						></div>
					</div>
				) }

				{ variation === 'variation-4' && (
					<>
						<RichText
							tagName={ headingTag || 'h2' }
							className="block-title block__rowflex--heading-title heading-3 mb-0"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder="Enter Heading..."
						/>

						<div className="block__rowflex--block-content subtitle1-reg">
							<RichText
								tagName="p"
								value={ attributes.description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder="Enter description..."
							/>
						</div>
					</>
				) }

				{ variation === 'our-testing-menu' ? (
					<div className="our-testing-menu__grid">
						<InnerBlocks
							allowedBlocks={ [ 'ambrygen/icon-grids-item' ] }
							template={ selectedTemplate }
							templateLock={ false }
						/>
					</div>
				) : variation === 'variation-4' ? (
					<div className="icon-grid__list">
						<InnerBlocks
							allowedBlocks={ [ 'ambrygen/icon-grids-item' ] }
							template={ selectedTemplate }
							templateLock={ false }
						/>
					</div>
				) : (
					<InnerBlocks
						allowedBlocks={ [ 'ambrygen/icon-grids-item' ] }
						template={ selectedTemplate }
						templateLock={ false }
					/>
				) }
			</div>
		</>
	);
}
