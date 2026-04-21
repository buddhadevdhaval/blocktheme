<?php
/**
 * Genetic Testing post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Genetic Testing.
 */
class GeneticTesting extends AbstractPostType {

	public function slug(): string {
		return 'genetic-testing';
	}

	public function label(): string {
		return __( 'Genetic Testing', 'ambrygen' );
	}

	public function singular_label(): string {
		return __( 'Genetic Testing', 'ambrygen' );
	}

	public function meta_fields(): array {
		return array(
			'meta_title'                    => array(
				'label' => __( 'Intro Title', 'ambrygen' ),
				'type'  => 'text',
			),
			'intro'                  => array(
				'label'    => __( 'Intro Content', 'ambrygen' ),
				'type'     => 'wysiwyg',
				'sanitize' => 'wp_kses_post',
			),
			'when_to_consider_title'         => array(
				'label' => __( 'When to Consider Title', 'ambrygen' ),
				'type'  => 'text',
			),
			'when_to_consider_content'       => array(
				'label'    => __( 'When to Consider Content', 'ambrygen' ),
				'type'     => 'wysiwyg',
				'sanitize' => 'wp_kses_post',
			),
			'why_is_this_important_title'    => array(
				'label' => __( 'Why Is This Important Title', 'ambrygen' ),
				'type'  => 'text',
			),
			'why_is_this_important'  => array(
				'label'    => __( 'Why Is This Important Content', 'ambrygen' ),
				'type'     => 'wysiwyg',
				'sanitize' => 'wp_kses_post',
			),
			'linked_posts_genetic'          => array(
				'label'       => __( 'Linked Posts', 'ambrygen' ),
				'type'        => 'post_relationship',
				'description' => __( 'Search and link related marketing materials or product versions to this genetic testing post.', 'ambrygen' ),
				'multiple'    => true,
				'post_types'  => array( 'marketing_material', 'product_version' ),
			),
		);
	}
}
