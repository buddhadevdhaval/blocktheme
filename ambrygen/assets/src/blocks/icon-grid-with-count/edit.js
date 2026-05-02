import {
	InnerBlocks,
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { TagSelector, CtaButtonField, BlockExamplePreview } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const { heading, headingTag, description, link, blockId } = attributes;

	if ( blockId === 'icon-grid-with-count-example' ) {
		return (
			<BlockExamplePreview
				imagePath="/assets/src/images/icon-grid/variation2.png"
			/>
		);
	}

	const blockProps = useBlockProps( {
		className: 'our-testing-menu',
		id: blockId,
	} );

	const TEMPLATE = [
		[ 'ambrygen/icon-grids-item', {} ],
	];

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Link Settings', 'ambrygen-web' ) }>
					<CtaButtonField
						label={ __( 'Link setting', 'ambrygen-web' ) }
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
			<div className="our-testing-menu__header block__rowflex">
				<RichText
					tagName={ headingTag || 'h2' }
					className="block-title block__rowflex--heading-title heading-3 mb-0"
					value={ heading }
					onChange={ ( value ) =>
						setAttributes( { heading: value } )
					}
					placeholder="Add Title..."
				/>

				<div className="block__rowflex--block-content subtitle1-reg">
					<RichText
						tagName="p"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder="Add Description..."
					/>

					<div className="block_rowflex-link">
						{ link?.url && link?.text && (
							<a
								href={ link.url }
								target={ link.target || undefined }
								rel={ link.rel || undefined }
								className="site-btn is-style-site-text-btn has-right-arrow"
								onClick={ ( e ) => e.preventDefault() }
							>
								{ link.text }
								{ link.target === '_blank' && (
									<span className="screen-reader-text">
										{ __(
											'(opens in new tab)',
											'ambrygen-web'
										) }
									</span>
								) }
							</a>
						) }
					</div>
				</div>
				<div className="is-style-gl-s50" aria-hidden="true"></div>
			</div>

			<div className="our-testing-menu__grid">
				<InnerBlocks
					allowedBlocks={ [ 'ambrygen/icon-grids-item' ] }
					template={ TEMPLATE }
					templateLock={ false }
				/>
			</div>
		</div>
	);
}

