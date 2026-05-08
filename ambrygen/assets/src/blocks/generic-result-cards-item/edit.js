import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { ImageUploader, TagSelector } from '../_shared/components';

const ALLOWED_INNER_BLOCKS = [ 'core/paragraph', 'core/buttons', 'core/button' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		title,
		headingTag = 'h3',
		summary,
		imageUrl,
		imageId,
		imageAlt,
		cardVariant = 'card-bg-green',
	} = attributes;

	const hasImage = Boolean( imageUrl );
	const hasTitle = !! title;
	const hasSubtitle = !! summary;
	const HeadingTag = headingTag || 'h3';
	const hasDescription = useSelect(
		( select ) => {
			const innerBlocks = select( 'core/block-editor' ).getBlocks( clientId );

			if ( ! innerBlocks || innerBlocks.length === 0 ) {
				return false;
			}

			return innerBlocks.some( ( innerBlock ) => {
				const content = innerBlock?.attributes?.content || '';
				const textContent = content.replace( /<[^>]+>/g, '' ).trim();

				return textContent.length > 0;
			} );
		},
		[ clientId ]
	);
	const hasCardContent =
		hasImage || hasTitle || hasSubtitle || hasDescription;

	const blockProps = useBlockProps( {
		className: hasCardContent
			? `principles-steps__card principles-steps__card--${ cardVariant }`
			: 'generic-result-cards-item-placeholder',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h3' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Card Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Card Background Color', 'ambrygen-web' ) }
						value={ cardVariant }
						options={ [
							{
								label: __( 'Green', 'ambrygen-web' ),
								value: 'card-bg-green',
							},
							{
								label: __( 'Pink', 'ambrygen-web' ),
								value: 'card-bg-pink',
							},
							{
								label: __( 'Yellow', 'ambrygen-web' ),
								value: 'card-bg-yellow',
							},
							{
								label: __( 'Purple', 'ambrygen-web' ),
								value: 'card-bg-purple',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { cardVariant: value } )
						}
					/>
					<ImageUploader
						label={ __( 'Icon', 'ambrygen-web' ) }
						url={ imageUrl }
						id={ imageId }
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
				{ hasImage && (
					<>
						<div className="principles-steps__card-icon">
							<img src={ imageUrl } alt={ imageAlt || '' } />
						</div>
						<div className="is-style-gl-s20" aria-hidden="true"></div>
					</>
				) }
				<div className="principles-steps__card-content">
					<RichText
						tagName={ HeadingTag }
						className="heading-5 principles-steps__card-title mb-0"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __( 'Add Card Heading...', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s8" aria-hidden="true"></div>
					<RichText
						tagName="div"
						className="body1-sbold principles-steps__card-summary"
						value={ summary }
						onChange={ ( value ) =>
							setAttributes( { summary: value } )
						}
						placeholder={ __( 'Add Card Sub Heading...', 'ambrygen-web' ) }
					/>
					<div className="is-style-gl-s16" aria-hidden="true"></div>
					<div className="principles-steps__card-description">
						<InnerBlocks
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							templateLock={ false }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
