<?php
/**
 * Product Versions post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Product Versions.
 */
class ProductVersions extends AbstractPostType {

	public function slug(): string {
		return 'product_version';
	}

	public function label(): string {
		return __( 'Product Versions', 'ambrygen-web' );
	}

	public function singular_label(): string {
		return __( 'Product Version', 'ambrygen-web' );
	}

	public function menu_icon(): string {
		return 'dashicons-archive';
	}

	public function extra_args(): array {
		return array(
			'rewrite' => array(
				'slug' => 'product-version',
			),
			'has_archive' => 'product-version',
		);
	}

	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'product_code',
				'hierarchical' => false,
				'labels'       => array(
					'name'          => __( 'Product Codes', 'ambrygen-web' ),
					'singular_name' => __( 'Product Code', 'ambrygen-web' ),
					'search_items'  => __( 'Search Product Codes', 'ambrygen-web' ),
					'all_items'     => __( 'All Product Codes', 'ambrygen-web' ),
					'edit_item'     => __( 'Edit Product Code', 'ambrygen-web' ),
					'update_item'   => __( 'Update Product Code', 'ambrygen-web' ),
					'add_new_item'  => __( 'Add New Product Code', 'ambrygen-web' ),
					'new_item_name' => __( 'New Product Code', 'ambrygen-web' ),
					'menu_name'     => __( 'Product Codes', 'ambrygen-web' ),
				),
			),
		);
	}
}
