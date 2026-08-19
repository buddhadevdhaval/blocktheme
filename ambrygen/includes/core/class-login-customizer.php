<?php
/**
 * Login Customizer.
 *
 * Handles customization of the WordPress login page.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Customize the WordPress login screen branding.
 */
final class Login_Customizer {

	use Singleton;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_action( 'login_enqueue_scripts', array( $this, 'custom_login_logo' ) );
		add_filter( 'login_headerurl', array( $this, 'custom_login_url' ) );
		add_filter( 'login_headertext', array( $this, 'custom_login_title' ) );
	}

	/**
	 * Inject custom CSS for the login logo.
	 */
	public function custom_login_logo(): void {
		$logo_id = Theme_Options::get_login_logo_id();

		if ( ! $logo_id ) {
			return;
		}

		$logo_url = wp_get_attachment_image_url( $logo_id, 'full' );

		if ( ! $logo_url ) {
			return;
		}

		// Get original dimensions to scale properly
		$meta   = wp_get_attachment_metadata( $logo_id );
		$width  = $meta['width'] ?? 320;
		$height = $meta['height'] ?? 80;

		// Limit max width but maintain aspect ratio
		$display_width  = min( $width, 320 );
		$display_height = ( $display_width / $width ) * $height;

		?>
		<style type="text/css">
			#login h1 a, .login h1 a {
				background-image: url(<?php echo esc_url( $logo_url ); ?>);
				height: <?php echo absint( $display_height ); ?>px;
				width: <?php echo absint( $display_width ); ?>px;
				background-size: contain;
				background-position: center bottom;
				background-repeat: no-repeat;
				padding-bottom: 30px;
				margin: 0 auto;
			}
		</style>
		<?php
	}

	/**
	 * Change login logo URL to site home page.
	 */
	public function custom_login_url(): string {
		return home_url();
	}

	/**
	 * Change login logo alt text to site name.
	 */
	public function custom_login_title(): string {
		return get_bloginfo( 'name' );
	}
}
