import {
	InnerBlocks,
	RichText,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	TagSelector,
	BlockExamplePreview,
	ImageUploader,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const ALLOWED_BLOCKS = [ 'ambrygen/large-icon-grid-item' ];
const TEMPLATE = [
	[ 'ambrygen/large-icon-grid-item', {} ],
	[ 'ambrygen/large-icon-grid-item', {} ],
	[ 'ambrygen/large-icon-grid-item', {} ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { heading, headingTag, description, blockId, backgroundImage } =
		attributes;
	const isExample = blockId === 'large-icon-grid-example';
	const HeadingTag = headingTag || 'h2';
	const hasBackgroundImage = Boolean( backgroundImage?.url );

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				imagePath="/assets/src/images/large-icon-grid/preview.png"
			/>
		);
	}

	const blockProps = useBlockProps( {
		className: 'block-layout icon-grid variation-grid-post style-large-icons',
		id: blockId || undefined,
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) } initialOpen={ false }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody title={ __( 'Display Settings', 'ambrygen-web' ) }>
					<ImageUploader
						url={ backgroundImage?.url || '' }
						label={ __( 'Background Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								backgroundImage: {
									id: media.id,
									url: media.url,
									alt: media.alt || '',
								},
							} )
						}
						onRemove={ () =>
							setAttributes( {
								backgroundImage: {
									url: '',
									id: 0,
									alt: '',
								},
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			{ hasBackgroundImage && (
				<div className="block-bg-image">
					<img
						src={ backgroundImage.url }
						alt={ backgroundImage.alt || '' }
					/>
				</div>
			) }
			<div className="icon-grid-block">
				<div className="info-list-block__header">
					<RichText
						tagName={ HeadingTag }
						className="heading-4 block-title mb-0"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s20" aria-hidden="true"></div>
					<div className="info-list-block__intro subtitle-1-regular">
						<RichText
							tagName="p"
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

				<div className="is-style-gl-s64" aria-hidden="true"></div>
				<div className="info-list__list info-list__row">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
						templateLock={ false }
					/>
				</div>
			</div>
		</div>
	);
}
