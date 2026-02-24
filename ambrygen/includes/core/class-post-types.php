<?php
/**
 * Custom Post Types.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

use WP_Post;

defined( 'ABSPATH' ) || exit;

final class Post_Types {
	use Singleton;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Setup hooks.
	 *
	 * @return void
	 */
	private function setup_hooks(): void {

		$this->register_post_types();
		$this->register_taxonomies();
		$this->register_post_meta_fields();
		$this->register_taxonomy_meta();


		add_action( 'add_meta_boxes', [ $this, 'register_meta_boxes' ] );
		add_action( 'save_post', [ $this, 'save_meta_boxes' ], 10, 2 );
	}

	/**
	 * Register custom post types.
	 *
	 * @return void
	 */
	public function register_post_types(): void {
		foreach ( $this->get_post_types() as $slug => $args ) {
			$labels = [
				'name'               => $args['label'],
				'singular_name'      => $args['singular_label'],
				'menu_name'          => $args['label'],
				'name_admin_bar'     => $args['singular_label'],
				'add_new_item'       => sprintf( __( 'Add New %s', 'ambrygen' ), $args['singular_label'] ),
				'edit_item'          => sprintf( __( 'Edit %s', 'ambrygen' ), $args['singular_label'] ),
				'new_item'           => sprintf( __( 'New %s', 'ambrygen' ), $args['singular_label'] ),
				'view_item'          => sprintf( __( 'View %s', 'ambrygen' ), $args['singular_label'] ),
				'all_items'          => sprintf( __( 'All %s', 'ambrygen' ), $args['label'] ),
				'search_items'       => sprintf( __( 'Search %s', 'ambrygen' ), $args['label'] ),
				'not_found'          => __( 'No items found.', 'ambrygen' ),
				'not_found_in_trash' => __( 'No items found in Trash.', 'ambrygen' ),
			];

			$defaults = [
				'labels'             => $labels,
				'public'             => $args['public'] ?? true,
				'show_in_menu'       => $args['show_in_menu'] ?? true,
				'menu_icon'          => $args['menu_icon'] ?? 'dashicons-admin-post',
				'supports'           => $args['supports'] ?? [ 'title', 'editor', 'thumbnail' ],
				'rewrite'            => $args['rewrite'] ?? [ 'slug' => $slug ],
				'has_archive'        => $args['has_archive'] ?? true,
				'show_in_rest'       => true,
				'exclude_from_search'=> false,
				'publicly_queryable' => true,
			];

			register_post_type( $slug, $defaults );
		}
	}

	/**
	 * Register taxonomies.
	 *
	 * @return void
	 */
	public function register_taxonomies(): void {
		$taxonomies = $this->get_taxonomies();

		foreach ( $taxonomies as $taxonomy => $args ) {
			register_taxonomy(
				$taxonomy,
				$args['post_types'],
				[
					'labels'            => $args['labels'],
					'hierarchical'      => $args['hierarchical'] ?? false,
					'show_ui'           => true,
					'show_admin_column' => true,
					'show_in_rest'      => true,
					'rewrite'           => [ 'slug' => $taxonomy ],
				]
			);
		}
	}

	/**
	 * Define post types.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	private function get_post_types(): array {
		return [
			'our_team' => [
				'label'          => __( 'Our Team', 'ambrygen' ),
				'singular_label' => __( 'Team Member', 'ambrygen' ),
				'menu_icon'      => 'dashicons-groups',
				'supports'       => [ 'title', 'thumbnail' ],
				'meta_fields'    => [
					'designation' => [
						'label' => __( 'Designation', 'ambrygen' ),
						'type'  => 'text',
					],
				],
			],
			'jobs' => [
				'label'          => __( 'Jobs', 'ambrygen' ),
				'singular_label' => __( 'Job', 'ambrygen' ),
				'menu_icon'      => 'dashicons-briefcase',
				'supports'       => [ 'title', 'editor', 'thumbnail' ]
			],
			'blood-test' => [
				'label'          => __( 'Blood Test', 'ambrygen' ),
				'singular_label' => __( 'Blood Test', 'ambrygen' ),
				'menu_icon'      => 'dashicons-briefcase',
				'supports'       => [ 'title', 'editor', 'thumbnail' ]
			],
		];
	}

	/**
	 * Define taxonomies.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	private function get_taxonomies(): array {
		return [
			'member_type' => [
				'post_types' => [ 'our_team' ],
				'hierarchical' => true,
				'labels' => [
					'name'          => __( 'Member Types', 'ambrygen' ),
					'singular_name' => __( 'Member Type', 'ambrygen' ),
					'search_items'  => __( 'Search Member Types', 'ambrygen' ),
					'all_items'     => __( 'All Member Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Member Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Member Type', 'ambrygen' ),
					'menu_name'     => __( 'Member Type', 'ambrygen' ),
				],
			],
			'job_type' => [
				'post_types' => [ 'jobs' ],
				'hierarchical' => true,
				'labels' => [
					'name'          => __( 'Job Types', 'ambrygen' ),
					'singular_name' => __( 'Job Type', 'ambrygen' ),
					'search_items'  => __( 'Search Job Types', 'ambrygen' ),
					'all_items'     => __( 'All Job Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Job Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Job Type', 'ambrygen' ),
					'menu_name'     => __( 'Job Type', 'ambrygen' ),
				],
			],
			'job_location' => [
				'post_types' => [ 'jobs' ],
				'hierarchical' => true,
				'labels' => [
					'name'          => __( 'Job Locations', 'ambrygen' ),
					'singular_name' => __( 'Job Location', 'ambrygen' ),
					'search_items'  => __( 'Search Job Locations', 'ambrygen' ),
					'all_items'     => __( 'All Job Locations', 'ambrygen' ),
					'edit_item'     => __( 'Edit Job Location', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Job Location', 'ambrygen' ),
					'menu_name'     => __( 'Job Location', 'ambrygen' ),
				],
			],
			'job_preferences' => [
				'post_types' => [ 'jobs' ],
				'hierarchical' => true,
				'labels' => [
					'name'          => __( 'Job Preferences', 'ambrygen' ),
					'singular_name' => __( 'Job Preference', 'ambrygen' ),
					'search_items'  => __( 'Search Job Preferences', 'ambrygen' ),
					'all_items'     => __( 'All Job Preferences', 'ambrygen' ),
					'edit_item'     => __( 'Edit Job Preference', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Job Preference', 'ambrygen' ),
					'menu_name'     => __( 'Job Preference', 'ambrygen' ),
				],
			],
			'test_type' => [
				'post_types' => [ 'blood-test' ],
				'hierarchical' => true,
				'labels' => [
					'name'          => __( 'Test Types', 'ambrygen' ),
					'singular_name' => __( 'Test Type', 'ambrygen' ),
					'search_items'  => __( 'Search Test Types', 'ambrygen' ),
					'all_items'     => __( 'All Test Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Test Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Test Type', 'ambrygen' ),
					'menu_name'     => __( 'Test Type', 'ambrygen' ),
				],
			],
		];
	}

	/**
	 * Register post meta fields.
	 *
	 * @return void
	 */
	public function register_post_meta_fields(): void {
		foreach ( $this->get_post_types() as $slug => $args ) {
			if ( empty( $args['meta_fields'] ) ) {
				continue;
			}

			foreach ( $args['meta_fields'] as $meta_key => $field ) {
				register_post_meta(
					$slug,
					$meta_key,
					[
						'type'              => 'string',
						'single'            => true,
						'sanitize_callback' => 'sanitize_text_field',
						'show_in_rest'      => true,
						'auth_callback'     => static function(): bool {
							return current_user_can( 'edit_posts' );
						},
					]
				);
			}
		}
	}

	/**
	 * Register meta boxes.
	 *
	 * @return void
	 */
	public function register_meta_boxes(): void {
		foreach ( $this->get_post_types() as $slug => $args ) {
			if ( empty( $args['meta_fields'] ) ) {
				continue;
			}

			add_meta_box(
				$slug . '_meta_box',
				sprintf( __( '%s Details', 'ambrygen' ), $args['singular_label'] ),
				[ $this, 'render_meta_box' ],
				$slug,
				'normal',
				'default',
				$args['meta_fields']
			);
		}
	}

	/**
	 * Render meta box fields.
	 *
	 * @param WP_Post $post Current post.
	 * @param array   $meta Meta box args.
	 *
	 * @return void
	 */
	public function render_meta_box( WP_Post $post, array $meta ): void {
		$meta_fields = $meta['args'];

		wp_nonce_field( 'ambrygen_meta_box', 'ambrygen_meta_nonce' );

		foreach ( $meta_fields as $key => $field ) {
			$value = get_post_meta( $post->ID, $key, true );
			?>
			<p>
				<label for="<?php echo esc_attr( $key ); ?>">
					<?php echo esc_html( $field['label'] ); ?>
				</label>

				<input
					type="text"
					name="<?php echo esc_attr( $key ); ?>"
					id="<?php echo esc_attr( $key ); ?>"
					class="widefat"
					value="<?php echo esc_attr( $value ); ?>"
				/>
			</p>
			<?php
		}
	}

	/**
	 * Save meta box data.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object.
	 *
	 * @return void
	 */
	public function save_meta_boxes( int $post_id, WP_Post $post ): void {

		if (
			empty( $_POST['ambrygen_meta_nonce'] ) ||
			! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ambrygen_meta_nonce'] ) ), 'ambrygen_meta_box' )
		) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$post_types = $this->get_post_types();

		if ( empty( $post_types[ $post->post_type ]['meta_fields'] ) ) {
			return;
		}

		foreach ( $post_types[ $post->post_type ]['meta_fields'] as $key => $field ) {
			if ( ! isset( $_POST[ $key ] ) ) {
				continue;
			}

			update_post_meta(
				$post_id,
				$key,
				sanitize_text_field( wp_unslash( $_POST[ $key ] ) )
			);
		}
	}

	/**
	 * Add image fields to job-related taxonomies.
	 */
	public function register_taxonomy_meta(): void {
		$taxonomies = [ 'job_type', 'job_location', 'job_preferences','test_type' ];

		foreach ( $taxonomies as $taxonomy ) {

		        register_term_meta(
					$taxonomy,
					'term_image',
					[
						'type'         => 'integer',
						'single'       => true,
						'show_in_rest' => true,
						'sanitize_callback' => 'absint',
						'auth_callback' => static function() {
							return current_user_can( 'edit_terms' );
						},
					]
				);


			// Add field to add term screen
			add_action( $taxonomy . '_add_form_fields', function() use ( $taxonomy ) {
				?>
				<div class="form-field term-image-wrap">
					<label><?php esc_html_e( 'Image', 'ambrygen' ); ?></label>
					<img src="" class="term_image_prev">
        <img src="" class="term_image_prev" style="max-width:100px; display:block; margin-bottom:5px;" />
					<button class="button button-secondary upload-term-image"><?php esc_html_e( 'Upload Image', 'ambrygen' ); ?></button>
					<button class="button button-secondary remove-term-image"><?php esc_html_e( 'Remove Image', 'ambrygen' ); ?></button>

				</div>
				<?php
			}, 10, 2 );

			// Add field to edit term screen
			add_action( $taxonomy . '_edit_form_fields', function( $term ) use ( $taxonomy ) {
			$image_id  = get_term_meta( $term->term_id, 'term_image', true );
			$image_url = $image_id ? wp_get_attachment_url( $image_id ) : '';
			?>
			<tr class="form-field term-image-wrap">
				<th scope="row">
					<label><?php esc_html_e( 'Image', 'ambrygen' ); ?></label>
				</th>
				<td>
					<img src="<?php echo esc_url( $image_url ); ?>" class="term_image_prev" style="max-width:100px; display:block; margin-bottom:5px;" />
					<input type="hidden" name="term_image" id="term_image" value="<?php echo esc_attr( $image_id ); ?>" class="term-image-field" />
					<button class="button button-secondary upload-term-image"><?php esc_html_e( 'Upload Image', 'ambrygen' ); ?></button>
					            <button class="button button-secondary remove-term-image"><?php esc_html_e( 'Remove Image', 'ambrygen' ); ?></button>

				</td>
			</tr>
			<?php
		}, 10, 2 );


			// Save term meta
			add_action( 'created_' . $taxonomy, [ $this, 'save_taxonomy_image_meta' ], 10, 2 );
			add_action( 'edited_' . $taxonomy, [ $this, 'save_taxonomy_image_meta' ], 10, 2 );
		}

		// Enqueue media uploader for admin
	// Enqueue media uploader and JS
		add_action( 'admin_enqueue_scripts', function() {
			wp_enqueue_media();
			wp_add_inline_script( 'jquery-core', "
				jQuery(document).ready(function($){
					// Upload image
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

					// Remove image
					$('.remove-term-image').on('click', function(e){
						e.preventDefault();
						var button = $(this);
						var input = button.prevAll('.term-image-field').first();
						var preview = button.prevAll('.term_image_prev').first();
						input.val('').trigger('change');
						preview.attr('src','');
					});
				});
			" );
		});

	}

	/**
	 * Save taxonomy image meta.
	 *
	 * @param int $term_id Term ID.
	 */
	public function save_taxonomy_image_meta( int $term_id ): void {
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
function get_post_term_ids( int $post_id, string $taxonomy ): array {
    if ( ! $post_id || ! taxonomy_exists( $taxonomy ) ) {
        return [];
    }

    $terms = wp_get_post_terms( $post_id, $taxonomy, [
        'fields' => 'ids', // Only return term IDs
    ] );

    if ( is_wp_error( $terms ) ) {
        return [];
    }

    return $terms;
}



}
