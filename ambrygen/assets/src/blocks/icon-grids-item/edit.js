import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { icon = {}, title = '', links = [] } = attributes;

	const updateLink = ( index, field, value ) => {
		const updated = [ ...links ];
		updated[ index ] = { ...updated[ index ], [ field ]: value };
		setAttributes( { links: updated } );
	};

	const addLink = () => {
		setAttributes( {
			links: [ ...links, { label: '', url: '' } ],
		} );
	};

	const removeLink = ( index ) => {
		const updated = links.filter( ( _, i ) => i !== index );
		setAttributes( { links: updated } );
	};

	const blockProps = useBlockProps( {
		className: 'info-list__col',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
					<TextControl
						label="Title"
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
					/>

					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ [ 'image' ] }
							value={ icon?.id }
							onSelect={ ( media ) =>
								setAttributes( {
									icon: {
										id: media.id,
										url: media.url,
										alt: media.alt || media.title,
										sizes: media.sizes || {},
									},
								} )
							}
							render={ ( { open } ) => (
								<div style={ { margin: '12px 0' } }>
									<Button onClick={ open } isSecondary>
										{ icon?.url
											? 'Replace Icon'
											: 'Upload Icon' }
									</Button>
									{ icon?.url && (
										<p
											style={ {
												marginTop: 8,
												fontSize: '12px',
											} }
										>
											<img
												src={ icon.url }
												style={ {
													maxHeight: '40px',
													maxWidth: '40px',
												} }
												alt=""
											/>
										</p>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>

					{ links.map( ( link, i ) => (
						<div
							key={ i }
							style={ {
								marginTop: 12,
								padding: 12,
								border: '1px solid #ddd',
								borderRadius: 4,
							} }
						>
							<TextControl
								label={ `Link ${ i + 1 } Label` }
								value={ link.label }
								onChange={ ( val ) =>
									updateLink( i, 'label', val )
								}
							/>
							<TextControl
								label={ `Link ${ i + 1 } URL` }
								value={ link.url }
								onChange={ ( val ) =>
									updateLink( i, 'url', val )
								}
							/>
							<Button
								onClick={ () => removeLink( i ) }
								isDestructive
								style={ { marginTop: 8 } }
							>
								Remove Link
							</Button>
						</div>
					) ) }

					<Button
						onClick={ addLink }
						isSecondary
						style={ { marginTop: 12 } }
					>
						Add Link
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="info-list__card">
					<div className="info-list__image">
						{ icon?.url && (
							<img src={ icon.url } alt={ icon.alt || '' } />
						) }
					</div>
					<div className="info-list__content">
						<div className="subtitle1-sbold info-list__title">
							{ title }
						</div>
						<div className="is-style-gl-s8"></div>
						<div className="info-list__links">
							{ links.map(
								( link, i ) =>
									link.label &&
									link.url && (
										<div
											key={ i }
											className="info-list__link-col text-md-Semibold"
										>
											<a
												href={ link.url }
												className="info-list__link"
											>
												{ link.label }
											</a>
										</div>
									)
							) }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
