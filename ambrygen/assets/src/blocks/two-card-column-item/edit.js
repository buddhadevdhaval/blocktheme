import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	ImageUploader,
	DEFAULT_IMAGES,
} from '../_shared/components';
import OrderingOptionsEdit from './ordering-options-edit';

const VARIATION_VALUES = {
	VARIATION_2: 'variation-2',
};

export default function Edit( { attributes, setAttributes, context } ) {
	const { sectiontitle, description, imageUrl, imageAlt, imageId } =
		attributes;
	const variation = context?.[ 'ambrygen/twoCardColumnVariation' ] || '';
	const isVariation2 = variation === VARIATION_VALUES.VARIATION_2;

	const blockProps = useBlockProps( {
		className: isVariation2
			? 'block-layout ordering-options__card'
			: 'block-layout cta-tiles-with-content__item',
	} );

	const defaultPlaceholder = useMemo(
		() => DEFAULT_IMAGES()?.placeholder || {},
		[]
	);
	const displayImageUrl = imageUrl || defaultPlaceholder.url || '';
	const isDefaultImage =
		imageUrl === defaultPlaceholder.url &&
		imageId === defaultPlaceholder.id;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Image', 'ambrygen-web' ) }
					initialOpen
				>
					<ImageUploader
						label={ __( 'Card Image', 'ambrygen-web' ) }
						url={ isDefaultImage ? '' : imageUrl }
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
								imageId: 0,
								imageAlt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ isVariation2 ? (
					<OrderingOptionsEdit
						description={ description }
						displayImageUrl={ displayImageUrl }
						imageAlt={ imageAlt }
						imageUrl={ imageUrl }
						sectiontitle={ sectiontitle }
						setAttributes={ setAttributes }
					/>
				) : (
					<>
						<div className="cta-tiles-with-content__body">
							<RichText
								tagName="div"
								className="cta-tiles-with-content__title"
								value={ sectiontitle }
								onChange={ ( value ) =>
									setAttributes( { sectiontitle: value } )
								}
								placeholder={ __(
									'Add Title...',
									'ambrygen-web'
								) }
								allowedFormats={ [] }
							/>

							<RichText
								tagName="div"
								className="body2-reg cta-tiles-with-content__desc"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder={ __(
									'Add Short Description...',
									'ambrygen-web'
								) }
							/>
						</div>

						<div className="cta-tiles-with-content__image-container">
							{ displayImageUrl && (
								<img
									className="cta-tiles-with-content__image"
									src={ displayImageUrl }
									alt={ imageUrl ? imageAlt || '' : '' }
								/>
							) }
						</div>
					</>
				) }
			</div>
		</>
	);
}
