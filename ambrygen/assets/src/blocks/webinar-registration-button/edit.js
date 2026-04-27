import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { newTab } = attributes;

	const registrationLink = useSelect( ( select ) => {
		const meta = select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {};
		return meta.registration_link || '';
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Button Settings', 'ambrygen-web' ) }>
					<ToggleControl
						label={ __( 'Open in new tab', 'ambrygen-web' ) }
						checked={ newTab }
						onChange={ ( val ) => setAttributes( { newTab: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="banner-btn">
					<a
						className="site-btn has-right-arrow"
						href="#"
						onClick={ ( e ) => e.preventDefault() }
						title={ __( 'Register Now', 'ambrygen-web' ) }
					>
						{ __( 'Register Now', 'ambrygen-web' ) }
						{ ! registrationLink && (
							<span style={ { fontSize: '10px', display: 'block', opacity: 0.6 } }>
								{ __( '(Enter registration link in Post Meta)', 'ambrygen-web' ) }
							</span>
						) }
					</a>
				</div>
			</div>
		</>
	);
}
