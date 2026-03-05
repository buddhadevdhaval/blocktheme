<?php
/**
 * Render: Icon Grids Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'info-list__col',
	)
);

$ambrygen_attributes     = $attributes ?? array();
$ambrygen_icon_variation = $block->context['ambrygen/variation'] ?? '';
$ambrygen_title          = wp_strip_all_tags( $ambrygen_attributes['title'] ?? '' );

$ambrygen_links = is_array( $ambrygen_attributes['links'] ?? null )
	? $ambrygen_attributes['links']
	: array();

$ambrygen_count        = 0;
$ambrygen_img_id       = 0;
$ambrygen_icon_id      = 0;
$ambrygen_icon_url     = '';
$ambrygen_term_url     = '';
$ambrygen_termlinktext = '';

if ( 'our-testing-menu' === $ambrygen_icon_variation ) {

	$ambrygen_termlinktext = ! empty( $ambrygen_attributes['termlinktext'] )
	? $ambrygen_attributes['termlinktext']
	: 'View Test';
	
	$ambrygen_selected_term_id = isset( $ambrygen_attributes['selectedTerm'] )
		? absint( $ambrygen_attributes['selectedTerm'] )
		: 0;

	if ( $ambrygen_selected_term_id ) {
		$ambrygen_term = get_term( $ambrygen_selected_term_id, 'test_type' );

		if ( $ambrygen_term && ! is_wp_error( $ambrygen_term ) ) {
			$ambrygen_title         = wp_strip_all_tags( $ambrygen_term->name );
			$ambrygen_count         = isset( $ambrygen_term->count ) ? absint( $ambrygen_term->count ) : 0;
			$ambrygen_img_id        = absint( get_term_meta( $ambrygen_term->term_id, 'term_image', true ) );
			$ambrygen_term_link_raw = get_term_link( $ambrygen_term );
			$ambrygen_term_url      = is_wp_error( $ambrygen_term_link_raw ) ? '' : esc_url( $ambrygen_term_link_raw );
		}
	}
} else {

	$ambrygen_icon = is_array( $ambrygen_attributes['icon'] ?? null )
		? $ambrygen_attributes['icon']
		: array();

	$ambrygen_icon_id  = isset( $ambrygen_icon['id'] ) ? absint( $ambrygen_icon['id'] ) : 0;
	$ambrygen_icon_url = isset( $ambrygen_icon['url'] ) ? esc_url( $ambrygen_icon['url'] ) : '';
	$ambrygen_icon_alt = isset( $ambrygen_icon['alt'] ) ? sanitize_text_field( $ambrygen_icon['alt'] ) : '';
}

/**
 * WCAG:
 * Decorative images must have empty alt.
 * Informative images must have meaningful alt.
 */

$ambrygen_wrapper_class      = 'our-testing-menu' === $ambrygen_icon_variation ? 'item-card' : 'info-list__col';
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $ambrygen_wrapper_class,
	)
);

$ambrygen_card_class = '';
if ( 'variation-4' === $ambrygen_icon_variation ) {
	$ambrygen_card_class = 'icon-grid__item';
} elseif ( 'our-testing-menu' !== $ambrygen_icon_variation && 'variation-3' !== $ambrygen_icon_variation ) {
	$ambrygen_card_class = 'info-list__card';
}

if ( 'variation-3' === $ambrygen_icon_variation ) {
	$ambrygen_selected_post_id = isset( $ambrygen_attributes['selectedPost'] ) ? absint( $ambrygen_attributes['selectedPost'] ) : 0;

	if ( ! $ambrygen_selected_post_id ) {
		$ambrygen_fallback_posts   = get_posts(
			array(
				'post_type'      => 'blood-test',
				'posts_per_page' => 1,
				'orderby'        => 'date',
				'order'          => 'ASC',
				'fields'         => 'ids',
			)
		);
		$ambrygen_selected_post_id = ! empty( $ambrygen_fallback_posts[0] ) ? absint( $ambrygen_fallback_posts[0] ) : 0;
	}

	if ( ! $ambrygen_selected_post_id ) {
		return;
	}

	$ambrygen_selected_post = get_post( $ambrygen_selected_post_id );
	if ( ! $ambrygen_selected_post || 'blood-test' !== $ambrygen_selected_post->post_type ) {
		return;
	}

	$ambrygen_post_title  = ! empty( $ambrygen_attributes['title'] ) ? wp_strip_all_tags( $ambrygen_attributes['title'] ) : get_the_title( $ambrygen_selected_post );
	$ambrygen_category    = ! empty( $ambrygen_attributes['category'] ) ? wp_strip_all_tags( $ambrygen_attributes['category'] ) : 'Category';
	$ambrygen_badge_text  = ! empty( $ambrygen_attributes['badgeText'] ) ? wp_strip_all_tags( $ambrygen_attributes['badgeText'] ) : 'Test';
	$ambrygen_badge_color = ! empty( $ambrygen_attributes['badgeColor'] ) ? sanitize_html_class( $ambrygen_attributes['badgeColor'] ) : 'blue';
	$ambrygen_post_url    = get_permalink( $ambrygen_selected_post );
	?>
	<div class="features-tabs__card">
		<div class="features-tabs__content-head">
			<div class="features-tabs__category body2-semibold">
				<?php echo esc_html( $ambrygen_category ); ?>
			</div>
			<div class="heading-5 features-tabs__card-title">
				<?php echo esc_html( $ambrygen_post_title ); ?> <div class="badge badge--<?php echo esc_attr( $ambrygen_badge_color ); ?>"><i class="badge__dot"></i><?php echo esc_html( $ambrygen_badge_text ); ?></div>
			</div>
		</div>
		<a class="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up" href="<?php echo esc_url( $ambrygen_post_url ); ?>" aria-label="<?php echo esc_attr( 'View test for ' . $ambrygen_post_title ); ?>">
			<?php esc_html_e( 'View Test', 'ambrygen-web' ); ?>
		</a>
	</div>
	<?php
	return;
}
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_card_class ) : ?>
		<div class="<?php echo esc_attr( $ambrygen_card_class ); ?>">
	<?php endif; ?>

		<?php if ( $ambrygen_icon_id && 'our-testing-menu' !== $ambrygen_icon_variation && 'variation-4' !== $ambrygen_icon_variation ) : ?>
			<div class="info-list__image">
				<?php
				echo wp_kses_post(
					Helper::image(
						$ambrygen_icon_id,
						'medium_large',
						array(
							'class'   => 'card-image',
							'loading' => 'lazy',
							'alt'     => $ambrygen_title ? esc_attr( $ambrygen_title ) : '',
						)
					)
				);
				?>
			</div>

		<?php elseif ( 'our-testing-menu' === $ambrygen_icon_variation && $ambrygen_img_id ) : ?>
			<div class="item-card__icon">
				<?php
				echo wp_kses_post(
					Helper::image(
						$ambrygen_img_id,
						'medium_large',
						array(
							'class'   => 'card-image',
							'loading' => 'lazy',
							'alt'     => $ambrygen_title ? esc_attr( $ambrygen_title ) : '',
						)
					)
				);
				?>
			</div>
		<?php endif; ?>

		<?php if ( 'our-testing-menu' === $ambrygen_icon_variation ) : ?>

			<div class="info-list__content">
				<div class="item-card__info">

					<?php if ( $ambrygen_title ) : ?>
						<div class="item-card__category body2-medium">
							<?php echo esc_html( $ambrygen_title ); ?>
						</div>
					<?php endif; ?>

					<?php if ( $ambrygen_title ) : ?>
					<div class="item-card__title subtitle2-sbold">
						<?php echo esc_html( $ambrygen_count ); ?> Tests
					</div>
					<?php endif; ?>

					<div class="is-style-gl-s8" aria-hidden="true"></div>

				</div>

				<?php if ( $ambrygen_term_url ) : ?>
					<a
						class="site-btn is-style-site-text-btn has-icon icon-arrow-up text-14"
						href="<?php echo esc_url( $ambrygen_term_url ); ?>"
						aria-label="<?php echo esc_attr( 'View tests for ' . $ambrygen_title ); ?>"
					>
						<?php echo esc_html( $ambrygen_termlinktext ); ?>
					</a>
				<?php endif; ?>

			</div>

			<?php elseif ( 'variation-4' === $ambrygen_icon_variation ) : ?>

				<?php if ( $ambrygen_icon_id ) : ?>
		<div class="icon-grid__icon">
					<?php
					echo wp_kses_post(
						Helper::image(
							$ambrygen_icon_id,
							'medium_large',
							array(
								'class'   => '',
								'loading' => 'lazy',
								'alt'     => $ambrygen_title ? esc_attr( $ambrygen_title ) : '',
							)
						)
					);
					?>
		</div>
	<?php endif; ?>

				<?php if ( $ambrygen_title ) : ?>
		<h3 class="icon-grid__item-title text-xl-semibold mb-0">
					<?php echo esc_html( $ambrygen_title ); ?>
		</h3>
	<?php endif; ?>

	<div class="is-style-gl-s8" aria-hidden="true"></div>

				<?php if ( ! empty( $ambrygen_attributes['description'] ) ) : ?>
		<div class="icon-grid__item-description text-md-reg">
					<?php echo wp_kses_post( $ambrygen_attributes['description'] ); ?>
		</div>
	<?php endif; ?>

	<div class="is-style-gl-s20" aria-hidden="true"></div>

				<?php
				if ( ! empty( $ambrygen_links[0]['label'] ) && ! empty( $ambrygen_links[0]['url'] ) ) :

					$ambrygen_link_label  = sanitize_text_field( $ambrygen_links[0]['label'] );
					$ambrygen_link_url    = esc_url( $ambrygen_links[0]['url'] );
					$ambrygen_link_target = ! empty( $ambrygen_links[0]['target'] ) ? sanitize_text_field( $ambrygen_links[0]['target'] ) : '';
					$ambrygen_rel         = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';
					?>

		<a
			class="site-btn is-style-site-text-btn has-icon"
			href="<?php echo esc_url( $ambrygen_link_url ); ?>"
					<?php if ( '_blank' === $ambrygen_link_target ) : ?>
				target="_blank"
			<?php endif; ?>
					<?php if ( $ambrygen_rel ) : ?>
				rel="<?php echo esc_attr( $ambrygen_rel ); ?>"
			<?php endif; ?>
		>
					<?php echo esc_html( $ambrygen_link_label ); ?>
		</a>

	<?php endif; ?>

		<?php else : ?>


			<div class="info-list__content">

				<?php if ( $ambrygen_title ) : ?>
					<div class="subtitle1-sbold info-list__title">
						<?php echo esc_html( $ambrygen_title ); ?>
					</div>
				<?php endif; ?>

				<div class="is-style-gl-s8"></div>

				<?php if ( ! empty( $ambrygen_links ) ) : ?>
					<div class="info-list__links">
						<?php
						foreach ( $ambrygen_links as $ambrygen_link ) :

							$ambrygen_link_label  = isset( $ambrygen_link['label'] ) ? sanitize_text_field( $ambrygen_link['label'] ) : '';
							$ambrygen_link_url    = isset( $ambrygen_link['url'] ) ? esc_url( $ambrygen_link['url'] ) : '';
							$ambrygen_link_target = isset( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '';

							$ambrygen_rel = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';

							if ( $ambrygen_link_label && $ambrygen_link_url ) :
								?>
							<div class="info-list__link-col text-md-Semibold">
								<a
									href="<?php echo esc_url( $ambrygen_link_url ); ?>"
									class="info-list__link"
									<?php if ( '_blank' === $ambrygen_link_target ) : ?>
										target="_blank"
									<?php endif; ?>
									<?php if ( $ambrygen_rel ) : ?>
										rel="<?php echo esc_attr( $ambrygen_rel ); ?>"
									<?php endif; ?>
								>
									<?php echo esc_html( $ambrygen_link_label ); ?>
								</a>
							</div>
								<?php
							endif;
						endforeach;
						?>
					</div>
				<?php endif; ?>

			</div>

		<?php endif; ?>

	<?php if ( $ambrygen_card_class ) : ?>
		</div>
	<?php endif; ?>

</div>
