<?php

namespace Ambrygen\Theme\Core\Admin;

use Ambrygen\Theme\Core\Admin\Fields\PostRelationshipField;
use Ambrygen\Theme\Core\Admin\Fields\MarketingMaterialRepeaterField;
use Ambrygen\Theme\Core\Admin\Fields\EventMeetExpertRepeaterField;
use Ambrygen\Theme\Core\Admin\Fields\PosterPdfRepeaterField;
use Ambrygen\Theme\Core\Admin\Fields\WebinarAuthorRepeaterField;
use Ambrygen\Theme\Core\Admin\Fields\ProductStatsRepeaterField;
use Ambrygen\Theme\Core\Singleton;
use WP_Post;

defined( 'ABSPATH' ) || exit;

/**
 * Post meta box registration and saving controller.
 */
final class MetaBoxController {

	use Singleton;

	private array $definitions = array();

	/**
	 * Constructor.
	 *
	 * @param array $definitions Post type definitions keyed by slug.
	 */
	protected function __construct( array $definitions = array() ) {
		$this->definitions = $definitions;
		$this->register_hooks();
	}

	/**
	 * Set the post type definitions used by the controller.
	 *
	 * @param array $definitions Post type definitions keyed by slug.
	 * @return void
	 */
	public function set_definitions( array $definitions ): void {
		$this->definitions = $definitions;
	}

	/**
	 * Register admin hooks for meta boxes and field assets.
	 *
	 * @return void
	 */
	private function register_hooks(): void {
		add_action( 'add_meta_boxes', array( $this, 'register_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_meta_boxes' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_post_meta_media' ) );
		add_action( 'admin_footer', array( $this, 'render_video_settings_js' ) );
		add_filter( 'use_block_editor_for_post_type', array( $this, 'disable_block_editor_for_supported_post_types' ), 10, 2 );
	}

	/**
	 * Disable the block editor for supported post types.
	 *
	 * @param bool   $use_block_editor Whether the block editor is enabled.
	 * @param string $post_type        Post type slug.
	 * @return bool
	 */
	public function disable_block_editor_for_supported_post_types( bool $use_block_editor, string $post_type ): bool {
		$classic_editor_post_types = array(
			'product_version',
			'marketing_material',
			'top_bar_message',
			'author',
			'jobs',
			'conferences',
			'presentation',
			'poster',
			'webinar',
		);

		if ( in_array( $post_type, $classic_editor_post_types, true ) ) {
			return false;
		}

		return $use_block_editor;
	}

	/**
	 * Render inline admin JavaScript for post video settings fields.
	 *
	 * @return void
	 */
	public function render_video_settings_js(): void {
		$screen = get_current_screen();
		if ( ! $screen || 'post' !== $screen->post_type ) {
			return;
		}
		?>
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					const $mediaType = $('#media_type');
					const $videoType = $('#video_type');
					const $videoTypeWrapper = $('.field-wrapper-video_type');
					const $iframeWrapper = $('.field-wrapper-iframe_url');
					const $videoWrapper = $('.field-wrapper-video_url');
					const $posterWrapper = $('.field-wrapper-poster_image_id');

					function toggleVideoFields() {
						const mediaType = $mediaType.val();
						const videoType = $videoType.val();

						if (mediaType === 'image') {
							$videoTypeWrapper.hide();
							$iframeWrapper.hide();
							$videoWrapper.hide();
							$posterWrapper.hide();
						} else {
							$videoTypeWrapper.show();
							$posterWrapper.show();
							
							if (videoType === 'embed') {
								$iframeWrapper.show();
								$videoWrapper.hide();
							} else if (videoType === 'mp4') {
								$iframeWrapper.hide();
								$videoWrapper.show();
							} else {
								$iframeWrapper.hide();
								$videoWrapper.hide();
							}
						}
					}

					if ($mediaType.length) {
						$mediaType.on('change', toggleVideoFields);
						$videoType.on('change', toggleVideoFields);
						toggleVideoFields();
					}
				});
			})(jQuery);
		</script>
		<?php
	}

	/**
	 * Register meta boxes for supported post types.
	 *
	 * @return void
	 */
	public function register_meta_boxes(): void {
		foreach ( $this->definitions as $slug => $def ) {
			$meta_fields = $def->meta_fields();

			if ( empty( $meta_fields ) || ! $this->has_visible_meta_fields( $meta_fields ) ) {
				continue;
			}

			add_meta_box(
				$slug . '_meta_box',
				sprintf( __( '%s Details', 'ambrygen-web' ), $def->singular_label() ),
				array( $this, 'render_meta_box' ),
				$slug,
				'normal',
				'default',
				array( 'slug' => $slug )
			);
		}

		add_meta_box(
			'post_author_meta_box',
			__( 'Author Selection', 'ambrygen-web' ),
			array( $this, 'render_post_author_meta_box' ),
			'post',
			'normal',
			'default'
		);
	}

	/**
	 * Determine whether a meta box has visible fields.
	 *
	 * @param array $fields Meta field definitions.
	 * @return bool
	 */
	private function has_visible_meta_fields( array $fields ): bool {
		foreach ( $fields as $field ) {
			if ( empty( $field['hidden'] ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Render the author selection meta box for posts.
	 *
	 * @param WP_Post $post Current post object.
	 * @return void
	 */
	public function render_post_author_meta_box( WP_Post $post ): void {
		wp_nonce_field( 'ambrygen_meta_box', 'ambrygen_meta_nonce' );
		echo '<input type="hidden" name="webinar_authors_meta_box_present" value="1">';
		echo '<div class="">';

		$key   = 'webinar_authors';
		$field = array(
			'label' => __( 'Post Authors', 'ambrygen-web' ),
			'type'  => 'webinar_author_repeater',
		);

		WebinarAuthorRepeaterField::instance()->render( $post->ID, $key, $field );

		echo '</div>';
	}

	/**
	 * Render the configured meta box fields for a post type.
	 *
	 * @param WP_Post $post Current post object.
	 * @param array   $box  Meta box arguments.
	 * @return void
	 */
	public function render_meta_box( WP_Post $post, array $box ): void {
		$slug   = $box['args']['slug'] ?? '';
		$def    = $this->definitions[ $slug ] ?? null;
		$fields = $def ? $def->meta_fields() : array();

		wp_nonce_field( 'ambrygen_meta_box', 'ambrygen_meta_nonce' );

		if ( 'genetic-testing' === $slug ) {
			$this->render_genetic_testing_meta_box( $post, $fields );
			return;
		}

		echo '<div class="cs-wpblock-form-layout">';
		foreach ( $fields as $key => $field ) {
			$this->render_meta_field( $post, $key, $field );
		}
		echo '</div>';
	}

	/**
	 * Render the custom genetic testing meta box layout.
	 *
	 * @param WP_Post $post   Current post object.
	 * @param array   $fields Meta field definitions.
	 * @return void
	 */
	private function render_genetic_testing_meta_box( WP_Post $post, array $fields ): void {
		$sections = array(
			array(
				'title'       => __( 'Hero Content', 'ambrygen-web' ),
				'description' => __( 'Manage the introduction shown at the top of the genetic testing page.', 'ambrygen-web' ),
				'fields'      => array( 'banner_description', 'short_description', 'meta_title', 'intro' ),
			),
			array(
				'title'       => __( 'Detail Sections', 'ambrygen-web' ),
				'description' => __( 'Control the two content blocks shown in the main page body.', 'ambrygen-web' ),
				'fields'      => array( 'when_to_consider_title', 'when_to_consider_content', 'why_is_this_important_title', 'why_is_this_important' ),
			),
			array(
				'title'       => __( 'Linked Content', 'ambrygen-web' ),
				'description' => __( 'Choose related posts used for downloads, quick reference, and supporting content.', 'ambrygen-web' ),
				'fields'      => array( 'linked_posts_genetic' ),
			),
			array(
				'title'       => __( 'Product Stats', 'ambrygen-web' ),
				'description' => __( 'Edit the stat cards and footer content displayed in the product stats section.', 'ambrygen-web' ),
				'fields'      => array( 'product_stats_title', 'product_stats_repeater', 'product_stats_footer' ),
			),
			array(
				'title'       => __( 'Bottom Content', 'ambrygen-web' ),
				'description' => __( 'Manage the content displayed at the bottom of genetic testing single pages.', 'ambrygen-web' ),
				'fields'      => array( 'test_description' ),
			),
		);

		echo '<div class="cs-wpblock-form-layout ambrygen-genetic-testing-meta-box" style="    grid-template-columns: repeat(2, 1fr);">';

		foreach ( $fields as $key => $field ) {
			if ( ! empty( $field['hidden'] ) ) {
				$this->render_meta_field( $post, $key, $field );
			}
		}

		foreach ( $sections as $section ) {
			echo '<section class="ambrygen-meta-section" style="margin-bottom:24px;padding:20px;border:1px solid #dcdcde;border-radius:8px;background:#fff;">';
			echo '<div style="margin-bottom:16px;">';
			// echo '<h3 style="margin:0 0 6px 0;">' . esc_html($section['title']) . '</h3>';
			// echo '<p style="margin:0;color:#50575e;">' . esc_html($section['description']) . '</p>';
			echo '</div>';

			foreach ( $section['fields'] as $field_key ) {
				if ( ! isset( $fields[ $field_key ] ) ) {
					continue;
				}

				$this->render_meta_field( $post, $field_key, $fields[ $field_key ] );
			}

			echo '</section>';
		}

		echo '</div>';
	}

	/**
	 * Render a single meta field.
	 *
	 * @param WP_Post $post  Current post object.
	 * @param string  $key   Meta field key.
	 * @param array   $field Meta field definition.
	 * @return void
	 */
	private function render_meta_field( WP_Post $post, string $key, array $field ): void {
		$raw_meta  = get_post_meta( $post->ID, $key, true );
		$value     = is_scalar( $raw_meta ) ? (string) $raw_meta : '';
		$type      = $field['type'] ?? 'text';
		$input_id  = esc_attr( $key );
		$is_hidden = ! empty( $field['hidden'] );

		if ( $is_hidden ) {
			printf(
				'<input type="hidden" name="%1$s" id="%1$s" value="%2$s">',
				$input_id,
				esc_attr( $value )
			);
			return;
		}

		echo '<div class="form-field form-field-' . esc_attr( $type ) . ' field-wrapper-' . esc_attr( $key ) . '">';
		printf(
			'<label for="%1$s">%2$s</label>',
			$input_id,
			esc_html( $field['label'] )
		);

		if ( 'textarea' === $type ) {
			$display_value = $value;

			if ( is_string( $display_value ) ) {
				$decoded_value = json_decode( $display_value, true );

				if ( is_array( $decoded_value ) ) {
					$display_value = implode(
						', ',
						array_filter(
							array_map(
								static fn( $item): string => trim( wp_strip_all_tags( (string) $item ) ),
								$decoded_value
							),
							static fn( string $item): bool => '' !== $item
						)
					);
				}
			}

			printf(
				'<textarea name="%1$s" id="%1$s" class="widefat" rows="4">%2$s</textarea>',
				$input_id,
				esc_textarea( (string) $display_value )
			);
		} elseif ( 'select' === $type ) {
			$options = $field['options'] ?? array();
			printf(
				'<select name="%1$s" id="%1$s" class="widefat">',
				$input_id
			);
			foreach ( $options as $opt_val => $opt_label ) {
				printf(
					'<option value="%1$s" %2$s>%3$s</option>',
					esc_attr( $opt_val ),
					selected( $value, $opt_val, false ),
					esc_html( $opt_label )
				);
			}
			echo '</select>';
		} elseif ( 'wysiwyg' === $type ) {
			wp_editor(
				$value,
				$key,
				array(
					'textarea_name' => $key,
					'textarea_rows' => 8,
					'media_buttons' => false,
				)
			);
		} elseif ( 'checkbox' === $type ) {
			$is_checked  = ( '' !== $value && '0' !== $value && 'false' !== $value );
			$field_value = isset( $field['value'] ) ? $field['value'] : '1';
			printf(
				'<input type="checkbox" name="%1$s" id="%1$s" value="%2$s" %3$s>',
				$input_id,
				esc_attr( $field_value ),
				checked( $is_checked, true, false )
			);
		} elseif ( 'date' === $type ) {
			$date_val = ! empty( $value ) ? gmdate( 'Y-m-d', strtotime( $value ) ) : '';
			printf(
				'<input type="date" name="%1$s" id="%1$s" class="widefat" value="%2$s">',
				$input_id,
				esc_attr( $date_val )
			);
		} elseif ( 'datetime-local' === $type ) {
			$datetime_val = '';
			if ( ! empty( $value ) ) {
				$parsed_datetime = strtotime( $value );
				$datetime_val    = $parsed_datetime ? gmdate( 'Y-m-d\TH:i', $parsed_datetime ) : (string) $value;
			}
			printf(
				'<input type="datetime-local" name="%1$s" id="%1$s" class="widefat" value="%2$s">',
				$input_id,
				esc_attr( $datetime_val )
			);
		} elseif ( 'time' === $type ) {
			$time_val = '';
			if ( ! empty( $value ) ) {
				$parsed_time = strtotime( $value );
				$time_val    = $parsed_time ? gmdate( 'H:i', $parsed_time ) : (string) $value;
			}
			printf(
				'<input type="time" name="%1$s" id="%1$s" class="widefat" value="%2$s">',
				$input_id,
				esc_attr( $time_val )
			);
		} elseif ( 'link_picker' === $type ) {
			$this->render_link_picker_field( $key, $value );
		} elseif ( 'post_relationship' === $type ) {
			PostRelationshipField::instance()->render( $post->ID, $key, $field );
		} elseif ( 'marketing_material_repeater' === $type ) {
			MarketingMaterialRepeaterField::instance()->render( $post->ID, $key, $field );
		} elseif ( 'event_meet_expert_repeater' === $type ) {
			EventMeetExpertRepeaterField::instance()->render( $post->ID, $key, $field );
		} elseif ( in_array( $type, array( 'poster_pdf_repeater', 'presentation_pdf_repeater' ), true ) ) {
			PosterPdfRepeaterField::instance()->render( $post->ID, $key, $field );
		} elseif ( 'webinar_author_repeater' === $type ) {
			WebinarAuthorRepeaterField::instance()->render( $post->ID, $key, $field );
		} elseif ( 'product_stats_repeater' === $type ) {
			ProductStatsRepeaterField::instance()->render( $post->ID, $key, $field );
		} elseif ( 'media_gallery' === $type ) {
			$this->render_media_gallery_field( $post->ID, $key, $field, $value );
		} elseif ( 'media_file' === $type ) {
			$this->render_media_file_field( $post->ID, $key, $field, $value );
		} else {
			printf(
				'<input type="%1$s" name="%2$s" id="%2$s" value="%3$s">',
				esc_attr( $type ),
				$input_id,
				esc_attr( $value )
			);
		}

		echo '</div>';
	}

	/**
	 * Render a media gallery field.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Meta field definition.
	 * @param string $value   Current stored value.
	 * @return void
	 */
	private function render_media_gallery_field( int $post_id, string $key, array $field, string $value ): void {
		$ids = array_filter(
			array_map(
				'absint',
				array_map(
					'trim',
					explode( ',', (string) $value )
				)
			)
		);

		echo '<div class="ambrygen-media-gallery-field">';
		printf(
			'<input type="hidden" name="%1$s" id="%1$s" class="widefat ambrygen-media-gallery-input" value="%2$s" />',
			esc_attr( $key ),
			esc_attr( $value )
		);
		echo '<div class="ambrygen-media-gallery-preview" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;">';
		foreach ( $ids as $image_id ) {
			$thumb = wp_get_attachment_image_url( $image_id, 'thumbnail' );
			if ( ! $thumb ) {
				continue;
			}

			$attachment = get_post( $image_id );
			$title      = $attachment ? $attachment->post_title : '';
			printf(
				'<div class="ambrygen-media-gallery-preview-item" data-attachment-id="%1$d" style="position:relative;display:inline-flex;">' .
					'<img src="%2$s" alt="" style="width:72px;height:72px;object-fit:cover;border:1px solid #ddd;border-radius:4px;display:block;" />' .
					'<button type="button" class="button-link-delete ambrygen-media-gallery-remove-item" aria-label="%3$s" title="%3$s" style="position:absolute;top:4px;right:4px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(17,24,39,0.82);color:#fff;text-align:center;text-decoration:none;font-size:15px;font-weight:700;line-height:1;border:1px solid rgba(255,255,255,0.22);box-shadow:0 1px 3px rgba(0,0,0,0.22);">&times;</button>' .
				'</div>',
				$image_id,
				esc_url( $thumb ),
				esc_attr(
					sprintf(
						/* translators: %s: attachment title. */
						__( 'Remove image %s', 'ambrygen-web' ),
						$title ?: (string) $image_id
					)
				)
			);
		}
		echo '</div>';
		echo '<div class="form-field form-field-button">';
		echo '<button type="button" class="theme-button is-secondary ambrygen-media-gallery-upload">';
		esc_html_e( 'Select Images', 'ambrygen-web' );
		echo '</button> ';
		echo '<button type="button" class="theme-button is-destructive ambrygen-media-gallery-remove">';
		esc_html_e( 'Clear', 'ambrygen-web' );
		echo '</button>';
		echo '</div>';
		echo '<p class="description">';
		esc_html_e( 'Selected image IDs are saved as comma-separated values.', 'ambrygen-web' );
		echo '</p>';
		echo '</div>';
	}

	/**
	 * Render a link picker field.
	 *
	 * @param string $key   Meta field key.
	 * @param string $value Current stored value.
	 * @return void
	 */
	private function render_link_picker_field( string $key, string $value ): void {
		echo '<div class="ambrygen-link-picker" style="display:grid;gap:8px;">';
		printf(
			'<input type="hidden" name="%1$s" id="%1$s" class="ambrygen-link-picker__input widefat" value="%2$s" />',
			esc_attr( $key ),
			esc_attr( $value )
		);
		echo '<div class="ambrygen-link-picker__value" style="padding:10px 12px;border:1px solid #dcdcde;border-radius:4px;background:#fff;">';
		echo wp_kses_post( $this->render_link_picker_value_markup( $value ) );
		echo '</div>';
		echo '<div style="display:flex;gap:8px;" class="form-field-button">';
		echo '<button type="button" class="theme-button is-secondary ambrygen-link-picker__select">';
		esc_html_e( 'Select Link', 'ambrygen-web' );
		echo '</button>';
		echo '<button type="button" class=" ambrygen-link-picker__clear theme-button is-destructive">';
		esc_html_e( 'Clear', 'ambrygen-web' );
		echo '</button>';
		echo '</div>';
		echo '</div>';
	}

	/**
	 * Render the current link picker value markup.
	 *
	 * @param string $value Current stored value.
	 * @return string
	 */
	private function render_link_picker_value_markup( string $value ): string {
		if ( '' === trim( $value ) ) {
			return '<span class="description">' . esc_html__( 'No link selected.', 'ambrygen-web' ) . '</span>';
		}

		return sprintf(
			'<a href="%1$s" target="_blank" rel="noopener">%2$s</a>',
			esc_url( $value ),
			esc_html( $value )
		);
	}

	/**
	 * Render a media file field.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Meta field definition.
	 * @param string $value   Current stored value.
	 * @return void
	 */
	private function render_media_file_field( int $post_id, string $key, array $field, string $value ): void {
		$expects_image = $this->media_file_field_expects_image( $key, $field );
		$file_id       = absint( $value );
		$file_title    = '';
		$file_url      = '';
		$is_image      = false;
		$image_html    = '';

		if ( $file_id > 0 ) {
			$file_post = get_post( $file_id );
			$file_url  = wp_get_attachment_url( $file_id );
			$is_image  = wp_attachment_is_image( $file_id ) || $expects_image;
			if ( $file_post ) {
				$file_title = $file_post->post_title;
			}

			if ( $is_image ) {
				$image_url = wp_get_attachment_image_url( $file_id, 'medium' );

				if ( $image_url ) {
					$image_html = sprintf(
						'<img src="%1$s" alt="" style="display:block;max-width:180px;height:auto;border:1px solid #ddd;border-radius:4px;margin-bottom:8px;" />',
						esc_url( $image_url )
					);
				}
			}
		}

		printf(
			'<div class="ambrygen-media-file-field"%s>',
			$expects_image ? ' data-library-type="image"' : ''
		);
		printf(
			'<input type="hidden" name="%1$s" id="%1$s" class="widefat ambrygen-media-file-input" value="%2$s" />',
			esc_attr( $key ),
			esc_attr( $file_id )
		);
		echo '<div class="ambrygen-media-file-preview" style="margin:8px 0;">';
		if ( $file_id > 0 && $file_url ) {
			printf(
				'<span class="ambrygen-media-file-preview-item" data-attachment-id="%1$d">' .
					'%4$s' .
					'<a class="ambrygen-media-file-link" href="%2$s" target="_blank" rel="noopener">%3$s</a>' .
				'</span>',
				$file_id,
				esc_url( $file_url ),
				esc_html( $file_title ?: basename( $file_url ) ),
				$image_html
			);
		} else {
			echo '<span class="ambrygen-media-file-empty">' . esc_html__( 'No file selected.', 'ambrygen-web' ) . '</span>';
		}
		echo '</div>';
		echo '<div class="form-field-button">';
		echo '<button type="button" class="theme-button is-secondary ambrygen-media-file-upload">';
		esc_html_e( 'Select File', 'ambrygen-web' );
		echo '</button> ';
		echo '<button type="button" class="theme-button is-destructive ambrygen-media-file-remove">';
		esc_html_e( 'Clear', 'ambrygen-web' );
		echo '</button>';
		echo '</div>';
		echo '</div>';
	}

	/**
	 * Determine whether a media file field expects an image attachment.
	 *
	 * @param string $key   Meta field key.
	 * @param array  $field Meta field definition.
	 * @return bool
	 */
	private function media_file_field_expects_image( string $key, array $field ): bool {
		if ( isset( $field['library_type'] ) && 'image' === $field['library_type'] ) {
			return true;
		}

		if ( isset( $field['preview_type'] ) && 'image' === $field['preview_type'] ) {
			return true;
		}

		return (bool) preg_match( '/(^|_)image(_|$)/', $key );
	}

	/**
	 * Save meta box values for a post.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Current post object.
	 * @return void
	 */
	public function save_meta_boxes( int $post_id, WP_Post $post ): void {
		$ambrygen_nonce_ok = false;
		if ( ! empty( $_POST['ambrygen_meta_nonce'] ) ) {
			$ambrygen_nonce_ok = wp_verify_nonce(
				sanitize_text_field( wp_unslash( $_POST['ambrygen_meta_nonce'] ) ),
				'ambrygen_meta_box'
			);
		}

		// Fallback for editor flows where the custom meta-box nonce isn't present,
		// but core post edit nonce is (e.g. Block Editor / metabox save flow).
		$core_nonce_ok = false;
		if ( ! $ambrygen_nonce_ok && ! empty( $_POST['_wpnonce'] ) ) {
			$core_nonce_ok = wp_verify_nonce(
				sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ),
				'update-post_' . $post_id
			);
		}

		if ( ! $ambrygen_nonce_ok && ! $core_nonce_ok ) {
			// Some editor flows may not include either nonce for metabox saves, but will still include
			// a matching post_ID from the edit form request.
			$posted_post_id = isset( $_POST['post_ID'] ) ? absint( wp_unslash( $_POST['post_ID'] ) ) : 0;
			if ( 0 === $posted_post_id || $posted_post_id !== $post_id ) {
				return;
			}
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( 'post' === $post->post_type ) {
			if ( isset( $_POST['webinar_authors_meta_box_present'] ) || isset( $_POST['webinar_authors'] ) ) {
				$this->save_webinar_author_repeater( $post_id, 'webinar_authors', array() );
			}
		}

		$def    = $this->definitions[ $post->post_type ] ?? null;
		$fields = $def ? $def->meta_fields() : array();

		foreach ( $fields as $key => $field ) {
			$type     = $field['type'] ?? 'text';
			$sanitize = $field['sanitize'] ?? 'sanitize_text_field';

			if ( 'marketing_material_repeater' === $type ) {
				$this->save_marketing_material_repeater( $post_id, $key, $field );
				continue;
			}

			if ( 'event_meet_expert_repeater' === $type ) {
				$this->save_event_meet_expert_repeater( $post_id, $key, $field );
				continue;
			}

			if ( in_array( $type, array( 'poster_pdf_repeater', 'presentation_pdf_repeater' ), true ) ) {
				$this->save_poster_pdf_repeater( $post_id, $key, $field );
				continue;
			}

			if ( 'webinar_author_repeater' === $type ) {
				$this->save_webinar_author_repeater( $post_id, $key, $field );
				continue;
			}

			if ( 'product_stats_repeater' === $type ) {
				$this->save_product_stats_repeater( $post_id, $key, $field );
				continue;
			}

			if ( ! isset( $_POST[ $key ] ) ) {
				if ( 'checkbox' === $type ) {
					update_post_meta( $post_id, $key, '0' );
				} elseif ( isset( $field['multiple'] ) && $field['multiple'] ) {
					delete_post_meta( $post_id, $key );
				}
				continue;
			}

			$raw_val = wp_unslash( $_POST[ $key ] );

			if ( 'date' === $type ) {
				if ( empty( $raw_val ) ) {
					delete_post_meta( $post_id, $key );
					continue;
				}

				$parsed = strtotime( $raw_val );
				if ( $parsed ) {
					$raw_val = wp_date( 'Y-m-d H:i:s', $parsed );
				}
			}

			if ( 'datetime-local' === $type ) {
				$raw_val = sanitize_text_field( (string) $raw_val );

				if ( empty( $raw_val ) ) {
					delete_post_meta( $post_id, $key );
					continue;
				}

				$parsed = strtotime( $raw_val );
				if ( $parsed ) {
					$raw_val = wp_date( 'Y-m-d H:i:s', $parsed );
				}
			}

			if ( 'time' === $type ) {
				$raw_val = sanitize_text_field( (string) $raw_val );

				if ( empty( $raw_val ) ) {
					delete_post_meta( $post_id, $key );
					continue;
				}
			}

			if ( isset( $field['multiple'] ) && $field['multiple'] ) {
				if ( ! is_array( $raw_val ) ) {
					$raw_val = array();
				}

				if ( is_callable( $sanitize ) && 'sanitize_text_field' !== $sanitize ) {
					$sanitized_value = call_user_func( $sanitize, $raw_val );
				} else {
					$sanitized_value = $this->sanitize_array( $raw_val );
				}

				if ( ! is_array( $sanitized_value ) ) {
					$sanitized_value = array();
				}

				$sanitized_value = array_values(
					array_filter(
						array_map( 'absint', $sanitized_value )
					)
				);

				if ( empty( $sanitized_value ) ) {
					delete_post_meta( $post_id, $key );
				} else {
					update_post_meta( $post_id, $key, $sanitized_value );
				}
			} else {
				update_post_meta(
					$post_id,
					$key,
					call_user_func( $sanitize, $raw_val )
				);
			}
		}

		if ( 'poster' === $post->post_type ) {
			$this->maybe_assign_poster_linked_authors( $post_id );
		}
	}

	/**
	 * Assign linked author meta for posters based on parsed author names.
	 *
	 * @param int $post_id Poster post ID.
	 * @return void
	 */
	private function maybe_assign_poster_linked_authors( int $post_id ): void {
		$author_names = \Ambrygen\Theme\Core\Helper::get_poster_authors( $post_id );
		if ( empty( $author_names ) ) {
			return;
		}

		$matched_author_ids = array();
		foreach ( $author_names as $author_name ) {
			$matched_author_id = $this->find_author_post_id_by_name( (string) $author_name );
			if ( $matched_author_id > 0 ) {
				$matched_author_ids[] = $matched_author_id;
			}
		}

		$matched_author_ids = array_values( array_unique( array_filter( array_map( 'absint', $matched_author_ids ) ) ) );
		if ( empty( $matched_author_ids ) ) {
			return;
		}

		update_post_meta( $post_id, 'linked_author', $matched_author_ids );
	}

	/**
	 * Find an author post ID by matching a normalized author name.
	 *
	 * @param string $author_name Author name to match.
	 * @return int
	 */
	private function find_author_post_id_by_name( string $author_name ): int {
		$normalized_name = $this->normalize_author_lookup_value( $author_name );
		if ( '' === $normalized_name ) {
			return 0;
		}

		$author_posts = get_posts(
			array(
				'post_type'      => 'author',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);

		foreach ( $author_posts as $author_post_id ) {
			$author_post_id = absint( $author_post_id );
			if ( $author_post_id <= 0 ) {
				continue;
			}

			$candidate_values = array(
				get_the_title( $author_post_id ),
				get_post_meta( $author_post_id, 'display_name', true ),
				get_post_meta( $author_post_id, 'username', true ),
			);

			$post_author_user_id = (int) get_post_field( 'post_author', $author_post_id );
			if ( $post_author_user_id > 0 ) {
				$user = get_user_by( 'id', $post_author_user_id );
				if ( $user ) {
					$candidate_values[] = $user->display_name ?? '';
					$candidate_values[] = $user->user_login ?? '';
					$candidate_values[] = $user->user_nicename ?? '';
				}
			}

			foreach ( $candidate_values as $candidate_value ) {
				if ( $this->normalize_author_lookup_value( (string) $candidate_value ) === $normalized_name ) {
					return $author_post_id;
				}
			}
		}

		return 0;
	}

	/**
	 * Normalize a value for author lookup comparisons.
	 *
	 * @param string $value Raw author lookup value.
	 * @return string
	 */
	private function normalize_author_lookup_value( string $value ): string {
		$value = wp_strip_all_tags( $value );
		$value = html_entity_decode( $value, ENT_QUOTES, 'UTF-8' );
		$value = strtolower( trim( preg_replace( '/\s+/', ' ', $value ) ) );

		return $value;
	}

	/**
	 * Save marketing material repeater field rows.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Meta field definition.
	 * @return void
	 */
	private function save_marketing_material_repeater( int $post_id, string $key, array $field ): void {
		$rows_raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
		if ( ! is_array( $rows_raw ) ) {
			delete_post_meta( $post_id, $key );
			return;
		}

		$allowed_statuses = array( 'in_production', 'on_staging', 'disabled_urgent' );
		$taxonomy_slug    = isset( $field['language_taxonomy'] ) ? (string) $field['language_taxonomy'] : 'marketing_material_language';
		$now              = (string) current_time( 'mysql' );
		$rows             = array();

		foreach ( $rows_raw as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$file_id          = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
			$media_lab_id     = isset( $row['media_lab_id'] ) ? sanitize_text_field( (string) $row['media_lab_id'] ) : '';
			$status           = isset( $row['status'] ) ? sanitize_key( (string) $row['status'] ) : '';
			$language_term_id = isset( $row['language_term_id'] ) ? absint( $row['language_term_id'] ) : 0;
			$replacement_date = isset( $row['replacement_date'] ) ? sanitize_text_field( (string) $row['replacement_date'] ) : '';
			$created_at       = isset( $row['created_at'] ) ? sanitize_text_field( (string) $row['created_at'] ) : '';

			$replacement_date = $replacement_date ? gmdate( 'Y-m-d', strtotime( $replacement_date ) ) : '';
			if ( ! in_array( $status, $allowed_statuses, true ) ) {
				$status = 'in_production';
			}

			if ( $language_term_id > 0 ) {
				$term = get_term( $language_term_id, $taxonomy_slug );
				if ( ! $term || is_wp_error( $term ) ) {
					$language_term_id = 0;
				}
			}

			$is_active         = ! empty( $row['is_active'] );
			$is_web            = ! empty( $row['is_web'] );
			$is_print          = ! empty( $row['is_print'] );
			$is_self_printable = ! empty( $row['is_self_printable'] );

			$is_empty_row = ( 0 === $file_id )
				&& ( '' === $media_lab_id )
				&& ( 0 === $language_term_id )
				&& ( '' === $replacement_date )
				&& ! $is_web
				&& ! $is_print
				&& ! $is_self_printable;

			if ( $is_empty_row ) {
				continue;
			}

			if ( '' === $created_at ) {
				$created_at = $now;
			}

			$rows[] = array(
				'file_id'           => $file_id,
				'media_lab_id'      => $media_lab_id,
				'status'            => $status,
				'is_active'         => $is_active ? 1 : 0,
				'is_web'            => $is_web ? 1 : 0,
				'is_print'          => $is_print ? 1 : 0,
				'is_self_printable' => $is_self_printable ? 1 : 0,
				'language_term_id'  => $language_term_id,
				'replacement_date'  => $replacement_date,
				'created_at'        => $created_at,
				'updated_at'        => $now,
			);
		}

		if ( empty( $rows ) ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $rows );
		}
	}

	/**
	 * Save event meet-the-expert repeater field rows.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Meta field definition.
	 * @return void
	 */
	private function save_event_meet_expert_repeater( int $post_id, string $key, array $field ): void {
		$rows_raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
		if ( ! is_array( $rows_raw ) ) {
			delete_post_meta( $post_id, $key );
			return;
		}

		$rows = array();

		foreach ( $rows_raw as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$session_date = isset( $row['session_date'] ) ? sanitize_text_field( (string) $row['session_date'] ) : '';
			$session_time = isset( $row['session_time'] ) ? sanitize_text_field( (string) $row['session_time'] ) : '';
			$session_date = $session_date ? gmdate( 'Y-m-d', strtotime( $session_date ) ) : '';

			$members_raw = isset( $row['members'] ) && is_array( $row['members'] ) ? $row['members'] : array();
			if ( empty( $members_raw ) ) {
				$members_raw = array(
					array(
						'name'        => isset( $row['name'] ) ? $row['name'] : '',
						'designation' => isset( $row['designation'] ) ? $row['designation'] : '',
						'bio'         => isset( $row['bio'] ) ? $row['bio'] : '',
						'image_id'    => isset( $row['image_id'] ) ? $row['image_id'] : 0,
					),
				);
			}

			$members = array();
			foreach ( $members_raw as $member_row ) {
				if ( ! is_array( $member_row ) ) {
					continue;
				}

				$name        = isset( $member_row['name'] ) ? sanitize_text_field( (string) $member_row['name'] ) : '';
				$designation = isset( $member_row['designation'] ) ? sanitize_text_field( (string) $member_row['designation'] ) : '';
				$bio         = isset( $member_row['bio'] ) ? wp_kses_post( (string) $member_row['bio'] ) : '';
				$image_id    = isset( $member_row['image_id'] ) ? absint( $member_row['image_id'] ) : 0;

				if ( '' === $name && '' === $designation && '' === trim( wp_strip_all_tags( $bio ) ) && 0 === $image_id ) {
					continue;
				}

				$members[] = array(
					'name'        => $name,
					'designation' => $designation,
					'bio'         => $bio,
					'image_id'    => $image_id,
				);
			}

			if ( '' === $session_date && '' === $session_time && empty( $members ) ) {
				continue;
			}

			$rows[] = array(
				'session_date' => $session_date,
				'session_time' => $session_time,
				'members'      => $members,
			);
		}

		if ( empty( $rows ) ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $rows );
		}
	}

	/**
	 * Save poster or presentation PDF repeater rows.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Meta field definition.
	 * @return void
	 */
	private function save_poster_pdf_repeater( int $post_id, string $key, array $field ): void {
		$rows_raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
		if ( ! is_array( $rows_raw ) ) {
			delete_post_meta( $post_id, $key );
			return;
		}

		$rows = array();

		foreach ( $rows_raw as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$file_id  = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
			$pdf_type = isset( $row['pdf_type'] ) ? sanitize_text_field( (string) $row['pdf_type'] ) : '';

			if ( 0 === $file_id && '' === $pdf_type ) {
				continue;
			}

			$rows[] = array(
				'pdf_type' => $pdf_type,
				'file_id'  => $file_id,
			);
		}

		if ( empty( $rows ) ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $rows );
		}
	}

	/**
	 * Save webinar author repeater rows.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Meta field definition.
	 * @return void
	 */
	private function save_webinar_author_repeater( int $post_id, string $key, array $field ): void {
		$rows_raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
		if ( ! is_array( $rows_raw ) ) {
			delete_post_meta( $post_id, $key );
			return;
		}

		$rows       = array();
		$author_ids = array();

		foreach ( $rows_raw as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$linked_author = isset( $row['linked_author'] ) ? absint( $row['linked_author'] ) : 0;
			$designation   = isset( $row['designation'] ) ? sanitize_text_field( (string) $row['designation'] ) : '';
			$bio           = isset( $row['bio'] ) ? wp_kses_post( (string) $row['bio'] ) : '';
			$image_id      = isset( $row['image_id'] ) ? absint( $row['image_id'] ) : 0;

			if ( 0 === $linked_author && '' === $designation && '' === trim( wp_strip_all_tags( $bio ) ) && 0 === $image_id ) {
				continue;
			}

			if ( $linked_author > 0 ) {
				$author_post = get_post( $linked_author );
				if ( ! $author_post || 'author' !== $author_post->post_type ) {
					$linked_author = 0;
				}
			}

			$rows[] = array(
				'linked_author' => $linked_author,
				'designation'   => $designation,
				'bio'           => $bio,
				'image_id'      => $image_id,
			);

			if ( $linked_author > 0 ) {
				$author_ids[] = $linked_author;
			}
		}

		if ( empty( $rows ) ) {
			delete_post_meta( $post_id, $key );
			delete_post_meta( $post_id, 'linked_author' );
			return;
		}

		update_post_meta( $post_id, $key, $rows );

		$author_ids = array_values( array_unique( array_filter( array_map( 'absint', $author_ids ) ) ) );
		if ( empty( $author_ids ) ) {
			delete_post_meta( $post_id, 'linked_author' );
		} else {
			update_post_meta( $post_id, 'linked_author', $author_ids );
		}
	}

	/**
	 * Save product stats repeater rows.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Meta field definition.
	 * @return void
	 */
	private function save_product_stats_repeater( int $post_id, string $key, array $field ): void {
		$rows_raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
		if ( ! is_array( $rows_raw ) ) {
			delete_post_meta( $post_id, $key );
			return;
		}

		$rows = array();
		foreach ( $rows_raw as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$title           = isset( $row['title'] ) ? sanitize_text_field( (string) $row['title'] ) : '';
			$subtitle        = isset( $row['subtitle'] ) ? sanitize_text_field( (string) $row['subtitle'] ) : '';
			$description     = isset( $row['description'] ) ? sanitize_text_field( (string) $row['description'] ) : '';
			$sub_description = isset( $row['sub_description'] ) ? sanitize_text_field( (string) $row['sub_description'] ) : '';

			if ( '' === $title && '' === $subtitle && '' === $description && '' === $sub_description ) {
				continue;
			}

			$rows[] = array(
				'title'           => $title,
				'subtitle'        => $subtitle,
				'description'     => $description,
				'sub_description' => $sub_description,
			);
		}

		if ( empty( $rows ) ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $rows );
		}
	}

	/**
	 * Sanitize an array of values as absolute integers.
	 *
	 * @param mixed $value Raw value.
	 * @return array
	 */
	private function sanitize_array( $value ): array {
		if ( ! is_array( $value ) ) {
			$value = array();
		}

		return array_filter(
			array_map( 'absint', $value )
		);
	}

	/**
	 * Enqueue admin media assets for supported post edit screens.
	 *
	 * @return void
	 */
	public function enqueue_post_meta_media(): void {
		$screen               = get_current_screen();
		$supported_post_types = array_merge(
			array_keys( $this->definitions ),
			array( 'post' )
		);

		if ( ! $screen || ! in_array( $screen->post_type, $supported_post_types, true ) ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_script( 'wplink' );
		wp_enqueue_style( 'editor-buttons' );
		if ( function_exists( 'wp_enqueue_editor' ) ) {
			wp_enqueue_editor();
		}
		wp_enqueue_script( 'jquery-ui-autocomplete' );
		wp_enqueue_script( 'jquery-ui-sortable' );
	}
}
