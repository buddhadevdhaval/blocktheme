<?php
/**
 * Posters post type definitions.
 *
 * Groups post types related to posters.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Posters -- poster listings.
 */
class Posters extends AbstractPostType {

	public function slug(): string {
		return 'poster';
	}

	public function label(): string {
		return __( 'Posters', 'ambrygen-web' );
	}

	public function singular_label(): string {
		return __( 'Poster', 'ambrygen-web' );
	}

	public function menu_icon(): string {
		return 'dashicons-format-image';
	}

	public function extra_args(): array {
		return array(
			'rewrite' => array(
				'slug' => 'scientific-posters',
			),
			'has_archive' => 'scientific-posters',
		);
	}

	public function meta_fields(): array {
		return array(
			'_old_id'               => array(
				'label'    => __( 'Old ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'poster_pdf_files'      => array(
				'label' => __( 'Poster PDFs', 'ambrygen-web' ),
				'type'  => 'poster_pdf_repeater',
			),
			'lis_active'            => array(
				'label' => __( 'LIS Active', 'ambrygen-web' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'name'                  => array(
				'label' => __( 'Name', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'description'           => array(
				'label' => __( 'Description', 'ambrygen-web' ),
				'type'  => 'textarea',
			),
			'slug'                  => array(
				'label' => __( 'Slug', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'launch_id'             => array(
				'label'    => __( 'Launch ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'start_at'              => array(
				'label' => __( 'Start Date', 'ambrygen-web' ),
				'type'  => 'date',
			),
			'end_at'                => array(
				'label' => __( 'End Date', 'ambrygen-web' ),
				'type'  => 'date',
			),
			'pr_name'               => array(
				'label' => __( 'PR Name', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'authors'               => array(
				'label' => __( 'Authors', 'ambrygen-web' ),
				'type'  => 'textarea',
			),
			'session_id'            => array(
				'label'    => __( 'Session ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'search_score'          => array(
				'label'    => __( 'Search Score', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'floatval',
			),
			'launch_deactivation_id' => array(
				'label'    => __( 'Launch Deactivation ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
		);
	}

	public function taxonomies(): array {
		return array();
	}
}
