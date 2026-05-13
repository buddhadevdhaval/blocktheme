import {
	InnerBlocks,
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	TagSelector,
	CtaButtonField,
	BlockExamplePreview,
	ImageUploader,
} from '../_shared/components';

const ALLOWED_BLOCKS = ['ambrygen/icon-grid-with-count-item'];
const TEMPLATE = [['ambrygen/icon-grid-with-count-item', {}]];

export default function Edit({ attributes, setAttributes, clientId }) {
	const { heading, headingTag, description, link, blockId, backgroundImage } =
		attributes;
	const isExample = blockId === 'icon-grid-with-count-example';
	const HeadingTag = headingTag || 'h2';
	const hasBackgroundImage = Boolean(backgroundImage?.url);

	useEffect(() => {
		if (isExample) {
			return;
		}

		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({ blockId: expectedId });
		}
	}, [clientId, blockId, isExample, setAttributes]);

	if (isExample) {
		return (
			<BlockExamplePreview
				imagePath="/assets/src/images/icon-grid-with-count/preview.png"
			/>
		);
	}

	const blockProps = useBlockProps({
		className: 'block-layout our-testing-menu',
		id: blockId || undefined,
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Heading Settings', 'ambrygen-web')} initialOpen={false}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h2'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody title={__('Display Settings', 'ambrygen-web')}>
					<ImageUploader
						url={backgroundImage?.url || ''}
						label={__('Background Image', 'ambrygen-web')}
						onSelect={(media) =>
							setAttributes({
								backgroundImage: {
									id: media.id,
									url: media.url,
									alt: media.alt || '',
								},
							})
						}
						onRemove={() =>
							setAttributes({
								backgroundImage: {
									url: '',
									id: 0,
									alt: '',
								},
							})
						}
					/>
					<CtaButtonField
						label={__('', 'ambrygen-web')}
						textLabel={__('Link Text', 'ambrygen-web')}
						defaultVariant="primary"
						value={link}
						showVariant={false}
						onChange={(value) =>
							setAttributes({ link: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			{hasBackgroundImage && (
				<div className="block-bg-image">
					<img
						src={backgroundImage.url}
						alt={backgroundImage.alt || ''}
					/>
				</div>
			)}
			<div className="our-testing-menu__header block__rowflex">
				<div className='block__rowflex--col-left'>
					<RichText
						tagName={HeadingTag}
						className="block-title block__rowflex--heading-title heading-3 mb-0"
						value={heading}
						onChange={(value) =>
							setAttributes({ heading: value })
						}
						placeholder={__('Add Title...', 'ambrygen-web')}
					/>
				</div>

				<div className="block__rowflex--block-content subtitle1-reg">
					<RichText
						tagName="p"
						value={description}
						onChange={(value) =>
							setAttributes({ description: value })
						}
						placeholder={__(
							'Add Description...',
							'ambrygen-web'
						)}
					/>

					<div className="block_rowflex-link">
						{link?.url && link?.text && (
							<a
								href={link.url}
								target={link.target || undefined}
								rel={link.rel || undefined}
								className="site-btn is-style-site-text-btn has-right-arrow"
								onClick={(e) => e.preventDefault()}
							>
								{link.text}
								{link.target === '_blank' && (
									<span className="screen-reader-text">
										{__(
											'(opens in new tab)',
											'ambrygen-web'
										)}
									</span>
								)}
							</a>
						)}
					</div>
				</div>
			</div>
			<div className="is-style-gl-s64" aria-hidden="true"></div>

			<div className="our-testing-menu__grid">
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={TEMPLATE}
					templateLock={false}
				/>
			</div>
		</div>
	);
}
