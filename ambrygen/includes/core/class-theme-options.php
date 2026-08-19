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

/**
 * Manage global theme option settings and admin UI.
 */
final class Theme_Options {

	use Singleton;

	/**
	 * Option key.
	 */
	private const OPTION_KEY                       = 'ambrygen_theme_options';
	private const CONTACT_INFO_EXCLUDED_POST_TYPES = array(
		'marketing_material',
		'top_bar_message',
		'author',
		'jobs',
		'event',
		'product_version',
	);

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'wp_head', array( $this, 'render_header_scripts' ), 999 );
		add_action( 'wp_footer', array( $this, 'render_footer_scripts' ), 999 );
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
	 *
	 * @param array $input Raw option input.
	 * @return array
	 */
	public function sanitize_options( array $input ): array {
		$sanitized = array(
			'placeholder_image_id'           => isset( $input['placeholder_image_id'] ) ? absint( $input['placeholder_image_id'] ) : 0,
			'login_logo_id'                  => isset( $input['login_logo_id'] ) ? absint( $input['login_logo_id'] ) : 0,
			'webinar_main_title'             => isset( $input['webinar_main_title'] ) ? sanitize_text_field( $input['webinar_main_title'] ) : '',
			'header_popup_title'             => isset( $input['header_popup_title'] ) ? sanitize_text_field( $input['header_popup_title'] ) : '',
			'blog_disclaimer_title'          => isset( $input['blog_disclaimer_title'] ) ? sanitize_text_field( $input['blog_disclaimer_title'] ) : '',
			'blog_disclaimer_content'        => isset( $input['blog_disclaimer_content'] ) ? wp_kses_post( $input['blog_disclaimer_content'] ) : '',
			'blog_default_image_id'          => isset( $input['blog_default_image_id'] ) ? absint( $input['blog_default_image_id'] ) : 0,
			'contact_info_hidden_post_types' => $this->sanitize_contact_info_hidden_post_types( $input['contact_info_hidden_post_types'] ?? array() ),
			'google_analytics_script'        => $this->sanitize_script_snippet( $input['google_analytics_script'] ?? '' ),
			'onetrust_script'                => $this->sanitize_script_snippet( $input['onetrust_script'] ?? '' ),
			'custom_header_script'           => $this->sanitize_script_snippet( $input['custom_header_script'] ?? '' ),
			'custom_footer_script'           => $this->sanitize_script_snippet( $input['custom_footer_script'] ?? '' ),

		);

		$sanitized['webinar_additional_content'] = array(
			'ceu'  => $this->sanitize_additional_content_section( $input['webinar_additional_content']['ceu'] ?? array(), 'CEU' ),
			'pace' => $this->sanitize_additional_content_section( $input['webinar_additional_content']['pace'] ?? array(), 'PACE' ),
		);
		$sanitized['event_empty_states']         = array(
			'upcoming' => $this->sanitize_event_empty_state_section(
				$input['event_empty_states']['upcoming'] ?? array(),
				__( "We're still working on it", 'ambrygen-web' ),
				__( 'No registered posters or presentations yet.', 'ambrygen-web' )
			),
			'past'     => $this->sanitize_event_empty_state_section(
				$input['event_empty_states']['past'] ?? array(),
				__( "We're still working on it", 'ambrygen-web' ),
				__( 'No registered posters or presentations yet.', 'ambrygen-web' )
			),
		);
		$sanitized['header_popup_items']         = $this->sanitize_header_popup_items( $input['header_popup_items'] ?? array() );

		return $sanitized;
	}

	/**
	 * Render admin page.
	 */
	public function render_options_page(): void {

		$options = get_option( self::OPTION_KEY );
		$users   = get_users(
			array(
				'orderby' => 'login',
				'order'   => 'ASC',
				'fields'  => array( 'ID', 'user_login', 'display_name' ),
			)
		);
		?>

	<div class="wrap">
		<h1><?php esc_html_e( 'Theme Options', 'ambrygen-web' ); ?></h1>
		<?php $this->render_username_update_notice(); ?>

		<form method="post" action="options.php">
			<?php settings_fields( 'ambrygen_theme_options_group' ); ?>

			<div class="ambrygen-theme-options-tabs" data-ambrygen-tabs>
				<div class="nav-tab-wrapper" role="tablist" aria-label="<?php esc_attr_e( 'Theme option sections', 'ambrygen-web' ); ?>">
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button nav-tab-active" data-tab-target="general" role="tab" aria-selected="true"><?php esc_html_e( 'General', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="login" role="tab" aria-selected="false"><?php esc_html_e( 'Login', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="webinar" role="tab" aria-selected="false"><?php esc_html_e( 'Webinar', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="header-popup" role="tab" aria-selected="false"><?php esc_html_e( 'Header Popup', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="blog" role="tab" aria-selected="false"><?php esc_html_e( 'Blog Settings', 'ambrygen-web' ); ?></button>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="event" role="tab" aria-selected="false"><?php esc_html_e( 'Event Settings', 'ambrygen-web' ); ?></button>
					<?php
					/*
					Temporary: hide Contact Info theme option tab.
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="contact-info" role="tab" aria-selected="false"><?php esc_html_e( 'Contact Info', 'ambrygen-web' ); ?></button>
					*/
					?>
					<button type="button" class="nav-tab ambrygen-theme-options-tabs__button" data-tab-target="scripts" role="tab" aria-selected="false"><?php esc_html_e( 'Scripts', 'ambrygen-web' ); ?></button>
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
				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="scripts" hidden>
					<p class="description" style="margin:0 0 16px;">
						<?php esc_html_e( 'Paste the complete vendor-provided code snippet into the matching field below, for example: <script>...</script>. Keep any script tags exactly as provided. Google Analytics and OneTrust are printed in the page head.', 'ambrygen-web' ); ?>
					</p>
					<table class="form-table">
						<tr>
							<th scope="row">
								<?php esc_html_e( 'OneTrust Script', 'ambrygen-web' ); ?>
							</th>
							<td>
								<?php
								$this->render_script_textarea_field(
									'onetrust_script',
									$options['onetrust_script'] ?? '',
									__( 'Paste the full OneTrust snippet exactly as provided, for example <script src="..."></script>. This field is intended for the cookie consent script and prints in the document head.', 'ambrygen-web' )
								);
								?>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Google Analytics Script', 'ambrygen-web' ); ?>
							</th>
							<td>
								<?php
								$this->render_script_textarea_field(
									'google_analytics_script',
									$options['google_analytics_script'] ?? '',
									__( 'Paste the full Google Analytics or GA4 snippet exactly as provided, for example <script async src="..."></script>. This field prints in the document head before OneTrust.', 'ambrygen-web' )
								);
								?>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Custom Header Script', 'ambrygen-web' ); ?>
							</th>
							<td>
								<?php
								$this->render_script_textarea_field(
									'custom_header_script',
									$options['custom_header_script'] ?? '',
									__( 'Optional extra code for the page head, such as <script>...</script> or verification meta tags. Leave blank if not needed.', 'ambrygen-web' )
								);
								?>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Custom Footer Script', 'ambrygen-web' ); ?>
							</th>
							<td>
								<?php
								$this->render_script_textarea_field(
									'custom_footer_script',
									$options['custom_footer_script'] ?? '',
									__( 'Optional extra code to print before the closing footer tag, such as <script>...</script>. Use this for scripts that should load at the end of the page.', 'ambrygen-web' )
								);
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

				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="event" hidden>
					<table class="form-table">
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Empty State Content', 'ambrygen-web' ); ?>
							</th>
							<td>
								<p class="description" style="margin-top:0;">
									<?php esc_html_e( 'These messages are shown when no linked posters or presentations are available for a conference.', 'ambrygen-web' ); ?>
								</p>
								<?php
								$event_empty_states = $options['event_empty_states'] ?? array();
								$this->render_event_empty_state_section(
									'upcoming',
									__( 'Upcoming Event', 'ambrygen-web' ),
									$event_empty_states['upcoming'] ?? array()
								);
								$this->render_event_empty_state_section(
									'past',
									__( 'Past Event', 'ambrygen-web' ),
									$event_empty_states['past'] ?? array()
								);
								?>
							</td>
						</tr>
					</table>
				</div>

				<?php
				/*
				Temporary: hide Contact Info theme option settings panel.
				<div class="ambrygen-theme-options-tabs__panel" data-tab-panel="contact-info" hidden>
					<table class="form-table">
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Shared Template Part', 'ambrygen-web' ); ?>
							</th>
							<td>
								<p>
									<?php esc_html_e( 'Add and manage the Contact Info block in the template part file:', 'ambrygen-web' ); ?>
									<?php
									$contact_info_template_part_url = add_query_arg(
										array(
											'p'      => '/wp_template_part/' . get_stylesheet() . '//contact-info-global',
											'canvas' => 'edit',
										),
										admin_url( 'site-editor.php' )
									);
									?>
									<a href="<?php echo esc_url( $contact_info_template_part_url ); ?>">
										<?php esc_html_e( 'click here for the edit', 'ambrygen-web' ); ?>
									</a>
								</p>
								<p class="description">
									<?php esc_html_e( 'This template part is automatically rendered before the footer unless it is hidden by the rules below.', 'ambrygen-web' ); ?>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<?php esc_html_e( 'Hide for Post Types', 'ambrygen-web' ); ?>
							</th>
							<td>
								<?php $this->render_contact_info_post_types_field( $options['contact_info_hidden_post_types'] ?? array() ); ?>
								<p class="description">
									<?php esc_html_e( 'Hide the global Contact Info block for these post types and their archives.', 'ambrygen-web' ); ?>
								</p>
							</td>
						</tr>
					</table>
				</div>
				*/
				?>
			</div>

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
	/**
	 * Get placeholder image ID.
	 *
	 * @return int
	 */
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
	 * Get event empty-state settings.
	 *
	 * @param string $scope Empty-state scope.
	 * @return array<string, string>
	 */
	public static function get_event_empty_state_settings( string $scope = 'upcoming' ): array {
		$options = get_option( self::OPTION_KEY );
		$scope   = 'past' === $scope ? 'past' : 'upcoming';
		$states  = isset( $options['event_empty_states'] ) && is_array( $options['event_empty_states'] )
			? $options['event_empty_states']
			: array();

		$fallback_title   = __( "We're still working on it", 'ambrygen-web' );
		$fallback_message = __( 'No registered posters or presentations yet.', 'ambrygen-web' );
		$state            = isset( $states[ $scope ] ) && is_array( $states[ $scope ] ) ? $states[ $scope ] : array();

		return array(
			'title'   => isset( $state['title'] ) && '' !== trim( (string) $state['title'] )
				? sanitize_text_field( $state['title'] )
				: $fallback_title,
			'message' => isset( $state['message'] ) && '' !== trim( wp_strip_all_tags( (string) $state['message'] ) )
				? wp_kses_post( $state['message'] )
				: wpautop( esc_html( $fallback_message ) ),
			'ctas'    => self::normalize_event_empty_state_ctas( $state['ctas'] ?? array() ),
		);
	}

	/**
	 * Get Contact Info visibility settings.
	 *
	 * @return array<string, array<int, int|string>>
	 */
	public static function get_contact_info_visibility_settings(): array {
		$options = get_option( self::OPTION_KEY );

		$hidden_post_types = isset( $options['contact_info_hidden_post_types'] ) && is_array( $options['contact_info_hidden_post_types'] )
			? array_values(
				array_filter(
					array_map( 'sanitize_key', $options['contact_info_hidden_post_types'] )
				)
			)
			: array();

		return array(
			'hidden_post_types' => $hidden_post_types,
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
						'textarea_name'  => "{$key}[desc]",
						'textarea_rows'  => 6,
						'media_buttons'  => false,
						'textarea_class' => 'ambrygen-wysiwyg-textarea',
					)
				);
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Render an event empty-state content section.
	 *
	 * @param string $slug    Section slug.
	 * @param string $label   Section label.
	 * @param array  $section Section data.
	 */
	private function render_event_empty_state_section( string $slug, string $label, array $section ): void {
		$title     = $section['title'] ?? __( "We're still working on it", 'ambrygen-web' );
		$message   = $section['message'] ?? __( 'No registered posters or presentations yet.', 'ambrygen-web' );
		$key       = self::OPTION_KEY . '[event_empty_states][' . $slug . ']';
		$editor_id = 'event_empty_state_' . $slug . '_message';
		$ctas      = self::normalize_event_empty_state_ctas( $section['ctas'] ?? array() );
		?>
		<div class="ambrygen-mm-row" style="border:1px solid #dcdcde; padding:15px; margin:0 0 15px; background:#fff;">
			<h3 style="margin:0 0 15px;"><?php echo esc_html( $label ); ?></h3>

			<div style="margin-bottom:15px;">
				<label for="<?php echo esc_attr( $editor_id . '_title' ); ?>"><strong><?php esc_html_e( 'Headline', 'ambrygen-web' ); ?></strong></label>
				<input
					type="text"
					class="widefat"
					id="<?php echo esc_attr( $editor_id . '_title' ); ?>"
					name="<?php echo esc_attr( $key ); ?>[title]"
					value="<?php echo esc_attr( $title ); ?>"
				/>
			</div>

			<div style="margin-bottom:0;">
				<label><strong><?php esc_html_e( 'Message', 'ambrygen-web' ); ?></strong></label>
				<?php
				wp_editor(
					$message,
					$editor_id,
					array(
						'textarea_name'  => "{$key}[message]",
						'textarea_rows'  => 6,
						'media_buttons'  => false,
						'textarea_class' => 'ambrygen-wysiwyg-textarea',
					)
				);
				?>
			</div>

			<div style="margin-top:15px;">
				<label><strong><?php esc_html_e( 'CTA Buttons', 'ambrygen-web' ); ?></strong></label>
				<?php
				$this->render_event_empty_state_cta_section(
					$key . '[ctas][primary]',
					__( 'CTA Button 1', 'ambrygen-web' ),
					$ctas['primary']
				);
				$this->render_event_empty_state_cta_section(
					$key . '[ctas][secondary]',
					__( 'CTA Button 2', 'ambrygen-web' ),
					$ctas['secondary']
				);
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Render an event empty-state CTA section.
	 *
	 * @param string $key   CTA key.
	 * @param string $label CTA label.
	 * @param array  $cta   CTA data.
	 */
	private function render_event_empty_state_cta_section( string $key, string $label, array $cta ): void {
		$text      = $cta['text'] ?? '';
		$link      = $cta['link'] ?? '';
		$link_text = $cta['link_text'] ?? '';
		$target    = isset( $cta['target'] ) && '_blank' === $cta['target'] ? '_blank' : '';
		$input_id  = sanitize_html_class( str_replace( array( '[', ']' ), '_', $key ) );
		?>
		<div style="border:1px solid #dcdcde; padding:12px; margin:0 0 12px; background:#f9f9f9;">
			<h4 style="margin:0 0 12px;"><?php echo esc_html( $label ); ?></h4>



			<div style="margin-bottom:0;">
				<label for="<?php echo esc_attr( $input_id . '_link' ); ?>"><strong><?php esc_html_e( 'Link', 'ambrygen-web' ); ?></strong></label>
				<div class="ambrygen-link-picker">
					<input
						type="hidden"
						class="ambrygen-link-picker__text"
						id="<?php echo esc_attr( $input_id . '_link_text' ); ?>"
						name="<?php echo esc_attr( $key ); ?>[link_text]"
						value="<?php echo esc_attr( $link_text ); ?>"
					/>
					<input
						type="hidden"
						class="ambrygen-link-picker__input"
						id="<?php echo esc_attr( $input_id . '_link' ); ?>"
						name="<?php echo esc_attr( $key ); ?>[link]"
						value="<?php echo esc_url( $link ); ?>"
					/>
					<div class="ambrygen-link-picker__value">
						<?php if ( ! empty( $link ) ) : ?>
							<a
								href="<?php echo esc_url( $link ); ?>"
								<?php echo '_blank' === $target ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>
							>
								<?php echo esc_html( $link ); ?>
							</a>
						<?php else : ?>
							<span class="description"><?php esc_html_e( 'No link selected yet.', 'ambrygen-web' ); ?></span>
						<?php endif; ?>
					</div>
					<div class="ambrygen-link-picker__actions theme-field-actions">
						<button type="button" class="theme-button is-secondary ambrygen-link-picker__select">
							<?php esc_html_e( 'Select Link', 'ambrygen-web' ); ?>
						</button>
						<button type="button" class="theme-button is-destructive ambrygen-link-picker__clear remove-button is-destructive components-button is-next-40px-default-size">
							<?php esc_html_e( 'Clear', 'ambrygen-web' ); ?>
						</button>
					</div>
					<input
						type="hidden"
						class="ambrygen-link-picker__target"
						name="<?php echo esc_attr( $key ); ?>[target]"
						value="<?php echo esc_attr( $target ); ?>"
					/>
				</div>
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
		$target     = isset( $item['target'] ) && '_blank' === $item['target'] ? '_blank' : '';
		$key        = self::OPTION_KEY . '[header_popup_items][' . $index . ']';
		?>
		<div class="ambrygen-mm-row" style="border:1px solid #dcdcde; padding:15px; margin:0 0 15px; background:#fff;">
			<h3 style="margin:0 0 15px;"><?php echo esc_html( sprintf( __( 'Popup Item %d', 'ambrygen-web' ), $index + 1 ) ); ?></h3>

			<div style="margin-bottom:15px;">
				<label for="<?php echo esc_attr( 'header_popup_item_' . $index . '_link' ); ?>"><strong><?php esc_html_e( 'Link', 'ambrygen-web' ); ?></strong></label>
				<div class="ambrygen-link-picker">
					<input
						type="hidden"
						class="ambrygen-link-picker__text"
						id="<?php echo esc_attr( 'header_popup_item_' . $index . '_title' ); ?>"
						name="<?php echo esc_attr( $key ); ?>[title]"
						value="<?php echo esc_attr( $item_title ); ?>"
					/>
					<input
						type="hidden"
						class="ambrygen-link-picker__input"
						id="<?php echo esc_attr( 'header_popup_item_' . $index . '_link' ); ?>"
						name="<?php echo esc_attr( $key ); ?>[link]"
						value="<?php echo esc_url( $link ); ?>"
					/>
					<div class="ambrygen-link-picker__value">
						<?php if ( ! empty( $link ) ) : ?>
							<a
								href="<?php echo esc_url( $link ); ?>"
								<?php echo '_blank' === $target ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>
							>
								<?php echo esc_html( $link ); ?>
							</a>
						<?php else : ?>
							<span class="description"><?php esc_html_e( 'No link selected yet.', 'ambrygen-web' ); ?></span>
						<?php endif; ?>
					</div>
					<div class="ambrygen-link-picker__actions theme-field-actions">
						<button type="button" class="theme-button is-secondary ambrygen-link-picker__select">
							<?php esc_html_e( 'Select Link', 'ambrygen-web' ); ?>
						</button>
						<button type="button" class="theme-button is-destructive ambrygen-link-picker__clear">
							<?php esc_html_e( 'Clear', 'ambrygen-web' ); ?>
						</button>
					</div>
					<input
						type="hidden"
						class="ambrygen-link-picker__target"
						name="<?php echo esc_attr( $key ); ?>[target]"
						value="<?php echo esc_attr( $target ); ?>"
					/>
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

			<div class="theme-field-actions">
				<button type="button" class="upload-button theme-button is-secondary">
					<?php esc_html_e( 'Select Image', 'ambrygen-web' ); ?>
				</button>

				<button type="button" class="remove-button theme-button is-destructive">
					<?php esc_html_e( 'Remove', 'ambrygen-web' ); ?>
				</button>
			</div>


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
	 * Sanitize an event empty-state section.
	 *
	 * @param array  $section         Section input.
	 * @param string $default_title   Default headline.
	 * @param string $default_message Default message.
	 * @return array<string, string>
	 */
	private function sanitize_event_empty_state_section( array $section, string $default_title, string $default_message ): array {
		return array(
			'title'   => isset( $section['title'] ) && '' !== trim( (string) $section['title'] )
				? sanitize_text_field( $section['title'] )
				: $default_title,
			'message' => isset( $section['message'] ) && '' !== trim( wp_strip_all_tags( (string) $section['message'] ) )
				? wp_kses_post( $section['message'] )
				: wpautop( esc_html( $default_message ) ),
			'ctas'    => $this->sanitize_event_empty_state_ctas( $section['ctas'] ?? array() ),
		);
	}

	/**
	 * Sanitize event empty-state CTAs.
	 *
	 * @param array $ctas CTA input.
	 * @return array<string, array<string, string>>
	 */
	private function sanitize_event_empty_state_ctas( array $ctas ): array {
		$defaults  = array(
			'primary'   => '',
			'secondary' => '',
		);
		$sanitized = array();

		foreach ( $defaults as $slug => $default_text ) {
			$cta = isset( $ctas[ $slug ] ) && is_array( $ctas[ $slug ] ) ? $ctas[ $slug ] : array();

			$sanitized[ $slug ] = array(
				'text'      => isset( $cta['text'] ) ? sanitize_text_field( $cta['text'] ) : '',
				'link_text' => isset( $cta['link_text'] ) ? sanitize_text_field( $cta['link_text'] ) : '',
				'link'      => isset( $cta['link'] ) ? esc_url_raw( $cta['link'] ) : '',
				'target'    => isset( $cta['target'] ) && '_blank' === $cta['target'] ? '_blank' : '',
			);
		}

		return $sanitized;
	}

	/**
	 * Normalize event empty-state CTAs with defaults.
	 *
	 * @param array $ctas Raw CTA data.
	 * @return array<string, array<string, string>>
	 */
	private static function normalize_event_empty_state_ctas( array $ctas ): array {
		$defaults   = array(
			'primary'   => '',
			'secondary' => '',
		);
		$normalized = array();

		foreach ( $defaults as $slug => $default_text ) {
			$cta = isset( $ctas[ $slug ] ) && is_array( $ctas[ $slug ] ) ? $ctas[ $slug ] : array();

			$normalized[ $slug ] = array(
				'text'      => isset( $cta['text'] ) ? sanitize_text_field( $cta['text'] ) : '',
				'link_text' => isset( $cta['link_text'] ) && '' !== trim( (string) $cta['link_text'] )
					? sanitize_text_field( $cta['link_text'] )
					: $default_text,
				'link'      => isset( $cta['link'] ) && '' !== trim( (string) $cta['link'] )
					? esc_url( $cta['link'] )
					: '',
				'target'    => isset( $cta['target'] ) && '_blank' === $cta['target'] ? '_blank' : '',
			);
		}

		return $normalized;
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
				'target'   => isset( $item['target'] ) && '_blank' === $item['target'] ? '_blank' : '',
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
				'target'   => isset( $item['target'] ) && '_blank' === $item['target'] ? '_blank' : '',
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

			<div class="theme-field-actions">

			<button type="button" class="upload-button theme-button is-secondary">
				<?php esc_html_e( 'Select Image', 'ambrygen-web' ); ?>
			</button>

			<button type="button" class="remove-button theme-button is-destructive">
				<?php esc_html_e( 'Remove', 'ambrygen-web' ); ?>
			</button>
				</div>
		</div>
		<?php
	}
	/**
	 * Render a textarea for raw script snippets.
	 *
	 * @param string $key         Option key.
	 * @param string $value       Current field value.
	 * @param string $description Field helper text.
	 */
	private function render_script_textarea_field( string $key, string $value, string $description = '' ): void {
		$requires_script_tag = in_array(
			$key,
			array( 'onetrust_script', 'google_analytics_script' ),
			true
		);
		?>
		<textarea
			class="large-text code"
			rows="8"
			name="<?php echo esc_attr( self::OPTION_KEY ); ?>[<?php echo esc_attr( $key ); ?>]"
			<?php echo $requires_script_tag ? 'data-requires-script-tag="true"' : ''; ?>
		><?php echo esc_textarea( $value ); ?></textarea>
		<?php if ( '' !== $description ) : ?>
			<p class="description"><?php echo esc_html( $description ); ?></p>
		<?php endif; ?>
		<?php
	}

	/**
	 * Sanitize raw script content.
	 *
	 * @param mixed $value Raw field value.
	 */
	private function sanitize_script_snippet( $value ): string {
		$value = is_string( $value ) ? trim( wp_unslash( $value ) ) : '';

		if ( '' === $value ) {
			return '';
		}

		if ( current_user_can( 'manage_options' ) ) {
			return $value;
		}

		return wp_kses_post( $value );
	}


	/**
	 * Redirect back to the Theme Options screen with a status notice.
	 *
	 * @param string $redirect_url Redirect target URL.
	 * @param string $status       Notice status.
	 * @param string $message      Notice message.
	 */
	private function redirect_with_username_notice( string $redirect_url, string $status, string $message ): void {
		wp_safe_redirect(
			add_query_arg(
				array(
					'ambrygen_username_status'  => sanitize_key( $status ),
					'ambrygen_username_message' => rawurlencode( $message ),
				),
				$redirect_url
			)
		);
		exit;
	}

	/**
	 * Render the username update notice, if present.
	 */
	private function render_username_update_notice(): void {
		$status  = isset( $_GET['ambrygen_username_status'] ) ? sanitize_key( wp_unslash( $_GET['ambrygen_username_status'] ) ) : '';
		$message = isset( $_GET['ambrygen_username_message'] ) ? sanitize_text_field( rawurldecode( wp_unslash( $_GET['ambrygen_username_message'] ) ) ) : '';

		if ( '' === $status || '' === $message ) {
			return;
		}

		$notice_class = 'success' === $status ? 'notice notice-success' : 'notice notice-error';
		?>
		<div class="<?php echo esc_attr( $notice_class ); ?>">
			<p><?php echo esc_html( $message ); ?></p>
		</div>
		<?php
	}

	/**
	 * Render saved tracking and custom scripts in the document head.
	 */
	public function render_header_scripts(): void {
		$options = get_option( self::OPTION_KEY );

		$this->print_script_snippet( $options['onetrust_script'] ?? '' );
		$this->print_script_snippet( $options['google_analytics_script'] ?? '' );
		$this->print_script_snippet( $options['custom_header_script'] ?? '' );
	}

	/**
	 * Render saved tracking and custom scripts in the document footer.
	 */
	public function render_footer_scripts(): void {
		$options = get_option( self::OPTION_KEY );

		$this->print_script_snippet( $options['custom_footer_script'] ?? '' );
	}
	/**
	 * Print a saved script snippet if present.
	 *
	 * @param mixed $snippet Saved snippet.
	 */
	private function print_script_snippet( $snippet ): void {
		if ( ! is_string( $snippet ) || '' === trim( $snippet ) ) {
			return;
		}

		echo $snippet . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Render post-type checkboxes for Contact Info visibility.
	 *
	 * @param array $selected_post_types Selected post-type slugs.
	 * @return void
	 */
	private function render_contact_info_post_types_field( array $selected_post_types ): void {
		$selected_post_types = array_values( array_filter( array_map( 'sanitize_key', $selected_post_types ) ) );
		$post_types          = $this->get_allowed_contact_info_post_type_objects();

		foreach ( $post_types as $post_type ) :
			?>
			<p>
				<label>
					<input
						type="checkbox"
						name="<?php echo esc_attr( self::OPTION_KEY ); ?>[contact_info_hidden_post_types][]"
						value="<?php echo esc_attr( $post_type->name ); ?>"
						<?php checked( in_array( $post_type->name, $selected_post_types, true ) ); ?>
					/>
					<?php echo esc_html( $post_type->labels->singular_name ?: $post_type->label ); ?>
				</label>
			</p>
			<?php
		endforeach;
	}

	/**
	 * Sanitize hidden post-type list.
	 *
	 * @param mixed $post_types Raw post-type values.
	 * @return array<int, string>
	 */
	private function sanitize_contact_info_hidden_post_types( $post_types ): array {
		if ( ! is_array( $post_types ) ) {
			return array();
		}

		$allowed_post_types = $this->get_allowed_contact_info_post_type_names();
		$sanitized          = array_map( 'sanitize_key', $post_types );

		return array_values( array_intersect( $sanitized, $allowed_post_types ) );
	}

	/**
	 * Get allowed post type objects for the Contact Info visibility list.
	 *
	 * @return array<string, \WP_Post_Type>
	 */
	private function get_allowed_contact_info_post_type_objects(): array {
		$post_types = get_post_types(
			array(
				'public' => true,
			),
			'objects'
		);

		unset( $post_types['attachment'] );

		foreach ( self::CONTACT_INFO_EXCLUDED_POST_TYPES as $post_type_slug ) {
			unset( $post_types[ $post_type_slug ] );
		}

		return $post_types;
	}

	/**
	 * Get allowed post type names for the Contact Info visibility list.
	 *
	 * @return array<int, string>
	 */
	private function get_allowed_contact_info_post_type_names(): array {
		return array_keys( $this->get_allowed_contact_info_post_type_objects() );
	}




	/**
	 * Enqueue assets required by the theme options screen.
	 *
	 * @param string $hook_suffix Current admin page hook.
	 */
	public function enqueue_admin_assets( string $hook_suffix ): void {
		$theme_options_style_path = get_template_directory() . '/assets/src/css/theme-options.css';
		$theme_options_style_uri  = get_template_directory_uri() . '/assets/src/css/theme-options.css';

		$editor_forms_style_path = get_template_directory() . '/assets/src/css/editor-forms.css';
		$editor_forms_style_uri  = get_template_directory_uri() . '/assets/src/css/editor-forms.css';

		if ( 'appearance_page_ambrygen-theme-options' === $hook_suffix && file_exists( $theme_options_style_path ) ) {
			wp_enqueue_style(
				'ambrygen-theme-options-style',
				$theme_options_style_uri,
				array(),
				(string) filemtime( $theme_options_style_path )
			);
		}

		$screen                = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		$is_post_editor_screen = $screen && 'post' === $screen->base;

		if ( $is_post_editor_screen && file_exists( $editor_forms_style_path ) ) {
			wp_enqueue_style(
				'ambrygen-editor-forms-style',
				$editor_forms_style_uri,
				array(),
				(string) filemtime( $editor_forms_style_path )
			);
		}

	}


}
