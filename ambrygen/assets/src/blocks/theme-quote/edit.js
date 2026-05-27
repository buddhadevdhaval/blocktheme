import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useUniqueBlockId } from '../_shared/hooks';

import {
	BlockExamplePreview,
	TagSelector,
} from '../_shared/components';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		heading,
		headingTag,
		quoteAttribution,
		description,
	} = attributes;
	const HeadingTag = headingTag || 'h2';
	const isExample = blockId === 'theme-quote-example';

	useUniqueBlockId({
		blockId,
		clientId,
		setAttributes,
		enabled: !isExample,
		idPrefix: 'theme-quote',
	});

	const blockProps = useBlockProps({
		className: 'theme-quote',
	});

	if (isExample) {
		return (
			<BlockExamplePreview
				className="theme-quote-example-preview"
				imagePath="/assets/src/images/theme-quote/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Heading Settings', 'ambrygen-web')}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						type="heading"
						value={headingTag || 'h2'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="theme-quote__header block__rowflex">
					<div className='block__rowflex--col-left'>
						<div className="block__rowflex--heading-title theme-quote__header-quote">
							<RichText
								tagName={HeadingTag}
								className="heading-4 mb-0 theme-quote__quote-text"
								value={heading}
								onChange={(value) =>
									setAttributes({ heading: value })
								}
								allowedFormats={[
									'core/bold',
									'core/italic',
									'core/text-color',
									'ambrygen/tooltip',
								]}
								placeholder={__(
									'Add Heading (Quote)...',
									'ambrygen-web'
								)}
							/>

							<div className="is-style-gl-s16" aria-hidden="true"></div>
						</div>

						<RichText
							tagName="div"
							className="body2-reg theme-quote__quote-attribution"
							value={quoteAttribution}
							onChange={(value) =>
								setAttributes({ quoteAttribution: value })
							}
							allowedFormats={['core/bold', 'core/italic']}
							placeholder={__(
								'Add Author...',
								'ambrygen-web'
							)}
						/>
					</div>

					<div className="block__rowflex--block-content subtitle-1-regular theme-quote__header-description">
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
								'Add Description...',
								'ambrygen-web'
							)}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
