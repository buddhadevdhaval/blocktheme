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

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'presentation';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Presentations', 'ambrygen-web' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Presentation', 'ambrygen-web' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-media-document';
	}

	/**
	 * Get additional post type arguments.
	 *
	 * @return array
	 */
	public function extra_args(): array {
		return array(
			'rewrite'     => array(
				'slug' => 'scientific-presentations',
			),
			'has_archive' => 'scientific-presentations',
		);
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'_old_id'                => array(
				'label'    => __( 'Old ID', 'ambrygen-web' ),
				'type'     => 'number',
				'hidden'   => true,
				'sanitize' => 'absint',
			),
			'presentation_pdf_files' => array(
				'label' => __( 'Presentation PDFs', 'ambrygen-web' ),
				'type'  => 'presentation_pdf_repeater',
			),
			'launch_id'              => array(
				'label'    => __( 'Launch ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
			'end_at'                 => array(
				'label' => __( 'End Date & Time', 'ambrygen-web' ),
				'type'  => 'datetime-local',
			),
			'start_at'               => array(
				'label' => __( 'Start Date & Time', 'ambrygen-web' ),
				'type'  => 'datetime-local',
			),
			'pr_name'                => array(
				'label' => __( 'PR Name', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'is_invite_only'         => array(
				'label' => __( 'Is Invite Only', 'ambrygen-web' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'session_id'             => array(
				'label'    => __( 'Session ID', 'ambrygen-web' ),
				'type'     => 'text',
				'sanitize' => 'sanitize_text_field',
			),
			'trade_show_id'          => array(
				'label'    => __( 'Trade Show ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
			'type_id'                => array(
				'label'    => __( 'Type ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
			'speakers'               => array(
				'label' => __( 'Speakers', 'ambrygen-web' ),
				'type'  => 'textarea',
				// 'hidden'   => true,
			),
			'search_score'           => array(
				'label'    => __( 'Search Score', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'floatval',
				'hidden'   => true,
			),
			'launch_deactivation_id' => array(
				'label'    => __( 'Launch Deactivation ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
		);
	}
}
