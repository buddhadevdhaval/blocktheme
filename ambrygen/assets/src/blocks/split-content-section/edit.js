import {
	InnerBlocks,
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

import {
	ImageUploader,
	TagSelector,
	CtaButtonField,
} from '../_shared/components';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		title,
		titleTag,
		description,
		backgroundImage,
		backgroundImageAlt,
		primarybutton,
		secondarybutton,
		isMediumText,
	} = attributes;

	const CONTENT_TEMPLATE = [
		[
			'core/paragraph',
			{ placeholder: __('Add paragraph...', 'ambrygen-web') },
		],
	];

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [clientId, blockId, setAttributes]);

	const blockProps = useBlockProps({
		className: `heading-content-section ${isMediumText ? 'variation-medium-text' : ''
			}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Section Intro Settings', 'ambrygen-web')}
					initialOpen
				>
					<TagSelector
						label={__('Title Tag', 'ambrygen-web')}
						type="heading"
						value={titleTag || 'h2'}
						onChange={(value) =>
							setAttributes({ titleTag: value })
						}
					/>

					<ImageUploader
						label={__('Background Image', 'ambrygen-web')}
						url={backgroundImage}
						onSelect={(media) =>
							setAttributes({
								backgroundImage: media.url,
								backgroundImageId: media.id,
								backgroundImageAlt: media.alt || '',
							})
						}
						onRemove={() =>
							setAttributes({
								backgroundImage: '',
								backgroundImageId: 0,
								backgroundImageAlt: '',
							})
						}
					/>

					<ToggleControl
						label={__('Medium Text', 'ambrygen-web')}
						checked={isMediumText}
						onChange={(value) =>
							setAttributes({ isMediumText: value })
						}
					/>

					<CtaButtonField
						label={__('Primary Button', 'ambrygen-web')}
						value={primarybutton || {}}
						onChange={(value) =>
							setAttributes({ primarybutton: value })
						}
					/>

					<CtaButtonField
						label={__('Secondary Button', 'ambrygen-web')}
						value={secondarybutton || {}}
						onChange={(value) =>
							setAttributes({ secondarybutton: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{backgroundImage && (
					<div className="block-bg-image">
						<img
							src={backgroundImage}
							alt={backgroundImageAlt}
						/>
					</div>
				)}
				<div className="heading-content-section__inner block__rowflex">
					<RichText
						tagName={titleTag || 'h2'}
						className="heading-content-section__title heading-3 block-title mb-0 block__rowflex--heading-title"
						value={title}
						onChange={(value) =>
							setAttributes({ title: value })
						}
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/text-color',
							'ambrygen/tooltip',
						]}
						placeholder={__('Add Title', 'ambrygen-web')}
					/>
					<div className='heading-content-wrapper'>
						<div className="heading-content-section__description block__rowflex--block-content block-description">
							<RichText
								tagName="div"
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
								}
								allowedFormats={[
									'core/bold',
									'core/italic',
									'core/link',
									'ambrygen/tooltip',
								]}
								placeholder={__(
									'Add Description',
									'ambrygen-web'
								)}
							/>
						</div>
						<div className="heading-content-section__content js-gsap-fade">
							<div class="is-style-gl-s24" aria-hidden="true"></div>
							<InnerBlocks
								allowedBlocks={[
									'core/paragraph',
									'core/list',
									'core/buttons',
									'core/button',
									'core/spacer',
								]}
								template={CONTENT_TEMPLATE}
								templateLock={false}
								renderAppender={InnerBlocks.ButtonBlockAppender}
							/>
						</div>
					</div>


					{(primarybutton?.text || secondarybutton?.text) && (
						<div className="heading-content-section__actions">
							{primarybutton?.text && (
								<a
									href={primarybutton.url || '#'}
									className={`site-btn ${primarybutton.variant || ''
										}`}
									target={primarybutton.target || undefined}
									rel={
										primarybutton.target === '_blank'
											? 'noopener noreferrer'
											: undefined
									}
								>
									{primarybutton.text}
								</a>
							)}
							{secondarybutton?.text && (
								<a
									href={secondarybutton.url || '#'}
									className={`site-btn ${secondarybutton.variant || ''
										}`}
									target={secondarybutton.target || undefined}
									rel={
										secondarybutton.target === '_blank'
											? 'noopener noreferrer'
											: undefined
									}
								>
									{secondarybutton.text}
								</a>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
