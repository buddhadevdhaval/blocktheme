<?php

namespace Ambrygen\Theme\Core\Science;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Render science archive filters, counts, and meta summaries.
 */
final class ScienceRenderer {

	use Singleton;

	/**
	 * Safely trim UI labels when mbstring is unavailable.
	 *
	 * @param string $text Source text.
	 * @param int    $width Maximum display width.
	 * @param string $marker Overflow marker.
	 * @return string
	 */
	private function trim_ui_label( string $text, int $width = 45, string $marker = '...' ): string {
		$text = trim( $text );

		if ( '' === $text ) {
			return '';
		}

		if ( function_exists( 'mb_strimwidth' ) ) {
			return mb_strimwidth( $text, 0, $width, $marker );
		}

		return wp_html_excerpt( $text, $width, $marker );
	}

	/**
	 * Render presentation archive filters.
	 *
	 * @param int $post_id Current post ID.
	 * @return string
	 */
	public function render_presentation_filters( int $post_id = 0 ): string {
		$is_presentation = ( $post_id && 'presentation' === get_post_type( $post_id ) ) || is_singular( 'presentation' ) || is_post_type_archive( 'presentation' );
		$is_editor       = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );

		if ( ! $is_presentation && ! $is_editor ) {
			return '';
		}

		$data = Helper::get_presentation_filter_data();

		$current_search       = isset( $_GET['presentation-search'] )
			? sanitize_text_field( wp_unslash( $_GET['presentation-search'] ) )
			: ( isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '' );
		$current_conference   = isset( $_GET['conference_id'] ) ? absint( wp_unslash( $_GET['conference_id'] ) ) : 0;
		$current_speaker      = isset( $_GET['speaker'] ) ? sanitize_text_field( wp_unslash( $_GET['speaker'] ) ) : '';
		$current_collaborator = isset( $_GET['collaborator'] ) ? sanitize_text_field( wp_unslash( $_GET['collaborator'] ) ) : '';

		$archive_url = get_post_type_archive_link( 'presentation' );

		ob_start();
		?>
		<div class="cs-wp-filters__header">
			<h3 class="subtitle1-sbold mb-0 presentation-filters__heading block-title"><?php esc_html_e( 'Filter By', 'ambrygen-web' ); ?></h3>
			<button class="cs-wp-filters__toggle d-md-none" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle Filters', 'ambrygen-web' ); ?>">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
			</button>
		</div>
		<div class="wp-block-group presentation-filters__form cs-wp-filters__form">
			<form method="get" action="<?php echo esc_url( $archive_url ); ?>" class="presentation-filters-form cs-wp-filters-form" onsubmit="var searchField=this.querySelector('#presentation-search'); if(searchField && !searchField.value.trim()){ searchField.disabled=true; }">
			<div class="presentation-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="presentation-search"
						class="facetwp-label"><?php esc_html_e( 'Search', 'ambrygen-web' ); ?></label></div>
				<input id="presentation-search" type="search" name="presentation-search" value="<?php echo esc_attr( $current_search ); ?>"
					placeholder="<?php esc_attr_e( 'Search Presentations', 'ambrygen-web' ); ?>">
			</div>

			<div class="presentation-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="presentation-conference"
						class="facetwp-label"><?php esc_html_e( 'Conference', 'ambrygen-web' ); ?></label></div>
				<select id="presentation-conference" name="conference_id">
					<option value=""><?php esc_html_e( 'Select a Conference', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['conferences'] as $conference_id ) : ?>
						<option value="<?php echo esc_attr( $conference_id ); ?>" <?php selected( $current_conference, (int) $conference_id ); ?>>
							<?php echo esc_html( $this->trim_ui_label( get_the_title( (int) $conference_id ) ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="presentation-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="presentation-speaker"
						class="facetwp-label"><?php esc_html_e( 'Speakers', 'ambrygen-web' ); ?></label></div>
				<select id="presentation-speaker" name="speaker">
					<option value=""><?php esc_html_e( 'Choose a Speaker', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['speakers'] as $speaker_name ) : ?>
						<option value="<?php echo esc_attr( $speaker_name ); ?>" <?php selected( $current_speaker, $speaker_name ); ?>>
							<?php echo esc_html( $this->trim_ui_label( $speaker_name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="presentation-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="presentation-collaborator"
						class="facetwp-label"><?php esc_html_e( 'Collaborators', 'ambrygen-web' ); ?></label></div>
				<select id="presentation-collaborator" name="collaborator">
					<option value=""><?php esc_html_e( 'Select a Collaborator', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['collaborators'] as $collaborator_term ) : ?>
						<option value="<?php echo esc_attr( $collaborator_term->slug ); ?>" <?php selected( $current_collaborator, (string) $collaborator_term->slug ); ?>>
							<?php echo esc_html( $this->trim_ui_label( (string) $collaborator_term->name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="presentation-filters-form__actions cs-wp-filters-form__actions">
				<button type="submit" class="site-btn"><?php esc_html_e( 'Apply Filters', 'ambrygen-web' ); ?></button>
				<a href="<?php echo esc_url( $archive_url ); ?>"
					class="site-btn is-style-site-tertiary-btn"><?php esc_html_e( 'Clear', 'ambrygen-web' ); ?></a>
			</div>
		</form>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render the presentation archive result count.
	 *
	 * @param int $post_id Current post ID.
	 * @return string
	 */
	public function render_presentation_result_count( int $post_id = 0 ): string {
		$is_editor       = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		$is_presentation = ( $post_id && 'presentation' === get_post_type( $post_id ) ) || is_singular( 'presentation' ) || is_post_type_archive( 'presentation' );

		if ( ! $is_presentation && ! $is_editor ) {
			return '';
		}

		global $wp_query;
		if ( $is_editor && ( ! $wp_query instanceof \WP_Query || empty( $wp_query->posts ) || $wp_query->post_count === 0 ) ) {
			return sprintf(
				'<p class="text-md-Semibold">%s</p>',
				esc_html( sprintf( __( 'Showing %1$d of %2$d Results', 'ambrygen-web' ), 10, 150 ) )
			);
		}

		if ( ! $wp_query instanceof \WP_Query ) {
			return '';
		}

		return sprintf(
			'<p class="text-md-Semibold">%s</p>',
			esc_html(
				sprintf(
					__( 'Showing %1$d of %2$d Results', 'ambrygen-web' ),
					(int) $wp_query->post_count,
					(int) $wp_query->found_posts
				)
			)
		);
	}

	/**
	 * Render meta details for presentation cards and single views.
	 *
	 * @param int $post_id Presentation post ID.
	 * @return string
	 */
	public function render_presentation_meta( int $post_id = 0 ): string {
		$post_id        = $post_id ?: get_the_ID();
		$is_editor      = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_admin();
		$is_single_view = ! $is_editor && is_singular( 'presentation' );

		// For editor preview - always try to get a sample post if current post isn't valid
		if ( $is_editor && ( ! $post_id || 'presentation' !== get_post_type( $post_id ) ) ) {
			$sample_post = get_posts(
				array(
					'post_type'      => 'presentation',
					'posts_per_page' => 1,
					'post_status'    => 'publish',
				)
			);
			if ( ! empty( $sample_post ) ) {
				$post_id = $sample_post[0]->ID;
			} else {
				if ( $is_editor ) {
					return '<div class="ambrygen-presentation-meta listing-archive__item-meta flag-details">
                        <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
                            <div class="listing-archive__item-meta__row__label flag-label">Session:</div> #99
                        </div>
                        <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
                            <div class="listing-archive__item-meta__row__label flag-label">Speakers:</div> Sample Speaker Name
                        </div>
                        <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-conference-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <div class="listing-archive__item-meta__row__label">Conference:</div> Sample Conference 2026
                        </div>
                        <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-date-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            Friday, Mar 6, 2026 12:00am - 12:00am
                        </div>
                    </div>';
				}
				return '';
			}
		}

		if ( ! $is_editor && ( ! $post_id || 'presentation' !== get_post_type( $post_id ) ) ) {
			return '';
		}

		$session_id = (string) get_post_meta( $post_id, 'session_id', true );
		if ( '' === $session_id ) {
			$session_id = (string) get_post_meta( $post_id, 'session', true );
		}
		$start_at = (string) get_post_meta( $post_id, 'start_at', true );
		$end_at   = (string) get_post_meta( $post_id, 'end_at', true );

		$speakers      = Helper::get_presentation_speakers( (int) $post_id );
		$speaker_label = ! empty( $speakers ) ? implode( ', ', $speakers ) : '--';

		$conference_id   = Helper::get_linked_conference_id_by_presentation( (int) $post_id );
		$conference_html = '--';
		if ( $conference_id > 0 ) {
			$conference_html = sprintf(
				'<a href="%1$s" %3$s>%2$s</a>',
				$is_editor ? '#' : esc_url( get_permalink( $conference_id ) ),
				esc_html( get_the_title( $conference_id ) ),
				$is_editor ? 'style="pointer-events: none;"' : ''
			);
		}

		$display_date = get_the_date( 'l, M j, Y', $post_id );
		if ( '' !== $start_at ) {
			$start_timestamp = strtotime( $start_at );
			if ( false !== $start_timestamp ) {
				$display_date = wp_date( 'l, M j, Y g:ia', $start_timestamp );

				if ( '' !== $end_at ) {
					$end_timestamp = strtotime( $end_at );
					if ( false !== $end_timestamp ) {
						$display_date .= ' - ' . wp_date( 'g:ia', $end_timestamp );
					}
				}
			}
		}

		$presentation_pdf_links = '';
		$presentation_pdf_rows  = get_post_meta( $post_id, 'presentation_pdf_files', true );
		if ( ! $is_single_view && is_array( $presentation_pdf_rows ) ) {
			$pdf_buttons = array();

			foreach ( $presentation_pdf_rows as $presentation_pdf_row ) {
				if ( ! is_array( $presentation_pdf_row ) ) {
					continue;
				}

				$pdf_type = isset( $presentation_pdf_row['pdf_type'] ) ? trim( (string) $presentation_pdf_row['pdf_type'] ) : '';
				$file_id  = isset( $presentation_pdf_row['file_id'] ) ? absint( $presentation_pdf_row['file_id'] ) : 0;
				$link     = $file_id > 0 ? wp_get_attachment_url( $file_id ) : '';

				if ( '' === $pdf_type || '' === $link ) {
					continue;
				}

				$pdf_buttons[] = sprintf(
					'<a target="_blank" href="%1$s" class="site-btn btn-small has-download-arrow" rel="noopener noreferrer">%2$s</a>',
					esc_url( $link ),
					esc_html( $pdf_type )
				);
			}

			if ( ! empty( $pdf_buttons ) ) {
				$presentation_pdf_links = '
                <div class="is-style-gl-s16"></div>
                    <div class="abstract-link two-btn-row">' .
						implode( '', $pdf_buttons ) .
					'</div>';
			}
		}

		$presentation_collaborators_html = '';
		$presentation_collaborators      = get_the_terms( $post_id, 'collaborator' );

		if ( ! empty( $presentation_collaborators ) && ! is_wp_error( $presentation_collaborators ) ) {
			$presentation_archive_url = get_post_type_archive_link( 'presentation' );

			foreach ( $presentation_collaborators as $presentation_collaborator ) {
				$presentation_collaborator_link = $presentation_archive_url
					? add_query_arg( 'collaborator', $presentation_collaborator->slug, $presentation_archive_url )
					: get_term_link( $presentation_collaborator );

				if ( is_wp_error( $presentation_collaborator_link ) ) {
					continue;
				}

				$presentation_collaborators_html .= sprintf(
					'<div class="item-card"><a href="%1$s" %3$s rel="tag">%2$s</a></div>',
					$is_editor ? '#' : esc_url( $presentation_collaborator_link ),
					esc_html( $presentation_collaborator->name ),
					$is_editor ? 'style="pointer-events: none;"' : ''
				);
			}
		}

		$presentation_collaborator_classes = 'taxonomy-collaborator items-listing-bullet listing__item-collaborator card_item-topics test wp-block-post-terms';

		if ( ! $is_single_view ) {
			$presentation_collaborator_classes .= ' has-separator';
		}

		ob_start();
		?>
		<div class="ambrygen-presentation-meta listing-archive__item-meta flag-details">
			<?php if ( '' !== $session_id && '0' !== $session_id ) : ?>
				<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
					<div class="listing-archive__item-meta__row__label flag-label">Session:</div> <?php echo esc_html( '#' . $session_id ); ?>
				</div>
			<?php endif; ?>
			<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
				<div class="listing-archive__item-meta__row__label flag-label">Speakers:</div> <?php echo esc_html( $speaker_label ); ?>
			</div>
			<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-conference-info">
				<span class="event-carousel__meta-list-icon flag-icon"></span>
				<div class="listing-archive__item-meta__row__label">Conference:</div> <?php echo wp_kses_post( $conference_html ); ?>
			</div>
			<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-date-info">
				<span class="event-carousel__meta-list-icon flag-icon"></span>
				<?php echo esc_html( $display_date ); ?>
			</div>
			<?php if ( '' !== $presentation_collaborators_html ) : ?>
				<div class="poster-archive__item-collaborators-wrap">
					<div class="<?php echo esc_attr( $presentation_collaborator_classes ); ?>">
						<span class="wp-block-post-terms__prefix">Collaborators: </span>
						<div class="collaborators-items listings-items">
							<?php echo wp_kses_post( $presentation_collaborators_html ); ?>
						</div>
					</div>
				</div>
			<?php endif; ?>
			<?php echo wp_kses_post( $presentation_pdf_links ); ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render download buttons for presentation PDFs.
	 *
	 * @param int $post_id Presentation post ID.
	 * @return string
	 */
	public function render_presentation_pdf_files( int $post_id = 0 ): string {
		$post_id = $post_id ?: get_the_ID();
		if ( ! $post_id || 'presentation' !== get_post_type( $post_id ) ) {
			return '';
		}

		$is_editor = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_admin();
		if ( ! $is_editor && ! is_singular( 'presentation' ) ) {
			return '';
		}

		$presentation_pdf_rows = get_post_meta( $post_id, 'presentation_pdf_files', true );
		if ( ! is_array( $presentation_pdf_rows ) ) {
			return '';
		}

		$pdf_buttons = array();
		foreach ( $presentation_pdf_rows as $presentation_pdf_row ) {
			if ( ! is_array( $presentation_pdf_row ) ) {
				continue;
			}

			$pdf_type = isset( $presentation_pdf_row['pdf_type'] ) ? trim( (string) $presentation_pdf_row['pdf_type'] ) : '';
			$file_id  = isset( $presentation_pdf_row['file_id'] ) ? absint( $presentation_pdf_row['file_id'] ) : 0;
			$link     = $file_id > 0 ? wp_get_attachment_url( $file_id ) : '';

			if ( '' === $pdf_type || '' === $link ) {
				continue;
			}

			$pdf_buttons[] = sprintf(
				'<a target="_blank" href="%1$s" class="site-btn btn-small has-download-arrow" rel="noopener noreferrer">%2$s</a>',
				esc_url( $link ),
				esc_html( $pdf_type )
			);
		}

		if ( empty( $pdf_buttons ) ) {
			return '';
		}

		return '
                <div class="is-style-gl-s16"></div>
                    <div class="abstract-link two-btn-row">' .
						implode( '', $pdf_buttons ) .
					'</div>';
	}

	/**
	 * Render poster archive filters.
	 *
	 * @param int $post_id Current post ID.
	 * @return string
	 */
	public function render_poster_filters( int $post_id = 0 ): string {
		$is_editor = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		$is_poster = ( $post_id && 'poster' === get_post_type( $post_id ) ) || is_singular( 'poster' ) || is_post_type_archive( 'poster' );

		if ( ! $is_editor && ! $is_poster ) {
			return '';
		}

		$data = Helper::get_poster_filter_data();

		$current_search       = isset( $_GET['poster-search'] )
			? sanitize_text_field( wp_unslash( $_GET['poster-search'] ) )
			: ( isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '' );
		$current_conference   = isset( $_GET['conference_id'] ) ? absint( wp_unslash( $_GET['conference_id'] ) ) : 0;
		$current_author       = isset( $_GET['poster_author'] ) ? absint( wp_unslash( $_GET['poster_author'] ) ) : 0;
		$current_collaborator = isset( $_GET['collaborator'] ) ? sanitize_text_field( wp_unslash( $_GET['collaborator'] ) ) : '';

		$archive_url = get_post_type_archive_link( 'poster' );

		ob_start();
		?>
		<div class="cs-wp-filters__header">
			<h3 class="subtitle1-sbold mb-0 poster-filters__heading block-title"><?php esc_html_e( 'Filter By', 'ambrygen-web' ); ?></h3>
			<button class="cs-wp-filters__toggle d-md-none" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle Filters', 'ambrygen-web' ); ?>">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
			</button>
		</div>
		<div class="wp-block-group poster-filters__form cs-wp-filters__form">
		<form method="get" action="<?php echo esc_url( $archive_url ); ?>" class="poster-filters-form cs-wp-filters-form" onsubmit="var searchField=this.querySelector('#poster-search'); if(searchField && !searchField.value.trim()){ searchField.disabled=true; }">
			<div class="poster-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="poster-search"
						class="facetwp-label"><?php esc_html_e( 'Search', 'ambrygen-web' ); ?></label></div>
				<input id="poster-search" type="search" name="poster-search" value="<?php echo esc_attr( $current_search ); ?>"
					placeholder="<?php esc_attr_e( 'Search Posters', 'ambrygen-web' ); ?>">
			</div>

			<div class="poster-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="poster-conference"
						class="facetwp-label"><?php esc_html_e( 'Conference', 'ambrygen-web' ); ?></label></div>
				<select id="poster-conference" name="conference_id">
					<option value=""><?php esc_html_e( 'Select a Conference', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['conferences'] as $conference_id ) : ?>
						<option value="<?php echo esc_attr( $conference_id ); ?>" <?php selected( $current_conference, (int) $conference_id ); ?>>
							<?php echo esc_html( $this->trim_ui_label( get_the_title( (int) $conference_id ) ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="poster-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="poster-author"
						class="facetwp-label"><?php esc_html_e( 'Authors', 'ambrygen-web' ); ?></label></div>
				<select id="poster-author" name="poster_author">
					<option value=""><?php esc_html_e( 'Choose an Author', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['authors'] as $author_id => $author_name ) : ?>
						<option value="<?php echo esc_attr( (int) $author_id ); ?>" <?php selected( $current_author, (int) $author_id ); ?>>
							<?php echo esc_html( $this->trim_ui_label( $author_name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="poster-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="poster-collaborator"
						class="facetwp-label"><?php esc_html_e( 'Collaborators', 'ambrygen-web' ); ?></label></div>
				<select id="poster-collaborator" name="collaborator">
					<option value=""><?php esc_html_e( 'Select a Collaborator', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['collaborators'] as $collaborator_term ) : ?>
						<option value="<?php echo esc_attr( $collaborator_term->slug ); ?>" <?php selected( $current_collaborator, (string) $collaborator_term->slug ); ?>>
							<?php echo esc_html( $this->trim_ui_label( (string) $collaborator_term->name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="poster-filters-form__actions cs-wp-filters-form__actions">
				<button type="submit" class="site-btn"><?php esc_html_e( 'Apply Filters', 'ambrygen-web' ); ?></button>
				<a href="<?php echo esc_url( $archive_url ); ?>"
					class="site-btn is-style-site-tertiary-btn"><?php esc_html_e( 'Clear', 'ambrygen-web' ); ?></a>
			</div>
		</form>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render the poster archive result count.
	 *
	 * @param int $post_id Current post ID.
	 * @return string
	 */
	public function render_poster_result_count( int $post_id = 0 ): string {
		$is_editor         = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		$is_poster_archive = ( $post_id && 'poster' === get_post_type( $post_id ) ) || is_post_type_archive( 'poster' );

		if ( ! $is_editor && ! $is_poster_archive ) {
			return '';
		}

		global $wp_query;
		if ( $is_editor && ( ! $wp_query instanceof \WP_Query || empty( $wp_query->posts ) || $wp_query->post_count === 0 ) ) {
			return sprintf(
				'<p class="text-md-Semibold">%s</p>',
				esc_html( sprintf( __( 'Showing %1$d of %2$d Results', 'ambrygen-web' ), 10, 150 ) )
			);
		}

		if ( ! $wp_query instanceof \WP_Query ) {
			return '';
		}

		return sprintf(
			'<p class="text-md-Semibold">%s</p>',
			esc_html(
				sprintf(
					__( 'Showing %1$d of %2$d Results', 'ambrygen-web' ),
					(int) $wp_query->post_count,
					(int) $wp_query->found_posts
				)
			)
		);
	}

	/**
	 * Render meta details for poster cards and single views.
	 *
	 * @param int $post_id Poster post ID.
	 * @return string
	 */
	public function render_poster_meta( int $post_id = 0 ): string {
		$post_id        = $post_id ?: get_the_ID();
		$is_editor      = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		$is_single_view = ! $is_editor && is_singular( 'poster' );

		if ( $is_editor && ( ! $post_id || 'poster' !== get_post_type( $post_id ) ) ) {
			$sample_post = get_posts(
				array(
					'post_type'      => 'poster',
					'posts_per_page' => 1,
				)
			);
			if ( ! empty( $sample_post ) ) {
				$post_id = $sample_post[0]->ID;
			}
		}

		if ( ! $post_id || 'poster' !== get_post_type( $post_id ) ) {
			return '';
		}

		$session_id = (string) get_post_meta( $post_id, 'session_id', true );
		$start_at   = (string) get_post_meta( $post_id, 'start_at', true );
		$end_at     = (string) get_post_meta( $post_id, 'end_at', true );

		$authors      = Helper::get_poster_authors( (int) $post_id );
		$author_label = ! empty( $authors ) ? implode( ', ', $authors ) : '--';

		$conference_id   = Helper::get_linked_conference_id_by_related_post( (int) $post_id );
		$conference_html = '--';

		if ( $conference_id > 0 ) {
			$conference_html = sprintf(
				'<a href="%1$s" %3$s>%2$s</a>',
				$is_editor ? '#' : esc_url( get_permalink( $conference_id ) ),
				esc_html( get_the_title( $conference_id ) ),
				$is_editor ? 'style="pointer-events: none;"' : ''
			);
		}

		// Date logic
		$display_date = get_the_date( 'l, M j, Y', $post_id );
		if ( $start_at ) {
			$start_timestamp = strtotime( $start_at );
			if ( $start_timestamp ) {
				$display_date = wp_date( 'l, M j, Y g:ia', $start_timestamp );

				if ( $end_at ) {
					$end_timestamp = strtotime( $end_at );
					if ( $end_timestamp ) {
						$display_date .= ' - ' . wp_date( 'g:ia', $end_timestamp );
					}
				}
			}
		}

		$poster_collaborators_html = '';
		$poster_collaborators      = get_the_terms( $post_id, 'collaborator' );

		if ( ! empty( $poster_collaborators ) && ! is_wp_error( $poster_collaborators ) ) {
			$poster_archive_url = get_post_type_archive_link( 'poster' );

			foreach ( $poster_collaborators as $poster_collaborator ) {
				$poster_collaborator_link = $poster_archive_url
					? add_query_arg( 'collaborator', $poster_collaborator->slug, $poster_archive_url )
					: get_term_link( $poster_collaborator );

				if ( is_wp_error( $poster_collaborator_link ) ) {
					continue;
				}

				$poster_collaborators_html .= sprintf(
					'<div class="item-card"><a href="%1$s" %3$s rel="tag">%2$s</a></div>',
					$is_editor ? '#' : esc_url( $poster_collaborator_link ),
					esc_html( $poster_collaborator->name ),
					$is_editor ? 'style="pointer-events: none;"' : ''
				);
			}
		}

		$abstract_links  = '';
		$poster_pdf_rows = get_post_meta( $post_id, 'poster_pdf_files', true );
		if ( ! $is_single_view && is_array( $poster_pdf_rows ) ) {
			$pdf_buttons = array();

			foreach ( $poster_pdf_rows as $poster_pdf_row ) {
				if ( ! is_array( $poster_pdf_row ) ) {
					continue;
				}

				$pdf_type = isset( $poster_pdf_row['pdf_type'] ) ? trim( (string) $poster_pdf_row['pdf_type'] ) : '';
				$file_id  = isset( $poster_pdf_row['file_id'] ) ? absint( $poster_pdf_row['file_id'] ) : 0;
				$link     = $file_id > 0 ? wp_get_attachment_url( $file_id ) : '';

				if ( '' === $pdf_type || '' === $link ) {
					continue;
				}

				$pdf_buttons[] = sprintf(
					'<a target="_blank" href="%1$s" class="site-btn btn-small has-download-arrow" rel="noopener noreferrer">%2$s</a>',
					esc_url( $link ),
					esc_html( $pdf_type )
				);
			}

			if ( ! empty( $pdf_buttons ) ) {
				$abstract_links = '
                <div class="is-style-gl-s16"></div>
					<div class="abstract-link two-btn-row">' .
						implode( '', $pdf_buttons ) .
					'</div>';
			}
		}

		$poster_collaborator_classes = 'taxonomy-collaborator items-listing-bullet test listing__item-collaborator card_item-topics test2 wp-block-post-terms';

		if ( ! $is_single_view ) {
			$poster_collaborator_classes .= ' has-separator';
		}

		ob_start();
		?>
		<div class="ambrygen-poster-meta listing-archive__item-meta flag-details">

			<?php if ( $session_id && '0' !== $session_id ) : ?>
				<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
					<div class="listing-archive__item-meta__row__label flag-label">Session:</div>
					<?php echo esc_html( '#' . $session_id ); ?>
				</div>
			<?php endif; ?>

			<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-date-info">
				<div class="listing-archive__item-meta__row__label flag-label">
					<div class="event-carousel__meta-list-icon flag-icon"></div>Date:
				</div>
				<?php echo esc_html( $display_date ); ?>
			</div>

			<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-conference-info">
				<div class="listing-archive__item-meta__row__label flag-label">
					<div class="event-carousel__meta-list-icon flag-icon"></div>Conference:
				</div>
				<?php echo wp_kses_post( $conference_html ); ?>
			</div>

			<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-author-info">
				<div class="listing-archive__item-meta__row__label flag-label">
					<div class="event-carousel__meta-list-icon flag-icon"></div>Authors:
				</div>
				<?php echo esc_html( $author_label ); ?>
			</div>

			<?php if ( '' !== $poster_collaborators_html ) : ?>
				<div class="poster-archive__item-collaborators-wrap">
					<div class="<?php echo esc_attr( $poster_collaborator_classes ); ?>">
						<span class="wp-block-post-terms__prefix">Collaborators: </span>
						<div class="collaborators-items listings-items">
							<?php echo wp_kses_post( $poster_collaborators_html ); ?>
						</div>
					</div>
				</div>
			<?php endif; ?>

			<?php echo wp_kses_post( $abstract_links ); ?>

		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render download buttons for poster PDFs.
	 *
	 * @param int $post_id Poster post ID.
	 * @return string
	 */
	public function render_poster_pdf_files( int $post_id = 0 ): string {
		$post_id   = $post_id ?: (int) get_the_ID();
		$is_editor = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_admin();

		if ( $is_editor && ( ! $post_id || 'poster' !== get_post_type( $post_id ) ) ) {
			$sample_post = get_posts(
				array(
					'post_type'      => 'poster',
					'posts_per_page' => 1,
				)
			);
			if ( ! empty( $sample_post ) ) {
				$post_id = $sample_post[0]->ID;
			}
		}

		if ( ! $post_id || 'poster' !== get_post_type( $post_id ) ) {
			return '';
		}

		$rows = get_post_meta( $post_id, 'poster_pdf_files', true );

		// If in editor and no data, provide sample
		if ( $is_editor && ( ! is_array( $rows ) || empty( $rows ) ) ) {
			$rows = array(
				array(
					'pdf_type' => 'Poster PDF',
					'file_id'  => 0,
				),
			);
		}

		if ( ! is_array( $rows ) ) {
			return '';
		}

		$buttons = array();

		foreach ( $rows as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$pdf_type = isset( $row['pdf_type'] ) ? trim( (string) $row['pdf_type'] ) : '';
			$file_id  = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
			$file_url = $file_id ? wp_get_attachment_url( $file_id ) : ( $is_editor ? '#' : '' );

			if ( '' === $pdf_type || ! $file_url ) {
				continue;
			}

			$buttons[] = array(
				'label' => $pdf_type,
				'url'   => $file_url,
			);
		}

		if ( empty( $buttons ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="is-style-gl-s40" aria-hidden="true"></div>
		<div class="poster-pdf-files ssd">
			<?php foreach ( $buttons as $button ) : ?>
				<a
					class="site-btn btn-small has-download-arrow"
					href="<?php echo esc_url( $button['url'] ); ?>"
					target="_blank"
					rel="noopener"
				>
					<?php echo esc_html( $button['label'] ); ?>
				</a>
			<?php endforeach; ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render publication archive filters.
	 *
	 * @param int $post_id Current post ID.
	 * @return string
	 */
	public function render_publication_filters( int $post_id = 0 ): string {
		$is_editor        = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		$is_valid_context = is_post_type_archive( 'publication' ) || is_singular( 'publication' ) || ( $post_id > 0 && get_post_type( $post_id ) === 'publication' ) || $is_editor;
		if ( ! $is_valid_context ) {
			return '';
		}

		$data = Helper::get_publication_filter_data();

		$current_search         = isset( $_GET['publication-search'] )
			? sanitize_text_field( wp_unslash( $_GET['publication-search'] ) )
			: ( isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '' );
		$current_specialty_area = isset( $_GET['specialty_area'] ) ? sanitize_text_field( wp_unslash( $_GET['specialty_area'] ) ) : '';
		$current_topic          = isset( $_GET['topic'] ) ? sanitize_text_field( wp_unslash( $_GET['topic'] ) ) : '';
		$current_author         = isset( $_GET['publication_author'] ) ? absint( wp_unslash( $_GET['publication_author'] ) ) : 0;
		$current_collaborator   = isset( $_GET['collaborator'] ) ? sanitize_text_field( wp_unslash( $_GET['collaborator'] ) ) : '';

		$archive_url = get_post_type_archive_link( 'publication' );

		ob_start();
		?>
		<div class="cs-wp-filters__header">
			<h3 class="subtitle1-sbold mb-0 publication-filters__heading block-title"><?php esc_html_e( 'Filter By', 'ambrygen-web' ); ?></h3>
			<button class="cs-wp-filters__toggle d-md-none" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle Filters', 'ambrygen-web' ); ?>">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
			</button>
		</div>
		<div class="wp-block-group publication-filters__form cs-wp-filters__form">
			<form method="get" action="<?php echo esc_url( $archive_url ); ?>" class="publication-filters-form cs-wp-filters-form" onsubmit="var searchField=this.querySelector('#publication-search'); if(searchField && !searchField.value.trim()){ searchField.disabled=true; }">
			<div class="publication-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="publication-search"
						class="facetwp-label"><?php esc_html_e( 'Search', 'ambrygen-web' ); ?></label></div>
				<input id="publication-search" type="search" name="publication-search" value="<?php echo esc_attr( $current_search ); ?>"
					placeholder="<?php esc_attr_e( 'Search Publications', 'ambrygen-web' ); ?>">
			</div>

			<div class="publication-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="publication-specialty"
						class="facetwp-label"><?php esc_html_e( 'Specialty Area', 'ambrygen-web' ); ?></label></div>
				<select id="publication-specialty" name="specialty_area">
					<option value=""><?php esc_html_e( 'Select Specialty Area', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['specialty_areas'] as $term ) : ?>
						<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $current_specialty_area, (string) $term->slug ); ?>>
							<?php echo esc_html( $this->trim_ui_label( (string) $term->name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="publication-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="publication-topic"
						class="facetwp-label"><?php esc_html_e( 'Topics', 'ambrygen-web' ); ?></label></div>
				<select id="publication-topic" name="topic">
					<option value=""><?php esc_html_e( 'Select Topic', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['topics'] as $term ) : ?>
						<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $current_topic, (string) $term->slug ); ?>>
							<?php echo esc_html( $this->trim_ui_label( (string) $term->name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="publication-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="publication-author"
						class="facetwp-label"><?php esc_html_e( 'Authors', 'ambrygen-web' ); ?></label></div>
				<select id="publication-author" name="publication_author">
					<option value=""><?php esc_html_e( 'Choose an Author', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['authors'] as $author_id => $author_name ) : ?>
						<option value="<?php echo esc_attr( (int) $author_id ); ?>" <?php selected( $current_author, (int) $author_id ); ?>>
							<?php echo esc_html( $this->trim_ui_label( $author_name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="publication-filters-form__field cs-wp-filters-form__field">
				<div class="text-md-regular mb-0"><label for="publication-collaborator"
						class="facetwp-label"><?php esc_html_e( 'Collaborators', 'ambrygen-web' ); ?></label></div>
				<select id="publication-collaborator" name="collaborator">
					<option value=""><?php esc_html_e( 'Select a Collaborator', 'ambrygen-web' ); ?></option>
					<?php foreach ( $data['collaborators'] as $term ) : ?>
						<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $current_collaborator, (string) $term->slug ); ?>>
							<?php echo esc_html( $this->trim_ui_label( (string) $term->name ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="publication-filters-form__actions cs-wp-filters-form__actions">
				<button type="submit" class="site-btn"><?php esc_html_e( 'Apply Filters', 'ambrygen-web' ); ?></button>
				<a href="<?php echo esc_url( $archive_url ); ?>"
					class="site-btn is-style-site-tertiary-btn"><?php esc_html_e( 'Clear', 'ambrygen-web' ); ?></a>
			</div>
		</form>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render the publication archive result count.
	 *
	 * @param int $post_id Current post ID.
	 * @return string
	 */
	public function render_publication_result_count( int $post_id = 0 ): string {
		$is_editor        = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		$is_valid_context = is_post_type_archive( 'publication' ) || is_singular( 'publication' ) || ( $post_id > 0 && get_post_type( $post_id ) === 'publication' ) || $is_editor;
		if ( ! $is_valid_context ) {
			return '';
		}

		global $wp_query;
		if ( $is_editor && ( ! $wp_query instanceof \WP_Query || empty( $wp_query->posts ) || $wp_query->post_count === 0 ) ) {
			return sprintf(
				'<p class="text-md-Semibold">%s</p>',
				esc_html( sprintf( __( 'Showing %1$d of %2$d Results', 'ambrygen-web' ), 10, 150 ) )
			);
		}

		if ( ! $wp_query instanceof \WP_Query ) {
			return '';
		}

		return sprintf(
			'<p class="text-md-Semibold">%s</p>',
			esc_html(
				sprintf(
					__( 'Showing %1$d of %2$d Results', 'ambrygen-web' ),
					(int) $wp_query->post_count,
					(int) $wp_query->found_posts
				)
			)
		);
	}

	/**
	 * Render publication meta summary output.
	 *
	 * @param int $post_id Publication post ID.
	 * @return string
	 */
	public function render_publication_meta( int $post_id = 0 ): string {
		$post_id        = $post_id ?: (int) get_the_ID();
		$is_editor      = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_admin();
		$is_single_view = ! $is_editor && is_singular( 'publication' );

		if ( $is_editor && ( ! $post_id || 'publication' !== get_post_type( $post_id ) ) ) {
			$sample_post = get_posts(
				array(
					'post_type'      => 'publication',
					'posts_per_page' => 1,
				)
			);
			if ( ! empty( $sample_post ) ) {
				$post_id = $sample_post[0]->ID;
			}
		}

		if ( ! $post_id || 'publication' !== get_post_type( $post_id ) ) {
			return '';
		}

		$date_label      = get_the_date( 'F j, Y', $post_id );
		$linked_authors  = Helper::get_linked_author_options( $post_id );
		$display_authors = array_values( $linked_authors );
		$has_more_authors = false;
		$journal_title   = trim( (string) get_post_meta( $post_id, 'journal_title', true ) );
		$journal_abbr    = trim( (string) get_post_meta( $post_id, 'journal_abbr', true ) );
		$journal_volume  = trim( (string) get_post_meta( $post_id, 'journal_volume', true ) );
		$link            = esc_url( (string) get_post_meta( $post_id, 'link', true ) );
		$note            = trim( (string) get_post_meta( $post_id, 'note', true ) );

		if ( ! $is_single_view && count( $display_authors ) > 5 ) {
			$display_authors  = array_slice( $display_authors, 0, 5 );
			$has_more_authors = true;
		}

		ob_start();
		?>
		<div class="ambrygen-publication-meta listing-archive__item-meta flag-details">
			<div class="listing-archive__item-meta__row text-md-regular flag-info flag-date-info">
				<span class="flag-icon"></span>
				<span class="listing-archive__item-meta__row__label flag-label"><?php esc_html_e( 'Date:', 'ambrygen-web' ); ?></span>
				<?php echo esc_html( $date_label ); ?>
			</div>
			<?php if ( ! empty( $linked_authors ) ) : ?>
				<div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-author-info">
					<div class="listing-archive__item-meta__row__label flag-label">
						<div class="event-carousel__meta-list-icon flag-icon"></div>
						<?php esc_html_e( 'Authors:', 'ambrygen-web' ); ?>
					</div>
					<?php echo esc_html( implode( ', ', $display_authors ) ); ?><?php echo $has_more_authors ? esc_html( ', ...' ) : ''; ?>
				</div>
			<?php endif; ?>
			<?php if ( '' !== $journal_title ) : ?>
				<div class="listing-archive__item-meta__row text-md-regular items-listing-bullet">
					<span class="listing-archive__item-meta__row__label wp-block-post-terms__prefix"><?php esc_html_e( 'Journal:', 'ambrygen-web' ); ?></span>
					<?php echo esc_html( $journal_title ); ?>
				</div>
			<?php endif; ?>
		
			<?php if ( '' !== $journal_volume ) : ?>
				<div class="listing-archive__item-meta__row text-md-regular">
					<span class="listing-archive__item-meta__row__label"><?php esc_html_e( 'Journal Volume:', 'ambrygen-web' ); ?></span>
					<?php echo esc_html( $journal_volume ); ?>
				</div>
			<?php endif; ?>
			<?php if ( '' !== $note ) : ?>
				<div class="listing-archive__item-meta__row text-md-regular">
					<span class="listing-archive__item-meta__row__label"><?php esc_html_e( 'Note:', 'ambrygen-web' ); ?></span>
					<?php echo esc_html( $note ); ?>
				</div>
			<?php endif; ?>
		</div>
	 
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render the appropriate science meta partial for a post type.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_post_meta_fields( int $post_id ): string {
		if ( ! $post_id ) {
			return '';
		}

		$post_type = get_post_type( $post_id );
		if ( ! $post_type ) {
			return '';
		}

		$meta_fields = array();

		switch ( $post_type ) {
			case 'publication':
				return $this->render_publication_meta( $post_id );
			case 'presentation':
				return $this->render_presentation_meta();
			case 'poster':
				return $this->render_poster_meta();
			default:
				return '';
		}
	}
}
