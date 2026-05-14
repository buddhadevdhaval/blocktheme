import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BlockExamplePreview, TagSelector } from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const TEMPLATE = [ [ 'ambrygen/timeline-item' ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { anchor, blockId, title, description, headingTag } = attributes;
	const isExample = blockId === 'example-block-preview';
	const HeadingTag = headingTag || 'h2';
	const blockProps = useBlockProps( {
		className: 'block-layout timeline-block',
		id: isExample ? undefined : anchor || blockId || undefined,
	} );

	useUniqueBlockId( {
		blockId,
		clientId,
		enabled: ! isExample && ! anchor,
		idPrefix: 'section',
		setAttributes,
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="example-block-preview"
				imagePath="/assets/src/images/timeline/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ HeadingTag }
						type="heading"
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="timeline-block__header">
					<RichText
						tagName={ HeadingTag }
						className="heading-3 block-title mb-0"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __(
							'Add Heading...',
							'ambrygen-web'
						) }
					/>
					<div className="is-style-gl-s24" aria-hidden="true"></div>
					<RichText
						tagName="div"
						className="text-md-regular block-description"
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

				<div className="is-style-gl-s24" aria-hidden="true"></div>

				<div className="timeline-block__items">
					<InnerBlocks
						allowedBlocks={ [ 'ambrygen/timeline-item' ] }
						template={ TEMPLATE }
						templateLock={ false }
						renderAppender={ InnerBlocks.ButtonBlockAppender }
					/>
				</div>
			</div>
		</>
	);
}
