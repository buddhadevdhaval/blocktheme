import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes } ) {
	const { postType } = useSelect( ( select ) => ( {
		postType: select( 'core/editor' ).getCurrentPostType(),
	} ), [] );

	const blockProps = useBlockProps();

	if ( postType && postType !== 'post' ) {
		return (
			<div { ...blockProps }>
				<div className="ambrygen-block-placeholder">
					{ __( 'This block is only available for Blog Posts.', 'ambrygen-web' ) }
				</div>
			</div>
		);
	}

	const { title, subtitle } = attributes;

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Title', 'ambrygen-web' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
					<TextareaControl
						label={ __( 'Subtitle', 'ambrygen-web' ) }
						value={ subtitle }
						onChange={ ( value ) => setAttributes( { subtitle: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="sidebar-widget subscribe-card-cta">
				<div className="subscribe-card-cta__content">
					<div className="subscribe-card-cta__title heading-5 mb-0">{ title }</div>
					<div className="subscribe-card-cta__subtitle">{ subtitle }</div>
				</div>
				<div className="subscribe-card-cta__form">
					<input type="email" className="subscribe-card-cta__input" placeholder="olivia@xyz.com" readOnly />
					<button type="button" className="subscribe-card-cta__submit site-btn">{ __( 'Sign Up Now', 'ambrygen-web' ) }</button>
				</div>
			</div>
		</div>
	);
}
