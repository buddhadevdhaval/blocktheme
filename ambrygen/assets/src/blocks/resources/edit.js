import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	FormTokenField,
	Button,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { trash, link as linkIcon, plus } from '@wordpress/icons';
import {
	ImageUploader,
	DEFAULT_IMAGES,
	TagSelector,
} from '../_shared/components';
import { useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		subtitle,
		resourceCards,
		orgTitle,
		collaboratorIds,
		headingLevel,
		resourcesCardTitle,
		customCollaborators = [],
		enableCustomCollaborators = false,
	} = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const defaultPlaceholder = DEFAULT_IMAGES().placeholder;

	const blockProps = useBlockProps( {
		className: 'resources',
		id: blockId || undefined,
	} );

	// Fetch collaborators for the selection
	const collaborators = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'collaborator', {
			per_page: -1,
		});
	}, []);

	const collaboratorOptions = collaborators || [];
	const suggestions = collaboratorOptions.map((term) => term.name);

	// Map collaboratorIds to names for FormTokenField display
	const selectedCollaboratorNames = collaboratorIds
		.map((id) => {
			const term = collaboratorOptions.find((t) => t.id === id);
			return term ? term.name : null;
		})
		.filter(Boolean);

	const updateCards = (index, field, value) => {
		const newCards = [...resourceCards];
		newCards[index] = { ...newCards[index], [field]: value };
		setAttributes({ resourceCards: newCards });
	};

	const updatePdfLink = (cardIndex, linkIndex, field, value) => {
		const newCards = [...resourceCards];
		const newLinks = [...newCards[cardIndex].pdfLinks];
		newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
		newCards[cardIndex] = { ...newCards[cardIndex], pdfLinks: newLinks };
		setAttributes({ resourceCards: newCards });
	};

	const addPdfLink = (cardIndex) => {
		const newCards = [...resourceCards];
		const currentLinks = newCards[cardIndex].pdfLinks || [];
		if (currentLinks.length >= 2) {
			return;
		}
		const newLinks = [...currentLinks, { label: '', url: '' }];
		newCards[cardIndex] = { ...newCards[cardIndex], pdfLinks: newLinks };
		setAttributes({ resourceCards: newCards });
	};

	const removePdfLink = (cardIndex, linkIndex) => {
		const newCards = [...resourceCards];
		const newLinks = [...newCards[cardIndex].pdfLinks];
		newLinks.splice(linkIndex, 1);
		newCards[cardIndex] = { ...newCards[cardIndex], pdfLinks: newLinks };
		setAttributes({ resourceCards: newCards });
	};

	const addCard = () => {
		const newCards = [
			...resourceCards,
			{
				title: '',
				pdfLinks: [
					{ label: 'EN', url: '' },
					{ label: 'ES', url: '' },
				],
			},
		];
		setAttributes({ resourceCards: newCards });
	};

	const removeCard = (index) => {
		const newCards = [...resourceCards];
		newCards.splice(index, 1);
		setAttributes({ resourceCards: newCards });
	};

	const onCollaboratorsChange = (names) => {
		const newIds = names
			.map((name) => {
				const term = collaboratorOptions.find((t) => t.name === name);
				return term ? term.id : null;
			})
			.filter(Boolean);
		setAttributes({ collaboratorIds: newIds });
	};

	const addCustomCollaborator = () => {
		const newCustom = [
			...customCollaborators,
			{
				name: '',
				url: '',
				imageId: 0,
				imageUrl: '',
			}
		];
		setAttributes({ customCollaborators: newCustom });
	};

	const removeCustomCollaborator = (index) => {
		const newCustom = [...customCollaborators];
		newCustom.splice(index, 1);
		setAttributes({ customCollaborators: newCustom });
	};

	const updateCustomCollaborator = (index, field, value) => {
		const newCustom = [...customCollaborators];
		newCustom[index] = { ...newCustom[index], [field]: value };
		setAttributes({ customCollaborators: newCustom });
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Content Settings', 'ambrygen-web')}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingLevel}
						onChange={(value) =>
							setAttributes({ headingLevel: value })
						}
						type="heading"
					/>
				</PanelBody>
				{resourceCards.map((card, index) => (
					<PanelBody
						key={index}
						title={`${__('Item', 'ambrygen-web')} ${
							index + 1
						} Settings`}
						initialOpen={false}
					>
						<div className="resources__card-settings-header">
							<Button
								icon={trash}
								isDestructive
								onClick={() => removeCard(index)}
							>
								{__('Remove Item', 'ambrygen-web')}
							</Button>
						</div>
						<hr />
						<p>
							<strong>
								{__('PDF Downloads', 'ambrygen-web')} (Max
								2)
							</strong>
						</p>
						{(card.pdfLinks || []).map((link, lIndex) => (
							<div
								key={lIndex}
								className="resources__pdf-link-editor"
							>
								<div className="resources__pdf-link-editor-header">
									<span>
										{__('Link', 'ambrygen-web')}{' '}
										{lIndex + 1}
									</span>
									<Button
										icon={trash}
										isDestructive
										label={__(
											'Remove Link',
											'ambrygen-web'
										)}
										onClick={() =>
											removePdfLink(index, lIndex)
										}
										size="small"
									/>
								</div>
								<TextControl
									label={__('Label', 'ambrygen-web')}
									value={link.label}
									onChange={(val) =>
										updatePdfLink(
											index,
											lIndex,
											'label',
											val
										)
									}
									placeholder={__(
										'e.g. EN',
										'ambrygen-web'
									)}
								/>
								<div className="resources__pdf-link-editor-controls">
									<div className="resources__pdf-link-editor-url">
										<TextControl
											label={__(
												'File URL',
												'ambrygen-web'
											)}
											value={link.url}
											onChange={(val) =>
												updatePdfLink(
													index,
													lIndex,
													'url',
													val
												)
											}
										/>
									</div>
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) =>
												updatePdfLink(
													index,
													lIndex,
													'url',
													media.url
												)
											}
											allowedTypes={[
												'application/pdf',
											]}
											value={link.url}
											render={({ open }) => (
												<Button
													onClick={open}
													icon={linkIcon}
													variant="secondary"
													label={__(
														'Select PDF',
														'ambrygen-web'
													)}
												/>
											)}
										/>
									</MediaUploadCheck>
								</div>
							</div>
						))}
						{(card.pdfLinks || []).length < 2 && (
							<Button
								variant="secondary"
								icon={plus}
								onClick={() => addPdfLink(index)}
								className="resources__full-width-btn"
							>
								{__('Add PDF Link', 'ambrygen-web')}
							</Button>
						)}
					</PanelBody>
				))}

				<PanelBody title={__('Manage Items', 'ambrygen-web')}>
					<Button
						variant="secondary"
						icon={plus}
						onClick={addCard}
						className="resources__full-width-btn"
					>
						{__('Add New Item', 'ambrygen-web')}
					</Button>
				</PanelBody>

				<PanelBody title={__('Helpful Organizations', 'ambrygen-web')}>
					<FormTokenField
						label={__('Select Collaborators', 'ambrygen-web')}
						value={selectedCollaboratorNames}
						suggestions={suggestions}
						onChange={onCollaboratorsChange}
					/>
					<hr />
					<ToggleControl
						label={__('Enable Custom Collaborators', 'ambrygen-web')}
						checked={enableCustomCollaborators}
						onChange={(val) => setAttributes({ enableCustomCollaborators: val })}
					/>
					{enableCustomCollaborators && (
						<div className="resources__custom-collabs-wrap">
							<p><strong>{__('Custom Collaborators', 'ambrygen-web')}</strong></p>
							{(customCollaborators || []).map((collab, index) => (
								<div key={index} className="resources__custom-collab-editor">
									<div className="resources__custom-collab-editor-header">
										<span>{__('Collaborator', 'ambrygen-web')} {index + 1}</span>
										<Button
											icon={trash}
											isDestructive
											onClick={() => removeCustomCollaborator(index)}
											size="small"
										/>
									</div>
									<TextControl
										label={__('Name', 'ambrygen-web')}
										value={collab.name}
										onChange={(val) => updateCustomCollaborator(index, 'name', val)}
									/>
									<TextControl
										label={__('Link URL', 'ambrygen-web')}
										value={collab.url}
										onChange={(val) => updateCustomCollaborator(index, 'url', val)}
									/>
									<div className="resources__custom-collab-image">
										<p><strong>{__('Image', 'ambrygen-web')}</strong></p>
										<ImageUploader
											url={collab.imageUrl}
											onSelect={(media) => {
												const newCustom = [...customCollaborators];
												newCustom[index] = { 
													...newCustom[index], 
													imageId: media.id,
													imageUrl: media.url 
												};
												setAttributes({ customCollaborators: newCustom });
											}}
											onRemove={() => {
												const newCustom = [...customCollaborators];
												newCustom[index] = { 
													...newCustom[index], 
													imageId: 0,
													imageUrl: '' 
												};
												setAttributes({ customCollaborators: newCustom });
											}}
										/>
									</div>
									<hr />
								</div>
							))}
							<Button
								variant="secondary"
								icon={plus}
								onClick={addCustomCollaborator}
								className="resources__full-width-btn"
							>
								{__('Add Custom Collaborator', 'ambrygen-web')}
							</Button>
						</div>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="resources__header">
					<RichText
						tagName={headingLevel || 'h2'}
						className="heading-4 block-title mb-0 resources__title"
						value={title}
						onChange={(val) => setAttributes({ title: val })}
						placeholder={__('Add Title...', 'ambrygen-web')}
					/>
					<div className="is-style-gl-s12" aria-hidden="true"></div>
					<RichText
						tagName="div"
						className="body1 resources__subtitle"
						value={subtitle}
						onChange={(val) => setAttributes({ subtitle: val })}
						placeholder={__('Add Subtitle...', 'ambrygen-web')}
					/>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="resources__layout">
					<div className="test-lists-downloads">
						<div className="resources__card">
							<RichText
								tagName="div"
								className="subtitle2-sbold resources__card-title text-center"
								value={resourcesCardTitle}
								onChange={(val) =>
									setAttributes({ resourcesCardTitle: val })
								}
								placeholder={__(
									'Add Subsection Title...',
									'ambrygen-web'
								)}
							/>
							<div className="test-lists-downloads__list">
								{resourceCards.map((card, index) => (
									<div
										className="test-lists-downloads__item"
										key={index}
									>
										<RichText
											tagName="div"
											className="body1-sbold test-lists-downloads__item-title"
											value={card.title}
											onChange={(val) =>
											updateCards(index, 'title', val)
											}
											placeholder={__(
												'Resource Title',
												'ambrygen-web'
											)}
										/>
										<div className="test-lists-downloads__links">
											{(card.pdfLinks || []).map(
												(link, lIndex) => (
													<div
														key={lIndex}
														className="resources__link"
													>
														<span className="resources__link-label">
															{link.label ||
																(lIndex === 0
																	? 'EN'
																	: 'ES')}
														</span>
														<span className="resources__download-icon-placeholder">
															[↓]
														</span>
													</div>
												)
											)}
											{(card.pdfLinks || []).length ===
												0 && (
												<div className="resources__link">
													{__(
														'No Links',
														'ambrygen-web'
													)}
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="resources__orgs-group">
						<div className="resources__card">
							<RichText
								tagName="h3"
								className="subtitle2-sbold resources__card-title text-center"
								value={orgTitle}
								onChange={(val) =>
									setAttributes({ orgTitle: val })
								}
								placeholder={__(
									'Helpful Organizations',
									'ambrygen-web'
								)}
							/>
							<div className="resources__card-logo-grid resources__card-logo-grid--3-col">
								{collaboratorIds.length === 0 && ( !enableCustomCollaborators || (customCollaborators || []).length === 0 ) && (
									<div className="resources__logo-placeholder">
										{__(
											'Select Organizations in the sidebar',
											'ambrygen-web'
										)}
									</div>
								)}
								{collaboratorIds.map((id) => {
									const term = collaboratorOptions.find(
										(t) => t.id === id
									);
									return (
										<div
											key={id}
											className="resources__card-logo-link"
										>
											{term?.name || id}
										</div>
									);
								})}
								{enableCustomCollaborators && (customCollaborators || []).map((collab, index) => (
									<div
										key={`custom-${index}`}
										className="resources__card-logo-link"
									>
										{collab.name || __('Custom Collaborator', 'ambrygen-web')}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
