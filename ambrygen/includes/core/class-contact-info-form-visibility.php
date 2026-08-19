<?php
/**
 * Global Contact Info/Form template-part visibility service.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Control visibility for the shared contact info template part.
 */
final class Contact_Info_Form_Visibility {
	use Singleton;

	private const TEMPLATE_PART_SLUG = 'contact-info-global';

	/**
	 * Constructor.
	 */
	protected function __construct() {
		$this->register_hooks();
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	private function register_hooks(): void {
		// Temporary: disable automatic global contact info injection site-wide.
		// add_filter( 'render_block_core/template-part', array( $this, 'inject_global_contact_info_template_part' ), 10, 2 );
	}

	/**
	 * Inject the global Contact Info template part before the footer template part.
	 *
	 * @param string $block_content Rendered template-part content.
	 * @param array  $block Parsed block array.
	 * @return string
	 */
	public function inject_global_contact_info_template_part( string $block_content, array $block ): string {
		if ( is_admin() || wp_is_json_request() ) {
			return $block_content;
		}

		if ( 'footer' !== ( $block['attrs']['slug'] ?? '' ) ) {
			return $block_content;
		}

		if ( $this->should_hide_for_current_request() ) {
			return $block_content;
		}

		$global_contact_info = do_blocks(
			sprintf(
				'<!-- wp:template-part {"slug":"%1$s","theme":"%2$s"} /-->',
				esc_attr( self::TEMPLATE_PART_SLUG ),
				esc_attr( get_stylesheet() )
			)
		);

		if ( '' === trim( $global_contact_info ) ) {
			return $block_content;
		}

		return $global_contact_info . $block_content;
	}

	/**
	 * Check whether the global contact-info template should be hidden.
	 *
	 * @return bool
	 */
	private function should_hide_for_current_request(): bool {
		$settings = Theme_Options::get_contact_info_visibility_settings();

		if ( is_singular() ) {
			$post_id   = get_queried_object_id();
			$post_type = get_post_type( $post_id );

			if ( $post_id > 0 && 'page' === $post_type ) {
				$hide_for_page = get_post_meta( $post_id, '_ambrygen_hide_contact_info', true );

				if ( rest_sanitize_boolean( $hide_for_page ) ) {
					return true;
				}
			}

			if ( $post_type && in_array( $post_type, $settings['hidden_post_types'], true ) ) {
				return true;
			}
		} elseif ( is_post_type_archive() ) {
			$post_type = get_query_var( 'post_type' );

			if ( is_array( $post_type ) ) {
				$post_type = reset( $post_type );
			}

			if ( is_string( $post_type ) && in_array( $post_type, $settings['hidden_post_types'], true ) ) {
				return true;
			}
		}

		return false;
	}
}
