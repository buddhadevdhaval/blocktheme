<?php
/**
 * Shared Taxonomy definitions.
 *
 * ## Three taxonomy scopes -- pick the right one:
 *
 *   'global' => true          Attaches to ALL registered CPTs automatically.
 *                             Adding a new CPT picks it up with zero changes here.
 *                             Use for site-wide taxonomies like base_tag.
 *
 *   'object_types' => [...]   Attaches to a specific list of CPT slugs.
 *                             Use when the taxonomy is shared between some
 *                             but not all CPTs (cross-group).
 *
 *   (neither)                 Attaches only to the CPT that declared it.
 *                             Defined in the CPT's own group file, not here.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Shared taxonomies -- no post type registered, only taxonomies.
 *
 * slug() returns '' so the engine skips register_post_type() for this class.
 */
class SharedTaxonomies extends AbstractPostType {

	public function slug(): string {
		return '';
	}

	public function label(): string {
		return '';
	}

	public function singular_label(): string {
		return '';
	}

	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'post_tag',
				'object_types' => array( 'conferences', 'booths', 'addresses' ),
				'use_existing' => true,
			),
			array(
				'slug'         => 'base_tag',
				'hierarchical' => false,
				'global'       => true,
				'labels'       => array(
					'name'          => __( 'Base Tags', 'ambrygen' ),
					'singular_name' => __( 'Base Tag', 'ambrygen' ),
					'search_items'  => __( 'Search Base Tags', 'ambrygen' ),
					'all_items'     => __( 'All Base Tags', 'ambrygen' ),
					'edit_item'     => __( 'Edit Base Tag', 'ambrygen' ),
					'update_item'   => __( 'Update Base Tag', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Base Tag', 'ambrygen' ),
					'new_item_name' => __( 'New Base Tag Name', 'ambrygen' ),
					'not_found'     => __( 'No base tags found.', 'ambrygen' ),
					'no_terms'      => __( 'No base tags', 'ambrygen' ),
					'menu_name'     => __( 'Base Tags', 'ambrygen' ),
				),
			),
		);
	}
}
