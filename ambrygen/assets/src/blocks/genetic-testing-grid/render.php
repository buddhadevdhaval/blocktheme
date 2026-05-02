<?php
/**
 * Render: Genetic Testing Grid
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    $content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_heading_tag = $attributes['headingTag'] ?? 'h2';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_heading_tag, 'h2' );

$ambrygen_block_id = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';

$ambrygen_bg_image = $attributes['backgroundImage'] ?? array();
$ambrygen_bg_url   = $ambrygen_bg_image['url'] ?? '';

$ambrygen_wrapper_attr = get_block_wrapper_attributes(
	array(
		'class' => 'block-layout',
		'id'    => $ambrygen_block_id,
	)
);
$ambrygen_selected_tabs = isset( $attributes['selectedTabs'] ) && is_array( $attributes['selectedTabs'] ) && ! empty( $attributes['selectedTabs'] ) ? $attributes['selectedTabs'] : array(
	array(
		'text'     => 'All Tests',
		'termSlug' => 'all',
	),
);
$ambrygen_taxonomy = 'poster_category';
?>

<div <?php echo $ambrygen_wrapper_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_bg_url ) : ?>
		<div class="block-bg-image">
			<img src="<?php echo esc_url( $ambrygen_bg_url ); ?>"
				alt="<?php echo esc_attr( $ambrygen_bg_image['alt'] ?? '' ); ?>" />
		</div>
	<?php endif; ?>

	<div class="icon-grid-block">
		<div class="features-tabs">
			<div class="features-tabs__header block__rowflex">
				<?php if ( ! empty( $attributes['heading'] ) ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-2 block-title mb-0 block__rowflex--heading-title js-gsap-fade">
						<?php
						echo wp_kses(
							$attributes['heading'],
							Helper::allowed_heading_html()
						);
						?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php if ( ! empty( $attributes['description'] ) ) : ?>
					<div class="block__rowflex--block-content subtitle-1-regular js-gsap-fade">
						<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
					</div>
				<?php endif; ?>
			</div>

			<div class="is-style-gl-s50" aria-hidden="true"></div>

			<div class="tabs-content">
				<div class="is-style-gl-s20" aria-hidden="true"></div>
				<div class="tabs__nav">
					<?php
					foreach ( $ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data ) :
						$ambrygen_is_active = 0 === $ambrygen_index ? ' is-active' : '';
						$ambrygen_tab_slug  = isset( $ambrygen_tab_data['termSlug'] ) ? sanitize_title( (string) $ambrygen_tab_data['termSlug'] ) : '';
						$ambrygen_tab_id    = 'all' === $ambrygen_tab_slug || '' === $ambrygen_tab_slug ? 'all' : $ambrygen_tab_slug;
						?>
						<button type="button"
							class="icon_ajax_tab tabs__tab text-md-Semibold<?php echo esc_attr( $ambrygen_is_active ); ?>"
							data-tab-target="<?php echo esc_attr( $ambrygen_tab_id ); ?>">
							<?php echo esc_html( $ambrygen_tab_data['text'] ?? '' ); ?>
						</button>
					<?php endforeach; ?>
				</div>
				<div class="is-style-gl-s32" aria-hidden="true"></div>

				<div class="tabs__panels">
					<?php
					foreach ( $ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data ) :
						$ambrygen_tab_slug   = isset( $ambrygen_tab_data['termSlug'] ) ? sanitize_title( (string) $ambrygen_tab_data['termSlug'] ) : '';
						$ambrygen_tab_id     = 'all' === $ambrygen_tab_slug || '' === $ambrygen_tab_slug ? 'all' : $ambrygen_tab_slug;
						$ambrygen_term_id    = isset( $ambrygen_tab_data['termId'] ) ? absint( $ambrygen_tab_data['termId'] ) : 0;
						$ambrygen_is_active  = 0 === $ambrygen_index ? ' is-active' : '';
						$ambrygen_tab_term   = null;
						$ambrygen_query_args = array(
							'post_type'      => 'genetic-testing',
							'posts_per_page' => -1,
							'orderby'        => 'date',
							'order'          => 'ASC',
						);

				if ( $ambrygen_term_id ) {
					$ambrygen_tab_term = get_term( $ambrygen_term_id, $ambrygen_taxonomy );
				} elseif ( 'all' !== $ambrygen_tab_id ) {
					$ambrygen_tab_term = get_term_by( 'slug', $ambrygen_tab_id, $ambrygen_taxonomy );
				}

				if ( $ambrygen_tab_term && ! is_wp_error( $ambrygen_tab_term ) ) {
					$ambrygen_query_args['tax_query'] = array(
						array(
							'taxonomy' => $ambrygen_taxonomy,
							'field'    => 'term_id',
							'terms'    => absint( $ambrygen_tab_term->term_id ),
						),
					);
				} elseif ( 'all' !== $ambrygen_tab_id ) {
					$ambrygen_query_args['post__in'] = array( 0 );
				}

				$ambrygen_tests_query = new WP_Query( $ambrygen_query_args );
				?>
				<div class="tabs__panel<?php echo esc_attr( $ambrygen_is_active ); ?>"
					id="<?php echo esc_attr( $ambrygen_tab_id ); ?>">
					<div class="features-tabs__grid">
						<?php if ( $ambrygen_tests_query->have_posts() ) : ?>
							<?php
							while ( $ambrygen_tests_query->have_posts() ) :
								$ambrygen_tests_query->the_post();
								$ambrygen_post_title = get_the_title();
								$ambrygen_post_terms = get_the_terms( get_the_ID(), $ambrygen_taxonomy );
								$ambrygen_category   = ( is_array( $ambrygen_post_terms ) && ! empty( $ambrygen_post_terms ) && ! is_wp_error( $ambrygen_post_terms[0] ) )
									? $ambrygen_post_terms[0]->name
									: '';
								?>
								<div class="features-tabs__card js-gsap-fade">
									<div class="features-tabs__content-head">
										<?php if ( $ambrygen_category ) : ?>
											<div class="features-tabs__category body2-semibold">
												<?php echo esc_html( $ambrygen_category ); ?>
											</div>
										<?php endif; ?>
										<div class="heading-5 features-tabs__card-title">
											<?php echo esc_html( $ambrygen_post_title ); ?>
											<div class="badge badge--blue"><i class="badge__dot"></i>Product</div>
										</div>
									</div>
									<a class="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow"
										href="<?php the_permalink(); ?>"
										aria-label="<?php echo esc_attr( 'View test for ' . $ambrygen_post_title ); ?>">
										<?php esc_html_e( 'View Test', 'ambrygen-web' ); ?>
									</a>
								</div>
							<?php endwhile; ?>
							<?php wp_reset_postdata(); ?>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
			</div>
		</div>
	</div>
</div>
