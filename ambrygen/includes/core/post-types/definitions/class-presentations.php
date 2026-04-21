<?php
/**
 * Presentations post type definitions.
 *
 * Groups post types related to presentations.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Presentations -- session or talk listings.
 */
class Presentations extends AbstractPostType {

	public function slug(): string {
		return 'presentation';
	}

	public function label(): string {
		return __( 'Presentations', 'ambrygen-web' );
	}

	public function singular_label(): string {
		return __( 'Presentation', 'ambrygen-web' );
	}

	public function menu_icon(): string {
		return 'dashicons-media-document';
	}

	public function extra_args(): array {
		return array(
			'rewrite' => array(
				'slug' => 'scientific-presentations',
			),
			'has_archive' => 'scientific-presentations',
		);
	}

	public function meta_fields(): array {
		return array(
			'_old_id'               => array(
				'label'    => __( 'Old ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'launch_id'             => array(
				'label'    => __( 'Launch ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'end_at'                => array(
				'label' => __( 'End Date', 'ambrygen-web' ),
				'type'  => 'date',
			),
			'start_at'              => array(
				'label' => __( 'Start Date', 'ambrygen-web' ),
				'type'  => 'date',
			),
			'pr_name'               => array(
				'label' => __( 'PR Name', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'is_invite_only'        => array(
				'label' => __( 'Is Invite Only', 'ambrygen-web' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'session_id'            => array(
				'label'    => __( 'Session ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'trade_show_id'         => array(
				'label'    => __( 'Trade Show ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'type_id'               => array(
				'label'    => __( 'Type ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'speakers'              => array(
				'label' => __( 'Speakers', 'ambrygen-web' ),
				'type'  => 'textarea',
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
}
