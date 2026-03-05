import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';

import Default from './components/Default';
import OurTestingMenu from './components/OurTestingMenu';
import Variation3 from './components/Variation3';
import Variation4 from './components/Variation4';

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
	const { blockId, variation } = attributes;

	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( {
				blockId: `section-${ clientId.slice( 0, 8 ) }`,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	const VARIANT_CLASS_MAP = {
		'icon-grid': 'info-list__row info-list-block',
		'our-testing-menu': 'our-testing-menu',
		'variation-3': 'variation-3',
		'variation-4': 'icon-grid',
	};

	const blockProps = useBlockProps( {
		className: VARIANT_CLASS_MAP[ variation ] || '',
	} );

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
		],
		[]
	);

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
								aria-pressed={ variation === variant.value }
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
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ variation === 'our-testing-menu' && (
					<OurTestingMenu
						attributes={ attributes }
						setAttributes={ setAttributes }
						template={ selectedTemplate }
					/>
				) }

				{ variation === 'variation-3' && (
					<Variation3
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				) }

				{ variation === 'variation-4' && (
					<Variation4
						attributes={ attributes }
						setAttributes={ setAttributes }
						template={ selectedTemplate }
					/>
				) }

				{ variation !== 'our-testing-menu' &&
					variation !== 'variation-4' &&
					variation !== 'variation-3' && (
						<Default template={ selectedTemplate } />
					) }
			</div>
		</>
	);
}
