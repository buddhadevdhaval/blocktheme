<?php

namespace Ambrygen\Theme\Core\Routes;

use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Handle legacy URL redirects and poster category compatibility routes.
 */
final class LegacyRedirectService {

	use Singleton;

	/**
	 * Register legacy redirect hooks.
	 */
	protected function __construct() {
		add_filter( 'request', array( $this, 'filter_category_request_to_poster_category' ) );
		add_action( 'pre_get_posts', array( $this, 'filter_poster_category_archive_query' ) );
		add_filter( 'term_link', array( $this, 'filter_poster_category_term_link' ), 10, 3 );
		add_action( 'template_redirect', array( $this, 'handle_template_redirects' ) );
	}

	/**
	 * Adjust poster category archive queries to include supported post types.
	 *
	 * @param mixed $query Main query object.
	 */
	public function filter_poster_category_archive_query( $query ): void {
		if ( is_admin() || ! $query instanceof \WP_Query || ! $query->is_main_query() ) {
			return;
		}

		if ( $query->is_tax( 'poster_category' ) ) {
			$query->set( 'post_type', array( 'poster', 'presentation' ) );
		}
	}

	/**
	 * Filter poster category term links to use category-style URLs.
	 *
	 * @param mixed $termlink Original term link.
	 * @param mixed $term     Term object.
	 * @param mixed $taxonomy Taxonomy slug.
	 * @return mixed
	 */
	public function filter_poster_category_term_link( $termlink, $term, $taxonomy ) {
		if ( 'poster_category' !== $taxonomy || ! $term instanceof \WP_Term ) {
			return $termlink;
		}

		return home_url( '/category/' . $term->slug . '/' );
	}

	/**
	 * Convert unknown category requests into poster category requests when possible.
	 *
	 * @param mixed $query_vars Request query vars.
	 * @return mixed
	 */
	public function filter_category_request_to_poster_category( $query_vars ) {
		if ( is_admin() || empty( $query_vars['category_name'] ) ) {
			return $query_vars;
		}

		$ambrygen_category_slug = sanitize_title( wp_unslash( $query_vars['category_name'] ) );

		if ( '' === $ambrygen_category_slug ) {
			return $query_vars;
		}

		if ( get_term_by( 'slug', $ambrygen_category_slug, 'category' ) ) {
			return $query_vars;
		}

		$ambrygen_poster_category = get_term_by( 'slug', $ambrygen_category_slug, 'poster_category' );

		if ( ! $ambrygen_poster_category || is_wp_error( $ambrygen_poster_category ) ) {
			return $query_vars;
		}

		unset( $query_vars['category_name'] );

		$query_vars['poster_category'] = $ambrygen_category_slug;
		$query_vars['taxonomy']        = 'poster_category';
		$query_vars['term']            = $ambrygen_category_slug;

		return $query_vars;
	}

	/**
	 * Run template-level legacy redirects.
	 */
	public function handle_template_redirects(): void {
		if ( $this->redirect_legacy_poster_category_urls() ) {
			exit;
		}

		// if ($this->redirect_legal_page()) {
		// exit;
		// }

		if ( $this->redirect_material_file_view() ) {
			exit;
		}
	}

	/**
	 * Redirect legacy poster category URLs to category-style URLs.
	 *
	 * @return bool
	 */
	private function redirect_legacy_poster_category_urls(): bool {
		if ( ! is_tax( 'poster_category' ) ) {
			return false;
		}

		$ambrygen_term = get_queried_object();

		if ( ! $ambrygen_term instanceof \WP_Term ) {
			return false;
		}

		$ambrygen_target_url   = home_url( '/category/' . $ambrygen_term->slug . '/' );
		$ambrygen_current_path = wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH );
		$ambrygen_legacy_path  = '/poster_category/' . $ambrygen_term->slug . '/';

		if ( is_string( $ambrygen_current_path ) && 0 === strpos( trailingslashit( $ambrygen_current_path ), $ambrygen_legacy_path ) ) {
			wp_safe_redirect( $ambrygen_target_url, 301 );
			return true;
		}

		return false;
	}

	/**
	 * Redirect the legacy legal page.
	 *
	 * @return bool
	 */
	private function redirect_legal_page(): bool {
		if ( ! is_page( 'legal' ) ) {
			return false;
		}

		wp_safe_redirect( home_url( '/legal/notice-of-privacy-practice/' ), 301 );
		return true;
	}

	/**
	 * Redirect legacy marketing material file view URLs to attachment URLs.
	 *
	 * @return bool
	 */
	private function redirect_material_file_view(): bool {
		$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( (string) $_SERVER['REQUEST_URI'] ) : '';
		$request_path = $request_uri ? (string) wp_parse_url( $request_uri, PHP_URL_PATH ) : '';

		if ( ! preg_match( '#^/file/material/view/\d+/([^/]+)$#', $request_path, $matches ) ) {
			return false;
		}

		$requested_filename = sanitize_file_name( urldecode( (string) $matches[1] ) );
		if ( '' === $requested_filename ) {
			return false;
		}

		global $wpdb;

		$attachment_ids = $wpdb->get_col(
			$wpdb->prepare(
				"
            SELECT post_id
            FROM {$wpdb->postmeta}
            WHERE meta_key = '_wp_attached_file'
              AND meta_value LIKE %s
            ORDER BY post_id DESC
            ",
				'%' . $wpdb->esc_like( $requested_filename )
			)
		);

		$attachment_id = 0;

		if ( ! empty( $attachment_ids ) ) {
			foreach ( $attachment_ids as $candidate_id ) {
				$candidate_path = (string) get_post_meta( (int) $candidate_id, '_wp_attached_file', true );
				if ( '' === $candidate_path ) {
					continue;
				}

				$candidate_basename = wp_basename( $candidate_path );
				$candidate_variants = array( $candidate_basename );

				if ( preg_match( '/^[A-Za-z0-9]+_(.+)$/', $candidate_basename, $candidate_matches ) ) {
					$candidate_variants[] = (string) $candidate_matches[1];
				}

				if ( in_array( $requested_filename, $candidate_variants, true ) ) {
					$attachment_id = (int) $candidate_id;
					break;
				}
			}
		}

		if ( $attachment_id <= 0 ) {
			return false;
		}

		$attachment_url = wp_get_attachment_url( $attachment_id );
		if ( ! $attachment_url ) {
			return false;
		}

		wp_safe_redirect( $attachment_url, 301 );
		return true;
	}
}
