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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	/**
	 * Add Theme Options page.
	 */
	public function add_options_page(): void {

		add_theme_page(
			__( 'Theme Options', 'ambrygen-web' ),
			__( 'Theme Options', 'ambrygen-web' ),
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
		$sanitized = array(
			'placeholder_image_id' => isset( $input['placeholder_image_id'] ) ? absint( $input['placeholder_image_id'] ) : 0,
			'login_logo_id'        => isset( $input['login_logo_id'] ) ? absint( $input['login_logo_id'] ) : 0,
			'webinar_main_title'   => isset( $input['webinar_main_title'] ) ? sanitize_text_field( $input['webinar_main_title'] ) : '',
		);

		$sanitized['webinar_additional_content'] = array(
			'ceu'  => $this->sanitize_additional_content_section( $input['webinar_additional_content']['ceu'] ?? array(), 'CEU' ),
			'pace' => $this->sanitize_additional_content_section( $input['webinar_additional_content']['pace'] ?? array(), 'PACE' ),
		);

		return $sanitized;
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
		<h1><?php esc_html_e( 'Theme Options', 'ambrygen-web' ); ?></h1>

		<form method="post" action="options.php">
			<?php settings_fields( 'ambrygen_theme_options_group' ); ?>

			<table class="form-table">
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Placeholder Image', 'ambrygen-web' ); ?>
					</th>
					<td>
						<?php $this->render_image_field( 'placeholder_image_id', $options['placeholder_image_id'] ?? 0 ); ?>
						<p class="description">
							<?php esc_html_e( 'Set a global fallback image.', 'ambrygen-web' ); ?>
						</p>
					</td>
				</tr>

				<tr>
					<th scope="row" colspan="2" style="padding:0;">
						<hr />
						<h2><?php esc_html_e( 'Login Settings', 'ambrygen-web' ); ?></h2>
					</th>
				</tr>

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Login Logo', 'ambrygen-web' ); ?>
					</th>
					<td>
						<?php $this->render_image_field( 'login_logo_id', $options['login_logo_id'] ?? 0 ); ?>
						<p class="description">
							<?php esc_html_e( 'Set a custom logo for the WordPress login page.', 'ambrygen-web' ); ?>
						</p>
					</td>
				</tr>

				<tr>
					<th scope="row" colspan="2" style="padding:0;">
						<hr />
						<h2><?php esc_html_e( 'Webinar Settings', 'ambrygen-web' ); ?></h2>
					</th>
				</tr>

				<tr>
					<th scope="row">
						<?php esc_html_e( 'CEU / PACE Additional Vertical Content', 'ambrygen-web' ); ?>
					</th>
					<td>
						<p class="description" style="margin-top:0;">
							<?php esc_html_e( 'These sections are shown on webinars when the CEU or PACE checkbox is enabled.', 'ambrygen-web' ); ?>
						</p>
						<?php
						$additional_content = $options['webinar_additional_content'] ?? array();
						$this->render_additional_content_section( 'ceu', __( 'CEU', 'ambrygen-web' ), $additional_content['ceu'] ?? array() );
						$this->render_additional_content_section( 'pace', __( 'PACE', 'ambrygen-web' ), $additional_content['pace'] ?? array() );
						?>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
	</div>

		<?php
	}

	/**
	 * Enqueue assets required by the theme options screen.
	 *
	 * @param string $hook_suffix Current admin page hook.
	 */
	public function enqueue_admin_assets( string $hook_suffix ): void {
		if ( 'appearance_page_ambrygen-theme-options' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_media();

		if ( function_exists( 'wp_enqueue_editor' ) ) {
			wp_enqueue_editor();
		}
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

	/**
	 * Get login logo image ID.
	 */
	public static function get_login_logo_id(): int {

		$options = get_option( self::OPTION_KEY );

		return isset( $options['login_logo_id'] )
		? absint( $options['login_logo_id'] )
		: 0;
	}

	/**
	 * Render a repeater row.
	 *
	 * @param string $slug Section slug.
	 * @param string $label Section label.
	 * @param array  $section Section data.
	 */
	private function render_additional_content_section( string $slug, string $label, array $section ): void {
		$title     = $section['title'] ?? $label;
		$image_id  = isset( $section['image_id'] ) ? absint( $section['image_id'] ) : 0;
		$desc      = $section['desc'] ?? '';
		$key       = self::OPTION_KEY . '[webinar_additional_content][' . $slug . ']';
		$editor_id = 'webinar_additional_content_' . $slug . '_desc';
		?>
		<div class="ambrygen-mm-row" style="border:1px solid #dcdcde; padding:15px; margin:0 0 15px; background:#fff;">
			<h3 style="margin:0 0 15px;"><?php echo esc_html( $label ); ?></h3>

			<div style="margin-bottom:15px;">
				<label for="<?php echo esc_attr( $editor_id . '_title' ); ?>"><strong><?php esc_html_e( 'Title', 'ambrygen-web' ); ?></strong></label>
				<input
					type="text"
					class="widefat"
					id="<?php echo esc_attr( $editor_id . '_title' ); ?>"
					name="<?php echo esc_attr( $key ); ?>[title]"
					value="<?php echo esc_attr( $title ); ?>"
				/>
			</div>

			<div style="margin-bottom:15px;">
				<label><strong><?php esc_html_e( 'Image', 'ambrygen-web' ); ?></strong></label>
				<?php $this->render_additional_content_image_field( $key, $image_id ); ?>
			</div>

			<div style="margin-bottom:0;">
				<label><strong><?php esc_html_e( 'Description', 'ambrygen-web' ); ?></strong></label>
				<?php
				wp_editor(
					$desc,
					$editor_id,
					array(
						'textarea_name' => "{$key}[desc]",
						'textarea_rows' => 6,
						'media_buttons' => false,
						'textarea_class' => 'ambrygen-wysiwyg-textarea',
					)
				);
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Render an image field for webinar additional content.
	 *
	 * @param string $key      Option key prefix.
	 * @param int    $image_id Image ID.
	 */
	private function render_additional_content_image_field( string $key, int $image_id ): void {
		$image = $image_id ? wp_get_attachment_image_url( $image_id, 'medium' ) : '';
		?>
		<div class="ambrygen-theme-option-image-field" style="margin-top:10px;">
			<div class="image-preview" style="margin-bottom:10px;">
				<?php if ( $image ) : ?>
					<img src="<?php echo esc_url( $image ); ?>" style="max-width:100px; display:block;" />
				<?php endif; ?>
			</div>

			<input type="hidden"
				class="image-id"
				name="<?php echo esc_attr( $key ); ?>[image_id]"
				value="<?php echo esc_attr( $image_id ); ?>"
			/>

			<button type="button" class="button button-small upload-button">
				<?php esc_html_e( 'Select Image', 'ambrygen-web' ); ?>
			</button>

			<button type="button" class="button button-small remove-button">
				<?php esc_html_e( 'Remove', 'ambrygen-web' ); ?>
			</button>
		</div>
		<?php
	}

	/**
	 * Sanitize a webinar additional content section.
	 *
	 * @param array  $section Section input.
	 * @param string $default_title Default title.
	 * @return array<string, int|string>
	 */
	private function sanitize_additional_content_section( array $section, string $default_title ): array {
		return array(
			'title'    => isset( $section['title'] ) && '' !== trim( (string) $section['title'] )
				? sanitize_text_field( $section['title'] )
				: $default_title,
			'image_id' => isset( $section['image_id'] ) ? absint( $section['image_id'] ) : 0,
			'desc'     => isset( $section['desc'] ) ? wp_kses_post( $section['desc'] ) : '',
		);
	}

	/**
	 * Render an image upload field.
	 *
	 * @param string $key      Option key.
	 * @param int    $image_id Current image ID.
	 */
	private function render_image_field( string $key, int $image_id ): void {
		$image = $image_id ? wp_get_attachment_image_url( $image_id, 'medium' ) : '';
		?>
		<div class="ambrygen-theme-option-image-field">
			<div class="image-preview" style="margin-bottom:10px;">
				<?php if ( $image ) : ?>
					<img src="<?php echo esc_url( $image ); ?>" style="max-width:150px; display:block;" />
				<?php endif; ?>
			</div>

			<input type="hidden"
				class="image-id"
				name="<?php echo esc_attr( self::OPTION_KEY ); ?>[<?php echo esc_attr( $key ); ?>]"
				value="<?php echo esc_attr( $image_id ); ?>"
			/>

			<button type="button" class="button upload-button">
				<?php esc_html_e( 'Select Image', 'ambrygen-web' ); ?>
			</button>

			<button type="button" class="button remove-button">
				<?php esc_html_e( 'Remove', 'ambrygen-web' ); ?>
			</button>
		</div>
		<?php
	}
}
