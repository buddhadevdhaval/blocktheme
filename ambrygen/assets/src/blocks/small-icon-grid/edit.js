import {
	InnerBlocks,
	RichText,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	TagSelector,
	BlockExamplePreview,
	ImageUploader,
	CtaButtonField,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const ALLOWED_BLOCKS = [ 'ambrygen/small-icon-grid-item' ];
const TEMPLATE = [
	[ 'ambrygen/small-icon-grid-item', {} ],
	[ 'ambrygen/small-icon-grid-item', {} ],
	[ 'ambrygen/small-icon-grid-item', {} ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		heading,
		headingTag,
		description,
		link = {},
		isLargeIcon,
		blockId,
		backgroundImage,
	} = attributes;
	const isExample = blockId === 'small-icon-grid-example';
	const HeadingTag = headingTag || 'h2';
	const hasBackgroundImage = Boolean( backgroundImage?.url );
	const hasCta = Boolean( link?.url && link?.text );

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
	} );

	const blockProps = useBlockProps( {
		className: `block-layout icon-grid ${
			isLargeIcon ? 'style-large-icons' : ''
		}`,
		id: blockId || undefined,
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview imagePath="/assets/src/images/small-icon-grid/preview.png" />
		);
	}

	return (
		<div { ...blockProps }>
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
				<PanelBody title={ __( 'Display Settings', 'ambrygen-web' ) }>
					<ToggleControl
						label={ __( 'Large Icons', 'ambrygen-web' ) }
						checked={ isLargeIcon }
						onChange={ ( value ) =>
							setAttributes( { isLargeIcon: value } )
						}
					/>
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
					<CtaButtonField
						label={ __( '', 'ambrygen-web' ) }
						textLabel={ __( 'Link Text', 'ambrygen-web' ) }
						defaultVariant="primary"
						value={ link }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { link: value } )
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
				<div className="icon-grid__header">
					<RichText
						tagName={ HeadingTag }
						className="heading-3 block-title mb-0"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s20" aria-hidden="true"></div>
					<div className="text-xl-reg icon-grid__intro text-center">
						<RichText
							tagName="p"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
						/>
					</div>
					{ hasCta && (
						<div className="site-btn is-style-site-text-btn has-right-arrow text-14">
							{ link.text }
						</div>
					) }
				</div>

				<div className="is-style-gl-s64" aria-hidden="true"></div>
				<div className="icon-grid__list">
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
