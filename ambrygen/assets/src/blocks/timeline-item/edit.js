import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ImagePlaceholder, ImageUploader } from '../_shared/components';

const TEMPLATE = [ [ 'core/list' ] ];

export default function Edit( { attributes, setAttributes } ) {
	const { title, intro, imageUrl, imageAlt } = attributes;
	const blockProps = useBlockProps( {
		className: 'timeline-block__item',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Timeline Item Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<ImageUploader
						label={ __( 'Item Image', 'ambrygen-web' ) }
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
				<div className="timeline-block__badge-col">
					<div className="timeline-block__badge"></div>
				</div>

				<div className="timeline-block__content-card">
					<div className="timeline-block__image">
						{ imageUrl ? (
							<img src={ imageUrl } alt={ imageAlt || '' } />
						) : (
							<ImagePlaceholder />
						) }
					</div>

					<div className="timeline-block__text-content">
						<RichText
							tagName="h3"
							className="subtitle1-sbold mb-0 timeline-block__text-title"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __(
								'Add Title...',
								'ambrygen-web'
							) }
						/>

						<div className="is-style-gl-s12" aria-hidden="true"></div>

						<RichText
							tagName="div"
							className="text-md-regular timeline-block__intro"
							value={ intro }
							onChange={ ( value ) =>
								setAttributes( { intro: value } )
							}
							placeholder={ __(
								'Add Intro...',
								'ambrygen-web'
							) }
						/>

						<div className="is-style-gl-s12" aria-hidden="true"></div>

						<InnerBlocks
							allowedBlocks={ [
								'core/paragraph',
								'core/list',
								'core/button',
								'core/buttons',
								'core/spacer',
							] }
							template={ TEMPLATE }
							templateLock={ false }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
