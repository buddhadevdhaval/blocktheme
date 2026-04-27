import { createBlock } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { TagSelector } from '../_shared/components';

const TEMPLATE = [
	['ambrygen/ordering-options-card'],
	['ambrygen/ordering-options-card'],
];

// Gutenberg's List block uses inner blocks (`core/list-item`) rather than a legacy `values` HTML string.
const createListBlockFromItems = (items = []) => {
	const normalizedItems =
		Array.isArray(items) && items.length ? items : [{ text: '' }];

	return createBlock(
		'core/list',
		{ ordered: false },
		normalizedItems.map((item) =>
			createBlock('core/list-item', { content: item?.text || '' })
		)
	);
};

const createCardBlockFromOption = (option = {}) =>
	createBlock(
		'ambrygen/ordering-options-card',
		{
			imageId: option?.imageId || 0,
			imageUrl: option?.imageUrl || '',
			imageAlt: option?.imageAlt || '',
			title: option?.title || '',
			subtitle: option?.subtitle || '',
			cta: {
				text: option?.cta?.text || '',
				url: option?.cta?.url || '',
				target: option?.cta?.target || '',
				rel: option?.cta?.rel || '',
				variant: option?.cta?.variant || '',
			},
		},
		[createListBlockFromItems(option?.items)]
	);

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		headingLevel,
		headingText,
		eyebrow,
		options = [],
		subtitle,
	} = attributes;
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId),
		[clientId]
	);
	const headingTag = headingLevel || 'h2';
	const hasInnerBlocks = innerBlocks.length > 0;

	useEffect(() => {
		const expectedId = `ordering-options-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({ blockId: expectedId });
		}
	}, [blockId, clientId, setAttributes]);

	useEffect(() => {
		if (hasInnerBlocks || !options.length) {
			return;
		}

		replaceInnerBlocks(
			clientId,
			options.map(createCardBlockFromOption),
			false
		);

		// Options is legacy data; once migrated to InnerBlocks, clear it to avoid re-migrating/resetting.
		setAttributes({ options: [] });
	}, [clientId, hasInnerBlocks, options, replaceInnerBlocks, setAttributes]);

	const blockProps = useBlockProps({
		className: 'block-layout ordering-options',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Section Settings', 'ambrygen-web')}
					initialOpen={true}
				>
					<TagSelector
						label={__('Heading Level', 'ambrygen-web')}
						value={headingTag}
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
						type="heading"
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="ordering-options__header">

					<RichText
						tagName="div"
						className="hero-kicker ordering-options__eyebrow"
						value={eyebrow}
						onChange={(value) =>
							setAttributes({ eyebrow: value })
						}
						placeholder={__(
							'Section eyebrow...',
							'ambrygen-web'
						)}
					/>
					<div class="is-style-gl-s12" aria-hidden="true"></div>

					<RichText
						tagName={headingTag}
						className="heading-4 block-title mb-0"
						value={headingText}
						onChange={(value) =>
							setAttributes({ headingText: value })
						}
						placeholder={__(
							'Section heading...',
							'ambrygen-web'
						)}
					/>

					<div
						className="is-style-gl-s12"
						aria-hidden="true"
					></div>

					<RichText
						tagName="div"
						className="body1 ordering-options__subtitle"
						value={subtitle}
						onChange={(value) =>
							setAttributes({ subtitle: value })
						}
						placeholder={__(
							'Section subtitle...',
							'ambrygen-web'
						)}
					/>
				</div>

				<div
					className="is-style-gl-s24"
					aria-hidden="true"
				></div>

				<div className="ordering-options__cards">
					<InnerBlocks
						allowedBlocks={[
							'ambrygen/ordering-options-card',
						]}
						template={TEMPLATE}
						renderAppender={
							InnerBlocks.ButtonBlockAppender
						}
					/>
				</div>
			</div>

		</>
	);
}
