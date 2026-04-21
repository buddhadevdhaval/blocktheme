import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

import { TagSelector } from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = ['ambrygen/three-column-image-grid-item'];

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		eyebrow,
		heading,
		description,
		headingTag,
		variation = 'default',
		isHeaderVertical,
	} = attributes;
	const { blockId } = attributes;

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [clientId, blockId, setAttributes]);

	const variationClass = variation !== 'default' ? variation : '';

	const blockProps = useBlockProps({
		className: `block-layout three-column-image-grid our-approach ${variationClass}`,
	});

	const HeadingTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
		headingTag
	)
		? headingTag
		: 'h2';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Heading Settings', 'ambrygen-web')}
					initialOpen={true}
				>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h2'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
						type="heading"
					/>
					<SelectControl
						label={__('Variation', 'ambrygen-web')}
						value={variation}
						options={[
							{
								label: __('Default', 'ambrygen-web'),
								value: 'default',
							},
							{
								label: __('Variation Three', 'ambrygen-web'),
								value: 'variation-three',
							},
						]}
						onChange={(value) =>
							setAttributes({ variation: value })
						}
					/>
					<ToggleControl
						label={__('Vertical Header Layout', 'ambrygen-web')}
						checked={isHeaderVertical}
						onChange={(value) =>
							setAttributes({ isHeaderVertical: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className={`our-approach__header block__rowflex is-${isHeaderVertical ? 'vertical' : 'horizontal'}`}>
					<div className="block-title mb-0 block__rowflex--heading-title js-gsap-fade our-approach__header__left">
						<RichText
							tagName="div"
							value={eyebrow}
							allowedFormats={['core/text-color']}
							onChange={(value) =>
								setAttributes({ eyebrow: value })
							}
							className="eyebrow"
							placeholder={__(
								'Add Eyebrow Text…',
								'ambrygen-web'
							)}
						/>
						{(eyebrow || heading) && (
							<div className="is-style-gl-s12" aria-hidden="true" />
						)}
						<RichText
							tagName={HeadingTag}
							className={`block-title block__rowflex--heading-title heading-3 mb-0`}
							value={heading}
							onChange={(value) =>
								setAttributes({ heading: value })
							}
							allowedFormats={['core/text-color']}
							placeholder={__('Add Heading', 'ambrygen-web')}
						/>
					</div>

					<div className='heading-content-wrapper'>
						<div className="block__rowflex--block-content subtitle1-reg">
							<RichText
								tagName="div"
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
								}
								multiline="p"
								placeholder={__(
									'Add description…',
									'ambrygen-web'
								)}
							/>
						</div>
					</div>
				</div>

				{(heading || description) && (
					<div className="is-style-gl-s32" aria-hidden="true"></div>
				)}

				<div className="our-approach__content">
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={[
							['ambrygen/three-column-image-grid-item'],
							['ambrygen/three-column-image-grid-item'],
							['ambrygen/three-column-image-grid-item'],
						]}
						templateLock="all"
					/>
				</div>
			</div>
		</>
	);
}
