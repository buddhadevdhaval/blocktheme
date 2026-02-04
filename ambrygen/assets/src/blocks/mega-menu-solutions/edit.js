import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	Tooltip,
	TextControl,
	PanelBody,
	CardDivider,
} from '@wordpress/components';
import { plus, trash, chevronUp, chevronDown, upload } from '@wordpress/icons';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const { leftTitle, items } = attributes;
	const [activeIndex, setActiveIndex] = useState(0);
	const blockProps = useBlockProps({
		className: 'nav__item--mega-menu__grid nav__item--mega-menu__second-level',
	});

	const handleItemSelect = (index) => {
		setActiveIndex(index);
		setTimeout(() => {
			const panelItem = document.getElementById(
				`mega-menu-solutions-item-${index}`
			);
			if (panelItem) {
				panelItem.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
		}, 50);
	};

	const updateItem = (index, key, value) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [key]: value };
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		const newItem = {
			label: 'New Solution',
			url: '#',
			icon: '',
			image: '',
			imageId: 0,
			rightTitle: 'New Solution Title',
			rightText: 'Description',
			rightUrl: '#',
		};
		setAttributes({ items: [...items, newItem] });
		setActiveIndex(items.length);
	};

	const removeItem = (index) => {
		if (items.length <= 1) {
			return;
		}
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
		if (activeIndex >= newItems.length) {
			setActiveIndex(Math.max(0, newItems.length - 1));
		}
	};

	const moveItemUp = (index) => {
		if (index === 0) {
			return;
		}
		const newItems = [...items];
		[newItems[index - 1], newItems[index]] = [
			newItems[index],
			newItems[index - 1],
		];
		setAttributes({ items: newItems });
		if (activeIndex === index) {
			setActiveIndex(index - 1);
		} else if (activeIndex === index - 1) {
			setActiveIndex(index);
		}
	};

	const moveItemDown = (index) => {
		if (index >= items.length - 1) {
			return;
		}
		const newItems = [...items];
		[newItems[index], newItems[index + 1]] = [
			newItems[index + 1],
			newItems[index],
		];
		setAttributes({ items: newItems });
		if (activeIndex === index) {
			setActiveIndex(index + 1);
		} else if (activeIndex === index + 1) {
			setActiveIndex(index);
		}
	};

	const activeItem = items[activeIndex] || {};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Solution Items', 'ambrygen-web')}
					initialOpen={true}
				>
					<p
						className="components-base-control__help"
						style={{ marginBottom: '12px' }}
					>
						{__(
							`Manage solution items. Current: ${items.length} items`,
							'ambrygen-web'
						)}
					</p>

					{items.map((item, index) => (
						<div
							key={index}
							id={`mega-menu-solutions-item-${index}`}
							style={{
								marginBottom: '16px',
								padding: '12px',
								background:
									activeIndex === index
										? '#e0e7ff'
										: '#f0f0f0',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
							onClick={() => setActiveIndex(index)}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '8px',
								}}
							>
								<strong>
									{__('Item', 'ambrygen-web')}{' '}
									{index + 1}:{' '}
									{item.label ||
										__('Untitled', 'ambrygen-web')}
								</strong>
								<div style={{ display: 'flex', gap: '4px' }}>
									<Button
										icon={chevronUp}
										size="small"
										disabled={index === 0}
										onClick={(e) => {
											e.stopPropagation();
											moveItemUp(index);
										}}
										label={__(
											'Move Up',
											'ambrygen-web'
										)}
									/>
									<Button
										icon={chevronDown}
										size="small"
										disabled={index >= items.length - 1}
										onClick={(e) => {
											e.stopPropagation();
											moveItemDown(index);
										}}
										label={__(
											'Move Down',
											'ambrygen-web'
										)}
									/>
									<Button
										icon={trash}
										size="small"
										isDestructive
										disabled={items.length <= 1}
										onClick={(e) => {
											e.stopPropagation();
											removeItem(index);
										}}
										label={__(
											'Remove Item',
											'ambrygen-web'
										)}
									/>
								</div>
							</div>

							{ /* Right Side Image Controls */}
							<div style={{ marginBottom: '8px' }}>
								<p
									style={{
										marginBottom: '4px',
										fontWeight: '500',
									}}
								>
									{__('Right Side Image', 'ambrygen-web')}
								</p>
								{item.image ? (
									<div>
										<img
											src={item.image}
											alt=""
											style={{
												maxWidth: '100%',
												height: 'auto',
												marginBottom: '8px',
												borderRadius: '4px',
											}}
										/>
										<div
											style={{
												display: 'flex',
												gap: '8px',
											}}
										>
											<MediaUploadCheck>
												<MediaUpload
													onSelect={(media) => {
														const newItems = [...items];
														newItems[index] = {
															...newItems[index],
															image: media.url,
															imageId: media.id,
														};
														setAttributes({ items: newItems });
													}}
													allowedTypes={['image']}
													render={({ open }) => (
														<Button
															variant="secondary"
															size="small"
															onClick={(e) => {
																e.stopPropagation();
																open();
															}}
														>
															{__(
																'Replace',
																'ambrygen-web'
															)}
														</Button>
													)}
												/>
											</MediaUploadCheck>
											<Button
												variant="secondary"
												size="small"
												isDestructive
												onClick={(e) => {
													e.stopPropagation();
													const newItems = [...items];
													newItems[index] = {
														...newItems[index],
														image: '',
														imageId: 0,
													};
													setAttributes({ items: newItems });
												}}
											>
												{__(
													'Remove',
													'ambrygen-web'
												)}
											</Button>
										</div>
									</div>
								) : (
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) => {
												const newItems = [...items];
												newItems[index] = {
													...newItems[index],
													image: media.url,
													imageId: media.id,
												};
												setAttributes({ items: newItems });
											}}
											allowedTypes={['image']}
											render={({ open }) => (
												<Button
													variant="secondary"
													icon={upload}
													onClick={(e) => {
														e.stopPropagation();
														open();
													}}
												>
													{__(
														'Upload Image',
														'ambrygen-web'
													)}
												</Button>
											)}
										/>
									</MediaUploadCheck>
								)}
							</div>

							<TextControl
								label={__('Label', 'ambrygen-web')}
								value={item.label}
								onChange={(value) =>
									updateItem(index, 'label', value)
								}
								onClick={(e) => e.stopPropagation()}
							/>

							<TextControl
								label={__('URL', 'ambrygen-web')}
								value={item.url}
								onChange={(value) =>
									updateItem(index, 'url', value)
								}
								onClick={(e) => e.stopPropagation()}
							/>

							<TextControl
								label={__('Right Title', 'ambrygen-web')}
								value={item.rightTitle}
								onChange={(value) =>
									updateItem(index, 'rightTitle', value)
								}
								onClick={(e) => e.stopPropagation()}
							/>

							<TextControl
								label={__('Right URL', 'ambrygen-web')}
								value={item.rightUrl || ''}
								onChange={(value) =>
									updateItem(index, 'rightUrl', value)
								}
								onClick={(e) => e.stopPropagation()}
							/>

							{index < items.length - 1 && <CardDivider />}
						</div>
					))}

					<Button
						variant="primary"
						icon={plus}
						onClick={addItem}
						style={{ width: '100%', justifyContent: 'center' }}
					>
						{__('Add Item', 'ambrygen-web')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{ /* Left Column */}
				<div className="nav__item--mega-menu__cl-left">
					<div className="nav__item--mega-menu__submenu-inner nav__item--mega-menu__second-level--submenu-inner">
						<div className="nav__item--mega-menu__submenu-inner--col">
							<RichText
								tagName="p"
								className="nav__item--mega-menu__submenu-inner--title caption-semi-bold"
								value={leftTitle}
								onChange={(val) =>
									setAttributes({ leftTitle: val })
								}
								placeholder={__('Title', 'ambrygen-web')}
							/>
							<ul className="nav__item--mega-menu__submenu-inner--links">
								{items.map((item, index) => (
									<li
										key={index}
										style={{
											position: 'relative',
											backgroundColor:
												activeIndex === index
													? '#f0f0f0'
													: 'transparent',
											borderRadius: '4px',
										}}
										onClick={() =>
											handleItemSelect(index)
										}
									>
										<a
											href={item.url}
											className="nav__item--mega-menu__submenu-inner--link submenu-inner-link "
											onClick={(e) =>
												e.preventDefault()
											}
										>
											<div className="nav__item--mega-menu__submenu-inner--icon">
												<MediaUploadCheck>
													<MediaUpload
														onSelect={(media) =>
															updateItem(
																index,
																'icon',
																media.url
															)
														}
														allowedTypes={[
															'image',
														]}
														render={({
															open,
														}) => (
															<div
																onClick={open}
																style={{
																	cursor: 'pointer',
																	width: '24px',
																	height: '24px',
																	background:
																		item.icon
																			? 'transparent'
																			: '#eee',
																	marginRight:
																		'8px',
																}}
															>
																{item.icon && (
																	<img
																		src={
																			item.icon
																		}
																		alt=""
																	/>
																)}
															</div>
														)}
													/>
												</MediaUploadCheck>
											</div>
											<RichText
												tagName="div"
												className="nav__item--mega-menu__submenu-inner--link-title body2-medium"
												value={item.label}
												onChange={(val) =>
													updateItem(
														index,
														'label',
														val
													)
												}
											/>
										</a>
										<div
											style={{
												marginTop: '5px',
												paddingLeft: '32px',
											}}
										>
											<TextControl
												value={item.url}
												onChange={(val) =>
													updateItem(
														index,
														'url',
														val
													)
												}
												placeholder={__(
													'URL',
													'ambrygen-web'
												)}
												onClick={(e) =>
													e.stopPropagation()
												}
											/>
										</div>
										<Tooltip text="Remove Item">
											<Button
												icon={trash}
												onClick={(e) => {
													e.stopPropagation();
													removeItem(index);
												}}
												className="remove-link-btn"
												style={{
													position: 'absolute',
													right: -30,
													top: 5,
													color: 'red',
												}}
												disabled={items.length <= 1}
											/>
										</Tooltip>
									</li>
								))}
							</ul>
							<Button
								variant="secondary"
								icon={plus}
								onClick={addItem}
							>
								{__('Add Item', 'ambrygen-web')}
							</Button>
						</div>
					</div>
				</div>

				<div className="nav__item--mega-menu__cl-right">
					<div className="nav__item--mega-menu__category-submenu-row">
						{items.length > 0 && (
							<div className="nav__item--mega-menu__category-submenu-lists category-submenu-lists">
								<div className="nav__item--mega-menu__category-submenu-lists--image">
									<figure
										style={{
											minHeight: '200px',
											background: '#f0f0f0',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										{activeItem.image ? (
											<img
												src={activeItem.image}
												alt=""
											/>
										) : (
											<span
												style={{
													color: '#999',
													fontSize: '12px',
												}}
											>
												{__(
													'No image set - use sidebar to upload',
													'ambrygen-web'
												)}
											</span>
										)}
									</figure>
								</div>
								<div className="cat-submenu-link">
									<RichText
										tagName="div"
										className="body2-medium mb-0 nav__item--mega-menu__link-title"
										value={activeItem.rightTitle}
										onChange={(val) =>
											updateItem(
												activeIndex,
												'rightTitle',
												val
											)
										}
										placeholder={__(
											'Right Side Title',
											'ambrygen-web'
										)}
									/>
									<div className="nav__item--mega-menu__links--icon"></div>
								</div>
								<div style={{ margin: '10px 0' }}>
									<TextControl
										label={__(
											'Right Side URL',
											'ambrygen-web'
										)}
										value={activeItem.rightUrl || ''}
										onChange={(val) =>
											updateItem(
												activeIndex,
												'rightUrl',
												val
											)
										}
										placeholder="https://..."
									/>
								</div>
								<RichText
									tagName="p"
									className="nav__item--mega-menu__info caption-regular"
									value={activeItem.rightText}
									onChange={(val) =>
										updateItem(
											activeIndex,
											'rightText',
											val
										)
									}
									placeholder={__(
										'Right Side Description',
										'ambrygen-web'
									)}
								/>
							</div>
						)}
						{items.length === 0 && (
							<p>
								{__(
									'Add an item on the left to configure right-side content.',
									'ambrygen-web'
								)}
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
