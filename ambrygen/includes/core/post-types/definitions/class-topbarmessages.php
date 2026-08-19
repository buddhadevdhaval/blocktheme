<?php
/**
 * Top Bar Messages post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Top Bar Messages -- scheduled announcement banners.
 */
class TopBarMessages extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'top_bar_message';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Top Bar Messages', 'ambrygen-web' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Top Bar Message', 'ambrygen-web' );
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
	 * Get supported post features.
	 *
	 * @return array
	 */
	public function supports(): array {
		return array( 'title', 'editor', 'page-attributes' );
	}

	/**
	 * Determine whether the post type has an archive.
	 *
	 * @return bool
	 */
	public function has_archive(): bool {
		return false;
	}

	/**
	 * Get additional post type arguments.
	 *
	 * @return array
	 */
	public function extra_args(): array {
		return array(
			'rewrite'             => false,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'show_in_nav_menus'   => false,
			'menu_position'       => 25,
		);
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'top_bar_message_text'       => array(
				'label'    => __( 'Message', 'ambrygen-web' ),
				'type'     => 'wysiwyg',
				'sanitize' => 'wp_kses_post',
			),
			'top_bar_message_link_text'  => array(
				'label' => __( 'Link Label', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'top_bar_message_link_url'   => array(
				'label'    => __( 'Link URL', 'ambrygen-web' ),
				'type'     => 'link_picker',
				'sanitize' => 'esc_url_raw',
			),
			'top_bar_message_color'      => array(
				'label'   => __( 'Color Theme', 'ambrygen-web' ),
				'type'    => 'select',
				'options' => array(
					''                      => __( 'Select None', 'ambrygen-web' ),
					'bg-primary_25'         => __( 'Primary 25 Background', 'ambrygen-web' ),
					'bg-primary_700'        => __( 'Primary 700 Background', 'ambrygen-web' ),
					'bg-primary_800'        => __( 'Primary 800 Background', 'ambrygen-web' ),
					'bg-lightblue-gradient' => __( 'Light Blue Gradient Background', 'ambrygen-web' ),
					'bg-gradient1'          => __( 'Gradient One Background', 'ambrygen-web' ),
				),
			),
			'top_bar_message_start_date' => array(
				'label' => __( 'Start Date', 'ambrygen-web' ),
				'type'  => 'date',
			),
			'top_bar_message_start_time' => array(
				'label' => __( 'Start Time', 'ambrygen-web' ),
				'type'  => 'time',
			),
			'top_bar_message_end_date'   => array(
				'label' => __( 'End Date', 'ambrygen-web' ),
				'type'  => 'date',
			),
			'top_bar_message_end_time'   => array(
				'label' => __( 'End Time', 'ambrygen-web' ),
				'type'  => 'time',
			),
		);
	}
}
