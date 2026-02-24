import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import {
	ImageUploader,
	ImagePlaceholder,
	DEFAULT_IMAGES,
} from '../_shared/components';

import { t } from '../_shared/utils';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { sectiontitle, description, imageUrl, imageAlt, imageId } =
		attributes;

	// ✅ Get block index
	const stepNumber = useSelect(
		( select ) => {
			const { getBlockIndex } = select( 'core/block-editor' );
			return getBlockIndex( clientId );
		},
		[ clientId ]
	);

	const defaults = DEFAULT_IMAGES();

	useEffect( () => {
		if ( ! imageUrl && defaults.placeholder.url ) {
			setAttributes( {
				imageUrl: defaults.placeholder.url,
				imageId: defaults.placeholder.id,
			} );
		}
	}, [] );

	const blockProps = useBlockProps( {
		className: 'vertical-tabs__item',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ t( 'Card Image' ) } initialOpen>
					<ImageUploader
						label={ t( 'Card Image' ) }
						url={ imageUrl || defaults.placeholder.url }
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
				<div className="vertical-tabs__header">
					{ /* ✅ Dynamic Step Number */ }
					<RichText
						tagName="div"
						className="caption-semi-bold vertical-tabs__step-label"
						value={
							attributes.customStepLabel
								? attributes.customStepLabel
								: `${ t( 'Step' ) } ${ stepNumber + 1 }`
						}
						onChange={ ( value ) =>
							setAttributes( { customStepLabel: value } )
						}
						placeholder={ `${ t( 'Step' ) } ${ stepNumber + 1 }` }
						allowedFormats={ [] }
					/>

					<RichText
						tagName="div"
						className="subtitle1-sbold vertical-tabs__title"
						value={ sectiontitle }
						onChange={ ( value ) =>
							setAttributes( { sectiontitle: value } )
						}
						placeholder={ t( 'Step Title' ) }
						allowedFormats={ [] }
					/>

					<RichText
						tagName="div"
						className="body1-regular vertical-tabs__desc"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ t( 'Step description...' ) }
					/>
				</div>

				<div className="vertical-tabs__content">
					<div className="vertical-tabs__image-wrapper">
						{ imageUrl ? (
							<img
								className="vertical-tabs__image"
								src={ imageUrl }
								alt={ imageAlt || '' }
							/>
						) : (
							<ImagePlaceholder />
						) }
					</div>
				</div>
			</div>
		</>
	);
}
