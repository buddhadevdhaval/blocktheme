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
 * Slug() returns '' so the engine skips register_post_type() for this class.
 */
class SharedTaxonomies extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return '';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return '';
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return '';
	}

	/**
	 * Get registered taxonomies.
	 *
	 * @return array
	 */
	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'post_tag',
				'object_types' => array( 'conferences', 'booths', 'addresses', 'webinar', 'press-releases', 'publication', 'genetic-testing', 'marketing_material' ),
				'use_existing' => true,
			),
			array(
				'slug'         => 'poster_category',
				'hierarchical' => true,
				'object_types' => array( 'presentation', 'poster', 'webinar', 'publication', 'genetic-testing', 'marketing_material', 'product_version' ),
				'labels'       => array(
					'name'          => __( 'Categories', 'ambrygen-web' ),
					'singular_name' => __( 'Category', 'ambrygen-web' ),
					'search_items'  => __( 'Search Categories', 'ambrygen-web' ),
					'all_items'     => __( 'All Categories', 'ambrygen-web' ),
					'edit_item'     => __( 'Edit Category', 'ambrygen-web' ),
					'update_item'   => __( 'Update Category', 'ambrygen-web' ),
					'add_new_item'  => __( 'Add New Category', 'ambrygen-web' ),
					'new_item_name' => __( 'New Category Name', 'ambrygen-web' ),
					'menu_name'     => __( 'Categories', 'ambrygen-web' ),
				),
				'show_in_rest' => true,

			),
			array(
				'slug'         => 'collaborator',
				'hierarchical' => true,
				'object_types' => array( 'presentations', 'poster', 'webinar', 'publication', 'presentation' ),
				'labels'       => array(
					'name'          => __( 'Collaborators', 'ambrygen-web' ),
					'singular_name' => __( 'Collaborator', 'ambrygen-web' ),
					'search_items'  => __( 'Search Collaborators', 'ambrygen-web' ),
					'all_items'     => __( 'All Collaborators', 'ambrygen-web' ),
					'edit_item'     => __( 'Edit Collaborator', 'ambrygen-web' ),
					'update_item'   => __( 'Update Collaborator', 'ambrygen-web' ),
					'add_new_item'  => __( 'Add New Collaborator', 'ambrygen-web' ),
					'new_item_name' => __( 'New Collaborator Name', 'ambrygen-web' ),
					'menu_name'     => __( 'Collaborators', 'ambrygen-web' ),
				),
				'show_in_rest' => true,
			),
			array(
				'slug'         => 'gene',
				'hierarchical' => true,
				'object_types' => array( 'product_version', 'marketing_material' ),
				'labels'       => array(
					'name'          => __( 'Genes', 'ambrygen-web' ),
					'singular_name' => __( 'Gene', 'ambrygen-web' ),
					'search_items'  => __( 'Search Genes', 'ambrygen-web' ),
					'all_items'     => __( 'All Genes', 'ambrygen-web' ),
					'edit_item'     => __( 'Edit Gene', 'ambrygen-web' ),
					'update_item'   => __( 'Update Gene', 'ambrygen-web' ),
					'add_new_item'  => __( 'Add New Gene', 'ambrygen-web' ),
					'new_item_name' => __( 'New Gene Name', 'ambrygen-web' ),
					'menu_name'     => __( 'Genes', 'ambrygen-web' ),
				),
				'show_in_rest' => true,
				'meta_fields'  => array(
					'is_active'                            => array(
						'label'    => __( 'Is Active', 'ambrygen-web' ),
						'type'     => 'select',
						'options'  => array(
							'1' => __( 'Active', 'ambrygen-web' ),
							'0' => __( 'Deactive', 'ambrygen-web' ),
						),
						'sanitize' => 'absint',
					),
					'full_name'                            => array(
						'label' => __( 'Full Name', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'description'                          => array(
						'label' => __( 'Description', 'ambrygen-web' ),
						'type'  => 'textarea',
					),
					'inheritance_models'                   => array(
						'label'    => __( 'Inheritance Models', 'ambrygen-web' ),
						'type'     => 'text',
						'multiple' => true,
					),
					'inheritance_model_cx_note'            => array(
						'label' => __( 'Inheritance Model CX Note', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'in_house'                             => array(
						'label'    => __( 'In House', 'ambrygen-web' ),
						'type'     => 'checkbox',
						'value'    => '1',
						'sanitize' => 'absint',
					),
					'penetrance_degree'                    => array(
						'label' => __( 'Penetrance Degree', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'penetrance_percentage'                => array(
						'label' => __( 'Penetrance Percentage', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'penetrance_expressivity'              => array(
						'label' => __( 'Penetrance Expressivity', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'penetrance_age_related'               => array(
						'label' => __( 'Penetrance Age Related', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'aliases'                              => array(
						'label'    => __( 'Aliases', 'ambrygen-web' ),
						'type'     => 'text',
						'multiple' => true,
					),
					'ref_seq_summary'                      => array(
						'label'    => __( 'Ref Seq Summary', 'ambrygen-web' ),
						'type'     => 'wysiwyg',
						'sanitize' => 'wp_kses_post',
					),
					'isoform'                              => array(
						'label' => __( 'Isoform', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'covered_cds_count'                    => array(
						'label' => __( 'Covered CDS Count', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'cds_count'                            => array(
						'label' => __( 'CDS Count', 'ambrygen-web' ),
						'type'  => 'text',
					),
					'show_static_count_on_product_version' => array(
						'label'       => __( 'Show static genes count on product version', 'ambrygen-web' ),
						'type'        => 'checkbox',
						'value'       => '1',
						'sanitize'    => 'absint',
						'description' => __( 'Enable custom genes count content for this gene on product version listings.', 'ambrygen-web' ),
					),
					'static_count'                         => array(
						'label'       => __( 'Genes Count', 'ambrygen-web' ),
						'type'        => 'text',
						'description' => __( 'Count value to show when Genes count is enabled.', 'ambrygen-web' ),
					),
					'static_count_badge_label'             => array(
						'label'       => __( 'Genes Badge Label', 'ambrygen-web' ),
						'type'        => 'text',
						'description' => __( 'Optional badge label shown instead of the default Gene/Genes text.', 'ambrygen-web' ),
					),
					'static_count_before_text'             => array(
						'label'       => __( 'Before Genes Count Text', 'ambrygen-web' ),
						'type'        => 'text',
						'description' => __( 'Optional text displayed before the static count.', 'ambrygen-web' ),
					),
					'static_count_after_text'              => array(
						'label'       => __( 'After Genes Count Text', 'ambrygen-web' ),
						'type'        => 'text',
						'description' => __( 'Optional text displayed after the static count.', 'ambrygen-web' ),
					),
					'static_count_link'                    => array(
						'label'       => __( 'Genes Count Link', 'ambrygen-web' ),
						'type'        => 'url',
						'sanitize'    => 'esc_url_raw',
						'description' => __( 'Optional link shown with the genes count content.', 'ambrygen-web' ),
					),
					'static_count_link_text'               => array(
						'label'       => __( 'Genes Count Link Text', 'ambrygen-web' ),
						'type'        => 'text',
						'description' => __( 'Link label for the genes count link.', 'ambrygen-web' ),
					),
				),
			),
		);
	}
}
