import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button, Tooltip, TextControl } from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';
import { useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { leftTitle, items } = attributes;
	const [ activeIndex, setActiveIndex ] = useState( 0 );
	const blockProps = useBlockProps( {
		className: 'nav__item--mega-menu__grid nav__item--mega-menu__second-level',
	} );

	const updateItem = ( index, key, value ) => {
		const newItems = [ ...items ];
		newItems[ index ] = { ...newItems[ index ], [ key ]: value };
		setAttributes( { items: newItems } );
	};

	const addItem = () => {
		const newItem = {
			label: 'New Link',
			url: '#',
			image: '',
			rightTitle: 'Link Title',
			rightText: 'Description',
			rightUrl: '#',
		};
		setAttributes( { items: [ ...items, newItem ] } );
		setActiveIndex( items.length );
	};

	const removeItem = ( index ) => {
		const newItems = items.filter( ( _, i ) => i !== index );
		setAttributes( { items: newItems } );
		if ( activeIndex >= newItems.length ) {
			setActiveIndex( Math.max( 0, newItems.length - 1 ) );
		}
	};

	const activeItem = items[ activeIndex ] || {};

	return (
		<div { ...blockProps }>
			{ /* Left Column */ }
			<div className="nav__item--mega-menu__cl-left">
				<div className="nav__item--mega-menu__submenu-inner nav__item--mega-menu__second-level--submenu-inner">
					<div className="nav__item--mega-menu__submenu-inner--col">
						<RichText
							tagName="p"
							className="nav__item--mega-menu__submenu-inner--title caption-semi-bold"
							value={ leftTitle }
							onChange={ ( val ) =>
								setAttributes( { leftTitle: val } )
							}
							placeholder={ __( 'Title', 'ambrygen-web' ) }
						/>
						<ul className="nav__item--mega-menu__submenu-inner--links">
							{ items.map( ( item, index ) => (
								<li
									key={ index }
									style={ {
										position: 'relative',
										backgroundColor:
											activeIndex === index
												? '#f0f0f0'
												: 'transparent',
										borderRadius: '4px',
									} }
									onClick={ () => setActiveIndex( index ) }
								>
									<a
										href={ item.url }
										className="nav__item--mega-menu__submenu-inner--link submenu-inner-link"
										onClick={ ( e ) => e.preventDefault() }
									>
										<RichText
											tagName="div"
											className="nav__item--mega-menu__submenu-inner--link-title body2-medium"
											value={ item.label }
											onChange={ ( val ) =>
												updateItem(
													index,
													'label',
													val
												)
											}
										/>
									</a>
									<div
										style={ {
											marginTop: '5px',
											paddingLeft: '0',
										} }
									>
										<TextControl
											value={ item.url }
											onChange={ ( val ) =>
												updateItem( index, 'url', val )
											}
											placeholder={ __(
												'URL',
												'ambrygen-web'
											) }
											onClick={ ( e ) =>
												e.stopPropagation()
											}
										/>
									</div>
									<Tooltip text="Remove Item">
										<Button
											icon={ trash }
											onClick={ ( e ) => {
												e.stopPropagation();
												removeItem( index );
											} }
											className="remove-link-btn"
											style={ {
												position: 'absolute',
												right: -30,
												top: 5,
												color: 'red',
											} }
										/>
									</Tooltip>
								</li>
							) ) }
						</ul>
						<Button
							variant="secondary"
							icon={ plus }
							onClick={ addItem }
						>
							{ __( 'Add Item', 'ambrygen-web' ) }
						</Button>
					</div>
				</div>
			</div>

			{ /* Right Column */ }
			<div className="nav__item--mega-menu__cl-right">
				<div className="nav__item--mega-menu__category-submenu-row">
					{ items.length > 0 && (
						<div className="nav__item--mega-menu__category-submenu-lists category-submenu-lists">
							<div className="nav__item--mega-menu__category-submenu-lists--image">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) =>
											updateItem(
												activeIndex,
												'image',
												media.url
											)
										}
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<figure
												onClick={ open }
												style={ {
													cursor: 'pointer',
													minHeight: '200px',
													background: '#f0f0f0',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												} }
											>
												{ activeItem.image ? (
													<img
														src={ activeItem.image }
														alt=""
													/>
												) : (
													<Button variant="secondary">
														{ __(
															'Upload Right Side Image',
															'ambrygen-web'
														) }
													</Button>
												) }
											</figure>
										) }
									/>
								</MediaUploadCheck>
							</div>
							<div className="nav__item--mega-menu__category-submenu-lists--links">
								<RichText
									tagName="p"
									className="body2-medium mb-0 nav__item--mega-menu__link-title"
									value={ activeItem.rightTitle }
									onChange={ ( val ) =>
										updateItem(
											activeIndex,
											'rightTitle',
											val
										)
									}
									placeholder={ __(
										'Right Side Title',
										'ambrygen-web'
									) }
								/>
								<div className="nav__item--mega-menu__links--icon"></div>
							</div>
							<div style={ { margin: '10px 0' } }>
								<TextControl
									label={ __(
										'Right Side URL',
										'ambrygen-web'
									) }
									value={ activeItem.rightUrl || '' }
									onChange={ ( val ) =>
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
								value={ activeItem.rightText }
								onChange={ ( val ) =>
									updateItem( activeIndex, 'rightText', val )
								}
								placeholder={ __(
									'Right Side Description',
									'ambrygen-web'
								) }
							/>
						</div>
					) }
					{ items.length === 0 && (
						<p>
							{ __(
								'Add an item on the left to configure right-side content.',
								'ambrygen-web'
							) }
						</p>
					) }
				</div>
			</div>
		</div>
	);
}
