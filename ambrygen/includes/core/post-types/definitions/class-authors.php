<?php
/**
 * Authors post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Authors -- individual author profiles.
 */
class Authors extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'author';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Authors', 'ambrygen' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Author', 'ambrygen' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-admin-users';
	}

	/**
	 * Get supported post features.
	 *
	 * @return array
	 */
	public function supports(): array {
		return array( 'title', 'author', 'thumbnail', 'excerpt', 'custom-fields', 'editor' );
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'user_designation' => array(
				'label' => __( 'Designation', 'ambrygen' ),
				'type'  => 'text',
			),
			'address_line1'    => array(
				'label' => __( 'Address Line 1', 'ambrygen' ),
				'type'  => 'text',
			),
			'address_line2'    => array(
				'label' => __( 'Address Line 2', 'ambrygen' ),
				'type'  => 'text',
			),
			'city'             => array(
				'label' => __( 'City', 'ambrygen' ),
				'type'  => 'text',
			),
			'birth_date'       => array(
				'label' => __( 'Birth Date', 'ambrygen' ),
				'type'  => 'date',
			),
			'country'          => array(
				'label' => __( 'Country', 'ambrygen' ),
				'type'  => 'text',
			),
			'image_gallry'     => array(
				'label' => __( 'Image Gallery', 'ambrygen' ),
				'type'  => 'media_gallery',
			),
			'small_image'      => array(
				'label'    => __( 'Small Image', 'ambrygen' ),
				'type'     => 'media_file',
				'sanitize' => 'absint',
			),
			'large_image'      => array(
				'label'    => __( 'Large Image', 'ambrygen' ),
				'type'     => 'media_file',
				'sanitize' => 'absint',
			),
			'email'            => array(
				'label' => __( 'Email', 'ambrygen' ),
				'type'  => 'email',
			),
			'phone_number'     => array(
				'label' => __( 'Phone Number', 'ambrygen' ),
				'type'  => 'text',
			),
		);
	}
}
