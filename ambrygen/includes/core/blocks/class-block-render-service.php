<?php

namespace Ambrygen\Theme\Core\Blocks;

use Ambrygen\Theme\Core\Conferences\ConferenceQueryService;
use Ambrygen\Theme\Core\Conferences\ConferenceRenderer;
use Ambrygen\Theme\Core\GeneticTesting\GeneticTestingRenderer;
use Ambrygen\Theme\Core\Theme_Options;
use Ambrygen\Theme\Core\Science\ScienceRenderer;
use Ambrygen\Theme\Core\Webinars\WebinarQueryService;
use Ambrygen\Theme\Core\Webinars\WebinarRenderer;
use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Provide block render callbacks that delegate to feature-specific renderers.
 */
final class BlockRenderService {

	use Singleton;

	/**
	 * Render conference linked posts tabs.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_linked_posts_tabs( int $post_id ): string {
		return ConferenceRenderer::instance()->render_linked_posts_tabs( $post_id );
	}

	/**
	 * Render conference hero content.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_hero_content( int $post_id ): string {
		return ConferenceRenderer::instance()->render_hero_content( $post_id );
	}

	/**
	 * Render conference overview and agenda content.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_overview_agenda( int $post_id ): string {
		return ConferenceRenderer::instance()->render_overview_agenda( $post_id );
	}

	/**
	 * Render conference experts content.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_experts( int $post_id ): string {
		return ConferenceRenderer::instance()->render_experts( $post_id );
	}

	/**
	 * Render conference posters content.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_posters( int $post_id ): string {
		return ConferenceRenderer::instance()->render_posters( $post_id );
	}

	/**
	 * Render conference presentations content.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_presentations( int $post_id ): string {
		return ConferenceRenderer::instance()->render_presentations( $post_id );
	}

	/**
	 * Render conference tabs navigation.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_tabs_nav( int $post_id ): string {
		return ConferenceRenderer::instance()->render_tabs_nav( $post_id );
	}

	/**
	 * Render event meta summary.
	 *
	 * @param int $post_id Event post ID.
	 * @return string
	 */
	public function render_event_meta_summary( int $post_id ): string {
		return ConferenceRenderer::instance()->render_event_meta_summary( $post_id );
	}

	/**
	 * Render event grid card markup.
	 *
	 * @param int $post_id Event post ID.
	 * @return string
	 */
	public function render_event_grid_card( int $post_id ): string {
		return ConferenceRenderer::instance()->render_event_grid_card( $post_id );
	}

	/**
	 * Render webinar grid card markup.
	 *
	 * @param int $post_id Webinar post ID.
	 * @return string
	 */
	public function render_webinar_grid_card( int $post_id ): string {
		return WebinarRenderer::instance()->render_webinar_grid_card( $post_id );
	}

	/**
	 * Render webinar meta summary.
	 *
	 * @param int $post_id Webinar post ID.
	 * @return string
	 */
	public function render_webinar_meta_summary( int $post_id ): string {
		return WebinarRenderer::instance()->render_webinar_meta_summary( $post_id );
	}

	/**
	 * Render social share UI.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_social_share( int $post_id ): string {
		return WebinarRenderer::instance()->render_share_post( $post_id );
	}

	/**
	 * Render webinar registration button markup.
	 *
	 * @param int   $post_id    Webinar post ID.
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function render_webinar_registration_button( int $post_id, array $attributes = array() ): string {
		return WebinarRenderer::instance()->render_webinar_registration_button( $post_id, $attributes );
	}

	/**
	 * Render webinar author swiper markup.
	 *
	 * @param int   $post_id    Webinar post ID.
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function render_webinar_author_swiper( int $post_id, array $attributes = array() ): string {
		return WebinarRenderer::instance()->render_author_swiper( $post_id, $attributes );
	}

	/**
	 * Render webinar additional information.
	 *
	 * @param int $post_id Webinar post ID.
	 * @return string
	 */
	public function render_webinar_additional_info( int $post_id ): string {
		return WebinarRenderer::instance()->render_webinar_additional_info( $post_id );
	}

	/**
	 * Render genetic testing hero content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_hero( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_hero( $post_id );
	}

	/**
	 * Render genetic testing details content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_details( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_details( $post_id );
	}

	/**
	 * Render genetic testing product stats.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_product_stats( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_product_stats( $post_id );
	}

	/**
	 * Render genetic testing genes section.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_genes( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_genes_analyzed( $post_id );
	}

	/**
	 * Render genetic testing quick reference content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_quick_reference( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_quick_reference_block( $post_id );
	}

	/**
	 * Render genetic testing description content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_description( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_post_description( $post_id );
	}

	/**
	 * Render genetic testing test details custom field content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_test_details_custom_field( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_test_details_custom_field( $post_id );
	}

	/**
	 * Render genetic testing related tests.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_related_tests( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_related_tests( $post_id );
	}

	/**
	 * Render genetic testing downloads.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_genetic_testing_downloads( int $post_id ): string {
		return GeneticTestingRenderer::instance()->render_post_downloads( $post_id );
	}

	/**
	 * Render presentation archive filters.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_presentation_filters( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_presentation_filters( $post_id );
	}

	/**
	 * Render presentation result count.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_presentation_result_count( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_presentation_result_count( $post_id );
	}

	/**
	 * Render presentation meta content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_presentation_meta( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_presentation_meta( $post_id );
	}

	/**
	 * Render poster archive filters.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_poster_filters( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_poster_filters( $post_id );
	}

	/**
	 * Render poster result count.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_poster_result_count( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_poster_result_count( $post_id );
	}

	/**
	 * Render poster meta content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_poster_meta( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_poster_meta( $post_id );
	}

	/**
	 * Render poster PDF file links.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_poster_pdf_files( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_poster_pdf_files( $post_id );
	}

	/**
	 * Render publication archive filters.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_publication_filters( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_publication_filters( $post_id );
	}

	/**
	 * Render publication result count.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_publication_result_count( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_publication_result_count( $post_id );
	}

	/**
	 * Render publication meta content.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_publication_meta( int $post_id = 0 ): string {
		return ScienceRenderer::instance()->render_publication_meta( $post_id );
	}

	/**
	 * Determine whether a conference has linked content.
	 *
	 * @param int $post_id Conference post ID.
	 * @return bool
	 */
	public function has_conference_data( int $post_id ): bool {
		return ConferenceQueryService::instance()->has_conference_data( $post_id );
	}

	/**
	 * Determine whether there are in-progress posts for a post type.
	 *
	 * @param string $post_type Post type slug.
	 * @return bool
	 */
	public function has_in_progress_posts( string $post_type ): bool {
		if ( 'webinar' === $post_type ) {
			return WebinarQueryService::instance()->has_in_progress_webinars();
		}

		if ( 'conferences' === $post_type ) {
			return ConferenceQueryService::instance()->has_in_progress_conferences();
		}

		return true;
	}

	/**
	 * Render the conference empty-state message.
	 *
	 * @param string $scope   Empty-state scope.
	 * @param int    $post_id Conference post ID.
	 * @return string
	 */
	public function render_conference_empty_message( string $scope = 'upcoming', int $post_id = 0 ): string {
		$settings = Theme_Options::get_event_empty_state_settings( $scope );
		$title    = $this->replace_conference_empty_state_tokens( $settings['title'], $post_id );
		$message  = $this->replace_conference_empty_state_tokens( $settings['message'], $post_id );
		$actions  = $this->render_conference_empty_state_actions( $settings['ctas'] ?? array(), $post_id );

		return sprintf(
			'<div class="wp-block-group tabs-content tabs-content--empty">
                <div class="container-1280">
                    <div class="tabs-content__empty-message">
                        <h3 class="tabs-content__empty-title h3-reg">%s</h3>
                        <div class="tabs-content__empty-text body1-reg">%s</div>
                        %s
                    </div>
                </div>
            </div>',
			esc_html( $title ),
			wp_kses_post( $message ),
			$actions
		);
	}

	/**
	 * Replace empty-state placeholders with conference data.
	 *
	 * @param string $content Content containing placeholders.
	 * @param int    $post_id Conference post ID.
	 * @return string
	 */
	private function replace_conference_empty_state_tokens( string $content, int $post_id ): string {
		if ( $post_id <= 0 ) {
			return $content;
		}

		$event_name = get_post_meta( $post_id, 'pr_name', true );
		if ( ! is_string( $event_name ) || '' === trim( $event_name ) ) {
			$event_name = get_the_title( $post_id );
		}

		$month_and_year = '';
		$start_at       = (string) get_post_meta( $post_id, 'start_at', true );
		$end_at         = (string) get_post_meta( $post_id, 'end_at', true );
		$date_source    = '' !== $start_at ? $start_at : $end_at;

		if ( '' !== $date_source ) {
			$timestamp = strtotime( $date_source );
			if ( false !== $timestamp ) {
				$month_and_year = wp_date( 'F Y', $timestamp );
			}
		}

		return strtr(
			$content,
			array(
				'{EVENT_NAME}'     => (string) $event_name,
				'{MONTH_AND_YEAR}' => $month_and_year,
			)
		);
	}

	/**
	 * Render empty-state CTA buttons.
	 *
	 * @param array $ctas CTA config.
	 * @param int   $post_id Conference post ID.
	 * @return string
	 */
	private function render_conference_empty_state_actions( array $ctas, int $post_id ): string {
		if ( empty( $ctas ) || ! is_array( $ctas ) ) {
			return '';
		}

		$buttons = array();

		foreach ( $ctas as $index => $cta ) {
			if ( ! is_array( $cta ) || empty( $cta['link'] ) ) {
				continue;
			}

			$raw_text = '';
			if ( ! empty( $cta['text'] ) ) {
				$raw_text = (string) $cta['text'];
			} elseif ( ! empty( $cta['link_text'] ) ) {
				$raw_text = (string) $cta['link_text'];
			}

			$text    = '' !== $raw_text ? $this->replace_conference_empty_state_tokens( $raw_text, $post_id ) : '';
			$target  = isset( $cta['target'] ) && '_blank' === $cta['target'] ? '_blank' : '';
			$rel     = '_blank' === $target ? ' rel="noopener noreferrer"' : '';
			$variant = 'secondary' === $index ? ' is-style-site-tertiary-btn' : '';

			if ( '' === $text ) {
				continue;
			}

			$buttons[] = sprintf(
				'<a href="%1$s" class="site-btn has-right-arrow%2$s"%3$s%4$s>%5$s</a>',
				esc_url( (string) $cta['link'] ),
				esc_attr( $variant ),
				$target ? ' target="' . esc_attr( $target ) . '"' : '',
				$rel,
				esc_html( $text )
			);
		}

		if ( empty( $buttons ) ) {
			return '';
		}

		return '<div class="wp-block-spacer is-style-gl-s40"></div><div class="hero-section__actions tabs-content__empty-actions">' . implode( '', $buttons ) . '</div>';
	}

	/**
	 * Determine whether a conference should use the past-event empty state.
	 *
	 * @param int $post_id Conference post ID.
	 * @return bool
	 */
	public function is_past_conference( int $post_id ): bool {
		if ( $post_id <= 0 || 'conferences' !== get_post_type( $post_id ) ) {
			return false;
		}

		$today  = current_time( 'Y-m-d' );
		$end_at = (string) get_post_meta( $post_id, 'end_at', true );

		if ( '' !== $end_at ) {
			return $end_at < $today;
		}

		$start_at = (string) get_post_meta( $post_id, 'start_at', true );

		return '' !== $start_at && $start_at < $today;
	}
}
