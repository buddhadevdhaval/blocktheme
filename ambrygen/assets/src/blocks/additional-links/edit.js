import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { BlockExamplePreview, TagSelector } from '../_shared/components';

const createDefaultCta = () => ({
	text: '',
	url: '',
	target: '',
	rel: '',
	variant: 'dark',
});

const TEMPLATE = [
	[
		'ambrygen/additional-links-item',
		{
			cta: createDefaultCta(),
			icon: {
				id: 0,
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			cta: createDefaultCta(),
			icon: {
				id: 0,
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			cta: createDefaultCta(),
			icon: {
				id: 0,
				url: '',
				alt: '',
			},
		},
	],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	const { blockId, heading, headingTag, description } = attributes;
	const { insertBlock } = useDispatch('core/block-editor');
	const isExample = blockId === 'additional-links-example';
	const blockProps = useBlockProps({
		className: 'additional-links',
	});

	useEffect(() => {
		if (isExample) {
			return;
		}

		const expectedId = `section-${clientId.slice(0, 8)}`;

		// Re-seed when the stored ID was copied from another block instance.
		if (!blockId ) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [clientId, blockId, isExample, setAttributes]);

	if (isExample) {
		return (
			<BlockExamplePreview
				className="additional-links-example-preview"
				imagePath="/assets/src/images/additional-links/preview.png"
			/>
		);
	}


	const handleAddItem = () => {
		insertBlock(
			createBlock('ambrygen/additional-links-item', {
				cta: createDefaultCta(),
				icon: {
					id: 0,
					url: '',
					alt: '',
				},
			}),
			undefined,
			clientId
		);
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody
					title={__('Heading Settings', 'ambrygen-web')}
					initialOpen={true}
				>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag}
						type="heading"
						onChange={(val) =>
							setAttributes({ headingTag: val })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="careers-highlight__header block__rowflex">
				<div className='block__rowflex--col-left'>
					<RichText
						tagName={headingTag}
						className="careers-highlight__title block__rowflex--heading-title heading-4 mb-0"
						value={heading}
						placeholder={__('Add Heading...', 'ambrygen-web')}
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/text-color',
						]}
						onChange={(val) => setAttributes({ heading: val })}
					/>
				</div>
				<RichText
					tagName="div"
					className="careers-highlight__intro block__rowflex--block-content subtitle1-reg"
					value={description}
					placeholder={__('Add Description...', 'ambrygen-web')}
					allowedFormats={[
						'core/bold',
						'core/italic',
						'core/link',
						'core/text-color',
					]}
					onChange={(val) =>
						setAttributes({ description: val })
					}
				/>
				<div className="is-style-gl-s50"></div>
			</div>

			<div className="wp-additional-link__cards">
				<InnerBlocks
					allowedBlocks={['ambrygen/additional-links-item']}
					template={TEMPLATE}
					templateLock={false}
					renderAppender={false}
				/>

				<div className="is-style-gl-s24" aria-hidden="true"></div>

				<Button variant="primary" onClick={handleAddItem}>
					{__('Add Link', 'ambrygen-web')}
				</Button>
			</div>
		</div>
	);
}
