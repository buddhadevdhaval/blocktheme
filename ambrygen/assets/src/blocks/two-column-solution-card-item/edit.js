import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEffect, useMemo } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import {
	ImageUploader,
	ImagePlaceholder,
	DEFAULT_IMAGES,
} from '../_shared/components';

import { t } from '../_shared/utils';

export default function Edit( { attributes, setAttributes } ) {
	const { sectiontitle, description, imageUrl, imageAlt } = attributes;

	const blockProps = useBlockProps( {
		className: 'cta-tiles-with-content__item',
	} );

	const defaultPlaceholder = useMemo(
		() => DEFAULT_IMAGES()?.placeholder || {},
		[]
	);

	useEffect( () => {
		if ( ! imageUrl ) {
			if ( defaultPlaceholder.url ) {
				setAttributes( {
					imageUrl: defaultPlaceholder.url,
					imageId: defaultPlaceholder.id,
				} );
			}
		}
	}, [
		imageUrl,
		defaultPlaceholder.url,
		defaultPlaceholder.id,
		setAttributes,
	] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ t( 'Card Image' ) } initialOpen>
					<ImageUploader
						label={ t( 'Card Image' ) }
						url={ imageUrl || defaultPlaceholder.url }
						onSelect={ ( media ) =>
							setAttributes( {
								imageUrl: media.url,
								imageId: media.id,
								imageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: undefined,
								imageAlt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="cta-tiles-with-content__body">
					<RichText
						tagName="div"
						className="cta-tiles-with-content__title"
						value={ sectiontitle }
						onChange={ ( value ) =>
							setAttributes( { sectiontitle: value } )
						}
						placeholder={ t( 'Card Title' ) }
						allowedFormats={ [] }
					/>

					<RichText
						tagName="div"
						className="body2-reg cta-tiles-with-content__desc"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ t( 'Card description...' ) }
					/>
				</div>

				<div className="cta-tiles-with-content__image-container">
					{ imageUrl ? (
						<img
							className="cta-tiles-with-content__image"
							src={ imageUrl }
							alt={ imageAlt || '' }
						/>
					) : (
						<ImagePlaceholder />
					) }
				</div>
			</div>
		</>
	);
}
