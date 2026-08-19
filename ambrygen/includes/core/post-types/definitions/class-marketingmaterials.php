<?php
/**
 * Marketing Materials post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Marketing Materials.
 */
class MarketingMaterials extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'marketing_material';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Marketing Materials', 'ambrygen-web' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Marketing Material', 'ambrygen-web' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-megaphone';
	}

	/**
	 * Get additional post type arguments.
	 *
	 * @return array
	 */
	public function extra_args(): array {
		return array(
			'rewrite'     => array(
				'slug' => 'marketing-material',
			),
			'has_archive' => 'marketing-material',
		);
	}

	/**
	 * Get registered taxonomies.
	 *
	 * @return array
	 */
	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'marketing_material_type',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Marketing Material Types', 'ambrygen-web' ),
					'singular_name' => __( 'Marketing Material Type', 'ambrygen-web' ),
					'search_items'  => __( 'Search Types', 'ambrygen-web' ),
					'all_items'     => __( 'All Types', 'ambrygen-web' ),
					'edit_item'     => __( 'Edit Type', 'ambrygen-web' ),
					'update_item'   => __( 'Update Type', 'ambrygen-web' ),
					'add_new_item'  => __( 'Add New Type', 'ambrygen-web' ),
					'new_item_name' => __( 'New Type Name', 'ambrygen-web' ),
					'menu_name'     => __( 'Material Types', 'ambrygen-web' ),
				),
			),
			array(
				'slug'         => 'marketing_material_language',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Languages', 'ambrygen-web' ),
					'singular_name' => __( 'Language', 'ambrygen-web' ),
					'search_items'  => __( 'Search Languages', 'ambrygen-web' ),
					'all_items'     => __( 'All Languages', 'ambrygen-web' ),
					'edit_item'     => __( 'Edit Language', 'ambrygen-web' ),
					'update_item'   => __( 'Update Language', 'ambrygen-web' ),
					'add_new_item'  => __( 'Add New Language', 'ambrygen-web' ),
					'new_item_name' => __( 'New Language Name', 'ambrygen-web' ),
					'menu_name'     => __( 'Languages', 'ambrygen-web' ),
				),
			),
		);
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'marketing_material_files' => array(
				'label'             => __( 'Files', 'ambrygen-web' ),
				'type'              => 'marketing_material_repeater',
				'language_taxonomy' => 'marketing_material_language',
			),
		);
	}
}
