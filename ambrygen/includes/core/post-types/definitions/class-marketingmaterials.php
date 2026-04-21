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

	public function slug(): string {
		return 'marketing_material';
	}

	public function label(): string {
		return __( 'Marketing Materials', 'ambrygen-web' );
	}

	public function singular_label(): string {
		return __( 'Marketing Material', 'ambrygen-web' );
	}

	public function menu_icon(): string {
		return 'dashicons-megaphone';
	}

	public function extra_args(): array {
		return array(
			'rewrite' => array(
				'slug' => 'marketing-material',
			),
			'has_archive' => 'marketing-material',
		);
	}

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
