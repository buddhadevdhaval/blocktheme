import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';

import { PanelBody } from '@wordpress/components';

import {
	ImageUploader,
	ImagePlaceholder,
	CtaButtonField,
} from '../_shared/components';

export default function Edit({ attributes, setAttributes }) {
	const { sectiontitle, description, imageUrl, imageAlt, cta } = attributes;

	const blockProps = useBlockProps({
		className: 'approach-card',
	});

	return (
		<>
			{ /* Sidebar Controls */}
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={true}>
					<ImageUploader
						label="Card Image"
						url={imageUrl}
						onSelect={(media) =>
							setAttributes({
								imageUrl: media.url,
								imageId: media.id,
							})
						}
						onRemove={() =>
							setAttributes({
								imageUrl: '',
								imageId: undefined,
							})
						}
					/>

					<CtaButtonField
						label="CTA"
						value={cta}
						showVariant={false}
						onChange={(value) =>
							setAttributes({ cta: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Editor Canvas */}
			<div {...blockProps}>
				<div className="approach-card__inner">
					<div className="approach-card__image-wrapper">
						<div className="approach-card__image">
							{imageUrl ? (
								<img src={imageUrl} alt="" />
							) : (
								<ImagePlaceholder />
							)}
						</div>
						<div className="is-style-gl-s24" aria-hidden="true"></div>

						<div className="approach-card__text-content">
							<RichText
								tagName="h3"
								className="approach-card__title heading-5 mb-0"
								value={sectiontitle}
								onChange={(value) =>
									setAttributes({ sectiontitle: value })
								}
								placeholder="Card Title"
							/>

							<RichText
								tagName="div"
								className="approach-card__description body2-reg"
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
								}
								placeholder="Card description..."
							/>
						</div>
					</div>



					<div className="is-style-gl-s32" aria-hidden="true"></div>

					{ /* CTA Preview */}
					{cta?.text && (
						<div className="approach-card__cta-wrapper">
							<span className="approach-card__cta">
								{cta.text}
							</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
