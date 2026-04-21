import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = ['ambrygen/card-result-block-item'];

export default function Edit({ attributes, setAttributes, clientId }) {
	const { blockId, eyebrowText, heading, headingTag, subtitle, footContent } = attributes;
	const innerBlockCount = useSelect(
		(select) => select('core/block-editor').getBlockCount(clientId),
		[clientId]
	);

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({ blockId: expectedId });
		}
	}, [clientId, blockId, setAttributes]);

	const HeadingTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
		headingTag
	)
		? headingTag
		: 'h2';

	const blockProps = useBlockProps({
		className: 'container-1280 card-result-block',
	});
	const gridClassName =
		innerBlockCount >= 4
			? 'principles-steps__grid col-4'
			: 'principles-steps__grid';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Header Settings', 'ambrygen-web')}
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
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className="principles-steps">
					<div className="principles-steps__header text-center">
						<RichText
							tagName="div"
							className="overline-text principles-steps__eyebrow hero-kicker"
							value={eyebrowText}
							onChange={(value) =>
								setAttributes({ eyebrowText: value })
							}
							placeholder={__(
								'Add eyebrow text',
								'ambrygen-web'
							)}
						/>
						<div
							className="is-style-gl-s12"
							aria-hidden="true"
						></div>
						<RichText
							tagName={HeadingTag}
							className="heading-4 block-title mb-0 principles-steps__title"
							value={heading}
							onChange={(value) =>
								setAttributes({ heading: value })
							}
							placeholder={__('Add heading', 'ambrygen-web')}
						/>
						<div
							className="is-style-gl-s12"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="block-description body1 principles-steps__subtitle"
							value={subtitle}
							onChange={(value) =>
								setAttributes({ subtitle: value })
							}
							placeholder={__('Add subtitle', 'ambrygen-web')}
						/>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<div className={gridClassName}>
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={[
								['ambrygen/card-result-block-item'],
								['ambrygen/card-result-block-item'],
								['ambrygen/card-result-block-item'],
							]}
							templateLock={false}
						/>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<div className="foot-content text-center">
						<RichText
							tagName="p"
							className=""
							value={footContent}
							onChange={(value) =>
								setAttributes({ footContent: value })
							}
							placeholder={__(
								'Add footer content',
								'ambrygen-web'
							)}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
