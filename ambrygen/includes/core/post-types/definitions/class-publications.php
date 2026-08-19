<?php
/**
 * Publications post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Publications -- peer-reviewed publication listings.
 */
class Publications extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'publication';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Publications', 'ambrygen-web' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Publication', 'ambrygen-web' );
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
	 * Determine whether the post type has an archive.
	 *
	 * @return bool
	 */
	public function has_archive(): bool {
		return true;
	}

	/**
	 * Get additional post type arguments.
	 *
	 * @return array
	 */
	public function extra_args(): array {
		return array(
			'rewrite'     => array(
				'slug' => 'science/peer-reviewed-publication',
			),
			'has_archive' => 'science/peer-reviewed-publications',
		);
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'_old_id'       => array(
				'label'    => __( 'Old ID', 'ambrygen-web' ),
				'type'     => 'number',
				'hidden'   => true,
				'sanitize' => 'absint',
			),
			// 'authors' => array(
			// 'label' => __( 'Authors', 'ambrygen-web' ),
			// 'type'  => 'textarea',
			// ),
			'linked_author' => array(
				'label'       => __( 'Linked Authors', 'ambrygen-web' ),
				'type'        => 'post_relationship',
				'post_types'  => array( 'author' ),
				'multiple'    => true,
				'description' => __( 'Select matching author profiles for this publication.', 'ambrygen-web' ),
			),
			'journal_title' => array(
				'label' => __( 'Journal Title', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'journal_abbr'  => array(
				'label' => __( 'Journal Abbreviation', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'journal_volume' => array(
				'label' => __( 'Journal Volume', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'link'          => array(
				'label'    => __( 'Link', 'ambrygen-web' ),
				'type'     => 'url',
				'sanitize' => 'esc_url_raw',
			),
			'note'          => array(
				'label' => __( 'Note', 'ambrygen-web' ),
				'type'  => 'textarea',
			),
		);
	}
}
