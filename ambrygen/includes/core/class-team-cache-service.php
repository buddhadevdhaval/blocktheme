<?php

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Invalidate cached team-member data when author posts change.
 */
final class TeamCacheService {

	use Singleton;

	/**
	 * Register team member cache invalidation hooks.
	 */
	protected function __construct() {
		add_action( 'save_post_author', array( $this, 'invalidate_team_member_cache' ) );
		add_action( 'delete_post', array( $this, 'invalidate_team_member_cache' ) );
	}

	/**
	 * Clear cached team member data when author posts change.
	 *
	 * @param int $post_id Post ID being updated or deleted.
	 */
	public function invalidate_team_member_cache( $post_id ): void {
		if ( 'author' !== get_post_type( $post_id ) ) {
			return;
		}

		wp_cache_delete( 'team_member_' . absint( $post_id ), 'ambrygen_team' );
	}
}
