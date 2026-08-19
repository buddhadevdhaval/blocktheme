<?php
/**
 * Security headers service.
 *
 * @package Ambrygen
 */


namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Manage security-related HTTP headers for theme responses.
 */
final class Security_Headers {

	use Singleton;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_action( 'send_headers', array( $this, 'add_security_headers' ) );
		add_action( 'wp', array( $this, 'set_cache_maxage' ) );
	}

	/**
	 * Add security headers via WordPress hook.
	 *
	 * @return void
	 */
	public function add_security_headers(): void {
		if ( headers_sent() ) {
			return;
		}

		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'X-XSS-Protection: 1; mode=block' );
		header( 'X-Content-Type-Options: nosniff' );
		header( 'Referrer-Policy: strict-origin-when-cross-origin' );
		header( 'Permissions-Policy: accelerometer=(), geolocation=(), microphone=(), camera=(), gyroscope=()' );
		header( 'Content-Security-Policy: upgrade-insecure-requests; block-all-mixed-content' );
		}
	
	/**
	 * Set Cache-Control headers for public pages.
	 *
	 * @return void
	 */
	public function set_cache_maxage(): void {
		if ( is_user_logged_in() || headers_sent() ) {
			return;
		}

		header( 'Cache-Control: public, max-age=' . HOUR_IN_SECONDS . ', s-maxage=' . HOUR_IN_SECONDS . ', must-revalidate', true );
	}
}
