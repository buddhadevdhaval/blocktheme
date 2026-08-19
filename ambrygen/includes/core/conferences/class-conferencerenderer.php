<?php
/**
 * Conference renderer service.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\Conferences;

use Ambrygen\Theme\Core\Conferences\ConferenceLinkService;
use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Science\ScienceRenderer;
use Ambrygen\Theme\Core\Singleton;
use Ambrygen\Theme\Core\Theme_Options;
defined( 'ABSPATH' ) || exit;

/**
 * Conference renderer service.
 */
final class ConferenceRenderer {


	use Singleton;

	/**
	 * Render the conference hero content section.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_hero_content( int $post_id ): string {

		$event_meta = $this->get_event_meta_details( $post_id );
		$kicker     = get_post_meta( $post_id, 'pr_sub_heading', true );
		$heading    = get_post_meta( $post_id, 'pr_name', true ) ?: get_the_title( $post_id );
		$date       = $event_meta['date'];
		$location   = $event_meta['location'];
		$booth      = $event_meta['booth'];

		$directions_url = $this->build_conference_google_maps_url( $post_id );
		$rsvp_url       = get_post_meta( $post_id, 'show_url', true );

		ob_start();
		?>
		<div class="hero-section__content">
			<?php if ( $kicker ) : ?>
				<div class="hero__eyebrow hero-kicker"><?php echo esc_html( $kicker ); ?></div>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php endif; ?>

			<h1 id="hero-heading-0" class="hero-section__heading heading-2 mb-0"><?php echo esc_html( $heading ); ?></h1>
			<div class="is-style-gl-s24" aria-hidden="true"></div>

			<div class="card-meta" aria-label="<?php esc_attr_e( 'Event details', 'ambrygen' ); ?>">
				<?php if ( $date ) : ?>
					<div class="card-meta-item calendar-check-icon">
						<div class="card-meta-icon"></div>
						<span class="card-meta-text text-lg-reg"><?php echo esc_html( $date ); ?></span>
					</div>
				<?php endif; ?>

				<?php if ( $location ) : ?>
					<div class="card-meta-item marker-pin">
						<div class="card-meta-icon"></div>
						<span class="card-meta-text text-lg-reg"><?php echo esc_html( $location ); ?></span>
					</div>
				<?php endif; ?>

				<?php if ( $booth ) : ?>
					<div class="card-meta-item flag-icon">
						<div class="card-meta-icon"></div>
						<span class="card-meta-text text-lg-reg"><?php echo esc_html( $booth ); ?></span>
					</div>
				<?php endif; ?>
			</div>

			<?php if ( $directions_url || $rsvp_url ) : ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div class="hero-section__actions">
					<?php if ( $directions_url ) : ?>
						<a target="_blank" href="<?php echo esc_url( $directions_url ); ?>"
							class="hero-section__button site-btn is-style-site-trailing-icon is-style-site-tertiary-btn">
							<?php esc_html_e( 'Directions', 'ambrygen-web' ); ?>
						</a>
					<?php endif; ?>

					<?php if ( $rsvp_url ) : ?>
						<a target="_blank" href="<?php echo esc_url( $rsvp_url ); ?>"
							class="hero-section__button site-btn is-style-site-trailing-icon">
							<?php esc_html_e( 'RSVP', 'ambrygen-web' ); ?>
						</a>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render the conference overview and agenda section.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_overview_agenda( int $post_id ): string {
		$presentations = ConferenceLinkService::instance()->get_linked_posts_by_type( $post_id, 'presentation' );
		$posters       = ConferenceLinkService::instance()->get_linked_posts_by_type( $post_id, 'poster' );
		$events        = ConferenceLinkService::instance()->get_linked_posts_by_type( $post_id, 'event' );

		if ( empty( $presentations ) && empty( $posters ) && empty( $events ) ) {
			return '';
		}

		$agenda_by_date = array();

		foreach ( $presentations as $p ) {
			$date_raw = get_post_meta( $p->ID, 'start_at', true );
			if ( $date_raw ) {
				$date_key                                       = date( 'Y-m-d', strtotime( $date_raw ) );
				$agenda_by_date[ $date_key ]['presentations'][] = $p;
			}
		}

		foreach ( $posters as $p ) {
			$date_raw = get_post_meta( $p->ID, 'start_at', true );
			if ( $date_raw ) {
				$date_key                                 = date( 'Y-m-d', strtotime( $date_raw ) );
				$agenda_by_date[ $date_key ]['posters'][] = $p;
			}
		}

		foreach ( $events as $e ) {
			$date_raw = get_post_meta( $e->ID, 'start_at', true );
			if ( $date_raw ) {
				$date_key                                = date( 'Y-m-d', strtotime( $date_raw ) );
				$agenda_by_date[ $date_key ]['events'][] = $e;
			}
		}

		ksort( $agenda_by_date );

		if ( empty( $agenda_by_date ) ) {
			return '';
		}

		ob_start();
		foreach ( $agenda_by_date as $date_str => $items ) :
			$timestamp = strtotime( $date_str );
			$day_name  = date_i18n( 'l', $timestamp );
			$day_date  = date_i18n( 'F j', $timestamp );
			$id_slug   = sanitize_title( $day_name );
			?>
			<article class="agenda-card" aria-labelledby="agenda-<?php echo esc_attr( $id_slug ); ?>-label">
				<div class="agenda-card__date-col">
					<div class="agenda-card__day-name subtitle2-sbold" id="agenda-<?php echo esc_attr( $id_slug ); ?>-label">
						<?php echo esc_html( $day_name ); ?>
					</div>
					<div class="agenda-card__day-date text-md-Semibold">
						<?php echo esc_html( $day_date ); ?>
					</div>
					<div class="agenda-card__divider" aria-hidden="true"></div>
				</div>

				<ul class="agenda-card__schedule" aria-label="<?php echo esc_attr( $day_name . ' ' . $day_date ); ?> schedule">

					<?php
					if ( ! empty( $items['posters'] ) ) :
						$poster_count = count( $items['posters'] );
						$first_p      = $items['posters'][0];
						$start_at     = get_post_meta( $first_p->ID, 'start_at', true );
						$end_at       = get_post_meta( $first_p->ID, 'end_at', true );
						$time         = '';

						if ( $start_at && $end_at ) {
							$time = date_i18n( 'g:i A', strtotime( $start_at ) ) . ' - ' . date_i18n( 'g:i A', strtotime( $end_at ) );
						} elseif ( $start_at ) {
							$time = date_i18n( 'g:i A', strtotime( $start_at ) );
						}
						?>
						<li class="agenda-card__row">
							<span class="agenda-card__event-label body1-sbold">
								<?php esc_html_e( 'Poster Session', 'ambrygen-web' ); ?>
							</span>
							<span class="agenda-card__event-time body1">
								<?php echo esc_html( $time ); ?>
								<?php
								if ( $poster_count ) {
									echo ' (' . esc_html( sprintf( _n( '%d Poster', '%d Posters', $poster_count, 'ambrygen-web' ), $poster_count ) ) . ')';
								}
								?>
							</span>
						</li>
					<?php endif; ?>

					<?php
					if ( ! empty( $items['presentations'] ) ) :
						$pres_count = count( $items['presentations'] );
						$first_p    = $items['presentations'][0];
						$start_at   = get_post_meta( $first_p->ID, 'start_at', true );
						$end_at     = get_post_meta( $first_p->ID, 'end_at', true );
						$time       = '';

						if ( $start_at && $end_at ) {
							$time = date_i18n( 'g:i A', strtotime( $start_at ) ) . ' - ' . date_i18n( 'g:i A', strtotime( $end_at ) );
						} elseif ( $start_at ) {
							$time = date_i18n( 'g:i A', strtotime( $start_at ) );
						}
						?>
						<li class="agenda-card__row">
							<span class="agenda-card__event-label body1-sbold">
								<?php esc_html_e( 'Oral Presentations', 'ambrygen-web' ); ?>
							</span>
							<span class="agenda-card__event-time body1">
								<?php echo esc_html( $time ); ?>
							</span>
						</li>
					<?php endif; ?>

					<?php
					if ( ! empty( $items['events'] ) ) :
						foreach ( $items['events'] as $event ) {
							$event_id   = $event->ID;
							$event_name = get_post_meta( $event_id, 'pr_name', true ) ?: $event->post_title;
							$start_at   = get_post_meta( $event_id, 'start_at', true );
							$end_at     = get_post_meta( $event_id, 'end_at', true );
							$time       = '';

							if ( $start_at && $end_at ) {
								$time = date_i18n( 'g:i A', strtotime( $start_at ) ) . ' - ' . date_i18n( 'g:i A', strtotime( $end_at ) );
							} elseif ( $start_at ) {
								$time = date_i18n( 'g:i A', strtotime( $start_at ) );
							}
							?>
							<li class="agenda-card__row">
								<span class="agenda-card__event-label body1-sbold">
									<?php echo esc_html( $event_name ); ?>
								</span>
								<span class="agenda-card__event-time body1">
									<?php echo esc_html( $time ); ?>
								</span>
							</li>
							<?php
						}
					endif;
					?>
				</ul>
			</article>
			<?php
		endforeach;

		return (string) ob_get_clean();
	}

	/**
	 * Render linked experts for the conference.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_experts( int $post_id ): string {
		$sessions    = ConferenceLinkService::instance()->get_meet_the_expert_entries( $post_id );
		$event_posts = ConferenceLinkService::instance()->get_linked_event_posts( $post_id );

		if ( empty( $sessions ) && empty( $event_posts ) ) {
			return '';
		}

		$default_header_date  = '';
		$default_header_time  = '';
		$default_header_booth = ConferenceLinkService::instance()->get_linked_booth_label( $post_id );
		$header_source        = $event_posts[0] ?? null;

		if ( $header_source instanceof WP_Post ) {
			$start_at = (string) get_post_meta( $header_source->ID, 'start_at', true );
			$end_at   = (string) get_post_meta( $header_source->ID, 'end_at', true );
			$show_id  = absint( get_post_meta( $header_source->ID, 'trade_show_id', true ) );

			if ( $start_at ) {
				$default_header_date = date_i18n( 'l, F j', strtotime( $start_at ) );
				$default_header_time = $end_at
					? date_i18n( 'g:i A', strtotime( $start_at ) ) . ' - ' . date_i18n( 'g:i A', strtotime( $end_at ) )
					: date_i18n( 'g:i A', strtotime( $start_at ) );
			}

			if ( '' === $default_header_booth && $show_id > 0 ) {
				$default_header_booth = ConferenceLinkService::instance()->get_trade_show_booth_tag( $show_id );
			}
		}

		ob_start();
		?>
		<div id="meet-the-experts" class="event-details__experts conference-tabs-content__panel">
			<div class="event-details">
				<div class="speaker-session panel-frame-layout">
					<?php if ( ! empty( $sessions ) ) : ?>
						<?php foreach ( $sessions as $index => $session ) : ?>
							<?php
							$session_date = ! empty( $session['session_date'] )
								? date_i18n( 'l, F j', strtotime( (string) $session['session_date'] ) )
								: $default_header_date;

							$session_time = ! empty( $session['session_time'] )
								? (string) $session['session_time']
								: $default_header_time;

							$has_members = ! empty( $session['members'] ) && is_array( $session['members'] );
							$has_content = ! empty( $session['content'] );
							$show_header = $session_date || $session_time || $default_header_booth;
							?>

							<?php if ( $index > 0 ) : ?>
								<div class="is-style-gl-s24" aria-hidden="true"></div>
							<?php endif; ?>

							<?php if ( $show_header && $has_members ) : ?>
								<div class="section-header">
									<div class="speaker-session__header">
										<div class="card-meta" aria-label="<?php esc_attr_e( 'Presentation schedule', 'ambrygen-web' ); ?>">
											<?php if ( $session_date ) : ?>
												<div class="card-meta-item calendar-check-icon">
													<div class="card-meta-icon"></div>
													<span class="card-meta-text body2-semibold"><?php echo esc_html( $session_date ); ?></span>
												</div>
											<?php endif; ?>

											<?php if ( $session_time ) : ?>
												<div class="card-meta-item clock-icon">
													<div class="card-meta-icon"></div>
													<span class="card-meta-text body2-semibold"><?php echo esc_html( $session_time ); ?></span>
												</div>
											<?php endif; ?>

											<?php if ( $default_header_booth ) : ?>
												<div class="card-meta-item flag-icon">
													<div class="card-meta-icon"></div>
													<span
														class="card-meta-text body2-semibold"><?php echo esc_html( $default_header_booth ); ?></span>
												</div>
											<?php endif; ?>
										</div>
									</div>
									<div class="is-style-gl-s24" aria-hidden="true"></div>
								</div>
							<?php endif; ?>

							<?php if ( $has_members ) : ?>
								<div class="speaker-session__speakers">
									<?php foreach ( $session['members'] as $member ) : ?>
										<article class="speaker-card">
											<div class="speaker-card__actions"></div>

											<?php if ( ! empty( $member['image_html'] ) ) : ?>
												<?php echo $member['image_html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
											<?php endif; ?>

											<div class="speaker-card__content">
												<?php if ( ! empty( $member['name'] ) ) : ?>
													<div class="speaker-card__name text-lg-medium"><?php echo esc_html( $member['name'] ); ?></div>
												<?php endif; ?>

												<?php if ( ! empty( $member['designation'] ) ) : ?>
													<div class="speaker-card__title body2-medium"><?php echo esc_html( $member['designation'] ); ?>
													</div>
												<?php endif; ?>

												<?php if ( ! empty( $member['bio'] ) ) : ?>
													<div class="speaker-card__bio body1">
														<?php echo $member['bio']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
													</div>
												<?php endif; ?>
											</div>
										</article>
									<?php endforeach; ?>
								</div>
							<?php endif; ?>

							<?php if ( $has_content ) : ?>
								<div class="speaker-session__content">
									<?php echo $session['content']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								</div>
							<?php endif; ?>
						<?php endforeach; ?>
					<?php endif; ?>
				</div>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render linked posters for the conference.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_posters( int $post_id ): string {
		$posters = ConferenceQueryService::instance()->get_linked_posts_by_type( $post_id, 'poster' );

		if ( empty( $posters ) ) {
			return '';
		}

		$grouped_posters = array();
		foreach ( $posters as $poster ) {
			$poster_id = $poster->ID;
			$start_at  = get_post_meta( $poster_id, 'start_at', true );
			$date_key  = ! empty( $start_at ) ? date( 'Y-m-d', strtotime( $start_at ) ) : 'no-date';

			if ( ! isset( $grouped_posters[ $date_key ] ) ) {
				$grouped_posters[ $date_key ] = array();
			}

			$grouped_posters[ $date_key ][] = $poster;
		}

		ksort( $grouped_posters );

		ob_start();
		?>
		<div class="event-details">
			<div class="event-posters-list panel-frame-layout">
				<?php foreach ( $grouped_posters as $day_posters ) : ?>
					<?php
					$first_p  = $day_posters[0];
					$start_at = get_post_meta( $first_p->ID, 'start_at', true );
					$end_at   = get_post_meta( $first_p->ID, 'end_at', true );
					$day_date = ! empty( $start_at ) ? date_i18n( 'l, F j', strtotime( $start_at ) ) : '';

					$time = '';
					if ( $start_at && $end_at ) {
						$time = date_i18n( 'g:i A', strtotime( $start_at ) ) . ' - ' . date_i18n( 'g:i A', strtotime( $end_at ) );
					} elseif ( $start_at ) {
						$time = date_i18n( 'g:i A', strtotime( $start_at ) );
					}
					?>
					<div class="poster-group">
						<div class="card-meta" aria-label="Poster session on <?php echo esc_attr( $day_date ); ?>">
							<?php if ( $day_date ) : ?>
								<div class="card-meta-item calendar-check-icon">
									<div class="card-meta-icon"></div>
									<span class="card-meta-text body2-semibold"><?php echo esc_html( $day_date ); ?></span>
								</div>
							<?php endif; ?>
							<div class="card-meta-item clock-icon">
								<div class="card-meta-icon"></div>
								<span class="card-meta-text body2-semibold"><?php echo esc_html( $time ); ?></span>
							</div>

							<div class="card-meta-item assessment-icon">
								<div class="card-meta-icon"></div>
								<span class="card-meta-text body2-semibold">
									<?php
									$count = count( $day_posters );
									printf( _n( '%d Poster', '%d Posters', $count, 'ambrygen-web' ), $count );
									?>
								</span>
							</div>
						</div>

						<div class="is-style-gl-s24" aria-hidden="true"></div>

						<div class="poster-group__cards">
							<?php foreach ( $day_posters as $poster ) : ?>
								<?php
								$poster_id   = $poster->ID;
								$session_id  = get_post_meta( $poster_id, 'session', true );
								$poster_name = get_post_meta( $poster_id, 'pr_name', true ) ?: $poster->post_title;

								$linked_authors = array_values( Helper::get_poster_linked_author_options( $poster_id ) );
								$authors        = ! empty( $linked_authors )
									? implode( ', ', $linked_authors )
									: $this->format_meta_list_value( get_post_meta( $poster_id, 'authors', true ) );
								$poster_pdfs = $this->get_poster_pdf_files( $poster_id );

								?>
								<article class="agenda-card">
									<?php if ( ! empty( $session_id ) ) : ?>
										<div class="agenda-card__date-col">
											<div class="agenda-card__day-name subtitle2-sbold">
												<?php esc_html_e( 'Session', 'ambrygen-web' ); ?></div>
											<div class="agenda-card__day-date subtitle1-sbold">
												<?php echo esc_html( 'P' . $session_id ); ?>
											</div>
											<div class="agenda-card__divider" aria-hidden="true"></div>
										</div>
									<?php endif; ?>

									<div class="agenda-card__schedule">
										<div class="agenda-card__event-title subtitle1-sbold mb-0 subtitle2-sbold">
											<a href="<?php echo esc_url( get_permalink( $poster_id ) ); ?>" class="agenda-card__event-link">
												<?php echo esc_html( $poster_name ); ?>
											</a>
											<?php if ( ! empty( $poster_pdfs ) ) : ?>
												<?php
												$types = array_values(
													array_filter(
														array_map(
															static function ( $item ) {
																$type = isset( $item['pdf_type'] ) ? trim( $item['pdf_type'] ) : '';
																return $type ? ucfirst( str_replace( '_', ' ', $type ) ) : '';
															},
															$poster_pdfs
														),
														static fn( $type) => $type !== ''
													)
												);
												?>

												<?php if ( ! empty( $types ) ) : ?>
					<div class="is-style-gl-s12" aria-hidden="true"></div>
					<div class="event-carousel__tags lists-item-category">

													<?php foreach ( $types as $type ) : ?>
							<div class="category-item">
								<a href="<?php echo esc_url( get_permalink( $poster_id ) ); ?>" class="event-carousel__tag"><?php echo esc_html( $type ); ?></a>
							</div>
						<?php endforeach; ?>
					</div>
					<div class="is-style-gl-s12" aria-hidden="true"></div>
				<?php endif; ?>
			<?php endif; ?>
										</div>
										<?php if ( $authors ) : ?>
											<div class="agenda-card__event-speakers body1"><?php echo esc_html( $authors ); ?></div>
										<?php endif; ?>
									</div>
								</article>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render linked presentations for the conference.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_presentations( int $post_id ): string {
		$presentations = ConferenceQueryService::instance()->get_linked_posts_by_type( $post_id, 'presentation' );

		if ( empty( $presentations ) ) {
			return '';
		}

		$grouped_presentations = array();
		foreach ( $presentations as $presentation ) {
			$presentation_id = $presentation->ID;
			$start_at        = get_post_meta( $presentation_id, 'start_at', true );
			$date_key        = ! empty( $start_at ) ? date( 'Y-m-d', strtotime( $start_at ) ) : 'no-date';

			if ( ! isset( $grouped_presentations[ $date_key ] ) ) {
				$grouped_presentations[ $date_key ] = array();
			}

			$grouped_presentations[ $date_key ][] = $presentation;
		}

		ksort( $grouped_presentations );

		ob_start();
		?>
		<div class="event-details">
			<div class="event-presentations-list panel-frame-layout">
				<?php foreach ( $grouped_presentations as $day_presentations ) : ?>
					<?php
					$first_p  = $day_presentations[0];
					$start_at = get_post_meta( $first_p->ID, 'start_at', true );
					$end_at   = get_post_meta( $first_p->ID, 'end_at', true );
					$day_date = ! empty( $start_at ) ? date_i18n( 'l, F j', strtotime( $start_at ) ) : '';

					$time = '';
					if ( $start_at && $end_at ) {
						$time = date_i18n( 'g:i A', strtotime( $start_at ) ) . ' - ' . date_i18n( 'g:i A', strtotime( $end_at ) );
					} elseif ( $start_at ) {
						$time = date_i18n( 'g:i A', strtotime( $start_at ) );
					}
					?>
					<div class="presentation-group event-presentations-card">
						<div class="card-meta" aria-label="Presentation schedule for <?php echo esc_attr( $day_date ); ?>">
							<?php if ( $day_date ) : ?>
								<div class="card-meta-item calendar-check-icon">
									<div class="card-meta-icon"></div>
									<span class="card-meta-text body2-semibold"><?php echo esc_html( $day_date ); ?></span>
								</div>
							<?php endif; ?>
							<div class="card-meta-item clock-icon">
								<div class="card-meta-icon"></div>
								<span class="card-meta-text body2-semibold"><?php echo esc_html( $time ); ?></span>
							</div>

							<div class="card-meta-item assessment-icon">
								<div class="card-meta-icon"></div>
								<span class="card-meta-text body2-semibold">
									<?php
									$count = count( $day_presentations );
									printf( _n( '%d Presentation', '%d Presentations', $count, 'ambrygen-web' ), $count );
									?>
								</span>
							</div>
						</div>

						<div class="is-style-gl-s24" aria-hidden="true"></div>

						<div class="presentation-group__cards">
							<?php foreach ( $day_presentations as $presentation ) : ?>
								<?php
								$presentation_id        = $presentation->ID;
								$session_id             = get_post_meta( $presentation_id, 'session', true );
								$presentation_name      = get_post_meta( $presentation_id, 'pr_name', true ) ?: $presentation->post_title;
								$speakers_list          = $this->format_meta_list_value( get_post_meta( $presentation_id, 'speakers', true ) );
								$presentation_pdfs      = $this->get_presentation_pdf_files( $presentation_id );
								$presentation_pdf_types = $this->get_pdf_type_labels( $presentation_pdfs );
								?>
								<article class="agenda-card presentation-card">
									<?php if ( ! empty( $session_id ) ) : ?>
										<div class="agenda-card__date-col">
											<div class="agenda-card__day-name subtitle2-sbold"><?php esc_html_e( 'Session', 'ambrygen' ); ?>
											</div>
											<div class="agenda-card__day-date subtitle1-sbold"><?php echo esc_html( $session_id ); ?></div>
										</div>
									<?php endif; ?>

									<div class="agenda-card__schedule">
										<div class="agenda-card__event-title subtitle1-sbold mb-0 subtitle2-sbold">
											<a href="<?php echo esc_url( get_permalink( $presentation_id ) ); ?>" class="agenda-card__event-link">
												<?php echo esc_html( $presentation_name ); ?>
											</a>
										</div>
										<?php if ( ! empty( $presentation_pdf_types ) ) : ?>
											<div class="is-style-gl-s12" aria-hidden="true"></div>
											<div class="event-carousel__tags lists-item-category">
												<?php foreach ( $presentation_pdf_types as $presentation_pdf_type ) : ?>
													<div class="category-item">
														<a href="<?php echo esc_url( get_permalink( $presentation_id ) ); ?>" class="event-carousel__tag"><?php echo esc_html( $presentation_pdf_type ); ?></a>
													</div>
												<?php endforeach; ?>
												
											</div>
											<div class="is-style-gl-s12" aria-hidden="true"></div>
										<?php endif; ?>
										<?php if ( $speakers_list ) : ?>
											<div class="agenda-card__event-speakers body1"><?php echo esc_html( $speakers_list ); ?></div>
										<?php endif; ?>
									</div>
								</article>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render the conference tabs navigation.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	public function render_tabs_nav( int $post_id ): string {
		$has_experts       = ! empty( ConferenceLinkService::instance()->get_meet_the_expert_entries( $post_id ) );
		$has_posters       = ! empty( ConferenceLinkService::instance()->get_linked_posts_by_type( $post_id, 'poster' ) );
		$has_presentations = ! empty( ConferenceLinkService::instance()->get_linked_posts_by_type( $post_id, 'presentation' ) );

		$tabs = array(
			array(
				'slug'  => 'all',
				'label' => __( 'Overview', 'ambrygen-web' ),
			),
		);
		if ( $has_experts ) {
			$tabs[] = array(
				'slug'  => 'meet-the-experts',
				'label' => __( 'Meet the Experts', 'ambrygen-web' ),
			);
		}
		if ( $has_posters ) {
			$tabs[] = array(
				'slug'  => 'scientific-posters',
				'label' => __( 'Scientific Posters', 'ambrygen-web' ),
			);
		}
		if ( $has_presentations ) {
			$tabs[] = array(
				'slug'  => 'oral-presentation',
				'label' => __( 'Oral Presentation', 'ambrygen-web' ),
			);
		}

		ob_start();
		?>
		<div class="tabs__mobile-nav">
			<select class="tabs__select text-md-sbold" aria-label="<?php esc_attr_e( 'Select test category', 'ambrygen-web' ); ?>">
				<?php foreach ( $tabs as $index => $tab ) : ?>
					<option value="<?php echo esc_attr( $tab['slug'] ); ?>" <?php selected( 0, $index ); ?>>
						<?php echo esc_html( $tab['label'] ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</div>
		<div class="tabs__nav test">
			<button type="button" class="tabs__tab text-md-Semibold is-active" data-tab-target="all">
				Overview </button>
			<?php if ( $has_experts ) : ?>
				<button type="button" class="tabs__tab text-md-Semibold" data-tab-target="meet-the-experts">
					Meet the Experts </button>
			<?php endif; ?>
			<?php if ( $has_posters ) : ?>
				<button type="button" class="tabs__tab text-md-Semibold" data-tab-target="scientific-posters">
					Scientific Posters </button>
			<?php endif; ?>
			<?php if ( $has_presentations ) : ?>
				<button type="button" class="tabs__tab text-md-Semibold" data-tab-target="oral-presentation">
					Oral Presentation </button>
			<?php endif; ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render event meta summary markup.
	 *
	 * @param int $post_id Event post ID.
	 * @return string
	 */
	public function render_event_meta_summary( int $post_id ): string {
		$post_id   = $post_id ?: get_the_ID();
		$is_editor = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );

		if ( $is_editor && ( ! $post_id || 'conferences' !== get_post_type( $post_id ) ) ) {
			$sample_post = get_posts(
				array(
					'post_type'      => 'conferences',
					'posts_per_page' => 1,
				)
			);
			if ( ! empty( $sample_post ) ) {
				$post_id = $sample_post[0]->ID;
			}
		}

		if ( ! $is_editor && ( ! $post_id || 'conferences' !== get_post_type( $post_id ) ) ) {
			return '';
		}

		$tags_html = '';
		$terms     = get_the_terms( $post_id, 'post_tag' );
		if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
			foreach ( $terms as $term ) {
				$tags_html .= sprintf(
					'<a %1$s class="cip-card__tag cip-card__tag--success"><div class="cip-card__tag-dot"></div> %2$s</a>',
					'href="' . esc_url( get_term_link( $term ) ) . '"',
					esc_html( $term->name )
				);
			}
		}

		$title       = get_the_title( $post_id );
		$subtitle    = (string) get_post_meta( $post_id, 'pr_sub_heading', true );
		$date_range  = $this->format_event_date_range(
			(string) get_post_meta( $post_id, 'start_at', true ),
			(string) get_post_meta( $post_id, 'end_at', true )
		);
		$location    = $this->get_event_location( $post_id );
		$booth       = $this->get_linked_booth( $post_id );
		$description = (string) get_post_meta( $post_id, 'pr_description', true );
		$permalink   = get_permalink( $post_id );

		ob_start();
		?>
		<div class="cip-card__info">
			<div class="cip-card__title-block">
				<div class="cip-card__title-wrap">
					<h3 class="cip-card__title heading-4 mb-0"><?php echo esc_html( $title ); ?></h3>
					<?php if ( '' !== $tags_html ) : ?>
						<div class="cip-card__tags" aria-hidden="true">
							<?php echo wp_kses_post( $tags_html ); ?>
						</div>
					<?php endif; ?>
				</div>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<?php if ( '' !== $subtitle ) : ?>
					<div class="cip-card__subtitle text-lg-bold mb-0"><?php echo esc_html( $subtitle ); ?></div>
				<?php endif; ?>
			</div>

			<ul class="cip-card__meta" <?php echo 'aria-label="' . esc_attr__( 'Event details', 'ambrygen-web' ) . '"'; ?>>
				<?php if ( '' !== $date_range ) : ?>
					<li class="cip-card__meta-item calendar-check">
						<div class="cip-card__meta-icon"></div>
						<span class="cip-card__meta-text text-lg-reg"><?php echo esc_html( $date_range ); ?></span>
					</li>
				<?php endif; ?>
				<?php if ( '' !== $location ) : ?>
					<li class="cip-card__meta-item marker-pin">
						<div class="cip-card__meta-icon"></div>
						<span class="cip-card__meta-text text-lg-reg"><?php echo esc_html( $location ); ?></span>
					</li>
				<?php endif; ?>
				<?php if ( '' !== $booth ) : ?>
					<li class="cip-card__meta-item flag">
						<div class="cip-card__meta-icon"></div>
						<span class="cip-card__meta-text text-lg-reg"><?php echo esc_html( $booth ); ?></span>
					</li>
				<?php endif; ?>
			</ul>

			<?php if ( '' !== $description ) : ?>
				<div class="cip-card__description body1 mb-0">
					<?php echo wp_kses_post( $description ); ?>
				</div>
			<?php endif; ?>

			<div class="cip-card__cta-wrap">
				<a <?php echo 'href="' . esc_url( $permalink ) . '"'; ?>
					class="cip-card__cta site-btn is-style-site-trailing-icon">
					<?php echo esc_html__( 'Details', 'ambrygen-web' ); ?>
				</a>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render an event archive grid card.
	 *
	 * @param int $post_id Event post ID.
	 * @return string
	 */
	public function render_event_grid_card( int $post_id ): string {
		$post_id   = $post_id ?: get_the_ID();
		$is_editor = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );

		if ( $is_editor && ( ! $post_id || 'conferences' !== get_post_type( $post_id ) ) ) {
			$sample_post = get_posts(
				array(
					'post_type'      => 'conferences',
					'posts_per_page' => 1,
				)
			);
			if ( ! empty( $sample_post ) ) {
				$post_id = $sample_post[0]->ID;
			}
		}

		if ( ! $is_editor && ( ! $post_id || 'conferences' !== get_post_type( $post_id ) ) ) {
			return '';
		}

		$title       = get_the_title( $post_id );
		$permalink   = get_permalink( $post_id );
		$description = (string) get_post_meta( $post_id, 'pr_sub_heading', true );
		if ( '' === $description ) {
			$description = get_the_excerpt( $post_id );
		}

		$date_range = $this->format_event_date_range(
			(string) get_post_meta( $post_id, 'start_at', true ),
			(string) get_post_meta( $post_id, 'end_at', true )
		);
		$location   = $this->get_event_location( $post_id );
		$thumb_id   = get_post_thumbnail_id( $post_id );
		$image_html = Helper::image_with_placeholder(
			$thumb_id,
			'event-carousel-thumb',
			array( 'class' => 'event-carousel__image' )
		);

		$tags_html = '';
		$terms     = get_the_terms( $post_id, 'post_tag' );
		?>

		<?php

		if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
			$tags_html .= '<div class="event-carousel__tags lists-item-category">';
			foreach ( $terms as $term ) {
				$tags_html .= sprintf(
					'<div class="category-item"><a href="%1$s" class="event-carousel__tag">%2$s</a></div>',
					esc_url( get_term_link( $term ) ),
					esc_html( $term->name )
				);
			}
			$tags_html .= '</div>';
		}
		?>


		<?php
		ob_start();
		?>
		<div class="event-carousel__card">
			<div class="event-carousel__image-wrap">
				<?php if ( '' !== $image_html ) : ?>
					<a href="<?php echo esc_url( $permalink ); ?>"><?php echo $image_html; ?></a>
				<?php endif; ?>
				<?php if ( '' !== $date_range ) : ?>
					<div class="event-carousel__month-info">
						<span class="event-carousel__month"><?php echo esc_html( $date_range ); ?></span>
					</div>
				<?php endif; ?>
			</div>
			<div class="event-carousel__content">
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<div class="event-carousel__title-row">
					<a href="<?php echo esc_url( $permalink ); ?>"
						class="text-lg-semibold event-carousel__card-title mb-0"><?php echo esc_html( $title ); ?></a>
					<?php if ( '' !== $tags_html ) : ?>
						<div class="event-carousel__tags" aria-hidden="true">
							<?php echo $tags_html; ?>
						</div>
					<?php endif; ?>
				</div>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<div class="event-carousel__body  flag-details">
					<div class="event-carousel__details">
						<?php if ( '' !== $date_range ) : ?>
							<div class="text-md-medium event-carousel__date-info flag-info flag-date-info">
								<div class="event-carousel__meta-icon flag-icon" aria-hidden="true"></div>
								<span><?php echo esc_html( $date_range ); ?></span>
							</div>
						<?php endif; ?>
						<?php if ( '' !== $location ) : ?>
							<div class="text-md-medium event-carousel__location flag-info flag-marker-pin">
								<div class="event-carousel__meta-icon flag-icon" aria-hidden="true"></div>
								<span><?php echo esc_html( $location ); ?></span>
							</div>
						<?php endif; ?>
					</div>
					<?php if ( '' !== $description ) : ?>
						<div class="event-carousel__description body2-reg">
							<?php echo wp_kses_post( $description ); ?>
						</div>
					<?php endif; ?>
				</div>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<div class="event-carousel__cta-wrap">
					<a href="<?php echo esc_url( $permalink ); ?>"
						class="event-carousel__cta site-btn is-style-site-trailing-icon btn-small">
						<?php esc_html_e( 'Details', 'ambrygen-web' ); ?>
					</a>
				</div>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Get formatted event meta details.
	 *
	 * @param int $post_id Post ID.
	 * @return array{date: string, location: string, booth: string}
	 */
	public function get_event_meta_details( int $post_id ): array {
		return array(
			'date'     => $this->format_event_date_range(
				(string) get_post_meta( $post_id, 'start_at', true ),
				(string) get_post_meta( $post_id, 'end_at', true )
			),
			'location' => $this->get_event_location( $post_id ),
			'booth'    => $this->get_linked_booth( $post_id ),
		);
	}

	/**
	 * Render the linked posts tabs block.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function render_linked_posts_tabs( int $post_id ): string {
		$query_service     = ConferenceQueryService::instance();
		$presentations     = $query_service->get_linked_posts_by_type( $post_id, 'presentation' );
		$posters           = $query_service->get_linked_posts_by_type( $post_id, 'poster' );
		$has_presentations = ! empty( $presentations );
		$has_posters       = ! empty( $posters );
		$scope             = $this->is_past_conference( $post_id ) ? 'past' : 'upcoming';

		if ( ! $has_presentations && ! $has_posters ) {
			return $this->get_empty_message( $scope, $post_id );
		}

		ob_start();
		?>
		<div class="wp-block-group conference-linked-posts-tabs-wrapper">
			<!-- Tab Navigation -->
			<div class="conference-tabs-nav">
				<ul class="conference-tabs-nav__list" role="tablist">
					<?php if ( $has_presentations ) : ?>
						<li class="conference-tabs-nav__item">
							<button class="conference-tabs-nav__button conference-tabs-nav__button--active" role="tab"
								aria-selected="true" aria-controls="conference-presentations-panel" data-tab="presentations">
								<?php esc_html_e( 'Oral Presentation', 'ambrygen-web' ); ?>
							</button>
						</li>
					<?php endif; ?>

					<?php if ( $has_posters ) : ?>
						<li class="conference-tabs-nav__item">
							<button
								class="conference-tabs-nav__button <?php echo ! $has_presentations ? 'conference-tabs-nav__button--active' : ''; ?>"
								role="tab" aria-selected="<?php echo ! $has_presentations ? 'true' : 'false'; ?>"
								aria-controls="conference-posters-panel" data-tab="posters">
								<?php esc_html_e( 'Scientific Posters', 'ambrygen-web' ); ?>
							</button>
						</li>
					<?php endif; ?>
				</ul>
			</div>

			<!-- Tab Content -->
			<div class="conference-tabs-content">
				<?php if ( $has_presentations ) : ?>
					<div id="conference-presentations-panel"
						class="conference-tabs-content__panel conference-tabs-content__panel--active" role="tabpanel"
						aria-labelledby="conference-presentations-tab">
						<section class="container-1136 conference-presentations">
							<div class="wrapper">
								<div class="conference-section">
									<h2 class="wp-block-heading heading-4">
										<?php esc_html_e( 'Oral Presentations', 'ambrygen-web' ); ?>
									</h2>
									<?php echo PostTypes::instance()->render_conference_presentations( $post_id ); ?>
								</div>
							</div>
						</section>
					</div>
				<?php endif; ?>

				<?php if ( $has_posters ) : ?>
					<div id="conference-posters-panel"
						class="conference-tabs-content__panel <?php echo ! $has_presentations ? 'conference-tabs-content__panel--active' : ''; ?>"
						role="tabpanel" aria-labelledby="conference-posters-tab">
						<section class="container-1136 conference-posters">
							<div class="wrapper">
								<div class="conference-section">
									<h2 class="wp-block-heading heading-4">
										<?php esc_html_e( 'Scientific Posters', 'ambrygen-web' ); ?>
									</h2>
									<?php echo PostTypes::instance()->render_conference_posters( $post_id ); ?>
								</div>
							</div>
						</section>
					</div>
				<?php endif; ?>
			</div>
		</div>




		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Get the empty-state message for conference linked content.
	 *
	 * @param string $scope Archive scope.
	 * @param int    $post_id Conference post ID.
	 * @return string
	 */
	public function get_empty_message( string $scope = 'upcoming', int $post_id = 0 ): string {
		$settings = Theme_Options::get_event_empty_state_settings( $scope );
		$title    = $this->replace_empty_state_tokens( $settings['title'], $post_id );
		$message  = $this->replace_empty_state_tokens( $settings['message'], $post_id );
		$actions  = $this->render_empty_state_actions( $settings['ctas'] ?? array(), $post_id );

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
	private function replace_empty_state_tokens( string $content, int $post_id ): string {
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
	 * @param array $ctas CTA configuration.
	 * @param int   $post_id Conference post ID.
	 * @return string
	 */
	private function render_empty_state_actions( array $ctas, int $post_id ): string {
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

			$text    = '' !== $raw_text ? $this->replace_empty_state_tokens( $raw_text, $post_id ) : '';
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

		return ' <div class="wp-block-spacer is-style-gl-s40"></div><div class="hero-section__actions tabs-content__empty-actions">' . implode( '', $buttons ) . '</div>';
	}

	/**
	 * Determine whether a conference should use the past-event empty state.
	 *
	 * @param int $post_id Conference post ID.
	 * @return bool
	 */
	private function is_past_conference( int $post_id ): bool {
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

	/**
	 * Format conference date range.
	 *
	 * @param string $start_raw Start date.
	 * @param string $end_raw   End date.
	 * @return string
	 */
	private function format_event_date_range( string $start_raw, string $end_raw ): string {
		$start_ts = $start_raw ? strtotime( $start_raw ) : false;
		$end_ts   = $end_raw ? strtotime( $end_raw ) : false;

		if ( ! $start_ts && ! $end_ts ) {
			return '';
		}

		if ( $start_ts && $end_ts ) {
			$start_month = wp_date( 'F', $start_ts );
			$end_month   = wp_date( 'F', $end_ts );
			$start_year  = wp_date( 'Y', $start_ts );
			$end_year    = wp_date( 'Y', $end_ts );

			if ( $start_month === $end_month && $start_year === $end_year ) {
				return sprintf(
					'%s %s - %s',
					wp_date( 'F', $start_ts ),
					wp_date( 'j', $start_ts ),
					wp_date( 'j', $end_ts )
				);
			}

			return sprintf(
				'%s %s - %s %s',
				wp_date( 'F', $start_ts ),
				wp_date( 'j', $start_ts ),
				wp_date( 'F', $end_ts ),
				wp_date( 'j', $end_ts )
			);
		}

		if ( $start_ts ) {
			return wp_date( 'F j', $start_ts );
		}

		return wp_date( 'F j', $end_ts );
	}

	/**
	 * Resolve conference location.
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	private function get_event_location( int $post_id ): string {
		$city    = trim( (string) get_post_meta( $post_id, 'city', true ) );
		$country = trim( (string) get_post_meta( $post_id, 'state_or_province', true ) );

		if ( '' !== $city && '' !== $country ) {
			return sprintf( '%s, %s', $city, $country );
		}

		if ( '' !== $city ) {
			return $city;
		}

		if ( '' !== $country ) {
			return $country;
		}

		return '';
	}

	/**
	 * Get linked booth label.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	private function get_linked_booth( int $post_id ): string {
		$terms = get_the_terms( $post_id, 'booth_tag' );
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$term = reset( $terms );
			$name = $term->name;

			if ( $name ) {
				if ( is_numeric( $name ) ) {
					return sprintf( 'Booth #%s', $name );
				}
				if ( false === stripos( $name, 'Booth' ) ) {
					return sprintf( 'Booth %s', $name );
				}
				return $name;
			}
		}

		$linked_posts = get_post_meta( $post_id, 'linked_posts', false );
		if ( empty( $linked_posts ) ) {
			return '';
		}

		foreach ( $linked_posts as $linked_id ) {
			if ( 'booths' === get_post_type( $linked_id ) ) {
				$title = get_the_title( $linked_id );
				if ( $title ) {
					if ( is_numeric( $title ) ) {
						return sprintf( 'Booth #%s', $title );
					}
					if ( false === stripos( $title, 'Booth' ) ) {
						return sprintf( 'Booth %s', $title );
					}
					return $title;
				}
			}
		}

		return '';
	}

	/**
	 * Resolve booth tag label for a trade show.
	 *
	 * @param int $trade_show_id Trade show ID.
	 * @return string
	 */
	private function get_trade_show_booth_tag( int $trade_show_id ): string {
		if ( $trade_show_id <= 0 ) {
			return '';
		}

		$terms = get_the_terms( $trade_show_id, 'booth_tag' );
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$term = reset( $terms );
			if ( $term && ! empty( $term->name ) ) {
				$name = (string) $term->name;

				if ( is_numeric( $name ) ) {
					return sprintf( 'Booth #%s', $name );
				}

				if ( false === stripos( $name, 'Booth' ) ) {
					return sprintf( 'Booth %s', $name );
				}

				return $name;
			}
		}

		return '';
	}

	/**
	 * Get poster PDF files for a poster post.
	 *
	 * Expected meta structure:
	 * [
	 *     [
	 *         'pdf_type' => 'abstract',
	 *         'file_id'  => 123,
	 *     ],
	 *     ...
	 * ]
	 *
	 * @param int         $post_id  Poster post ID.
	 * @param string|null $pdf_type Optional PDF type to filter by.
	 * @return array<int, array{pdf_type:string,file_id:int,url:string}>
	 */
	private function get_poster_pdf_files( int $post_id, ?string $pdf_type = null ): array {
		$rows = get_post_meta( $post_id, 'poster_pdf_files', true );

		if ( ! is_array( $rows ) ) {
			return array();
		}

		$files = array();

		foreach ( $rows as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$type    = isset( $row['pdf_type'] ) ? sanitize_key( $row['pdf_type'] ) : '';
			$file_id = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;

			if ( 0 === $file_id ) {
				continue;
			}

			if ( null !== $pdf_type && $type !== sanitize_key( $pdf_type ) ) {
				continue;
			}

			$file_url = wp_get_attachment_url( $file_id );

			if ( ! $file_url ) {
				continue;
			}

			$files[] = array(
				'pdf_type' => $type,
				'file_id'  => $file_id,
				'url'      => $file_url,
			);
		}

		return $files;
	}

	/**
	 * Get presentation PDF files for a presentation post.
	 *
	 * @param int         $post_id  Presentation post ID.
	 * @param string|null $pdf_type Optional PDF type to filter by.
	 * @return array<int, array{pdf_type:string,file_id:int,url:string}>
	 */
	private function get_presentation_pdf_files( int $post_id, ?string $pdf_type = null ): array {
		$rows = get_post_meta( $post_id, 'presentation_pdf_files', true );

		if ( ! is_array( $rows ) ) {
			return array();
		}

		$files = array();

		foreach ( $rows as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$type    = isset( $row['pdf_type'] ) ? sanitize_key( $row['pdf_type'] ) : '';
			$file_id = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;

			if ( 0 === $file_id ) {
				continue;
			}

			if ( null !== $pdf_type && $type !== sanitize_key( $pdf_type ) ) {
				continue;
			}

			$file_url = wp_get_attachment_url( $file_id );

			if ( ! $file_url ) {
				continue;
			}

			$files[] = array(
				'pdf_type' => $type,
				'file_id'  => $file_id,
				'url'      => $file_url,
			);
		}

		return $files;
	}

	/**
	 * Normalize PDF type values into unique display labels.
	 *
	 * @param array<int, array{pdf_type:string,file_id:int,url:string}> $files PDF files.
	 * @return array<int, string>
	 */
	private function get_pdf_type_labels( array $files ): array {
		$types = array_values(
			array_filter(
				array_map(
					static function ( $item ) {
						$type = isset( $item['pdf_type'] ) ? trim( (string) $item['pdf_type'] ) : '';
						return $type ? ucfirst( str_replace( '_', ' ', $type ) ) : '';
					},
					$files
				),
				static fn( $type) => '' !== $type
			)
		);

		return array_values( array_unique( $types ) );
	}

	/**
	 * Normalize list-like meta values into a readable string.
	 *
	 * @param mixed $value Meta value.
	 * @return string
	 */
	private function format_meta_list_value( $value ): string {
		if ( is_string( $value ) ) {
			$decoded = json_decode( $value, true );

			if ( is_array( $decoded ) ) {
				$value = $decoded;
			}
		}

		if ( is_array( $value ) ) {
			$filtered = array_values(
				array_filter(
					array_map(
						static function ( $item ): string {
							return trim( wp_strip_all_tags( (string) $item ) );
						},
						$value
					),
					static fn( string $item): bool => '' !== $item
				)
			);

			return implode( ', ', $filtered );
		}

		return trim( wp_strip_all_tags( (string) $value ) );
	}

	/**
	 * Build a Google Maps directions URL from conference address meta.
	 *
	 * @param int $post_id Conference post ID.
	 * @return string
	 */
	private function build_conference_google_maps_url( int $post_id ): string {
		$parts = array(
			trim( (string) get_post_meta( $post_id, 'name', true ) ),
			trim( (string) get_post_meta( $post_id, 'address_line1', true ) ),
			trim( (string) get_post_meta( $post_id, 'address_line2', true ) ),
			trim( (string) get_post_meta( $post_id, 'city', true ) ),
			trim( (string) get_post_meta( $post_id, 'state_or_province', true ) ),
			trim( (string) get_post_meta( $post_id, 'postal_code', true ) ),
			trim( (string) get_post_meta( $post_id, 'country', true ) ),
		);

		$parts = array_values(
			array_filter(
				$parts,
				static fn( string $value): bool => '' !== $value
			)
		);

		if ( empty( $parts ) ) {
			return '';
		}

		return add_query_arg(
			'api',
			'1',
			'https://www.google.com/maps/search/?query=' . rawurlencode( implode( ', ', $parts ) )
		);
	}
}
