<?php
/**
 * Template Name: Company Events
 *
 * @package Ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<main id="main-content">

	<!-- Upcoming Conferences Section -->
	<section class="container-1136 bg-gray-50">
		<div class="wrapper">

			<div class="is-style-gl-s50" aria-hidden="true"></div>

			<div class="upcoming-conferences" aria-labelledby="upcoming-conferences-heading">
				<div class="body1 upcoming-conferences__eyebrow"><?php esc_html_e( 'EVENTS', 'ambrygen-web' ); ?></div>
				<div class="is-style-gl-s8" aria-hidden="true"></div>
				<div class="upcoming-conferences__layout">

					<!-- Left Column -->
					<div class="upcoming-conferences__left">

						<h1 id="upcoming-conferences-heading" class="heading-3 block-title mb-0">
							<?php esc_html_e( 'Upcoming Conferences', 'ambrygen-web' ); ?>
						</h1>

						<div class="is-style-gl-s32" aria-hidden="true"></div>

						<form class="upcoming-conferences__form" aria-label="<?php esc_attr_e( 'Subscribe to conference updates', 'ambrygen-web' ); ?>" novalidate>
							<div class="upcoming-conferences__form-row">

								<div class="upcoming-conferences__field">
									<label for="conference-email" class="sr-only">
										<?php esc_html_e( 'Email address', 'ambrygen-web' ); ?>
									</label>
									<input id="conference-email" class="upcoming-conferences__input" type="email" name="email" placeholder="<?php esc_attr_e( 'Enter your email', 'ambrygen-web' ); ?>" autocomplete="email" aria-required="true" aria-describedby="conference-privacy-note" spellcheck="false" />
								</div>

								<button type="submit" class="upcoming-conferences__btn">
									<?php esc_html_e( 'Subscribe', 'ambrygen-web' ); ?>
								</button>
							</div>

							<div id="conference-privacy-note" class="upcoming-conferences__privacy body2">
								<?php
								printf(
									/* translators: %s: Privacy policy link string. */
									esc_html__( 'We care about your data in our %s.', 'ambrygen-web' ),
									'<a href="' . esc_url( home_url( '/privacy-policy' ) ) . '" class="upcoming-conferences__privacy-link">' . esc_html__( 'privacy policy', 'ambrygen-web' ) . '</a>'
								);
								?>
							</div>

						</form>
					</div>

					<!-- Right Column -->
					<div class="upcoming-conferences__right">
						<div class="subtitle1-reg upcoming-conferences__description">
							<?php esc_html_e( 'Subscribe to learn about new product updates, the latest in technology, solutions, and updates.', 'ambrygen-web' ); ?>
						</div>
					</div>

				</div>
			</div>

			<div class="is-style-gl-s50" aria-hidden="true"></div>

		</div>
	</section>

	<section class="container-1136" aria-labelledby="blog-post-heading">
		<div class="is-style-gl-s96" aria-hidden="true"></div>
		<div class="wrapper">
			<div class="blog-post">
				<div class="blog-post__grid" role="list">
					<?php
					$upcoming_args = array(
						'post_type'      => 'trade_shows',
						'posts_per_page' => 8,
						'post_status'    => 'publish',
						// Assuming we might have a meta query for upcoming dates here.
					);
					$upcoming_query = new WP_Query( $upcoming_args );

					if ( $upcoming_query->have_posts() ) :
						while ( $upcoming_query->have_posts() ) :
							$upcoming_query->the_post();
							$location = get_post_meta( get_the_ID(), 'location', true );
							$date_str = get_post_meta( get_the_ID(), 'date', true );
							?>
							<div class="blog-post__card" role="listitem">
								<a class="blog-post__link" href="<?php echo esc_url( get_permalink() ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Learn more about %s', 'ambrygen-web' ), get_the_title() ) ); ?>">
									<div class="blog-post__image-wrap">
										<?php if ( has_post_thumbnail() ) : ?>
											<?php the_post_thumbnail( 'large', array( 'class' => 'blog-post__image', 'loading' => 'lazy' ) ); ?>
										<?php else : ?>
											<img class="blog-post__image" src="<?php echo esc_url( AMBRYGEN_DEFAULT_IMAGE ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" loading="lazy" />
										<?php endif; ?>
										<div class="blog-post__overlay" aria-hidden="true">
											<div class="blog-post__attribution">
												<?php if ( ! empty( $location ) ) : ?>
													<div class="blog-post__location"><?php echo esc_html( $location ); ?></div>
												<?php endif; ?>
												<?php if ( ! empty( $date_str ) ) : ?>
													<div class="blog-post__date"><?php echo esc_html( $date_str ); ?></div>
												<?php endif; ?>
											</div>
										</div>
									</div>
									<div class="blog-post__content">
										<div class="blog-post__text-group">
											<div class="blog-post__title text-lg-semibold"><?php the_title(); ?></div>
											<div class="blog-post__description text-md-regular"><?php echo wp_kses_post( wp_trim_words( get_the_excerpt(), 20 ) ); ?></div>
										</div>
										<div class="blog-post__cta site-btn is-style-site-text-btn has-icon icon-arrow-up" aria-hidden="true">
											<?php esc_html_e( 'Learn More', 'ambrygen-web' ); ?>
										</div>
									</div>
								</a>
							</div>
							<?php
						endwhile;
						wp_reset_postdata();
					else :
						echo '<p>' . esc_html__( 'No upcoming conferences found.', 'ambrygen-web' ) . '</p>';
					endif;
					?>
				</div>
			</div>
		</div>
		<div class="is-style-gl-s96" aria-hidden="true"></div>
	</section>

	<section class="container-1136">
		<div class="wrapper">
			<div class="conferences">
				<h2 class="heading-6 block-title mb-0"><?php esc_html_e( 'Past Conferences', 'ambrygen-web' ); ?></h2>
				<div class="is-style-gl-s32" aria-hidden="true"></div>
				<div class="conferences__grid">
					<?php
					$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
					$past_args = array(
						'post_type'      => 'trade_shows',
						'posts_per_page' => 10,
						'post_status'    => 'publish',
						'paged'          => $paged,
						// Assuming we might have a meta query for past dates here.
					);
					$past_query = new WP_Query( $past_args );

					if ( $past_query->have_posts() ) :
						while ( $past_query->have_posts() ) :
							$past_query->the_post();
							$location = get_post_meta( get_the_ID(), 'location', true );
							$date_str = get_post_meta( get_the_ID(), 'date_short', true ); // or derive from main date
							$terms = get_the_terms( get_the_ID(), 'category' ); // Or custom taxonomy
							?>
							<a href="<?php echo esc_url( get_permalink() ); ?>" class="conferences__card">
								<div class="conferences__image-wrap">
									<?php if ( has_post_thumbnail() ) : ?>
										<?php the_post_thumbnail( 'large', array( 'class' => 'conferences__image', 'loading' => 'lazy' ) ); ?>
									<?php else : ?>
										<img class="conferences__image" src="<?php echo esc_url( AMBRYGEN_DEFAULT_IMAGE ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" loading="lazy" />
									<?php endif; ?>
								</div>
								<div class="conferences__content">
									<div class="is-style-gl-s16" aria-hidden="true"></div>
									<div class="conferences__meta">
										<?php if ( ! empty( $location ) ) : ?>
											<span class="conferences__location text-small-semibold"><?php echo esc_html( $location ); ?></span>
										<?php endif; ?>
										<?php if ( ! empty( $date_str ) ) : ?>
											<span class="conferences__date text-small-semibold"><?php echo esc_html( $date_str ); ?></span>
										<?php endif; ?>
									</div>
									<div class="is-style-gl-s8" aria-hidden="true"></div>
									<div class="conferences__title-row">
										<div class="text-lg-semibold conferences__card-title mb-0">
											<?php the_title(); ?>
											<div class="conferences__link" aria-hidden="true"></div>
										</div>
									</div>
									<div class="is-style-gl-s4" aria-hidden="true"></div>
									<div class="body-s conferences__description">
										<?php echo wp_kses_post( wp_trim_words( get_the_excerpt(), 15 ) ); ?>
									</div>
									<div class="is-style-gl-s16" aria-hidden="true"></div>
									<div class="conferences__tags-link">
										<?php if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) : ?>
											<div class="conferences__tags">
												<?php foreach ( $terms as $term ) : ?>
													<span class="conferences__tag"><?php echo esc_html( $term->name ); ?></span>
												<?php endforeach; ?>
											</div>
										<?php endif; ?>
									</div>
								</div>
							</a>
							<?php
						endwhile;
						?>
						</div>
						<div class="is-style-gl-s64" aria-hidden="true"></div>
						
						<?php
						$current_page = max( 1, get_query_var( 'paged' ) );
						$total_pages = $past_query->max_num_pages;
						$pagination_links = paginate_links( array(
							'base'      => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
							'format'    => '?paged=%#%',
							'current'   => $current_page,
							'total'     => $total_pages,
							'prev_text' => __( 'Previous', 'ambrygen-web' ),
							'next_text' => __( 'Next', 'ambrygen-web' ),
							'type'      => 'array',
						) );

						if ( is_array( $pagination_links ) ) {
							?>
							<nav class="pagination" aria-label="<?php esc_attr_e( 'Conference results pagination', 'ambrygen-web' ); ?>">
								<div class="pagination__divider" role="separator" aria-hidden="true"></div>
								<div class="is-style-gl-s20" aria-hidden="true"></div>
								<div class="pagination__inner">
									<ol class="pagination__list" role="list" aria-label="<?php esc_attr_e( 'Page numbers', 'ambrygen-web' ); ?>">
										<?php
										foreach ( $pagination_links as $link ) {
											$active_class = ( strpos( $link, 'current' ) !== false ) ? ' pagination__link--active' : '';
											$link = str_replace( 'page-numbers', 'pagination__link' . $active_class, $link );
											$link = str_replace( 'prev', 'pagination__nav pagination__nav--prev', $link );
											$link = str_replace( 'next', 'pagination__nav pagination__nav--next', $link );
											echo '<li class="pagination__item">' . wp_kses_post( $link ) . '</li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
										}
										?>
									</ol>
								</div>
							</nav>
							<?php
						}
						wp_reset_postdata();
					else :
						echo '<p>' . esc_html__( 'No past conferences found.', 'ambrygen-web' ) . '</p>';
					endif;
					?>
			</div>
		</div>
		<div class="is-style-gl-s50" aria-hidden="true"></div>
	</section>

</main>

<?php
get_footer();
