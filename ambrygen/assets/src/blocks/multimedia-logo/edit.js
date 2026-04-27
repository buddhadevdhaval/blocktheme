import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { ImageUploader, TagSelector } from '../_shared/components';

const DEFAULT_GROUP_ITEM = {
	groupName: '',
	linkName: '',
	fileUrl: '',
	fileId: 0,
};

const updateArrayItem = ( items = [], index, updates ) =>
	items.map( ( item, itemIndex ) =>
		itemIndex === index ? { ...item, ...updates } : item
	);

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		heading,
		headingTag = 'h2',
		image1Url,
		image1Id,
		image1Alt,
		webGroups = [],
		printGroups = [],
		image2Url,
		image2Id,
		image2Alt,
		description,
	} = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'logo-section',
	} );

	const addWebGroup = () => {
		setAttributes( {
			webGroups: [ ...webGroups, DEFAULT_GROUP_ITEM ],
		} );
	};

	const addPrintGroup = () => {
		setAttributes( {
			printGroups: [ ...printGroups, DEFAULT_GROUP_ITEM ],
		} );
	};

	const updateWebGroup = ( index, updates ) => {
		setAttributes( {
			webGroups: updateArrayItem( webGroups, index, updates ),
		} );
	};

	const updatePrintGroup = ( index, updates ) => {
		setAttributes( {
			printGroups: updateArrayItem( printGroups, index, updates ),
		} );
	};

	const removeWebGroup = ( index ) => {
		setAttributes( {
			webGroups: webGroups.filter( ( _, itemIndex ) => itemIndex !== index ),
		} );
	};

	const removePrintGroup = ( index ) => {
		setAttributes( {
			printGroups: printGroups.filter(
				( _, itemIndex ) => itemIndex !== index
			),
		} );
	};

	const renderFileControl = ( item, onSelect, onRemove ) => (
		<div style={ { marginBottom: '16px' } }>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ onSelect }
					render={ ( { open } ) => (
						<Button variant="secondary" onClick={ open }>
							{ item.fileUrl
								? __( 'Replace File', 'ambrygen-web' )
								: __( 'Select File', 'ambrygen-web' ) }
						</Button>
					) }
				/>
			</MediaUploadCheck>
			{ item.fileUrl && (
				<Button
					variant="secondary"
					isDestructive
					onClick={ onRemove }
					style={ { marginLeft: '8px' } }
				>
					{ __( 'Remove File', 'ambrygen-web' ) }
				</Button>
			) }
		</div>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading', 'ambrygen-web' ) } initialOpen>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						type="heading"
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Image-1', 'ambrygen-web' ) } initialOpen={ false }>
					<ImageUploader
						label={ __( 'Image-1', 'ambrygen-web' ) }
						url={ image1Url }
						id={ image1Id }
						onSelect={ ( media ) =>
							setAttributes( {
								image1Url: media.url,
								image1Id: media.id,
								image1Alt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								image1Url: '',
								image1Id: 0,
								image1Alt: '',
							} )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Group For Web', 'ambrygen-web' ) } initialOpen={ false }>
					{ webGroups.map( ( item, index ) => (
						<div key={ index } style={ { marginBottom: '20px' } }>
							<p><strong>{ __( 'Repeater Item', 'ambrygen-web' ) } { index + 1 }</strong></p>
							<input
								type="text"
								className="components-text-control__input"
								value={ item.groupName || '' }
								placeholder={ __( 'Group Name', 'ambrygen-web' ) }
								onChange={ ( event ) =>
									updateWebGroup( index, {
										groupName: event.target.value,
									} )
								}
							/>
							<div style={ { height: '12px' } }></div>
							<input
								type="text"
								className="components-text-control__input"
								value={ item.linkName || '' }
								placeholder={ __( 'Link Name', 'ambrygen-web' ) }
								onChange={ ( event ) =>
									updateWebGroup( index, {
										linkName: event.target.value,
									} )
								}
							/>
							<div style={ { height: '12px' } }></div>
							{ renderFileControl(
								item,
								( media ) =>
									updateWebGroup( index, {
										fileUrl: media?.url || '',
										fileId: media?.id || 0,
										linkName:
											item.linkName || media?.title || media?.filename || '',
									} ),
								() =>
									updateWebGroup( index, {
										fileUrl: '',
										fileId: 0,
									} )
							) }
							<Button
								variant="secondary"
								isDestructive
								onClick={ () => removeWebGroup( index ) }
							>
								{ __( 'Remove Item', 'ambrygen-web' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addWebGroup }>
						{ __( 'Add item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Group For Print', 'ambrygen-web' ) } initialOpen={ false }>
					{ printGroups.map( ( item, index ) => (
						<div key={ index } style={ { marginBottom: '20px' } }>
							<p><strong>{ __( 'Repeater Item', 'ambrygen-web' ) } { index + 1 }</strong></p>
							<input
								type="text"
								className="components-text-control__input"
								value={ item.groupName || '' }
								placeholder={ __( 'Group Name', 'ambrygen-web' ) }
								onChange={ ( event ) =>
									updatePrintGroup( index, {
										groupName: event.target.value,
									} )
								}
							/>
							<div style={ { height: '12px' } }></div>
							<input
								type="text"
								className="components-text-control__input"
								value={ item.linkName || '' }
								placeholder={ __( 'Link Name', 'ambrygen-web' ) }
								onChange={ ( event ) =>
									updatePrintGroup( index, {
										linkName: event.target.value,
									} )
								}
							/>
							<div style={ { height: '12px' } }></div>
							{ renderFileControl(
								item,
								( media ) =>
									updatePrintGroup( index, {
										fileUrl: media?.url || '',
										fileId: media?.id || 0,
										linkName:
											item.linkName || media?.title || media?.filename || '',
									} ),
								() =>
									updatePrintGroup( index, {
										fileUrl: '',
										fileId: 0,
									} )
							) }
							<Button
								variant="secondary"
								isDestructive
								onClick={ () => removePrintGroup( index ) }
							>
								{ __( 'Remove Item', 'ambrygen-web' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addPrintGroup }>
						{ __( 'Add item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Image-2', 'ambrygen-web' ) } initialOpen={ false }>
					<ImageUploader
						label={ __( 'Image-2', 'ambrygen-web' ) }
						url={ image2Url }
						id={ image2Id }
						onSelect={ ( media ) =>
							setAttributes( {
								image2Url: media.url,
								image2Id: media.id,
								image2Alt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								image2Url: '',
								image2Id: 0,
								image2Alt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="logo-section__header">
					<RichText
						tagName={ headingTag || 'h2' }
						className="logo-section__title heading-3 mb-0"
						value={ heading }
						onChange={ ( value ) => setAttributes( { heading: value } ) }
						placeholder={ __( 'Heading', 'ambrygen-web' ) }
					/>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="logo-section__top">
					<div className="logo-section__logo">
						{ image1Url ? (
							<img src={ image1Url } alt={ image1Alt || '' } />
						) : null }
					</div>

					<div className="logo-section__downloads">
						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title subtitle2-sbold">
								{ __( 'Group For Web', 'ambrygen-web' ) }
							</div>
							<div className="logo-section__downloads-list">
								{ webGroups.map( ( item, index ) => (
									<div key={ `${ index }-web` } className="logo-section__downloads-item">
										{ item.groupName && (
											<div className="subtitle2-sbold">{ item.groupName }</div>
										) }
										{ item.linkName && (
											<span className="logo-section__downloads-link">
												{ item.linkName }
											</span>
										) }
									</div>
								) ) }
							</div>
						</div>

						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title subtitle2-sbold">
								{ __( 'Group For Print', 'ambrygen-web' ) }
							</div>
							<div className="logo-section__downloads-list">
								{ printGroups.map( ( item, index ) => (
									<div key={ `${ index }-print` } className="logo-section__downloads-item">
										{ item.groupName && (
											<div className="subtitle2-sbold">{ item.groupName }</div>
										) }
										{ item.linkName && (
											<span className="logo-section__downloads-link">
												{ item.linkName }
											</span>
										) }
									</div>
								) ) }
							</div>
						</div>
					</div>
				</div>

				<div className="logo-section__divider" aria-hidden="true"></div>

				<div className="logo-section__bottom">
					<div className="logo-section__left">
						{ image2Url ? <img src={ image2Url } alt={ image2Alt || '' } /> : null }
					</div>
					<div className="logo-section__right">
						<RichText
							tagName="div"
							className="logo-section__right-content"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __( 'Description', 'ambrygen-web' ) }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
