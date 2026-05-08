import {
	InspectorControls,
	LinkControl,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ImageUploader } from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

export default function Edit( { attributes, setAttributes } ) {
	const {
		icon = {},
		title = '',
		description = '',
		links = [],
		count = '',
	} = attributes;

	const displayIcon = icon?.url
		? icon
		: {
				url: getThemeAssetUrl( '/assets/src/images/logo.png' ),
				alt: __( 'Ambrygen logo', 'ambrygen-web' ),
			};

	const updateLink = ( index, field, value ) => {
		const updated = [ ...links ];
		updated[ index ] = {
			...updated[ index ],
			[ field ]: value,
		};

		setAttributes( { links: updated } );
	};

	const addLink = () => {
		setAttributes( {
			links: [
				...links,
				{
					_key: `link-${ Date.now() }`,
					label: '',
					url: '',
					target: '',
					rel: '',
				},
			],
		} );
	};

	const removeLink = ( index ) => {
		setAttributes( {
			links: links.filter( ( _, i ) => i !== index ),
		} );
	};

	const blockProps = useBlockProps( {
		className: 'info-list__col',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
					<TextControl
						label={ __( 'Count', 'ambrygen-web' ) }
						value={ count }
						onChange={ ( value ) => setAttributes( { count: value } ) }
						placeholder={ __( 'Add Count...', 'ambrygen-web' ) }
					/>

					<ImageUploader
						url={ icon?.url }
						label="Icon"
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
						onRemove={ () => setAttributes( { icon: {} } ) }
					/>

					<p
						style={ {
							marginTop: '-4px',
							marginBottom: '12px',
							fontSize: '12px',
							color: '#666',
						} }
					>
						{ __( 'Use only 50px x 50px icon size.', 'ambrygen-web' ) }
					</p>

					{ links.map( ( link, i ) => (
						<div
							key={ link._key || i }
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
								onChange={ ( val ) => updateLink( i, 'label', val ) }
							/>

							<LinkControl
								value={ {
									url: link.url || '',
									opensInNewTab: link.target === '_blank',
								} }
								onChange={ ( newLink ) => {
									const updated = [ ...links ];

									updated[ i ] = {
										...updated[ i ],
										url: newLink.url,
										target: newLink.opensInNewTab ? '_blank' : '',
										rel: newLink.opensInNewTab
											? 'noopener noreferrer'
											: '',
									};

									setAttributes( { links: updated } );
								} }
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
						variant="secondary"
						style={ { marginTop: 12 } }
					>
						Add Link
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="info-list__card">
					<div className="info-list__image">
						{ displayIcon?.url && (
							<img
								src={ displayIcon.url }
								alt={ icon?.url ? icon.alt || '' : '' }
							/>
						) }
					</div>

					<div className="info-list__content">
						<RichText
							tagName="div"
							className="subtitle1-sbold info-list__title"
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Add Title...', 'ambrygen-web' ) }
						/>

						{ count && (
							<div className="info-list__count subtitle2-sbold">
								{ count } Tests
							</div>
						) }

						<div className="is-style-gl-s8" aria-hidden="true"></div>

						<RichText
							tagName="div"
							className="info-list__description text-md-reg"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __( 'Add Short Description...', 'ambrygen-web' ) }
						/>

						<div className="is-style-gl-s16" aria-hidden="true"></div>

						<div className="info-list__links">
							{ links.map(
								( link, i ) =>
									link.label &&
									link.url && (
										<div
											key={ link._key || i }
											className="info-list__link-col text-md-Semibold"
										>
											<a
												href={ link.url }
												target={ link.target || undefined }
												rel={ link.rel || undefined }
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
