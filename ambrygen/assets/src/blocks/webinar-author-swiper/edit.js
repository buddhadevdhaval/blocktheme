import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { ImageUploader } from '../_shared/components';

export default function Edit( { attributes, setAttributes } ) {
	const { overlayTopImage, overlayBottomImage } = attributes;
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Decorative Graphics', 'ambrygen-web' ) }>
					<ImageUploader
						url={ overlayTopImage }
						onSelect={ ( img ) =>
							setAttributes( {
								overlayTopImage: img.url,
								overlayTopImageId: img.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								overlayTopImage: '',
								overlayTopImageId: 0,
							} )
						}
						label={ __( 'Top-Left Graphic', 'ambrygen-web' ) }
					/>
					<ImageUploader
						url={ overlayBottomImage }
						onSelect={ ( img ) =>
							setAttributes( {
								overlayBottomImage: img.url,
								overlayBottomImageId: img.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								overlayBottomImage: '',
								overlayBottomImageId: 0,
							} )
						}
						label={ __( 'Bottom-Right Graphic', 'ambrygen-web' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div className="wp-block-group author-slider-block container-1280">
				<div style={ { padding: '50px', textAlign: 'center', border: '1px dashed #ccc' } }>
					<h3 className="heading-5">{ __( 'Webinar Author Slider', 'ambrygen-web' ) }</h3>
					<p className="body1-reg">{ __( 'Authors selected in the post meta will appear here as a slider on the frontend.', 'ambrygen-web' ) }</p>
				</div>
			</div>
		</div>
	);
}
