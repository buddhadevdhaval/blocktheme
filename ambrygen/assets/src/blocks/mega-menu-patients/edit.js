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
	PanelRow,
	CardDivider,
} from '@wordpress/components';
import {
	plus,
	trash,
	chevronUp,
	chevronDown,
	upload,
	image as imageIcon,
} from '@wordpress/icons';

export default function Edit({ attributes, setAttributes }) {
	const { items } = attributes;
	const blockProps = useBlockProps({
		className: 'nav__item--mega-menu__grid',
	});

	const MAX_ITEMS = 3;

	const updateItem = (index, key, value) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [key]: value };
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		if (items.length >= MAX_ITEMS) {
			return;
		}
		const newItem = {
			image: '',
			imageId: 0,
			title: __('New Item', 'ambrygen-web'),
			url: '#',
			text: __('Description here', 'ambrygen-web'),
			hasSubmenu: false,
			submenuTitle: '',
			submenuLinks: [],
		};
		setAttributes({ items: [...items, newItem] });
	};

	const removeItem = (index) => {
		if (items.length <= 1) {
			return;
		}
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
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
	};

	const updateSubmenuLink = (itemIndex, linkIndex, key, value) => {
		const newItems = [...items];
		const item = newItems[itemIndex];
		const newLinks = [...item.submenuLinks];
		newLinks[linkIndex] = { ...newLinks[linkIndex], [key]: value };

		newItems[itemIndex] = {
			...item,
			submenuLinks: newLinks
		};
		setAttributes({ items: newItems });
	};

	const addSubmenuLink = (itemIndex) => {
		const newItems = [...items];
		const item = newItems[itemIndex];

		newItems[itemIndex] = {
			...item,
			submenuLinks: [
				...item.submenuLinks,
				{ label: 'New Link', url: '#', icon: '' },
			]
		};
		setAttributes({ items: newItems });
	};

	const removeSubmenuLink = (itemIndex, linkIndex) => {
		const newItems = [...items];
		const item = newItems[itemIndex];

		newItems[itemIndex] = {
			...item,
			submenuLinks: item.submenuLinks.filter((_, i) => i !== linkIndex)
		};
		setAttributes({ items: newItems });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Menu Items', 'ambrygen-web')}
					initialOpen={true}
				>
					<p
						className="components-base-control__help"
						style={{ marginBottom: '12px' }}
					>
						{__(
							`Manage up to ${MAX_ITEMS} menu items. Current: ${items.length}/${MAX_ITEMS}`,
							'ambrygen-web'
						)}
					</p>

					{items.map((item, index) => (
						<div
							key={index}
							style={{
								marginBottom: '16px',
								padding: '12px',
								background: '#f0f0f0',
								borderRadius: '4px',
							}}
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
									{item.title ||
										__('Untitled', 'ambrygen-web')}
								</strong>
								<div style={{ display: 'flex', gap: '4px' }}>
									<Button
										icon={chevronUp}
										size="small"
										disabled={index === 0}
										onClick={() => moveItemUp(index)}
										label={__(
											'Move Up',
											'ambrygen-web'
										)}
									/>
									<Button
										icon={chevronDown}
										size="small"
										disabled={index >= items.length - 1}
										onClick={() => moveItemDown(index)}
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
										onClick={() => removeItem(index)}
										label={__(
											'Remove Item',
											'ambrygen-web'
										)}
									/>
								</div>
							</div>

							{ /* Image Controls */}
							<div style={{ marginBottom: '8px' }}>
								<p
									style={{
										marginBottom: '4px',
										fontWeight: '500',
									}}
								>
									{__('Image', 'ambrygen-web')}
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
															onClick={open}
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
												onClick={() => {
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
													onClick={open}
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
								label={__('Title', 'ambrygen-web')}
								value={item.title}
								onChange={(value) =>
									updateItem(index, 'title', value)
								}
							/>

							<TextControl
								label={__('URL', 'ambrygen-web')}
								value={item.url}
								onChange={(value) =>
									updateItem(index, 'url', value)
								}
							/>

							<TextControl
								label={__('Description', 'ambrygen-web')}
								value={item.text}
								onChange={(value) =>
									updateItem(index, 'text', value)
								}
							/>

							{index < items.length - 1 && <CardDivider />}
						</div>
					))}

					{items.length < MAX_ITEMS && (
						<Button
							variant="primary"
							icon={plus}
							onClick={addItem}
							style={{
								width: '100%',
								justifyContent: 'center',
							}}
						>
							{__('Add Item', 'ambrygen-web')}
						</Button>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{items.map((item, index) => (
					<div key={index} className="nav__item--mega-menu__item">
						<div className="nav__item--mega-menu__col">
							<figure className="nav__item--mega-menu__image">
								{item.image ? (
									<img src={item.image} alt="" />
								) : (
									<span
										style={{
											color: '#999',
											fontSize: '12px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											minHeight: '100px',
											background: '#f0f0f0',
										}}
									>
										{__('No image set', 'ambrygen-web')}
									</span>
								)}
							</figure>

							{ /* Title & Link */}
							<div className="nav__item--mega-menu__links">
								<RichText
									tagName="p"
									className="body2-medium mb-0 nav__item--mega-menu__link-title"
									value={item.title}
									onChange={(value) =>
										updateItem(index, 'title', value)
									}
									placeholder={__(
										'Title',
										'ambrygen-web'
									)}
								/>
							</div>
							<RichText
								tagName="p"
								className="nav__item--mega-menu__info caption-regular"
								value={item.text}
								onChange={(value) =>
									updateItem(index, 'text', value)
								}
								placeholder={__(
									'Description',
									'ambrygen-web'
								)}
							/>
						</div>

						{item.hasSubmenu ? (
							<div className="nav__item--mega-menu__submenu-inner">
								<div className="nav__item--mega-menu__submenu-inner--col">
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<RichText
											tagName="p"
											className="nav__item--mega-menu__submenu-inner--title caption-semi-bold"
											value={item.submenuTitle}
											onChange={(value) =>
												updateItem(
													index,
													'submenuTitle',
													value
												)
											}
											placeholder={__(
												'Submenu Title',
												'ambrygen-web'
											)}
										/>
										<Button
											icon={trash}
											isSmall
											isDestructive
											onClick={() =>
												updateItem(
													index,
													'hasSubmenu',
													false
												)
											}
											label={__(
												'Remove Section',
												'ambrygen-web'
											)}
										/>
									</div>
									<ul className="nav__item--mega-menu__submenu-inner--links">
										{item.submenuLinks.map(
											(link, linkIndex) => (
												<li
													key={linkIndex}
													className="nav__item--mega-menu__submenu-inner--link-wrapper"
													style={{
														position: 'relative',
													}}
												>
													<a
														href={link.url}
														className="nav__item--mega-menu__submenu-inner--link"
														onClick={(e) =>
															e.preventDefault()
														}
													>
														<div className="nav__item--mega-menu__submenu-inner--icon">
															<MediaUploadCheck>
																<MediaUpload
																	onSelect={(
																		media
																	) =>
																		updateSubmenuLink(
																			index,
																			linkIndex,
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
																			onClick={
																				open
																			}
																			style={{
																				cursor: 'pointer',
																				width: '24px',
																				height: '24px',
																				background:
																					link.icon
																						? 'transparent'
																						: '#eee',
																			}}
																		>
																			{link.icon && (
																				<img
																					src={
																						link.icon
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
															value={link.label}
															onChange={(
																value
															) =>
																updateSubmenuLink(
																	index,
																	linkIndex,
																	'label',
																	value
																)
															}
														/>
													</a>
													<div
														style={{
															marginTop: '5px',
														}}
													>
														<TextControl
															value={link.url}
															onChange={(
																value
															) =>
																updateSubmenuLink(
																	index,
																	linkIndex,
																	'url',
																	value
																)
															}
															placeholder={__(
																'Paste Link URL',
																'ambrygen-web'
															)}
														/>
													</div>
													<Tooltip text="Remove Link">
														<Button
															icon={trash}
															onClick={() =>
																removeSubmenuLink(
																	index,
																	linkIndex
																)
															}
															className="remove-link-btn"
															style={{
																position:
																	'absolute',
																right: -30,
																top: 5,
																color: 'red',
															}}
														/>
													</Tooltip>
												</li>
											)
										)}
									</ul>
									<Button
										variant="secondary"
										icon={plus}
										onClick={() =>
											addSubmenuLink(index)
										}
									>
										{__('Add Link', 'ambrygen-web')}
									</Button>
								</div>
							</div>
						) : (
							<div style={{ padding: '10px 0' }}>
								<Button
									variant="secondary"
									onClick={() =>
										updateItem(index, 'hasSubmenu', true)
									}
									style={{
										width: '100%',
										justifyContent: 'center',
									}}
								>
									{__(
										'Add Submenu (Links)',
										'ambrygen-web'
									)}
								</Button>
							</div>
						)}
					</div>
				))}
			</div>
		</>
	);
}
