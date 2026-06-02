import {
	InnerBlocks,
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useUniqueBlockId } from '../_shared/hooks';

import {
	BlockExamplePreview,
	ImageUploader,
	TagSelector,
} from '../_shared/components';

const CONTENT_TEMPLATE = [
	[
		'core/paragraph',
		{ placeholder: __( 'Add paragraph...', 'ambrygen-web' ) },
	],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		headline,
		headlineTag,
		title,
		titleTag,
		description,
		backgroundImage,
		backgroundImageAlt,
		isMediumText,
	} = attributes;

	const displayHeadline = headline || title;
	const displayHeadlineTag = headlineTag || titleTag || 'h2';
	const isExample = blockId === 'headline-alongside-text-example';

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
		idPrefix: 'headline-alongside-text',
	} );

	const hasInnerBlocks = useSelect(
		( select ) => {
			if ( isExample ) {
				return false;
			}

			const { getBlockOrder } = select( 'core/block-editor' );

			return getBlockOrder( clientId ).length > 0;
		},
		[ clientId, isExample ]
	);

	const blockProps = useBlockProps({
		className: `heading-content-section  block-layout ${isMediumText ? 'variation-medium-text' : ''
			}`,
	});

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="headline-alongside-text-example-preview"
				imagePath="/assets/src/images/headline-alongside-text/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Heading Settings', 'ambrygen-web')}
					initialOpen
				>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						type="heading"
						value={displayHeadlineTag}
						onChange={(value) =>
							setAttributes({
								headlineTag: value,
								titleTag: value,
							})
						}
					/>
				</PanelBody>
				<PanelBody
					title={__('Background Settings', 'ambrygen-web')}
				>
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
				<div
					className="heading-content-section__inner block__rowflex is-horizontal"
				>

					<div className='block__rowflex--col-left'>
						<RichText
							tagName={displayHeadlineTag}
							className="heading-content-section__title heading-3 block-title mb-0 block__rowflex--heading-title"
							value={displayHeadline}
							onChange={(value) =>
								setAttributes({
									headline: value,
									title: value,
								})
							}
							allowedFormats={[
								'core/bold',
								'core/italic',
								'core/text-color',
								'ambrygen/tooltip',
							]}
							placeholder={__('Add Heading...', 'ambrygen-web')}
						/>
					</div>
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
									'Add Description...',
									'ambrygen-web'
								)}
							/>
						</div>
						<div className="heading-content-section__content js-gsap-fade">
							<div className="is-style-gl-s24" aria-hidden="true"></div>
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
				</div>
			</div>
		</>
	);
}
