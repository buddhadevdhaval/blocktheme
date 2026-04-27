<?php
/**
 * Post Select Field (Dropdown).
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Post Select Field -- renders a dropdown list of posts.
 */
class PostSelectField {

	use Singleton;

	public function render( int $post_id, string $key, array $field ): void {
		$value = get_post_meta( $post_id, $key, true );

		if ( empty( $value ) ) {
			$value = array();
		} elseif ( ! is_array( $value ) ) {
			$value = array( $value );
		}

		$multiple   = isset( $field['multiple'] ) && $field['multiple'];
		$post_types = isset( $field['post_types'] ) ? $field['post_types'] : array( 'post' );
		$input_name = $multiple ? $key . '[]' : $key;

		$posts = get_posts(
			array(
				'post_type'      => $post_types,
				'posts_per_page' => -1,
				'post_status'    => 'publish',
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);

		printf(
			'<select name="%1$s" id="%2$s" class="widefat ambrygen-select2" %3$s>',
			esc_attr( $input_name ),
			esc_attr( $key ),
			$multiple ? 'multiple' : ''
		);

		if ( ! $multiple ) {
			echo '<option value="">' . esc_html__( 'Select Post...', 'ambrygen-web' ) . '</option>';
		}

		foreach ( $posts as $p ) {
			$selected = in_array( (string) $p->ID, array_map( 'strval', $value ), true );
			printf(
				'<option value="%1$s" %2$s>%3$s</option>',
				esc_attr( $p->ID ),
				selected( $selected, true, false ),
				esc_html( $p->post_title )
			);
		}

		echo '</select>';

		if ( ! empty( $field['description'] ) ) {
			echo '<p class="description">' . esc_html( $field['description'] ) . '</p>';
		}
	}
}
