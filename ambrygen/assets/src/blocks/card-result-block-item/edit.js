import {
	InspectorControls,
	RichText,
	useBlockProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ImageUploader, TagSelector } from '../_shared/components';

export default function Edit({ attributes, setAttributes }) {
	const {
		title,
		headingTag = 'h3',
		summary,
		imageUrl,
		imageId,
		imageAlt,
		cardVariant = 'negative',
	} = attributes;

	const hasImage = Boolean(imageUrl);

	const blockProps = useBlockProps({
		className: `principles-steps__card principles-steps__card--${cardVariant}`,
	});

	const allowedBlocks = [ 'core/paragraph', 'core/buttons', 'core/button' ];
	const template = [
		[
			'core/paragraph',
			{
				className: 'body1 principles-steps__card-description',
				placeholder: __( 'Card description…', 'ambrygen-web' ),
			},
		],
	];

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Card Settings', 'ambrygen-web')}
					initialOpen={true}
				>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h3'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
						type="heading"
					/>
					<SelectControl
						label={__(
							'Select Background Color',
							'ambrygen-web'
						)}
						value={cardVariant}
						options={[
							{
								label: __('Green', 'ambrygen-web'),
								value: 'card-bg-green',
							},
							{
								label: __('Pink', 'ambrygen-web'),
								value: 'card-bg-pink',
							},
							{
								label: __('Yellow', 'ambrygen-web'),
								value: 'card-bg-yellow',
							},
							{
								label: __('Purple', 'ambrygen-web'),
								value: 'card-bg-purple',
							},
						]}
						onChange={(value) =>
							setAttributes({ cardVariant: value })
						}
					/>
					<ImageUploader
						label={__('Card Image', 'ambrygen-web')}
						url={imageUrl}
						id={imageId}
						onSelect={(media) =>
							setAttributes({
								imageUrl: media.url,
								imageId: media.id,
								imageAlt: media.alt || '',
							})
						}
						onRemove={() =>
							setAttributes({
								imageUrl: '',
								imageId: 0,
								imageAlt: '',
							})
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{hasImage && (
					<>
						<div className="principles-steps__card-icon">
							<img src={imageUrl} alt={imageAlt || ''} />
						</div>
						<div
							className="is-style-gl-s20"
							aria-hidden="true"
						></div>
					</>
				)}
				<div className="principles-steps__card-content">
					<RichText
						tagName={headingTag || 'h3'}
						className="heading-5 principles-steps__card-title mb-0"
						value={title}
						onChange={(value) =>
							setAttributes({ title: value })
						}
						placeholder={__('Card title', 'ambrygen-web')}
					/>
					<div className="is-style-gl-s8" aria-hidden="true"></div>
					<RichText
						tagName="div"
						className="body1-sbold principles-steps__card-summary"
						value={summary}
						onChange={(value) =>
							setAttributes({ summary: value })
						}
						placeholder={__('Card summary', 'ambrygen-web')}
					/>
					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<div className="principles-steps__card-description">
						<InnerBlocks
							allowedBlocks={ allowedBlocks }
							template={ template }
							templateLock={ false }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
