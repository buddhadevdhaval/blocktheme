<?php
/**
 * Canonical URL service.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Render canonical tags for selected custom single routes.
 */
final class Canonical_Service {

	use Singleton;

	/**
	 * Post types that should always print a canonical tag.
	 *
	 * @var array<int, string>
	 */
	private const SUPPORTED_POST_TYPES = array(
		'press-releases',
		'post',
		'conferences',
		'poster',
		'publication',
	);

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_action( 'wp', array( $this, 'replace_core_canonical' ) );
		add_action( 'template_redirect', array( $this, 'redirect_to_canonical_permalink' ), 1 );
		add_action( 'wp_head', array( $this, 'render_canonical' ), 5 );
	}

	/**
	 * Remove the default canonical output for targeted single routes.
	 *
	 * @return void
	 */
	public function replace_core_canonical(): void {
		if ( ! $this->should_render_canonical() ) {
			return;
		}

		remove_action( 'wp_head', 'rel_canonical' );
	}

	/**
	 * Print a canonical tag for the current single post.
	 *
	 * @return void
	 */
	public function render_canonical(): void {
		if ( ! $this->should_render_canonical() ) {
			return;
		}

		$post_id = get_queried_object_id();
		if ( $post_id <= 0 ) {
			return;
		}

		$canonical_url = get_permalink( $post_id );
		if ( ! is_string( $canonical_url ) || '' === $canonical_url ) {
			return;
		}

		printf(
			"<link rel=\"canonical\" href=\"%s\" />\n",
			esc_url( $canonical_url )
		);
	}

	/**
	 * Redirect supported single routes to the exact canonical permalink.
	 *
	 * @return void
	 */
	public function redirect_to_canonical_permalink(): void {
		if ( is_admin() || ! $this->should_render_canonical() ) {
			return;
		}

		$post_id = get_queried_object_id();
		if ( $post_id <= 0 ) {
			return;
		}

		$canonical_url = get_permalink( $post_id );
		if ( ! is_string( $canonical_url ) || '' === $canonical_url ) {
			return;
		}

		$requested_path = wp_parse_url( (string) wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
		$canonical_path = wp_parse_url( $canonical_url, PHP_URL_PATH );

		if ( ! is_string( $requested_path ) || ! is_string( $canonical_path ) ) {
			return;
		}

		if ( $requested_path === $canonical_path ) {
			return;
		}

		wp_safe_redirect( $canonical_url, 301 );
		exit;
	}

	/**
	 * Determine whether the current request needs a canonical tag.
	 *
	 * @return bool
	 */
	private function should_render_canonical(): bool {
		if ( ! is_singular() ) {
			return false;
		}

		return is_singular( self::SUPPORTED_POST_TYPES );
	}
}
