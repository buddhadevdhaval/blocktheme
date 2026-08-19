<?php

namespace Ambrygen\Theme\Core;

use Ambrygen\Theme\Core\Admin\MetaBoxController;
use Ambrygen\Theme\Core\Admin\TaxonomyMetaController;
use Ambrygen\Theme\Core\Conferences\ConferenceAjaxController;
use Ambrygen\Theme\Core\PostTypes\AbstractPostType;
use Ambrygen\Theme\Core\PostTypes\Definitions\Addresses;
use Ambrygen\Theme\Core\PostTypes\Definitions\Authors;
use Ambrygen\Theme\Core\PostTypes\Definitions\Events;
use Ambrygen\Theme\Core\PostTypes\Definitions\GeneticTesting;
use Ambrygen\Theme\Core\PostTypes\Definitions\Jobs;
use Ambrygen\Theme\Core\PostTypes\Definitions\MarketingMaterials;
use Ambrygen\Theme\Core\PostTypes\Definitions\Posters;
use Ambrygen\Theme\Core\PostTypes\Definitions\Presentations;
use Ambrygen\Theme\Core\PostTypes\Definitions\PressRelease;
use Ambrygen\Theme\Core\PostTypes\Definitions\ProductVersions;
use Ambrygen\Theme\Core\PostTypes\Definitions\Publications;
use Ambrygen\Theme\Core\PostTypes\Definitions\Posts;
use Ambrygen\Theme\Core\PostTypes\Definitions\SharedTaxonomies;
use Ambrygen\Theme\Core\PostTypes\Definitions\TopBarMessages;
use Ambrygen\Theme\Core\PostTypes\Definitions\TreadShows;
use Ambrygen\Theme\Core\PostTypes\Definitions\Webinars;
use Ambrygen\Theme\Core\Routes\ConferenceRouteService;
use Ambrygen\Theme\Core\Routes\GeneticTestingRouteService;
use Ambrygen\Theme\Core\Routes\PresentationRouteService;
use Ambrygen\Theme\Core\Routes\PosterRouteService;
use Ambrygen\Theme\Core\Routes\PressReleaseRouteService;
use Ambrygen\Theme\Core\Routes\PostRouteService;
use Ambrygen\Theme\Core\Routes\PublicationRouteService;
use Ambrygen\Theme\Core\Routes\WebinarRouteService;
use Ambrygen\Theme\Core\Science\ScienceRouteService;
use Ambrygen\Theme\Core\Webinars\WebinarAjaxController;

defined( 'ABSPATH' ) || exit;

/**
 * Post type and taxonomy registration service.
 */
final class PostTypes {

	use Singleton;

	private const DEFINITIONS = array(
		Authors::class,
		Posts::class,
		Jobs::class,
		TreadShows::class,
		Presentations::class,
		Posters::class,
		Events::class,
		Webinars::class,
		PressRelease::class,
		Publications::class,
		ProductVersions::class,
		GeneticTesting::class,
		MarketingMaterials::class,
		TopBarMessages::class,
		SharedTaxonomies::class,
	);

	private array $definitions = array();

	/**
	 * Constructor.
	 */
	protected function __construct() {
		foreach ( self::DEFINITIONS as $class ) {
			$instance                               = new $class();
			$this->definitions[ $instance->slug() ] = $instance;
		}

		$this->register_post_types();
		$this->register_taxonomies();
		$this->register_post_meta_fields();

		MetaBoxController::instance()->set_definitions( $this->definitions );

		$tax_definitions = array();
		foreach ( $this->definitions as $def ) {
			foreach ( $def->taxonomies() as $tax ) {
				$tax_definitions[ $tax['slug'] ] = $tax;
			}
		}
		TaxonomyMetaController::instance()->set_taxonomies( $tax_definitions );

		ConferenceAjaxController::instance();
		WebinarAjaxController::instance();

		ConferenceRouteService::instance()->register_hooks();
		PressReleaseRouteService::instance()->register_hooks();
		PostRouteService::instance()->register_hooks();
		WebinarRouteService::instance()->register_hooks();
		GeneticTestingRouteService::instance()->register_hooks();
		PresentationRouteService::instance()->register_hooks();
		PosterRouteService::instance()->register_hooks();
		PublicationRouteService::instance()->register_hooks();
		ScienceRouteService::instance()->register_hooks();

		add_filter( 'rest_gene_collection_params', array( $this, 'filter_gene_collection_params' ) );
		add_filter( 'rest_request_before_callbacks', array( $this, 'normalize_gene_rest_request' ), 10, 3 );
		add_filter( 'rest_pre_dispatch', array( $this, 'short_circuit_gene_rest_pagination' ), 10, 3 );
		add_filter( 'rest_gene_query', array( $this, 'filter_gene_rest_query' ), 10, 2 );
		add_filter( 'rest_post_dispatch', array( $this, 'filter_gene_rest_response_headers' ), 10, 3 );
	}

	/**
	 * Register configured post types.
	 *
	 * @return void
	 */
	public function register_post_types(): void {
		foreach ( $this->definitions as $slug => $def ) {
			if ( '' === $slug ) {
				continue;
			}

			// Keep built-in WordPress types available for meta fields and admin UI
			// extensions, but do not re-register them and create duplicate menus.
			if ( 'post' === $slug && post_type_exists( $slug ) ) {
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
	 * Register configured taxonomies.
	 *
	 * @return void
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

				if ( ! empty( $tax['exclude_object_types'] ) && is_array( $tax['exclude_object_types'] ) ) {
					$object_types = array_values( array_diff( $object_types, $tax['exclude_object_types'] ) );
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
	 * Register post meta fields for supported content types.
	 *
	 * @return void
	 */
	public function register_post_meta_fields(): void {
		register_post_meta(
			'post',
			'linked_author',
			array(
				'type'              => 'integer',
				'single'            => true,
				'sanitize_callback' => null, // Let the save logic handle it
				'show_in_rest'      => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'integer',
						),
					),
				),
				'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
			)
		);

		register_post_meta(
			'post',
			'webinar_authors',
			array(
				'type'              => 'array',
				'single'            => true,
				'sanitize_callback' => null,
				'show_in_rest'      => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type'       => 'object',
							'properties' => array(
								'linked_author' => array(
									'type' => 'integer',
								),
								'designation'   => array(
									'type' => 'string',
								),
								'bio'           => array(
									'type' => 'string',
								),
								'image_id'      => array(
									'type' => 'integer',
								),
							),
						),
					),
				),
				'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
			)
		);

		register_post_meta(
			'webinar',
			'linked_author',
			array(
				'type'              => 'integer',
				'single'            => true,
				'sanitize_callback' => null,
				'show_in_rest'      => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'integer',
						),
					),
				),
				'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
			)
		);

		register_post_meta(
			'page',
			'_ambrygen_hide_contact_info',
			array(
				'type'              => 'boolean',
				'single'            => true,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'show_in_rest'      => array(
					'schema' => array(
						'type' => 'boolean',
					),
				),
				'auth_callback'     => static fn(): bool => current_user_can( 'edit_pages' ),
			)
		);

		foreach ( $this->definitions as $slug => $def ) {
			foreach ( $def->meta_fields() as $meta_key => $field ) {
				$type = $field['type'] ?? 'text';

				if ( in_array( $type, array( 'marketing_material_repeater', 'event_meet_expert_repeater', 'product_stats_repeater' ), true ) ) {
					continue;
				}

				if ( in_array( $type, array( 'poster_pdf_repeater', 'presentation_pdf_repeater' ), true ) ) {
					register_post_meta(
						$slug,
						$meta_key,
						array(
							'type'              => 'array',
							'single'            => true,
							'sanitize_callback' => null, // Let MetaBoxController handle repeater sanitization.
							'show_in_rest'      => array(
								'schema' => array(
									'type'  => 'array',
									'items' => array(
										'type'       => 'object',
										'properties' => array(
											'pdf_type' => array(
												'type' => 'string',
											),
											'file_id'  => array(
												'type' => 'integer',
											),
										),
									),
								),
							),
							'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
						)
					);

					continue;
				}

				if ( 'webinar_author_repeater' === $type ) {
					register_post_meta(
						$slug,
						$meta_key,
						array(
							'type'              => 'array',
							'single'            => true,
							'sanitize_callback' => null,
							'show_in_rest'      => array(
								'schema' => array(
									'type'  => 'array',
									'items' => array(
										'type'       => 'object',
										'properties' => array(
											'linked_author' => array(
												'type' => 'integer',
											),
											'designation' => array(
												'type' => 'string',
											),
											'bio'         => array(
												'type' => 'string',
											),
											'image_id'    => array(
												'type' => 'integer',
											),
										),
									),
								),
							),
							'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
						)
					);

					continue;
				}

				$is_single = true;
				$meta_type = 'string';

				if ( isset( $field['multiple'] ) && $field['multiple'] ) {
					$is_single = true;
					$meta_type = 'array';
				}

				register_post_meta(
					$slug,
					$meta_key,
					array(
						'type'              => $meta_type,
						'single'            => $is_single,
						'sanitize_callback' => $this->get_sanitize_callback( $field, $is_single ),
						'show_in_rest'      => array(
							'schema' => array(
								'type'  => $meta_type,
								'items' => array(
									'type' => 'integer',
								),
							),
						),
						'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
					)
				);
			}
		}
	}

	/**
	 * Build admin labels for a post type definition.
	 *
	 * @param AbstractPostType $def Post type definition instance.
	 * @return array
	 */
	private function build_labels( AbstractPostType $def ): array {
		$singular = $def->singular_label();
		$plural   = $def->label();

		return array(
			'name'                     => $plural,
			'singular_name'            => $singular,
			'menu_name'                => $plural,
			'name_admin_bar'           => $singular,
			'add_new'                  => sprintf( __( 'Add %s', 'ambrygen-web' ), $singular ),
			'add_new_item'             => sprintf( __( 'Add New %s', 'ambrygen-web' ), $singular ),
			'edit_item'                => sprintf( __( 'Edit %s', 'ambrygen-web' ), $singular ),
			'new_item'                 => sprintf( __( 'New %s', 'ambrygen-web' ), $singular ),
			'view_item'                => sprintf( __( 'View %s', 'ambrygen-web' ), $singular ),
			'search_items'             => sprintf( __( 'Search %s', 'ambrygen-web' ), $plural ),
			'not_found'                => sprintf( __( 'No %s found', 'ambrygen-web' ), strtolower( $plural ) ),
			'not_found_in_trash'       => sprintf( __( 'No %s found in Trash', 'ambrygen-web' ), strtolower( $plural ) ),
			'all_items'                => sprintf( __( 'All %s', 'ambrygen-web' ), $plural ),
			'parent_item_colon'        => sprintf( __( 'Parent %s:', 'ambrygen-web' ), $singular ),
			'archives'                 => sprintf( __( '%s Archives', 'ambrygen-web' ), $singular ),
			'attributes'               => sprintf( __( '%s Attributes', 'ambrygen-web' ), $singular ),
			'insert_into_item'         => sprintf( __( 'Insert into %s', 'ambrygen-web' ), strtolower( $singular ) ),
			'uploaded_to_this_item'    => sprintf( __( 'Uploaded to this %s', 'ambrygen-web' ), strtolower( $singular ) ),
			'featured_image'           => __( 'Featured Image', 'ambrygen-web' ),
			'set_featured_image'       => __( 'Set featured image', 'ambrygen-web' ),
			'remove_featured_image'    => __( 'Remove featured image', 'ambrygen-web' ),
			'use_featured_image'       => __( 'Use as featured image', 'ambrygen-web' ),
			'filter_items_list'        => sprintf( __( 'Filter %s list', 'ambrygen-web' ), strtolower( $plural ) ),
			'items_list_navigation'    => sprintf( __( '%s list navigation', 'ambrygen-web' ), $plural ),
			'items_list'               => sprintf( __( '%s list', 'ambrygen-web' ), $plural ),
			'item_published'           => sprintf( __( '%s published', 'ambrygen-web' ), $singular ),
			'item_published_privately' => sprintf( __( '%s published privately', 'ambrygen-web' ), $singular ),
			'item_reverted_to_draft'   => sprintf( __( '%s reverted to draft', 'ambrygen-web' ), $singular ),
			'item_scheduled'           => sprintf( __( '%s scheduled', 'ambrygen-web' ), $singular ),
			'item_updated'             => sprintf( __( '%s updated', 'ambrygen-web' ), $singular ),
		);
	}

	/**
	 * Get the sanitize callback for a registered meta field.
	 *
	 * @param array $field     Meta field configuration.
	 * @param bool  $is_single Whether the field stores a single value.
	 * @return callable
	 */
	private function get_sanitize_callback( array $field, bool $is_single ): callable {
		$sanitize = $field['sanitize'] ?? null;

		if ( ! $is_single || ! empty( $field['multiple'] ) ) {
			return array( $this, 'sanitize_array' );
		}

		if ( ! $sanitize ) {
			return 'sanitize_text_field';
		}

		$single_param_functions = array( 'floatval', 'intval', 'absint', 'boolval' );
		if ( in_array( $sanitize, $single_param_functions, true ) ) {
			return static function ( $value ) use ( $sanitize ) {
				return call_user_func( $sanitize, $value );
			};
		}

		return $sanitize;
	}

	/**
	 * Sanitize a recursively nested array structure.
	 *
	 * @param mixed $value Value to sanitize.
	 * @return array
	 */
	private function sanitize_array( $value ): array {
		if ( ! is_array( $value ) ) {
			return array();
		}

		return array_filter(
			array_map( 'absint', $value )
		);
	}

	/**
	 * Keep gene term REST responses lightweight for the editor.
	 *
	 * @param array $params REST collection params.
	 * @return array
	 */
	public function filter_gene_collection_params( array $params ): array {
		if ( isset( $params['per_page'] ) ) {
			$params['per_page']['maximum'] = 100;
			$params['per_page']['default'] = 100;
		}

		return $params;
	}

	/**
	 * Load only the first 50 genes by default, but allow paged search results.
	 *
	 * @param array            $prepared_args Prepared term query args.
	 * @param \WP_REST_Request $request Current REST request.
	 * @return array
	 */
	public function filter_gene_rest_query( array $prepared_args, $request ): array {
		$requested_per_page = (int) $request->get_param( 'per_page' );
		$search             = trim( (string) $request->get_param( 'search' ) );

		$prepared_args['number'] = $requested_per_page > 0 ? min( $requested_per_page, 50 ) : 50;

		if ( '' === $search ) {
			$prepared_args['offset'] = 0;
		}

		return $prepared_args;
	}

	/**
	 * Normalize default gene taxonomy panel requests to page 1 so the editor
	 * does not keep walking pages on the initial non-search load.
	 *
	 * @param mixed            $response Current response or null.
	 * @param callable         $handler  Route handler.
	 * @param \WP_REST_Request $request  Current request.
	 * @return mixed
	 */
	public function normalize_gene_rest_request( $response, $handler, $request ) {
		if ( '/wp/v2/gene' !== $request->get_route() ) {
			return $response;
		}

		$search = trim( (string) $request->get_param( 'search' ) );

		if ( '' === $search ) {
			$request->set_param( 'page', 1 );
		}

		return $response;
	}

	/**
	 * Stop page 2+ requests for the default gene panel load, while allowing
	 * search requests to paginate normally.
	 *
	 * @param mixed            $result  Response to replace, or null.
	 * @param \WP_REST_Server  $server  Server instance.
	 * @param \WP_REST_Request $request Current request.
	 * @return mixed
	 */
	public function short_circuit_gene_rest_pagination( $result, $server, $request ) {
		if ( null !== $result ) {
			return $result;
		}

		if ( '/wp/v2/gene' !== $request->get_route() ) {
			return $result;
		}

		$search = trim( (string) $request->get_param( 'search' ) );
		$page   = max( 1, (int) $request->get_param( 'page' ) );

		if ( '' !== $search || $page <= 1 ) {
			return $result;
		}

		$response = new \WP_REST_Response( array() );
		$response->header( 'X-WP-Total', '0' );
		$response->header( 'X-WP-TotalPages', '1' );

		return $response;
	}

	/**
	 * Report a single page for the default gene panel load so Gutenberg stops
	 * auto-requesting page 2, 3, 4... Search requests keep normal pagination.
	 *
	 * @param \WP_HTTP_Response|\WP_REST_Response $response Result to send.
	 * @param \WP_REST_Server                     $server   Server instance.
	 * @param \WP_REST_Request                    $request  Current request.
	 * @return \WP_HTTP_Response|\WP_REST_Response
	 */
	public function filter_gene_rest_response_headers( $response, $server, $request ) {
		if ( ! ( $response instanceof \WP_REST_Response ) ) {
			return $response;
		}

		if ( '/wp/v2/gene' !== $request->get_route() ) {
			return $response;
		}

		$search = trim( (string) $request->get_param( 'search' ) );

		if ( '' !== $search ) {
			return $response;
		}

		$data  = $response->get_data();
		$count = is_array( $data ) ? count( $data ) : 0;

		$response->header( 'X-WP-Total', (string) $count );
		$response->header( 'X-WP-TotalPages', '1' );

		return $response;
	}
}
