<?php
/**
 * Render: Icon Grids Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
use Ambrygen\Theme\Core\Helper;

$ambrygen_variation = isset( $attributes['variation'] ) ? sanitize_text_field( $attributes['variation'] ) : '';

$ambrygen_class = 'info-list__row info-list-block';

$ambrygen_link            = $attributes['link'] ?? array();
$ambrygen_main_attributes = '';
$ambrygen_block_id        = $attributes['blockId'] ?? '';

if ( 'variation-4' === $ambrygen_variation ) {

	$ambrygen_main_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'icon-grid',
			'id'    => $ambrygen_block_id,
		)
	);

} elseif ( 'our-testing-menu' === $ambrygen_variation ) {
	$ambrygen_class = 'our-testing-menu';

	$ambrygen_main_attributes = get_block_wrapper_attributes(
		array(
			'class' => ' ' . esc_attr( $ambrygen_class ),
			'id'    => $ambrygen_block_id,
		)
	);

	$ambrygen_wrapper_attr = get_block_wrapper_attributes(
		array(
			'class' => 'our-testing-menu__grid',

		)
	);
} else {
	$ambrygen_wrapper_attr = get_block_wrapper_attributes(
		array(
			'class' => 'info-list__row info-list-block',
		)
	);
}

$ambrygen_content = $content ?? '';

?>

<div <?php echo $ambrygen_main_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( 'variation-4' === $ambrygen_variation ) : ?>


		<div class="icon-grid__header">

			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?> class="heading-3 block-title mb-0">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?>>
			<?php endif; ?>

			<div class="is-style-gl-s20" aria-hidden="true"></div>

			<?php if ( ! empty( $attributes['description'] ) ) : ?>
				<div class="text-xl-reg icon-grid__intro text-center">
					<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
				</div>
			<?php endif; ?>

		</div>

		<div class="is-style-gl-s64" aria-hidden="true"></div>

		<div class="icon-grid__list">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pre-escaped inner blocks content ?>
		</div>

</div>
		<?php return; ?>

<?php endif; ?>

<?php
if ( 'variation-3' === $ambrygen_variation ) :
	$ambrygen_wrapper_attr  = get_block_wrapper_attributes(
		array(
			'class' => 'features-tabs',
		)
	);
	$ambrygen_selected_tabs = isset( $attributes['selectedTabs'] ) && is_array( $attributes['selectedTabs'] ) && ! empty( $attributes['selectedTabs'] ) ? $attributes['selectedTabs'] : array(
		array(
			'text'     => 'All Tests',
			'termSlug' => 'all',
		),
	);
	?>
<div <?php echo $ambrygen_wrapper_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

<div class="features-tabs__header block__rowflex">

			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?> class="heading-2 block-title mb-0 block__rowflex--heading-title">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?>>
			<?php endif; ?>

		

			<?php if ( ! empty( $attributes['description'] ) ) : ?>
				<div class="block__rowflex--block-content subtitle-1-regular">
					<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
				</div>
			<?php endif; ?>

		</div>
	<div class="is-style-gl-s50" aria-hidden="true"></div>
		<div class="tabs-content bg-gradient1">
<div class="is-style-gl-s20" aria-hidden="true"></div>
	<div class="tabs__nav">
		<?php
		foreach ( $ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data ) :
			$ambrygen_is_active = 0 === $ambrygen_index ? ' is-active' : '';
			?>
			<button type="button" class="tabs__tab text-md-Semibold<?php echo esc_attr( $ambrygen_is_active ); ?>" data-tab-target="<?php echo esc_attr( $ambrygen_tab_data['termSlug'] ?? '' ); ?>">
				<?php echo esc_html( $ambrygen_tab_data['text'] ?? '' ); ?>
			</button>
		<?php endforeach; ?>
	</div>
	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<div class="tabs__panels">
		<?php
		foreach ( $ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data ) :
			$ambrygen_tab_slug   = $ambrygen_tab_data['termSlug'] ?? '';
			$ambrygen_is_active  = 0 === $ambrygen_index ? ' is-active' : '';
			$ambrygen_tab_term   = ( 'all' !== $ambrygen_tab_slug && '' !== $ambrygen_tab_slug ) ? get_term_by( 'slug', $ambrygen_tab_slug, 'test_type' ) : null;
			$ambrygen_query_args = array(
				'post_type'      => 'blood-test',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'ASC',
			);

			if ( $ambrygen_tab_term && ! is_wp_error( $ambrygen_tab_term ) ) {
				$ambrygen_query_args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Required for filtering tests by selected taxonomy term.
					array(
						'taxonomy' => 'test_type',
						'field'    => 'term_id',
						'terms'    => absint( $ambrygen_tab_term->term_id ),
					),
				);
			} elseif ( 'all' !== $ambrygen_tab_slug ) {
				$ambrygen_query_args['post__in'] = array( 0 );
			}

			$ambrygen_tests_query = new WP_Query( $ambrygen_query_args );
			?>
			<div class="tabs__panel<?php echo esc_attr( $ambrygen_is_active ); ?>" id="<?php echo esc_attr( $ambrygen_tab_slug ); ?>">
				<div class="features-tabs__grid">
					<?php if ( $ambrygen_tests_query->have_posts() ) : ?>
						<?php
						while ( $ambrygen_tests_query->have_posts() ) :
							$ambrygen_tests_query->the_post();
							?>
							<?php
							$ambrygen_post_title = get_the_title();
							$ambrygen_post_terms = get_the_terms( get_the_ID(), 'test_type' );
							$ambrygen_category   = ( is_array( $ambrygen_post_terms ) && ! empty( $ambrygen_post_terms ) && ! is_wp_error( $ambrygen_post_terms[0] ) )
								? $ambrygen_post_terms[0]->name
								: 'Category';
							?>
							<div class="features-tabs__card">
								<div class="features-tabs__content-head">
									<div class="features-tabs__category body2-semibold">
										<?php echo esc_html( $ambrygen_category ); ?>
									</div>
									<div class="heading-5 features-tabs__card-title">
										<?php echo esc_html( $ambrygen_post_title ); ?> <div class="badge badge--blue"><i class="badge__dot"></i>Test</div>
									</div>
								</div>
								<a class="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up" href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr( 'View test for ' . $ambrygen_post_title ); ?>">
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
	<?php return; ?>
<?php endif; ?>

	<?php if ( 'our-testing-menu' === $ambrygen_variation ) : ?>
		<div class="our-testing-menu__header block__rowflex">
			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?> class="block-title block__rowflex--heading-title heading-3 mb-0">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['description'] ) || ( ! empty( $ambrygen_link['url'] ) && ! empty( $ambrygen_link['text'] ) ) ) : ?>
				<div class="block__rowflex--block-content subtitle1-reg">
					<?php if ( ! empty( $attributes['description'] ) ) : ?>
						<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
					<?php endif; ?>

					<?php
					if (
						! empty( $ambrygen_link['url'] ) &&
						! empty( $ambrygen_link['text'] )
					) :
						$ambrygen_target = ! empty( $ambrygen_link['target'] ) ? $ambrygen_link['target'] : '';
						$ambrygen_rel    = ! empty( $ambrygen_link['rel'] ) ? $ambrygen_link['rel'] : '';

						if ( '_blank' === $ambrygen_target && empty( $ambrygen_rel ) ) {
							$ambrygen_rel = 'noopener noreferrer';
						}
						?>
					<div class="block_rowflex-link">
						<a
							class="site-btn is-style-site-text-btn has-icon icon-arrow-up text-14"
							href="<?php echo esc_url( $ambrygen_link['url'] ); ?>"
							<?php echo $ambrygen_target ? ' target="' . esc_attr( $ambrygen_target ) . '"' : ''; ?>
							<?php echo $ambrygen_rel ? ' rel="' . esc_attr( $ambrygen_rel ) . '"' : ''; ?>
						>
							<?php echo esc_html( $ambrygen_link['text'] ); ?>
						</a>
					</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>

		</div>
		<div class="is-style-gl-s50" aria-hidden="true"></div>


	<?php endif; ?>

	<div <?php echo $ambrygen_wrapper_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		// InnerBlocks content is already escaped by Gutenberg
		echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pre-escaped by WordPress core.
		?>
	</div>
</div>
