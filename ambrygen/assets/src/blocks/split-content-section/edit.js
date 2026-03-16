import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ImageUploader, TagSelector } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		titleTag,
		description,
		backgroundImage,
		backgroundImageAlt,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'heading-content-section'
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Section Intro Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Title Tag', 'ambrygen-web' ) }
						type="heading"
						value={ titleTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { titleTag: value } )
						}
					/>

					<ImageUploader
						label={ __( 'Background Image', 'ambrygen-web' ) }
						url={ backgroundImage }
						onSelect={ ( media ) =>
							setAttributes( {
								backgroundImage: media.url,
								backgroundImageId: media.id,
								backgroundImageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								backgroundImage: '',
								backgroundImageId: 0,
								backgroundImageAlt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ backgroundImage && (
					<div className="block-bg-image">
						<img src={ backgroundImage } alt={ backgroundImageAlt } />
					</div>
				) }
				<div className="heading-content-section__inner block__rowflex">
					<RichText
						tagName={ titleTag || 'h2' }
						className="heading-content-section__title heading-3 block-title mb-0 block__rowflex--heading-title"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/text-color',
						] }
						placeholder={ __( 'Add Title', 'ambrygen-web' ) }
					/>

					<div className="heading-content-section__description block__rowflex--block-content block-description">
						<RichText
							tagName="div"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							allowedFormats={ [
								'core/bold',
								'core/italic',
								'core/link',
							] }
							placeholder={ __( 'Add Description', 'ambrygen-web' ) }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
