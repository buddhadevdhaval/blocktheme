import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { ImageUploader } from '../_shared/components';
import { ServerSideRender } from '@wordpress/server-side-render';

export default function Edit( { attributes, setAttributes, context, name } ) {
	const { overlayTopImage, overlayBottomImage } = attributes;
	const blockProps = useBlockProps();
	const previewPostId = context?.postId ? Number( context.postId ) : 0;

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

			<ServerSideRender
				block={ name }
				attributes={ {
					...attributes,
					previewPostId,
				} }
			/>
		</div>
	);
}
