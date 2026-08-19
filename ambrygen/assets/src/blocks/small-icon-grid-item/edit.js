import {
	useBlockProps,
	InspectorControls,
	LinkControl,
	RichText,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ImageUploader } from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

const PLACEHOLDER_ICON = {
	url: getThemeAssetUrl( '/assets/src/images/logo.png' ),
	alt: __( 'Ambrygen logo', 'ambrygen-web' ),
};

export default function Edit( { attributes, setAttributes } ) {
	const { icon = {}, title = '', description = '', links = [] } = attributes;
	const displayIcon = icon?.url ? icon : PLACEHOLDER_ICON;

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
		className: 'icon-grid__item',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
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
						{ __(
							'Use only 50px x 50px icon size.',
							'ambrygen-web'
						) }
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
								onChange={ ( value ) =>
									updateLink( i, 'label', value )
								}
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
										target: newLink.opensInNewTab
											? '_blank'
											: '',
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
				{ displayIcon?.url && (
					<div className="icon-grid__icon">
						<img
							src={ displayIcon.url }
							alt={ icon?.url ? icon.alt || '' : '' }
						/>
					</div>
				) }

				<RichText
					tagName="h3"
					className="icon-grid__item-title text-xl-semibold mb-0"
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder="Add Title..."
				/>

				<div className="is-style-gl-s8" aria-hidden="true"></div>

				<RichText
					tagName="p"
					className="icon-grid__item-description text-md-reg"
					value={ description }
					onChange={ ( value ) =>
						setAttributes( { description: value } )
					}
					placeholder="Add Short Description..."
				/>

				<div className="is-style-gl-s20" aria-hidden="true"></div>

				{ links?.[ 0 ]?.url && links?.[ 0 ]?.label && (
					<div className="site-btn is-style-site-text-btn has-right-arrow">
						{ links[ 0 ].label }
					</div>
				) }
			</div>
		</>
	);
}
