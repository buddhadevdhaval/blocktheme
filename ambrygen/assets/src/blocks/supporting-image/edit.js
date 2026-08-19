import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	BlockExamplePreview,
	ImageUploader,
	TagSelector,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		anchor,
		heading,
		headingTag,
		description,
		imageUrl,
		imageAlt,
	} = attributes;
	const isExample = blockId === 'supporting-image-example';

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
		idPrefix: 'supporting-image',
	} );

	const HeadingTag = headingTag || 'h2';

	const blockProps = useBlockProps( {
		className: 'supporting-image block-layout',
		id: anchor || blockId || undefined,
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="supporting-image-example-preview"
				imagePath="/assets/src/images/supporting-image/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Image Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						label={ __( 'Image', 'ambrygen-web' ) }
						url={ imageUrl }
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
				<div className="supporting-image__chart-card">
					<div className="supporting-image__chart-image">
						{ imageUrl ? (
							<img src={ imageUrl } alt={ imageAlt || '' } />
						) : (
							<Placeholder
								icon="format-image"
								label={ __( 'Chart image', 'ambrygen-web' ) }
								instructions={ __(
									'Upload the supporting image from block settings.',
									'ambrygen-web'
								) }
							/>
						) }
					</div>
				</div>

				<div className="supporting-image__content">
					<RichText
						tagName={ HeadingTag }
						className="heading-4 block-title mb-0 supporting-image__heading"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s24" aria-hidden="true"></div>
					<RichText
						tagName="div"
						className="subtitle1-regular supporting-image__description  block-description"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __( 'Add Description…', 'ambrygen-web' ) }
					/>
				</div>
			</div>
		</>
	);
}
