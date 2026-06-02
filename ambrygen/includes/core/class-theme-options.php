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
			'header_popup_title'       => isset( $input['header_popup_title'] ) ? sanitize_text_field( $input['header_popup_title'] ) : '',
			'blog_disclaimer_title'    => isset( $input['blog_disclaimer_title'] ) ? sanitize_text_field( $input['blog_disclaimer_title'] ) : '',
			'blog_disclaimer_content'  => isset( $input['blog_disclaimer_content'] ) ? wp_kses_post( $input['blog_disclaimer_content'] ) : '',
			'blog_default_image_id'    => isset( $input['blog_default_image_id'] ) ? absint( $input['blog_default_image_id'] ) : 0,
		);

		$sanitized['webinar_additional_content'] = array(
			'ceu'  => $this->sanitize_additional_content_section( $input['webinar_additional_content']['ceu'] ?? array(), 'CEU' ),
			'pace' => $this->sanitize_additional_content_section( $input['webinar_additional_content']['pace'] ?? array(), 'PACE' ),
		);
		$sanitized['header_popup_items'] = $this->sanitize_header_popup_items( $input['header_popup_items'] ?? array() );

		return $sanitized;
	}

	/**
	 * Render admin page.
	 */
	public function render_options_page(): void {

		$options  = get_option( self::OPTION_KEY );
		?>

	<div class="wrap">
		<h1><?php esc_html_e( 'Theme Options', 'ambrygen-web' ); ?></h1>

		<form method="post" action="options.php">
			<?php settings_fields( 'ambrygen_theme_options_group' ); ?>

			<div class="ambrygen-theme-options-tabs" data-ambrygen-tabs>
				<div class="nav-tab-wrapper" role="tablist" aria-label="<?php esc_attr_e( 'Theme option sections', 'ambrygen-web' ); ?>">
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button nav-tab-active" data-tab-target="general" role="tab" aria-selected="true"><?php esc_html_e( 'General', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="login" role="tab" aria-selected="false"><?php esc_html_e( 'Login', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="webinar" role="tab" aria-selected="false"><?php esc_html_e( 'Webinar', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="header-popup" role="tab" aria-selected="false"><?php esc_html_e( 'Header Popup', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="blog" role="tab" aria-selected="false"><?php esc_html_e( 'Blog Settings', 'ambrygen-web' ); ?></button>
				</div>

				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="general">
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
					</table>
				</div>

				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="login" hidden>
					<table class="form-table">
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
					</table>
				</div>

				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="webinar" hidden>
					<table class="form-table">
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
				</div>

				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="header-popup" hidden>
					<table class="form-table">
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Popup Title', 'ambrygen-web' ); ?>
							</th>
							<td>
								<input
									type="text"
									class="regular-text"
									name="<?php echo esc_attr( self::OPTION_KEY ); ?>[header_popup_title]"
									value="<?php echo esc_attr( $options['header_popup_title'] ?? '' ); ?>"
								/>
								<p class="description">
									<?php esc_html_e( 'Set the title shown at the top of the header popup.', 'ambrygen-web' ); ?>
								</p>
							</td>
						</tr>

						<tr>
							<th scope="row">
								<?php esc_html_e( 'Popup Items', 'ambrygen-web' ); ?>
							</th>
							<td>
								<p class="description" style="margin-top:0;">
									<?php esc_html_e( 'Manage the popup cards shown when the user icon is clicked.', 'ambrygen-web' ); ?>
								</p>
								<?php
								$header_popup_items = $options['header_popup_items'] ?? array();
								for ( $index = 0; $index < 4; $index++ ) {
									$this->render_header_popup_item_section( $index, $header_popup_items[ $index ] ?? array() );
								}
								?>
							</td>
						</tr>
					</table>
				</div>

				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="blog" hidden>
					<table class="form-table">
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Default Image', 'ambrygen-web' ); ?>
							</th>
							<td>
								<?php $this->render_image_field( 'blog_default_image_id', $options['blog_default_image_id'] ?? 0 ); ?>
								<p class="description">
									<?php esc_html_e( 'Set a default fallback image specifically for blog posts.', 'ambrygen-web' ); ?>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Disclaimers Title', 'ambrygen-web' ); ?>
							</th>
							<td>
								<input
									type="text"
									class="regular-text"
									name="<?php echo esc_attr( self::OPTION_KEY ); ?>[blog_disclaimer_title]"
									value="<?php echo esc_attr( $options['blog_disclaimer_title'] ?? '' ); ?>"
								/>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Disclaimers Content', 'ambrygen-web' ); ?>
							</th>
							<td>
								<?php
								wp_editor(
									$options['blog_disclaimer_content'] ?? '',
									'blog_disclaimer_content',
									array(
										'textarea_name' => self::OPTION_KEY . '[blog_disclaimer_content]',
										'textarea_rows' => 10,
										'media_buttons' => false,
									)
								);
								?>
							</td>
						</tr>
					</table>
				</div>
			</div>

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
		wp_enqueue_script( 'wplink' );
		wp_enqueue_style( 'editor-buttons' );

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
	 * Get blog default fallback image ID.
	 */
	public static function get_blog_default_image_id(): int {

		$options = get_option( self::OPTION_KEY );

		return isset( $options['blog_default_image_id'] )
		? absint( $options['blog_default_image_id'] )
		: 0;
	}

	/**
	 * Get header popup settings.
	 *
	 * @return array<string, mixed>
	 */
	public static function get_header_popup_settings(): array {
		$options = get_option( self::OPTION_KEY );

		return array(
			'title' => isset( $options['header_popup_title'] ) && '' !== trim( (string) $options['header_popup_title'] )
				? sanitize_text_field( $options['header_popup_title'] )
				: '',
			'items' => self::normalize_header_popup_items( $options['header_popup_items'] ?? array() ),
		);
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
	 * Render a header popup item section.
	 *
	 * @param int   $index Item index.
	 * @param array $item  Item data.
	 */
	private function render_header_popup_item_section( int $index, array $item ): void {
		$item_title = $item['title'] ?? '';
		$image_id   = isset( $item['image_id'] ) ? absint( $item['image_id'] ) : 0;
		$link       = $item['link'] ?? '';
		$key        = self::OPTION_KEY . '[header_popup_items][' . $index . ']';
		?>
		<div class="ambrygen-mm-row" style="border:1px solid #dcdcde; padding:15px; margin:0 0 15px; background:#fff;">
			<h3 style="margin:0 0 15px;"><?php echo esc_html( sprintf( __( 'Popup Item %d', 'ambrygen-web' ), $index + 1 ) ); ?></h3>

			<div style="margin-bottom:15px;">
				<label for="<?php echo esc_attr( 'header_popup_item_' . $index . '_title' ); ?>"><strong><?php esc_html_e( 'Title', 'ambrygen-web' ); ?></strong></label>
				<input
					type="text"
					class="widefat"
					id="<?php echo esc_attr( 'header_popup_item_' . $index . '_title' ); ?>"
					name="<?php echo esc_attr( $key ); ?>[title]"
					value="<?php echo esc_attr( $item_title ); ?>"
				/>
			</div>

			<div style="margin-bottom:15px;">
				<label for="<?php echo esc_attr( 'header_popup_item_' . $index . '_link' ); ?>"><strong><?php esc_html_e( 'Link', 'ambrygen-web' ); ?></strong></label>
				<div class="ambrygen-link-picker">
					<input
						type="hidden"
						class="ambrygen-link-picker__input"
						id="<?php echo esc_attr( 'header_popup_item_' . $index . '_link' ); ?>"
						name="<?php echo esc_attr( $key ); ?>[link]"
						value="<?php echo esc_url( $link ); ?>"
					/>
					<div class="ambrygen-link-picker__value">
						<?php if ( ! empty( $link ) ) : ?>
							<a href="<?php echo esc_url( $link ); ?>" target="_blank" rel="noopener noreferrer">
								<?php echo esc_html( $link ); ?>
							</a>
						<?php else : ?>
							<span class="description"><?php esc_html_e( 'No link selected yet.', 'ambrygen-web' ); ?></span>
						<?php endif; ?>
					</div>
					<div class="ambrygen-link-picker__actions">
						<button type="button" class="button button-secondary ambrygen-link-picker__select">
							<?php esc_html_e( 'Select Link', 'ambrygen-web' ); ?>
						</button>
						<button type="button" class="button-link-delete ambrygen-link-picker__clear">
							<?php esc_html_e( 'Clear', 'ambrygen-web' ); ?>
						</button>
					</div>
				</div>
			</div>

			<div style="margin-bottom:0;">
				<label><strong><?php esc_html_e( 'Image / Icon', 'ambrygen-web' ); ?></strong></label>
				<?php $this->render_additional_content_image_field( $key, $image_id ); ?>
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
	 * Sanitize header popup items.
	 *
	 * @param array $items Popup items.
	 * @return array<int, array<string, int|string>>
	 */
	private function sanitize_header_popup_items( array $items ): array {
		$sanitized = array();

		foreach ( range( 0, 3 ) as $index ) {
			$item = isset( $items[ $index ] ) && is_array( $items[ $index ] ) ? $items[ $index ] : array();

			$sanitized[] = array(
				'title'    => isset( $item['title'] ) ? sanitize_text_field( $item['title'] ) : '',
				'link'     => isset( $item['link'] ) ? esc_url_raw( $item['link'] ) : '',
				'image_id' => isset( $item['image_id'] ) ? absint( $item['image_id'] ) : 0,
			);
		}

		return $sanitized;
	}

	/**
	 * Normalize header popup items with defaults.
	 *
	 * @param array $items Raw popup items.
	 * @return array<int, array<string, int|string>>
	 */
	private static function normalize_header_popup_items( array $items ): array {
		$normalized = array();

		foreach ( range( 0, 3 ) as $index ) {
			$item = isset( $items[ $index ] ) && is_array( $items[ $index ] ) ? $items[ $index ] : array();

			$normalized[] = array(
				'title'    => isset( $item['title'] ) && '' !== trim( (string) $item['title'] )
					? sanitize_text_field( $item['title'] )
					: '',
				'link'     => isset( $item['link'] ) && '' !== trim( (string) $item['link'] )
					? esc_url( $item['link'] )
					: '',
				'image_id' => isset( $item['image_id'] ) ? absint( $item['image_id'] ) : 0,
			);
		}

		return $normalized;
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
