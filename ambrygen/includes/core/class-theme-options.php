<?php
/**
 * Theme Options.
 *
 * Handles global theme settings like placeholder image.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

final class Theme_Options {

	use Singleton;

	/**
	 * Option key.
	 */
	private const OPTION_KEY = 'ambrygen_theme_options';

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Add Theme Options page.
	 */
	public function add_options_page(): void {

		add_theme_page(
			__( 'Theme Options', AMBRYGEN_TEXT_DOMAIN ),
			__( 'Theme Options', AMBRYGEN_TEXT_DOMAIN ),
			'manage_options',
			'ambrygen-theme-options',
			array( $this, 'render_options_page' )
		);
	}

	/**
	 * Register settings.
	 */
	public function register_settings(): void {

		register_setting(
			'ambrygen_theme_options_group',
			self::OPTION_KEY,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize_options' ),
				'default'           => array(),
			)
		);
	}

	/**
	 * Sanitize options.
	 */
    public function sanitize_options( array $input ): array {
        return array(
            'placeholder_image_id' => isset( $input['placeholder_image_id'] )
                ? absint( $input['placeholder_image_id'] )
                : 0,
        );
    }

	/**
	 * Render admin page.
	 */
	public function render_options_page(): void {

	$options  = get_option( self::OPTION_KEY );
	$image_id = $options['placeholder_image_id'] ?? 0;
	$image    = $image_id ? wp_get_attachment_image_url( $image_id, 'medium' ) : '';
	?>

	<div class="wrap">
		<h1><?php esc_html_e( 'Theme Options', AMBRYGEN_TEXT_DOMAIN ); ?></h1>

		<form method="post" action="options.php">
			<?php settings_fields( 'ambrygen_theme_options_group' ); ?>

			<table class="form-table">
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Placeholder Image', AMBRYGEN_TEXT_DOMAIN ); ?>
					</th>
					<td>
						<div id="ambrygen-placeholder-wrapper">
							<?php if ( $image ) : ?>
								<img src="<?php echo esc_url( $image ); ?>" style="max-width:150px; display:block; margin-bottom:10px;" />
							<?php endif; ?>
						</div>

						<input type="hidden"
							id="ambrygen-placeholder-image-id"
							name="<?php echo esc_attr( self::OPTION_KEY ); ?>[placeholder_image_id]"
							value="<?php echo esc_attr( $image_id ); ?>"
						/>

						<button type="button" class="button" id="ambrygen-upload-button">
							<?php esc_html_e( 'Select Image', AMBRYGEN_TEXT_DOMAIN ); ?>
						</button>

						<button type="button" class="button" id="ambrygen-remove-button">
							<?php esc_html_e( 'Remove', AMBRYGEN_TEXT_DOMAIN ); ?>
						</button>

						<p class="description">
							<?php esc_html_e( 'Set a global fallback image.', AMBRYGEN_TEXT_DOMAIN ); ?>
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
	</div>

	<?php
}

	/**
	 * Get placeholder image URL.
	 */
	public static function get_placeholder_image(): string {

		$options = get_option( self::OPTION_KEY );

		if ( ! empty( $options['placeholder_image'] ) ) {
			return esc_url( $options['placeholder_image'] );
		}

		return defined( 'AMBRYGEN_DEFAULT_IMAGE' )
			? AMBRYGEN_DEFAULT_IMAGE
			: '';
	}
    public static function get_placeholder_image_id(): int {

	$options = get_option( self::OPTION_KEY );

	return isset( $options['placeholder_image_id'] )
		? absint( $options['placeholder_image_id'] )
		: 0;
}
}