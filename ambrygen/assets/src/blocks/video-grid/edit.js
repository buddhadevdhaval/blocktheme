import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	InnerBlocks,
	BlockContextProvider,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import {
	BlockExamplePreview,
	TagSelector,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const ALLOWED_BLOCKS = [ 'ambrygen/video-grid-item' ];
const TEMPLATE = [
	[ 'ambrygen/video-grid-item' ],
	[ 'ambrygen/video-grid-item' ],
];

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
} ) {
	const {
		blockId,
		subheading = '',
		headingTag = 'h2',
		subDescription = '',
		variation = 'variation-features',
	} = attributes;
	const HeadingTag = headingTag || 'h2';

	const hasContent = ( value ) =>
		value?.replace( /<[^>]+>/g, '' ).trim().length > 0;
	const isExample = blockId === 'video-grid-example';

	const innerBlocksCount = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlocks( clientId ).length,
		[ clientId ]
	);

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
	} );

	useEffect( () => {
		if ( variation !== 'variation-features' ) {
			setAttributes( {
				variation: 'variation-features',
			} );
		}
	}, [ variation, setAttributes ] );

	const layoutClass = 'variation-team';

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="video-grid-example-preview"
				imagePath="/assets/src/images/video-grid/preview.png"
			/>
		);
	}

	const blockProps = useBlockProps( {
		className: `image-grid-block video-grid wp-block-ambrygen-gallery block-${ variation } ${ layoutClass } grid-column${
			innerBlocksCount >= 3 ? 3 : 2
		}`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						type="heading"
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="two-column-videos">
					<div className="two-column-videos__subheading">
						<RichText
							tagName={ HeadingTag }
							className="heading-4 block-title mb-0"
							value={ subheading }
							onChange={ ( value ) =>
								setAttributes( {
									subheading: value,
								} )
							}
							placeholder={ __(
								'Add Heading...',
								'ambrygen-web'
							) }
						/>
						<div
							className="is-style-gl-s16"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="body1-reg two-column-videos__subheading-description"
							value={ subDescription }
							onChange={ ( value ) =>
								setAttributes( {
									subDescription: value,
								} )
							}
							placeholder={ __(
								'Add Description...',
								'ambrygen-web'
							) }
						/>
					</div>

					<div
						className="is-style-gl-s50"
						aria-hidden="true"
					></div>

					<div className="videos__cards">
						<BlockContextProvider
							value={ {
								'ambrygen/videoGridVariation': variation,
							} }
						>
							<InnerBlocks
								allowedBlocks={ ALLOWED_BLOCKS }
								template={ TEMPLATE }
								templateLock={ false }
								renderAppender={ false }
							/>
						</BlockContextProvider>
					</div>
				</div>
			</section>
		</>
	);
}
