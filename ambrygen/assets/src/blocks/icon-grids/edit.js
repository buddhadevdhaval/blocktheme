import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';

import Default from './components/Default';
import OurTestingMenu from './components/OurTestingMenu';
import Variation3 from './components/Variation3';
import Variation4 from './components/Variation4';
import Variation5 from './components/Variation5';
import { CtaButtonField, ImageUploader } from '../_shared/components';

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
			links: [{ label: '', url: '' }],
		},
	],
];

const TEMPLATE_SINGLE = [
	[
		'ambrygen/icon-grids-item',
		{
			title: '',
			links: [{ label: '', url: '' }],
		},
	],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	const { blockId, variation, isLargeIcon } = attributes;

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [blockId, clientId, setAttributes]);

	const VARIANT_CLASS_MAP = {
		'icon-grid': 'block-layout info-list__row info-list-block',
		'our-testing-menu': 'our-testing-menu',
		'variation-3': 'variation-3',
		'variation-4': 'icon-grid',
		'variation-5': 'block-layout info-list__row info-list-block',
	};

	const blockProps = useBlockProps({
		className: `${VARIANT_CLASS_MAP[variation] || ''} ${isLargeIcon ? 'style-large-icons' : ''
			}`,
		style: attributes.backgroundImage?.url
			? {
				backgroundImage: `url(${attributes.backgroundImage.url})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}
			: {},
	});

	const selectedTemplate =
		variation === 'our-testing-menu' ? TEMPLATE_SINGLE : TEMPLATE;

	const VARIANTS = useMemo(
		() => [
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
				label: 'Genetic Testing',
				value: 'variation-3',
				image: getThemeAssetUrl(
					'/assets/src/images/icon-grid/variation3.png'
				),
			},
			{
				label: 'Small Icon Grid',
				value: 'variation-4',
				image: getThemeAssetUrl(
					'/assets/src/images/icon-grid/variation4.png'
				),
			},
			{
				label: 'Medium Icon Grid',
				value: 'variation-5',
				image: getThemeAssetUrl(
					'/assets/src/images/icon-grid/variation1.png'
				),
			},
		],
		[]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout Variation', 'ambrygen-web')}>
					<div className="layout-variant-selector">
						{VARIANTS.map((variant) => (
							<button
								key={variant.value}
								type="button"
								className={`variant-button ${variation === variant.value
									? 'is-selected'
									: ''
									}`}
								aria-pressed={variation === variant.value}
								onClick={() =>
									setAttributes({
										variation: variant.value,
									})
								}
							>
								<img
									src={variant.image}
									alt={variant.label}
								/>
								<span>{variant.label}</span>
							</button>
						))}
					</div>
				</PanelBody>

				<PanelBody title={__('Settings', 'ambrygen-web')}>
					<ToggleControl
						label={__('Large Icons', 'ambrygen-web')}
						checked={isLargeIcon}
						onChange={(value) =>
							setAttributes({ isLargeIcon: value })
						}
					/>
					<ImageUploader
						url={attributes.backgroundImage?.url}
						label="Background Image"
						onSelect={(media) =>
							setAttributes({
								backgroundImage: {
									id: media.id,
									url: media.url,
									alt: media.alt || media.title,
								},
							})
						}
						onRemove={() => setAttributes({ backgroundImage: {} })}
					/>
					<CtaButtonField
						label={__('CTA Button', 'ambrygen-web')}
						value={attributes.link || {}}
						onChange={(value) => setAttributes({ link: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{variation === 'our-testing-menu' && (
					<OurTestingMenu
						attributes={attributes}
						setAttributes={setAttributes}
						template={selectedTemplate}
					/>
				)}

				{variation === 'variation-3' && (
					<Variation3
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				)}

				{variation === 'variation-4' && (
					<Variation4
						attributes={attributes}
						setAttributes={setAttributes}
						template={selectedTemplate}
					/>
				)}

				{variation === 'variation-5' && (
					<Variation5
						attributes={attributes}
						setAttributes={setAttributes}
						template={selectedTemplate}
					/>
				)}
				{variation !== 'our-testing-menu' &&
					variation !== 'variation-4' &&
					variation !== 'variation-3' &&
					variation !== 'variation-5' && (
						<Default template={selectedTemplate} />
					)}
			</div>
		</>
	);
}
