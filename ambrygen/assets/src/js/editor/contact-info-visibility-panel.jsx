import { useDispatch, useSelect } from '@wordpress/data';
import { CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const PANEL_NAME = 'ambrygen-contact-info-visibility-panel';
const META_KEY = '_ambrygen_hide_contact_info';
const { PluginDocumentSettingPanel } = window?.wp?.editPost || {};

function ContactInfoVisibilityPanel() {
	const { editPost } = useDispatch( 'core/editor' );

	const { postType, meta } = useSelect( ( select ) => {
		const editorStore = select( 'core/editor' );

		return {
			postType: editorStore?.getCurrentPostType?.() || null,
			meta: editorStore?.getEditedPostAttribute?.( 'meta' ) || {},
		};
	}, [] );

	if ( 'page' !== postType || ! PluginDocumentSettingPanel ) {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name={ PANEL_NAME }
			title={ __( 'Contact Info', 'ambrygen-web' ) }
			className="ambrygen-contact-info-visibility-panel"
		>
			<CheckboxControl
				label={ __(
					'Hide contact info block on this page',
					'ambrygen-web'
				) }
				help={ __(
					'This only affects the current page. Theme Options can still hide the block globally for other pages or post types.',
					'ambrygen-web'
				) }
				checked={ Boolean( meta?.[ META_KEY ] ) }
				onChange={ ( value ) =>
					editPost( {
						meta: {
							...meta,
							[ META_KEY ]: value,
						},
					} )
				}
			/>
		</PluginDocumentSettingPanel>
	);
}

if ( window?.wp?.plugins?.registerPlugin ) {
	window?.wp?.plugins?.registerPlugin?.( 'ambrygen-contact-info-visibility', {
		render: ContactInfoVisibilityPanel,
	} );
}
