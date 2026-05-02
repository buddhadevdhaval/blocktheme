import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { ImageUploader } from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

export default function Edit( { attributes, setAttributes } ) {
	const {
		iconId = 0,
		iconAlt = '',
		title = '',
		description = '',
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'icon-card-grid__card',
	} );
	const placeholderIconUrl = getThemeAssetUrl( '/assets/src/images/logo.png' );

	const iconPreviewUrl = useSelect(
		( select ) => {
			if ( ! iconId ) {
				return '';
			}

			const media = select( 'core' ).getMedia( iconId, {
				context: 'view',
			} );

			if ( media === undefined ) {
				return '';
			}

			return media?.source_url || '';
		},
		[ iconId ]
	);
	const isLoadingImage = useSelect(
		( select ) => {
			if ( ! iconId ) {
				return false;
			}

			return select( 'core' ).isResolving( 'getMedia', [ iconId ] );
		},
		[ iconId ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Icon Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						url={ iconPreviewUrl }
						label={ __( 'Icon', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								iconId: media.id || 0,
								iconAlt: media.alt || media.title || '',
							} )
						}
						onRemove={ () =>
							setAttributes( { iconId: 0, iconAlt: '' } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ isLoadingImage && ! iconPreviewUrl && (
					<div className="icon-card-grid__icon-wrap">
						<div className="icon-card-grid__icon" aria-hidden="true"></div>
					</div>
				) }
				{ ( iconPreviewUrl || placeholderIconUrl ) && (
					<div className="icon-card-grid__icon-wrap">
						<img
							src={ iconPreviewUrl || placeholderIconUrl }
							alt={ iconPreviewUrl ? iconAlt || '' : '' }
							className="icon-card-grid__icon"
							width="70"
							height="70"
						/>
					</div>
				) }

				<div className="icon-card-grid__content">
					<RichText
						tagName="div"
						className="subtitle1-sbold icon-card-grid__card-title"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>
					<RichText
						tagName="div"
						className="body1 icon-card-grid__card-desc"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Add Description...',
							'ambrygen-web'
						) }
					/>
				</div>
			</div>
		</>
	);
}
