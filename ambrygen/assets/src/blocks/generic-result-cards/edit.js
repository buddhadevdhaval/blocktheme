import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BlockExamplePreview, TagSelector } from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const ALLOWED_BLOCKS = [ 'ambrygen/generic-result-cards-item' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, eyebrowText, heading, headingTag, subtitle, footContent } =
		attributes;
	const innerBlockCount = useSelect(
		( select ) => select( 'core/block-editor' ).getBlockCount( clientId ),
		[ clientId ]
	);
	const isExample = blockId === 'generic-result-cards-example';

	useUniqueBlockId( {
		blockId,
		clientId,
		enabled: ! isExample,
		setAttributes,
	} );

	const HeadingTag = headingTag || 'h2';
	const blockProps = useBlockProps( {
		className: 'card-result-block block-layout',
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="generic-result-cards-example-preview"
				imagePath="/assets/src/images/generic-result-cards/preview.png"
			/>
		);
	}

	const gridClassName =
		innerBlockCount >= 4
			? 'principles-steps__grid col-4'
			: 'principles-steps__grid';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
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
			</InspectorControls>
			<div { ...blockProps }>
				<div className="principles-steps">
					<div className="principles-steps__header text-center">
						<RichText
							tagName="div"
							className="overline-text principles-steps__eyebrow hero-kicker"
							value={ eyebrowText }
							onChange={ ( value ) =>
								setAttributes( { eyebrowText: value } )
							}
							placeholder={ __(
								'Add Eyebrow Text…',
								'ambrygen-web'
							) }
						/>
						<div
							className="is-style-gl-s12"
							aria-hidden="true"
						></div>
						<RichText
							tagName={ HeadingTag }
							className="heading-4 block-title mb-0 principles-steps__title"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
						/>
						<div
							className="is-style-gl-s12"
							aria-hidden="true"
						></div>
						<RichText
							tagName="div"
							className="block-description body1 principles-steps__subtitle"
							value={ subtitle }
							onChange={ ( value ) =>
								setAttributes( { subtitle: value } )
							}
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
						/>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<div className={ gridClassName }>
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ [
								[ 'ambrygen/generic-result-cards-item' ],
								[ 'ambrygen/generic-result-cards-item' ],
								[ 'ambrygen/generic-result-cards-item' ],
							] }
							templateLock={ false }
						/>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<RichText
						tagName="p"
						className="foot-content text-center"
						value={ footContent }
						onChange={ ( value ) =>
							setAttributes( { footContent: value } )
						}
						placeholder={ __(
							'Bottom Description',
							'ambrygen-web'
						) }
					/>
				</div>
			</div>
		</>
	);
}
