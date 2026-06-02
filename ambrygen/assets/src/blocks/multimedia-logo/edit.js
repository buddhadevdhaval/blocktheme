import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { useMemo, useEffect } from '@wordpress/element';
import {
	BlockExamplePreview,
	ImageUploader,
	ImagePlaceholder,
	DEFAULT_IMAGES,
	ItemHeader,
	PanelItem,
	TagSelector,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

function createDownloadId() {
	return `download-${Date.now()}-${Math.random()
		.toString(36)
		.slice(2, 10)}`;
}

function createDefaultDownload(group) {
	return {
		id: createDownloadId(),
		group,
		groupName: '',
		label: '',
		fileUrl: '',
		fileId: 0,
	};
}

function getFileExtensionLabel(fileName = '', fileUrl = '', mimeType = '') {
	const source = fileName || fileUrl;

	if (source) {
		try {
			const normalizedSource = source.includes('://')
				? new URL(source).pathname
				: source;
			const cleanSource = normalizedSource.split('?')[0];
			const extension = cleanSource.split('.').pop();

			if (extension && extension !== cleanSource) {
				return extension.toUpperCase();
			}
		} catch {
			const cleanSource = source.split('?')[0];
			const extension = cleanSource.split('.').pop();

			if (extension && extension !== cleanSource) {
				return extension.toUpperCase();
			}
		}
	}

	if (mimeType) {
		const mimeExtension = mimeType.split('/').pop();

		if (mimeExtension) {
			return mimeExtension.toUpperCase();
		}
	}

	return __('Download file', 'ambrygen-web');
}

function normalizeDownloadsWithIds(downloads = []) {
	let hasChanges = false;

	const normalizedDownloads = downloads.map((item) => {
		if (item?.id) {
			return item;
		}

		hasChanges = true;

		return {
			...item,
			id: createDownloadId(),
		};
	});

	return {
		hasChanges,
		normalizedDownloads,
	};
}

const ALLOWED_DESCRIPTION_BLOCKS = [
	'core/paragraph',
	'core/buttons',
	'core/button',
	'core/spacer',
	'core/list',
];

const DESCRIPTION_TEMPLATE = [
	[
		'core/paragraph',
		{
			placeholder: __( 'Add Description...', 'ambrygen-web' ),
		},
	],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		anchor,
		blockId,
		sectionTitle,
		headingTag,
		logoImageUrl,
		logoImageAlt,
		downloads = [],
		secondaryImageUrl,
		secondaryImageAlt,
		secondaryImageId,
	} = attributes;
	const HeadingTag = headingTag || 'h2';
	const isExample = blockId === 'example-block-preview';

	useUniqueBlockId({
		blockId,
		clientId,
		enabled: !isExample,
		idPrefix: 'multimedia-logo',
		setAttributes,
	});

	useEffect(() => {
		const { hasChanges, normalizedDownloads } =
			normalizeDownloadsWithIds(downloads);

		if (hasChanges) {
			setAttributes({ downloads: normalizedDownloads });
		}
	}, [downloads, setAttributes]);

	const blockProps = useBlockProps({
		className: 'logo-section block-layout',
		id: anchor || blockId,
	});
	const defaultImages = useMemo(() => DEFAULT_IMAGES(), []);
	const displayLogo = logoImageUrl || defaultImages.placeholder.url;
	const hasSecondaryImage = Boolean(secondaryImageId || secondaryImageUrl);

	if (isExample) {
		return (
			<BlockExamplePreview
				className="multimedia-logo-example-preview"
				imagePath="/assets/src/images/multimedia-logo/preview.png"
			/>
		);
	}

	const addDownload = (group) => {
		setAttributes({
			downloads: [...downloads, createDefaultDownload(group)],
		});
	};

	const removeDownload = (downloadId) => {
		setAttributes({
			downloads: downloads.filter((item) => item.id !== downloadId),
		});
	};

	const moveDownload = (index, direction) => {
		const newIndex = index + direction;

		if (newIndex < 0 || newIndex >= downloads.length) {
			return;
		}

		const nextDownloads = [...downloads];
		[nextDownloads[index], nextDownloads[newIndex]] = [
			nextDownloads[newIndex],
			nextDownloads[index],
		];

		setAttributes({ downloads: nextDownloads });
	};

	const updateDownloadMedia = (downloadId, media) => {
		const label = getFileExtensionLabel(
			media?.filename,
			media?.url,
			media?.mime
		);

		setAttributes({
			downloads: downloads.map((item) =>
				item.id === downloadId
					? {
						...item,
						label,
						fileUrl: media?.url || '',
						fileId: media?.id || 0,
					}
					: item
			),
		});
	};

	const clearDownloadMedia = (downloadId) => {
		setAttributes({
			downloads: downloads.map((item) =>
				item.id === downloadId
					? {
						...item,
						label: '',
						fileUrl: '',
						fileId: 0,
					}
					: item
			),
		});
	};

	const webDownloads = downloads.filter((item) => item.group === 'web');
	const printDownloads = downloads.filter((item) => item.group === 'print');
	const getDownloadLabel = (item) =>
		item.label ||
		getFileExtensionLabel('', item.fileUrl) ||
		__('Download file', 'ambrygen-web');

	const renderDownloadPanel = (group) => {
		const groupDownloads = downloads
			.map((item, index) => ({ item, index }))
			.filter((entry) => entry.item.group === group);

		return (
			<>
				{groupDownloads.length === 0 && (
					<p className="components-base-control__help">
						{__('No items added yet.', 'ambrygen-web')}
					</p>
				)}

				{groupDownloads.map(({ item, index }) => (
					<PanelItem key={item.id}>
						<ItemHeader
							index={index}
							label={
								item.label ||
								getFileExtensionLabel('', item.fileUrl)
							}
							total={downloads.length}
							onMove={(i, dir) => moveDownload(i, dir)}
							onRemove={() => removeDownload(item.id)}
							minCount={0}
						/>

						<div style={{ marginBottom: '8px' }}>
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={[
										'application/pdf',
										'application/zip',
										'application/x-zip-compressed',
										'application/octet-stream',
										'image/svg+xml',
										'image/png',
										'image/jpeg',
									]}
									onSelect={(media) =>
										updateDownloadMedia(item.id, media)
									}
									render={({ open }) => (
										<Button
											variant="secondary"
											onClick={(e) => {
												e.stopPropagation();
												open();
											}}
										>
											{item.fileUrl
												? __('Replace File', 'ambrygen-web')
												: __('Select File', 'ambrygen-web')}
										</Button>
									)}
								/>
							</MediaUploadCheck>
							{item.fileUrl && (
								<Button
									variant="secondary"
									isDestructive
									onClick={(e) => {
										e.stopPropagation();
										clearDownloadMedia(item.id);
									}}
									style={{ marginLeft: '8px' }}
								>
									{__('Remove File', 'ambrygen-web')}
								</Button>
							)}
						</div>
					</PanelItem>
				))}

				<Button
					variant="primary"
					onClick={() => addDownload(group)}
					style={{ width: '100%', justifyContent: 'center' }}
				>
					{group === 'web'
						? __('Add Web Item', 'ambrygen-web')
						: __('Add Print Item', 'ambrygen-web')}
				</Button>
			</>
		);
	};

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
						value={headingTag || 'h2'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
					/>
				</PanelBody>
				<PanelBody
					title={__('Content Settings', 'ambrygen-web')}
					initialOpen
				>
					<ImageUploader
						label={__('Image-1', 'ambrygen-web')}
						url={logoImageUrl}
						onSelect={(media) =>
							setAttributes({
								logoImageUrl: media.url,
								logoImageId: media.id,
								logoImageAlt: media.alt || '',
							})
						}
						onRemove={() =>
							setAttributes({
								logoImageUrl: '',
								logoImageId: 0,
								logoImageAlt: '',
							})
						}
					/>
					<ImageUploader
						label={__('Image-2', 'ambrygen-web')}
						url={secondaryImageUrl}
						onSelect={(media) =>
							setAttributes({
								secondaryImageUrl: media.url,
								secondaryImageId: media.id,
								secondaryImageAlt: media.alt || '',
							})
						}
						onRemove={() =>
							setAttributes({
								secondaryImageUrl: '',
								secondaryImageId: 0,
								secondaryImageAlt: '',
							})
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('For Web', 'ambrygen-web')}
					initialOpen={false}
				>
					{renderDownloadPanel('web')}
				</PanelBody>
				<PanelBody
					title={__('For Print', 'ambrygen-web')}
					initialOpen={false}
				>
					{renderDownloadPanel('print')}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="logo-section__header">
					<RichText
						tagName={HeadingTag}
						className="logo-section__title heading-3 mb-0"
						value={sectionTitle}
						onChange={(value) =>
							setAttributes({ sectionTitle: value })
						}
						placeholder={__('Heading', 'ambrygen-web')}
					/>
				</div>
				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="logo-section__top">
					<div className="logo-section__logo">
						{displayLogo ? (
							<img src={displayLogo} alt={logoImageAlt} />
						) : (
							<ImagePlaceholder
								text={__('Image-1', 'ambrygen-web')}
							/>
						)}
					</div>

					<div className="logo-section__downloads">
						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title subtitle2-sbold">
								{__('For Web', 'ambrygen-web')}
							</div>
							<div className="logo-section__downloads-list">
								{webDownloads.length === 0 && (
									<div className="logo-section__downloads-empty">
										{__(
											'Add web items from the sidebar.',
											'ambrygen-web'
										)}
									</div>
								)}
								{webDownloads.map((item) => (
									<div
										key={item.id}
										className="logo-section__downloads-item with-icon"
									>
										<a
											className="logo-section__downloads-link text-small"
											href={item.fileUrl || '#'}
											onClick={(event) =>
												event.preventDefault()
											}
										>
											{getDownloadLabel(item)}
										</a>
									</div>
								))}
							</div>
						</div>

						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title subtitle2-sbold">
								{__('For Print', 'ambrygen-web')}
							</div>
							<div className="logo-section__downloads-list">
								{printDownloads.length === 0 && (
									<div className="logo-section__downloads-empty">
										{__(
											'Add print items from the sidebar.',
											'ambrygen-web'
										)}
									</div>
								)}
								{printDownloads.map((item) => (
									<div key={item.id}>
										{item.groupName && (
											<div className="logo-section__downloads-group-name">
												{item.groupName}
											</div>
										)}
										<div className="logo-section__downloads-item with-icon">
											<a
												className="logo-section__downloads-link text-small"
												href={item.fileUrl || '#'}
												onClick={(event) =>
													event.preventDefault()
												}
											>
												{getDownloadLabel(item)}
											</a>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="logo-section__divider" aria-hidden="true" />

				<div className="logo-section__bottom">
					{hasSecondaryImage && (
						<div className="logo-section__left">
							<div className="logo-section__guideline-item">
								<div className="logo-section__guideline-images">
									<img
										src={secondaryImageUrl}
										alt={secondaryImageAlt}
									/>
								</div>
							</div>
						</div>
					)}
					<div className="logo-section__right">
						<div className="logo-section__right-content">
							<div className="logo-section__description js-gsap-fade">
								<InnerBlocks
									allowedBlocks={ALLOWED_DESCRIPTION_BLOCKS}
									template={DESCRIPTION_TEMPLATE}
									templateInsertUpdatesSelection={true}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
