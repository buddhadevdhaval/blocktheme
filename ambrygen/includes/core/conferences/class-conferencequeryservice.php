<?php
/**
 * Conference query service.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\Conferences;

use Ambrygen\Theme\Core\Singleton;
use WP_Post;

defined( 'ABSPATH' ) || exit;

/**
 * Conference query service.
 */
final class ConferenceQueryService {

	use Singleton;

	/**
	 * Get linked posts of a specific type for a conference.
	 *
	 * @param int    $post_id   Conference post ID.
	 * @param string $post_type Optional post type filter.
	 * @return WP_Post[]
	 */
	public function get_linked_posts_by_type( int $post_id, string $post_type = '' ): array {
		if ( ! $post_id ) {
			return array();
		}

		$linked_post_ids = get_post_meta( $post_id, 'linked_posts', true );
		if ( empty( $linked_post_ids ) ) {
			return array();
		}

		if ( ! is_array( $linked_post_ids ) ) {
			$linked_post_ids = array( $linked_post_ids );
		}

		$linked_posts = array();
		foreach ( $linked_post_ids as $linked_id ) {
			$post = get_post( $linked_id );
			if ( ! $post instanceof WP_Post ) {
				continue;
			}

			if ( ! empty( $post_type ) && $post->post_type !== $post_type ) {
				continue;
			}

			$allowed_statuses = array( 'publish' );

			if ( current_user_can( 'read_post', $post->ID ) ) {
				$allowed_statuses[] = 'private';
			}

			if ( ! in_array( $post->post_status, $allowed_statuses, true ) ) {
				continue;
			}

			$linked_posts[] = $post;
		}

		return $linked_posts;
	}

	/**
	 * Check whether a conference has linked domain content.
	 *
	 * @param int $post_id Conference post ID.
	 * @return bool
	 */
	public function has_conference_data( int $post_id ): bool {
		$types = array( 'our_team', 'poster', 'presentation', 'event' );

		foreach ( $types as $type ) {
			if ( ! empty( $this->get_linked_posts_by_type( $post_id, $type ) ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check whether there are any conferences currently in progress.
	 *
	 * @return bool
	 */
	public function has_in_progress_conferences(): bool {
		$today = date( 'Y-m-d' );

		$args = array(
			'post_type'      => 'conferences',
			'posts_per_page' => 1,
			'post_status'    => 'publish',
			'fields'         => 'ids',
			'meta_query'     => array(
				'relation' => 'AND',
				array(
					'key'     => 'start_at',
					'value'   => $today,
					'compare' => '<=',
					'type'    => 'DATE',
				),
				array(
					'key'     => 'end_at',
					'value'   => $today,
					'compare' => '>=',
					'type'    => 'DATE',
				),
			),
		);

		$query = new \WP_Query( $args );
		return $query->have_posts();
	}
}
