<?php
/**
 * Custom Post Types.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

use WP_Post;
use Ambrygen\Theme\Core\PostTypes\AbstractPostType;
use Ambrygen\Theme\Core\PostTypes\Definitions\OurTeam;
use Ambrygen\Theme\Core\PostTypes\Definitions\Jobs;
use Ambrygen\Theme\Core\PostTypes\Definitions\TreadShows;
use Ambrygen\Theme\Core\PostTypes\Definitions\Booths;
use Ambrygen\Theme\Core\PostTypes\Definitions\Addresses;
use Ambrygen\Theme\Core\PostTypes\Definitions\SharedTaxonomies;

defined( 'ABSPATH' ) || exit;

final class PostTypes {
	use Singleton;

	/**
	 * All definition class names.
	 *
	 * @var class-string<AbstractPostType>[]
	 */
	private const DEFINITIONS = array(
		OurTeam::class,
		Jobs::class,
		TreadShows::class,
		Booths::class,
		Addresses::class,
		SharedTaxonomies::class,
	);

	/** @var AbstractPostType[] Instantiated definitions, keyed by slug. */
	private array $definitions = array();

	// -------------------------------------------------------------------------
	// Boot
	// -------------------------------------------------------------------------

	protected function __construct() {
		// Instantiate once and index by slug for O(1) lookups.
		foreach ( self::DEFINITIONS as $class ) {
			$instance                               = new $class();
			$this->definitions[ $instance->slug() ] = $instance;
		}

		$this->register_post_types();
		$this->register_taxonomies();
		$this->register_post_meta_fields();
		$this->register_taxonomy_meta();

		add_action( 'init', array( $this, 'register_conference_rewrite' ) );
		add_filter( 'query_vars', array( $this, 'register_conference_query_vars' ) );
		add_filter( 'post_type_link', array( $this, 'filter_conference_permalink' ), 10, 2 );
		add_action( 'pre_get_posts', array( $this, 'filter_conference_query' ) );

		add_action( 'add_meta_boxes', array( $this, 'register_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_meta_boxes' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_post_meta_media' ) );

		add_shortcode( 'ambrygen_conference_meta', array( $this, 'render_conference_meta_shortcode' ) );

		add_action( 'wp_ajax_ambrygen_conference_pagination', array( $this, 'ajax_conference_pagination' ) );
		add_action( 'wp_ajax_nopriv_ambrygen_conference_pagination', array( $this, 'ajax_conference_pagination' ) );
	}

	/**
	 * Register custom post types.
	 *
	 * @return void
	 */
	public function register_post_types(): void {
		foreach ( $this->definitions as $slug => $def ) {
			if ( '' === $slug ) {
				continue;
			}

			register_post_type(
				$slug,
				array_merge(
					array(
						'labels'              => $this->build_labels( $def ),
						'public'              => $def->public(),
						'show_in_menu'        => true,
						'menu_icon'           => $def->menu_icon(),
						'supports'            => $def->supports(),
						'rewrite'             => array( 'slug' => $slug ),
						'has_archive'         => $def->has_archive(),
						'show_in_rest'        => true,
						'exclude_from_search' => false,
						'publicly_queryable'  => true,
					),
					$def->extra_args()
				)
			);
		}
	}

	/**
	 * Register all taxonomies declared by definitions.
	 *
	 * Priority of object_type resolution (highest to lowest):
	 *   1. 'global' => true   -- attaches to every registered CPT automatically.
	 *   2. 'object_types'     -- explicit list of slugs (cross-group sharing).
	 *   3. Default            -- only the post type that declared the taxonomy.
	 */
	public function register_taxonomies(): void {
		$all_slugs = array_values( array_filter( array_keys( $this->definitions ) ) );

		foreach ( $this->definitions as $slug => $def ) {
			foreach ( $def->taxonomies() as $tax ) {
				if ( ! empty( $tax['global'] ) ) {
					$object_types = $all_slugs;
				} elseif ( ! empty( $tax['object_types'] ) ) {
					$object_types = $tax['object_types'];
				} else {
					$object_types = array( $slug );
				}

				if ( ! empty( $tax['use_existing'] ) ) {
					$taxonomy_slug = $tax['slug'];
					add_action(
						'init',
						static function () use ( $taxonomy_slug, $object_types ) {
							foreach ( $object_types as $object_type ) {
								register_taxonomy_for_object_type( $taxonomy_slug, $object_type );
							}
						},
						11
					);
					continue;
				}

				register_taxonomy(
					$tax['slug'],
					$object_types,
					array_merge(
						array(
							'labels'            => $tax['labels'],
							'hierarchical'      => $tax['hierarchical'] ?? false,
							'show_ui'           => true,
							'show_admin_column' => true,
							'show_in_rest'      => true,
							'rewrite'           => array( 'slug' => $tax['slug'] ),
						),
						$tax['extra_args'] ?? array()
					)
				);
			}
		}
	}

	/**
	 * Register post meta for REST API and Gutenberg access.
	 */
	public function register_post_meta_fields(): void {
		foreach ( $this->definitions as $slug => $def ) {
			foreach ( $def->meta_fields() as $meta_key => $field ) {
				register_post_meta(
					$slug,
					$meta_key,
					array(
						'type'              => 'string',
						'single'            => true,
						'sanitize_callback' => $field['sanitize'] ?? 'sanitize_text_field',
						'show_in_rest'      => true,
						'auth_callback'     => static fn (): bool => current_user_can( 'edit_posts' ),
					)
				);
			}
		}
	}

	// -------------------------------------------------------------------------
	// Conferences Custom Permalinks
	// -------------------------------------------------------------------------

	/**
	 * Register custom rewrite rule for conferences with meta-based URL.
	 *
	 * @return void
	 */
	public function register_conference_rewrite(): void {
		add_rewrite_tag( '%old_id%', '([^/]+)' );
		add_rewrite_tag( '%pr_name%', '([^/]+)' );

		add_rewrite_rule(
			'^conferences/([^/]+)/([^/]+)/?$',
			'index.php?post_type=conferences&old_id=$matches[1]&pr_name=$matches[2]',
			'top'
		);
	}

	/**
	 * Register custom query vars for conferences.
	 *
	 * @param array $vars Existing query vars.
	 * @return array
	 */
	public function register_conference_query_vars( array $vars ): array {
		$vars[] = 'old_id';
		$vars[] = 'pr_name';
		return $vars;
	}

	/**
	 * Filter conference permalinks to use _old_id/pr_name when available.
	 *
	 * @param string  $post_link Generated permalink.
	 * @param WP_Post $post      Post object.
	 * @return string
	 */
	public function filter_conference_permalink( string $post_link, WP_Post $post ): string {
		if ( 'conferences' !== $post->post_type ) {
			return $post_link;
		}

		$old_id  = get_post_meta( $post->ID, '_old_id', true );
		$pr_name = get_post_meta( $post->ID, 'pr_name', true );

		if ( empty( $old_id ) || empty( $pr_name ) ) {
			return $post_link;
		}

		$old_id       = rawurlencode( (string) $old_id );
		$pr_name_slug = sanitize_title( (string) $pr_name );

		return home_url( user_trailingslashit( "conferences/{$old_id}/{$pr_name_slug}" ) );
	}

	/**
	 * Resolve conference single requests by _old_id and pr_name.
	 *
	 * @param \WP_Query $query Main query instance.
	 * @return void
	 */
	public function filter_conference_query( \WP_Query $query ): void {
		if ( is_admin() || ! $query->is_main_query() ) {
			return;
		}

		if ( 'conferences' !== $query->get( 'post_type' ) ) {
			return;
		}

		$old_id  = $query->get( 'old_id' );
		$pr_name = $query->get( 'pr_name' );

		if ( empty( $old_id ) || empty( $pr_name ) ) {
			return;
		}

		$old_id  = sanitize_text_field( (string) $old_id );
		$pr_name = sanitize_text_field( rawurldecode( (string) $pr_name ) );
		$pr_name = preg_replace( '/\s+/', ' ', str_replace( '-', ' ', $pr_name ) );
		$pr_name = trim( $pr_name );

		$query->set(
			'meta_query',
			array(
				array(
					'key'   => '_old_id',
					'value' => $old_id,
				),
				array(
					'key'   => 'pr_name',
					'value' => $pr_name,
				),
			)
		);
		$query->set( 'posts_per_page', 1 );
		$query->set( 'post_status', 'publish' );

		// Force single template resolution for custom meta-based conference URLs.
		$query->is_singular = true;
		$query->is_single = true;
		$query->is_post_type_archive = false;
		$query->is_archive = false;
		$query->is_home = false;
	}

	// -------------------------------------------------------------------------
	// Meta Boxes
	// -------------------------------------------------------------------------

	/**
	 * Register meta boxes for definitions that declare meta fields.
	 */
	public function register_meta_boxes(): void {
		foreach ( $this->definitions as $slug => $def ) {
			if ( empty( $def->meta_fields() ) ) {
				continue;
			}

			add_meta_box(
				$slug . '_meta_box',
				/* translators: %s: singular post type label */
				sprintf( __( '%s Details', 'ambrygen' ), $def->singular_label() ),
				array( $this, 'render_meta_box' ),
				$slug,
				'normal',
				'default',
				array( 'slug' => $slug )
			);
		}
	}

	/**
	 * Render meta box fields for a post type.
	 *
	 * @param WP_Post $post Current post.
	 * @param array   $box  Meta box data; args['slug'] contains the post type slug.
	 */
	public function render_meta_box( WP_Post $post, array $box ): void {
		$def    = $this->definitions[ $box['args']['slug'] ] ?? null;
		$fields = $def ? $def->meta_fields() : array();

		wp_nonce_field( 'ambrygen_meta_box', 'ambrygen_meta_nonce' );

		foreach ( $fields as $key => $field ) {
			$value    = (string) get_post_meta( $post->ID, $key, true );
			$type     = $field['type'] ?? 'text';
			$input_id = esc_attr( $key );

			echo '<p>';
			printf(
				'<label for="%1$s">%2$s</label>',
				$input_id,
				esc_html( $field['label'] )
			);

			if ( 'textarea' === $type ) {
				printf(
					'<textarea name="%1$s" id="%1$s" class="widefat" rows="4">%2$s</textarea>',
					$input_id,
					esc_textarea( $value )
				);
			} elseif ( 'checkbox' === $type ) {
				$is_checked = ( '' !== $value && '0' !== $value && 'false' !== $value );
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
			} elseif ( 'media_gallery' === $type ) {
				$ids = array_filter(
					array_map(
						'absint',
						array_map(
							'trim',
							explode( ',', (string) $value )
						)
					)
				);

				echo '<div class="ambrygen-media-gallery-field" style="margin-bottom:16px;">';
				printf(
					'<label for="%1$s">%2$s</label>',
					esc_attr( $key ),
					esc_html( $field['label'] )
				);
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
					printf(
						'<img src="%1$s" alt="" style="width:72px;height:72px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />',
						esc_url( $thumb )
					);
				}
				echo '</div>';
				echo '<p>';
				echo '<button type="button" class="button button-secondary ambrygen-media-gallery-upload">';
				esc_html_e( 'Select Images', 'ambrygen' );
				echo '</button> ';
				echo '<button type="button" class="button button-secondary ambrygen-media-gallery-remove">';
				esc_html_e( 'Clear', 'ambrygen' );
				echo '</button>';
				echo '</p>';
				echo '<p class="description">';
				esc_html_e( 'Selected image IDs are saved as comma-separated values.', 'ambrygen' );
				echo '</p>';
				echo '</div>';
			} else {
				printf(
					'<input type="%1$s" name="%2$s" id="%2$s" class="widefat" value="%3$s">',
					esc_attr( $type ),
					$input_id,
					esc_attr( $value )
				);
			}

			echo '</p>';
		}
	}

	/**
	 * Persist meta box values on post save.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object.
	 */
	public function save_meta_boxes( int $post_id, WP_Post $post ): void {
		if (
			empty( $_POST['ambrygen_meta_nonce'] ) ||
			! wp_verify_nonce(
				sanitize_text_field( wp_unslash( $_POST['ambrygen_meta_nonce'] ) ),
				'ambrygen_meta_box'
			)
		) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$def    = $this->definitions[ $post->post_type ] ?? null;
		$fields = $def ? $def->meta_fields() : array();

		foreach ( $fields as $key => $field ) {
			$type     = $field['type'] ?? 'text';
			$sanitize = $field['sanitize'] ?? 'sanitize_text_field';

			if ( ! isset( $_POST[ $key ] ) ) {
				// If it's a checkbox and not in $_POST, it was unchecked. Save as '0'.
				if ( 'checkbox' === $type ) {
					update_post_meta( $post_id, $key, '0' );
				}
				continue;
			}

			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized via callback below.
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

			update_post_meta(
				$post_id,
				$key,
				call_user_func( $sanitize, $raw_val )
			);
		}
	}

	/**
	 * Sanitize CSV attachment IDs.
	 *
	 * @param mixed $value Raw value.
	 * @return string
	 */
	public function sanitize_comma_separated_ids( $value ): string {
		if ( is_array( $value ) ) {
			$value = implode( ',', $value );
		}

		$ids = array_filter(
			array_map(
				'absint',
				array_map(
					'trim',
					explode( ',', (string) $value )
				)
			)
		);

		return implode( ',', $ids );
	}

	/**
	 * Enqueue admin media uploader for post meta gallery fields.
	 *
	 * @return void
	 */
	public function enqueue_post_meta_media(): void {
		$screen = get_current_screen();
		if ( ! $screen || 'our_team' !== $screen->post_type ) {
			return;
		}

		wp_enqueue_media();
		wp_add_inline_script(
			'jquery-core',
			"
			jQuery(function($){
				function renderPreview(container, attachments){
					var preview = container.find('.ambrygen-media-gallery-preview');
					preview.empty();
					attachments.forEach(function(item){
						if (!item || !item.url) {
							return;
						}
						preview.append('<img src=\"' + item.url + '\" alt=\"\" style=\"width:72px;height:72px;object-fit:cover;border:1px solid #ddd;border-radius:4px;\" />');
					});
				}

				$(document).on('click', '.ambrygen-media-gallery-upload', function(e){
					e.preventDefault();
					var container = $(this).closest('.ambrygen-media-gallery-field');
					var input = container.find('.ambrygen-media-gallery-input');
					var frame = wp.media({
						title: 'Select Gallery Images',
						button: { text: 'Use selected images' },
						multiple: true,
						library: { type: 'image' }
					});

					frame.on('open', function(){
						var selected = frame.state().get('selection');
						var ids = (input.val() || '').split(',').map(function(id){ return parseInt(id, 10); }).filter(Boolean);
						ids.forEach(function(id){
							var attachment = wp.media.attachment(id);
							attachment.fetch();
							selected.add(attachment ? [attachment] : []);
						});
					});

					frame.on('select', function(){
						var selection = frame.state().get('selection').toJSON();
						var ids = selection.map(function(item){ return item.id; }).filter(Boolean);
						var thumbs = selection.map(function(item){
							var thumb = item.sizes && item.sizes.thumbnail ? item.sizes.thumbnail.url : item.url;
							return { id: item.id, url: thumb };
						});
						input.val(ids.join(',')).trigger('change');
						renderPreview(container, thumbs);
					});

					frame.open();
				});

				$(document).on('click', '.ambrygen-media-gallery-remove', function(e){
					e.preventDefault();
					var container = $(this).closest('.ambrygen-media-gallery-field');
					container.find('.ambrygen-media-gallery-input').val('').trigger('change');
					container.find('.ambrygen-media-gallery-preview').empty();
				});
			});
			"
		);
	}

	/**
	 * Add image fields to job-related taxonomies.
	 */
	public function register_taxonomy_meta(): void {
		$taxonomies = array( 'job_type', 'job_location', 'job_preferences', 'test_type' );

		foreach ( $taxonomies as $taxonomy ) {
			register_term_meta(
				$taxonomy,
				'term_image',
				array(
					'type'              => 'integer',
					'single'            => true,
					'show_in_rest'      => true,
					'sanitize_callback' => 'absint',
					'auth_callback'     => static function () {
						return current_user_can( 'manage_categories' );
					},
				)
			);

			// Add field to add term screen.
			add_action(
				$taxonomy . '_add_form_fields',
				function () {
					echo '<div class="form-field term-image-wrap">';
					echo '<label>';
					esc_html_e( 'Image', 'ambrygen' );
					echo '</label>';
					wp_nonce_field( 'ambrygen_term_image_meta', 'ambrygen_term_image_nonce' );
					echo '<img src="" class="term_image_prev" style="max-width:100px; display:block; margin-bottom:5px;" />';
					echo '<input type="hidden" name="term_image" id="term_image" value="" class="term-image-field" />';
					echo '<button class="button button-secondary upload-term-image">';
					esc_html_e( 'Upload Image', 'ambrygen' );
					echo '</button> ';
					echo '<button class="button button-secondary remove-term-image">';
					esc_html_e( 'Remove Image', 'ambrygen' );
					echo '</button>';
					echo '</div>';
				},
				10,
				2
			);

			// Add field to edit term screen.
			add_action(
				$taxonomy . '_edit_form_fields',
				function ( $term ) {
					$image_id  = get_term_meta( $term->term_id, 'term_image', true );
					$image_url = $image_id ? wp_get_attachment_url( $image_id ) : '';
					echo '<tr class="form-field term-image-wrap">';
					echo '<th scope="row"><label>';
					esc_html_e( 'Image', 'ambrygen' );
					echo '</label></th>';
					echo '<td>';
					wp_nonce_field( 'ambrygen_term_image_meta', 'ambrygen_term_image_nonce' );
					printf(
						'<img src="%1$s" class="term_image_prev" style="max-width:100px; display:block; margin-bottom:5px;" />',
						esc_url( $image_url )
					);
					printf(
						'<input type="hidden" name="term_image" id="term_image" value="%1$s" class="term-image-field" />',
						esc_attr( $image_id )
					);
					echo '<button class="button button-secondary upload-term-image">';
					esc_html_e( 'Upload Image', 'ambrygen' );
					echo '</button> ';
					echo '<button class="button button-secondary remove-term-image">';
					esc_html_e( 'Remove Image', 'ambrygen' );
					echo '</button>';
					echo '</td></tr>';
				},
				10,
				2
			);

			// Save term meta.
			add_action( 'created_' . $taxonomy, array( $this, 'save_taxonomy_image_meta' ), 10, 2 );
			add_action( 'edited_' . $taxonomy, array( $this, 'save_taxonomy_image_meta' ), 10, 2 );
		}

		// Enqueue media uploader for admin.
		add_action(
			'admin_enqueue_scripts',
			function () {
				wp_enqueue_media();
				wp_add_inline_script(
					'jquery-core',
					"
				jQuery(document).ready(function($){
					var clearTermImageField = function(scope){
						var context = scope && scope.length ? scope : $('#addtag');
						context.find('.term-image-field').val('');
						context.find('.term_image_prev').attr('src', '');
					};

					// Upload image.
					$('.upload-term-image').on('click', function(e){
						e.preventDefault();
						var button = $(this);
						var input = button.prevAll('.term-image-field').first();
						var preview = button.prevAll('.term_image_prev').first();
						var media = wp.media({ title: 'Upload Image', multiple: false }).open().on('select', function(){
							var attachment = media.state().get('selection').first().toJSON();
							input.val( attachment.id ).trigger('change');
							preview.attr('src', attachment.url);
						});
					});

					// Remove image.
					$('.remove-term-image').on('click', function(e){
						e.preventDefault();
						var button = $(this);
						var input = button.prevAll('.term-image-field').first();
						var preview = button.prevAll('.term_image_prev').first();
						input.val('').trigger('change');
						preview.attr('src','');
					});

					// Clear add-term image field after successful term creation.
					$(document).ajaxSuccess(function(event, xhr, settings){
						if (!settings || typeof settings.data !== 'string') {
							return;
						}

						if (settings.data.indexOf('action=add-tag') === -1) {
							return;
						}

						if (xhr && xhr.responseJSON && xhr.responseJSON.success === false) {
							return;
						}

						clearTermImageField($('#addtag'));
					});
				});
			"
				);
			}
		);
	}

	/**
	 * Save taxonomy image meta.
	 *
	 * @param int $term_id Term ID.
	 */
	public function save_taxonomy_image_meta( int $term_id ): void {
		if (
			empty( $_POST['ambrygen_term_image_nonce'] ) ||
			! wp_verify_nonce(
				sanitize_text_field( wp_unslash( $_POST['ambrygen_term_image_nonce'] ) ),
				'ambrygen_term_image_meta'
			)
		) {
			return;
		}

		if ( isset( $_POST['term_image'] ) && ! empty( $_POST['term_image'] ) ) {
			update_term_meta( $term_id, 'term_image', intval( $_POST['term_image'] ) );
		} else {
			delete_term_meta( $term_id, 'term_image' );
		}
	}

	/**
	 * Get term IDs for a given post ID and taxonomy.
	 *
	 * @param int    $post_id  Post ID.
	 * @param string $taxonomy Taxonomy slug.
	 *
	 * @return int[] Array of term IDs.
	 */
	public function get_post_term_ids( int $post_id, string $taxonomy ): array {
		if ( ! $post_id || ! taxonomy_exists( $taxonomy ) ) {
			return array();
		}

		$terms = wp_get_post_terms(
			$post_id,
			$taxonomy,
			array(
				'fields' => 'ids', // Only return term IDs.
			)
		);

		if ( is_wp_error( $terms ) ) {
			return array();
		}

		return $terms;
	}

	/**
	 * Render a list of registered conference meta fields.
	 *
	 * @return string
	 */
	public function render_conference_meta_shortcode(): string {
		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return '';
		}

		return $this->render_post_meta_fields( $post_id );
	}

	/**
	 * Render registered meta fields for a post.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_post_meta_fields( int $post_id ): string {
		if ( ! $post_id ) {
			return '';
		}

		$post_type = get_post_type( $post_id );
		if ( ! $post_type ) {
			return '';
		}

		$def = $this->definitions[ $post_type ] ?? null;
		if ( ! $def ) {
			return '';
		}

		$fields = $def->meta_fields();
		if ( empty( $fields ) ) {
			return '';
		}

		$output = '<div class="ambrygen-meta-list">';
		foreach ( $fields as $key => $field ) {
			$raw_value = get_post_meta( $post_id, $key, true );
			$value = is_array( $raw_value ) ? implode( ', ', $raw_value ) : (string) $raw_value;

			if ( '' === $value ) {
				$value = '—';
			} elseif ( 'date' === ( $field['type'] ?? '' ) ) {
				$timestamp = strtotime( $value );
				if ( $timestamp ) {
					$value = date_i18n( 'F j, Y', $timestamp );
				}
			}

			$label = $field['label'] ?? $key;

			$output .= '<div class="ambrygen-meta-item">';
			$output .= '<div class="ambrygen-meta-label">' . esc_html( $label ) . '</div>';
			$output .= '<div class="ambrygen-meta-value">' . wp_kses_post( $value ) . '</div>';
			$output .= '</div>';
		}
		$output .= '</div>';

		return $output;
	}

	/**
	 * Render a compact event meta summary (date range + location).
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_event_meta_summary( int $post_id ): string {
		if ( ! $post_id ) {
			return '';
		}

		$post_type = get_post_type( $post_id );
		if ( ! $post_type ) {
			return '';
		}

		// Fallback to the full meta list for non-conference post types.
		if ( 'conferences' !== $post_type ) {
			return $this->render_post_meta_fields( $post_id );
		}

		$date_range = $this->format_event_date_range(
			(string) get_post_meta( $post_id, 'start_at', true ),
			(string) get_post_meta( $post_id, 'end_at', true )
		);

		$location = $this->get_event_location( $post_id );

		if ( '' === $date_range && '' === $location ) {
			return '';
		}

		$output  = '<div class="ambrygen-event-meta">';
		if ( '' !== $date_range ) {
			$output .= '<div class="ambrygen-event-meta__date text-small-semibold">' . esc_html( $date_range ) . '</div>';
		}
		if ( '' !== $location ) {
			$output .= '<div class="ambrygen-event-meta__location text-small-semibold">' . esc_html( $location ) . '</div>';
		}
		$output .= '</div>';

		return $output;
	}

	/**
	 * AJAX handler for conference pagination.
	 *
	 * @return void
	 */
	public function ajax_conference_pagination(): void {
		check_ajax_referer( 'ambrygen-ajax', 'nonce' );

		$paged     = isset( $_POST['paged'] ) ? absint( $_POST['paged'] ) : 1;
		$scope_raw = isset( $_POST['scope'] ) ? sanitize_text_field( wp_unslash( $_POST['scope'] ) ) : '';

		$paged    = $paged > 0 ? $paged : 1;
		$scope   = 'past' === $scope_raw ? 'past' : 'upcoming';
		$html    = $this->render_conference_ajax_content_from_part( $scope, $paged );

		wp_send_json_success(
			array(
				'html'     => $html,
				'current'  => $paged,
			)
		);
	}

	// -------------------------------------------------------------------------
	// Private Helpers
	// -------------------------------------------------------------------------

	/**
	 * Render conference query block output from a template part for AJAX response.
	 *
	 * @param string $scope Scope string (past|upcoming).
	 * @param int    $paged Current page.
	 * @return string
	 */
	private function render_conference_ajax_content_from_part( string $scope, int $paged ): string {
		$part = 'past' === $scope ? 'parts/past-conferences.html' : 'parts/upcoming-conferences.html';

		$template_path = locate_template( $part );
		if ( ! $template_path || ! file_exists( $template_path ) ) {
			return '';
		}

		$contents = file_get_contents( $template_path );
		if ( false === $contents || '' === $contents ) {
			return '';
		}

		$blocks = parse_blocks( $contents );
		$query_block = $this->find_first_query_block( $blocks );
		if ( ! $query_block ) {
			return '';
		}

		$query_id = isset( $query_block['attrs']['queryId'] ) ? absint( $query_block['attrs']['queryId'] ) : 0;
		if ( $query_id > 0 ) {
			$_GET[ 'query-' . $query_id . '-page' ] = (string) $paged;
		}

		$html = render_block( $query_block );

		if ( $query_id > 0 ) {
			unset( $_GET[ 'query-' . $query_id . '-page' ] );
		}

		return (string) $html;
	}

	/**
	 * Find the first core/query block in a parsed block tree.
	 *
	 * @param array $blocks Parsed blocks.
	 * @return array|null
	 */
	private function find_first_query_block( array $blocks ): ?array {
		foreach ( $blocks as $block ) {
			if ( ! is_array( $block ) ) {
				continue;
			}

			if ( isset( $block['blockName'] ) && 'core/query' === $block['blockName'] ) {
				return $block;
			}

			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$found = $this->find_first_query_block( $block['innerBlocks'] );
				if ( $found ) {
					return $found;
				}
			}
		}

		return null;
	}

	/**
	 * Format a date range like "March 18 - 20".
	 *
	 * @param string $start_raw Start date raw value.
	 * @param string $end_raw   End date raw value.
	 * @return string
	 */
	private function format_event_date_range( string $start_raw, string $end_raw ): string {
		$start_ts = $start_raw ? strtotime( $start_raw ) : false;
		$end_ts   = $end_raw ? strtotime( $end_raw ) : false;

		if ( ! $start_ts && ! $end_ts ) {
			return '';
		}

		if ( $start_ts && $end_ts ) {
			$start_month = wp_date( 'F', $start_ts );
			$end_month   = wp_date( 'F', $end_ts );
			$start_year  = wp_date( 'Y', $start_ts );
			$end_year    = wp_date( 'Y', $end_ts );

			if ( $start_month === $end_month && $start_year === $end_year ) {
				return sprintf(
					'%s %s - %s',
					$start_month,
					wp_date( 'j', $start_ts ),
					wp_date( 'j', $end_ts )
				);
			}

			return sprintf(
				'%s %s - %s %s',
				wp_date( 'F', $start_ts ),
				wp_date( 'j', $start_ts ),
				wp_date( 'F', $end_ts ),
				wp_date( 'j', $end_ts )
			);
		}

		if ( $start_ts ) {
			return wp_date( 'F j', $start_ts );
		}

		return wp_date( 'F j', $end_ts );
	}

	/**
	 * Resolve a conference location from taxonomy or meta.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	private function get_event_location( int $post_id ): string {
		$location = '';

		if ( taxonomy_exists( 'region' ) ) {
			$terms = get_the_terms( $post_id, 'region' );
			if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$location = implode(
					', ',
					array_map(
						static function ( $term ) {
							return (string) $term->name;
						},
						$terms
					)
				);
			}
		}

		if ( '' === $location ) {
			$location = (string) get_post_meta( $post_id, 'location', true );
		}

		return $location;
	}

	/**
	 * Build the full WP labels array from a definition.
	 *
	 * @param AbstractPostType $def Definition instance.
	 * @return array
	 */
	private function build_labels( AbstractPostType $def ): array {
		$plural   = $def->label();
		$singular = $def->singular_label();

		return array(
			'name'               => $plural,
			'singular_name'      => $singular,
			'menu_name'          => $plural,
			'name_admin_bar'     => $singular,
			/* translators: %s: singular post type label */
			'add_new_item'       => sprintf( __( 'Add New %s', 'ambrygen' ), $singular ),
			/* translators: %s: singular post type label */
			'edit_item'          => sprintf( __( 'Edit %s', 'ambrygen' ), $singular ),
			/* translators: %s: singular post type label */
			'new_item'           => sprintf( __( 'New %s', 'ambrygen' ), $singular ),
			/* translators: %s: singular post type label */
			'view_item'          => sprintf( __( 'View %s', 'ambrygen' ), $singular ),
			/* translators: %s: plural post type label */
			'all_items'          => sprintf( __( 'All %s', 'ambrygen' ), $plural ),
			/* translators: %s: plural post type label */
			'search_items'       => sprintf( __( 'Search %s', 'ambrygen' ), $plural ),
			'not_found'          => __( 'No items found.', 'ambrygen' ),
			'not_found_in_trash' => __( 'No items found in Trash.', 'ambrygen' ),
		);
	}
}
