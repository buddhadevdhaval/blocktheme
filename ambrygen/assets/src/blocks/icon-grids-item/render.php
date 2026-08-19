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
use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_richtext_allowed = array(
	'span'   => array(
		'class'              => true,
		'title'              => true,
		'data-tooltip'       => true,
		'data-tooltip-title' => true,
		'data-tooltip-b64'   => true,
		'data-tooltip-id'    => true,
	),
	'mark'   => array(
		'class' => true,
		'style' => true,
	),
	'br'     => array(),
	'strong' => array(),
	'em'     => array(),
	'a'      => array(
		'href'   => true,
		'title'  => true,
		'target' => true,
		'rel'    => true,
		'class'  => true,
	),
);

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'info-list__col ',
	)
);

$ambrygen_attributes     = $attributes ?? array();
$ambrygen_icon_variation = $block->context['ambrygen/variation'] ?? '';

$ambrygen_title_raw = $ambrygen_attributes['title'] ?? '';
$ambrygen_title     = wp_strip_all_tags( $ambrygen_title_raw );

$ambrygen_links = is_array( $ambrygen_attributes['links'] ?? null )
	? $ambrygen_attributes['links']
	: array();

$ambrygen_count        = 0;
$ambrygen_img_id       = 0;
$ambrygen_icon_id      = 0;
$ambrygen_icon_url     = '';
$ambrygen_icon_alt     = '';
$ambrygen_term_url     = '';
$ambrygen_termlinktext = '';

if ( 'our-testing-menu' === $ambrygen_icon_variation ) {

	$ambrygen_termlinktext = ! empty( $ambrygen_attributes['termlinktext'] )
	? $ambrygen_attributes['termlinktext']
	: 'View Product';

	$ambrygen_selected_term_id = isset( $ambrygen_attributes['selectedTerm'] )
		? absint( $ambrygen_attributes['selectedTerm'] )
		: 0;

	if ( $ambrygen_selected_term_id ) {
		$ambrygen_term = get_term( $ambrygen_selected_term_id, 'poster_category' );

		if ( $ambrygen_term && ! is_wp_error( $ambrygen_term ) ) {
			$ambrygen_title_raw     = $ambrygen_term->name;
			$ambrygen_title         = wp_strip_all_tags( $ambrygen_title_raw );
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

	if ( ! $ambrygen_icon_url ) {
		$ambrygen_icon_url = esc_url( get_theme_file_uri( 'assets/src/images/logo.png' ) );
	}
}

$ambrygen_description = $ambrygen_attributes['description'] ?? '';
if ( 'our-testing-menu' !== $ambrygen_icon_variation ) {
	$ambrygen_count = $ambrygen_attributes['count'] ?? '';
}

$ambrygen_has_title       = '' !== trim( wp_strip_all_tags( (string) $ambrygen_title_raw ) );
$ambrygen_has_description = '' !== trim( wp_strip_all_tags( (string) $ambrygen_description ) );
$ambrygen_has_count       = '' !== trim( wp_strip_all_tags( (string) $ambrygen_count ) );
$ambrygen_visible_links   = array_values(
	array_filter(
		$ambrygen_links,
		static function ( $ambrygen_link ) {
			return ! empty( $ambrygen_link['label'] ) && ! empty( $ambrygen_link['url'] );
		}
	)
);
$ambrygen_has_links       = ! empty( $ambrygen_visible_links );

// Check if card has any content.
$ambrygen_has_content = ! empty( $ambrygen_title ) || ! empty( $ambrygen_description ) || ! empty( $ambrygen_count ) || ! empty( $ambrygen_icon_id ) || ! empty( $ambrygen_links ) || ( 'our-testing-menu' !== $ambrygen_icon_variation && ! empty( $ambrygen_icon_url ) );

if ( ! $ambrygen_has_content && 'variation-3' !== $ambrygen_icon_variation ) {
	return;
}

/**
 * WCAG:
 * Decorative images must have empty alt.
 * Informative images must have meaningful alt.
 */


$ambrygen_card_class = '';

$ambrygen_wrapper_class = 'our-testing-menu' === $ambrygen_icon_variation ? 'item-card js-gsap-fade' : 'info-list__col js-gsap-fade';
if ( 'variation-4' === $ambrygen_icon_variation ) {
	$ambrygen_wrapper_class = 'icon-grid__item js-gsap-fade';
}
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $ambrygen_wrapper_class,
	)
);
if ( 'variation-4' === $ambrygen_icon_variation ) {
	$ambrygen_card_class = '';
} elseif ( 'our-testing-menu' !== $ambrygen_icon_variation && 'variation-3' !== $ambrygen_icon_variation ) {
	$ambrygen_card_class = 'info-list__card';
}
if ( 'variation-3' === $ambrygen_icon_variation ) {
	$ambrygen_selected_post_id = isset( $ambrygen_attributes['selectedPost'] ) ? absint( $ambrygen_attributes['selectedPost'] ) : 0;

	if ( ! $ambrygen_selected_post_id ) {
		$ambrygen_fallback_posts   = get_posts(
			array(
				'post_type'      => 'genetic-testing',
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
	if ( ! $ambrygen_selected_post || 'genetic-testing' !== $ambrygen_selected_post->post_type ) {
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
		<a class="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow" href="<?php echo esc_url( $ambrygen_post_url ); ?>" aria-label="<?php echo esc_attr( 'View test for ' . $ambrygen_post_title ); ?>">
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

		<?php if ( 'our-testing-menu' !== $ambrygen_icon_variation && 'variation-4' !== $ambrygen_icon_variation && 'variation-5' !== $ambrygen_icon_variation && ( $ambrygen_icon_id || $ambrygen_icon_url ) ) : ?>
			<div class="info-list__image">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
				echo Helper::image_from_source(
					$ambrygen_icon_id,
					$ambrygen_icon_url,
					'medium_large',
					array(
						'class'    => 'card-image',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => $ambrygen_icon_id ? $ambrygen_icon_alt ?: $ambrygen_title : '',
					),
					false
				);
				?>
			</div>

		<?php elseif ( 'our-testing-menu' === $ambrygen_icon_variation && $ambrygen_img_id ) : ?>
			<div class="item-card__icon">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
				echo Helper::image_from_source(
					$ambrygen_img_id,
					'',
					'medium_large',
					array(
						'class'    => 'card-image',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => $ambrygen_title,
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

					<?php if ( $ambrygen_title ) : ?>
						<div class="is-style-gl-s8" aria-hidden="true"></div>
					<?php endif; ?>

				</div>

				<?php if ( $ambrygen_term_url ) : ?>
					<a
						class="site-btn is-style-site-text-btn has-right-arrow text-14"
						href="<?php echo esc_url( $ambrygen_term_url ); ?>"
						aria-label="<?php echo esc_attr( 'View tests for ' . $ambrygen_title ); ?>"
					>
						<?php echo esc_html( $ambrygen_termlinktext ); ?>
					</a>
				<?php endif; ?>

			</div>

			<?php elseif ( 'variation-4' === $ambrygen_icon_variation ) : ?>

				<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
		<div class="icon-grid__icon">
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
					echo Helper::image_from_source(
						$ambrygen_icon_id,
						$ambrygen_icon_url,
						'medium_large',
						array(
							'loading'  => 'lazy',
							'decoding' => 'async',
							'alt'      => $ambrygen_icon_id ? $ambrygen_icon_alt ?: $ambrygen_title : '',
						),
						false
					);
					?>
		</div>
	<?php endif; ?>

				<?php if ( $ambrygen_title ) : ?>
		<h3 class="icon-grid__item-title text-xl-semibold mb-0">
					<?php echo wp_kses( $ambrygen_title_raw, $ambrygen_richtext_allowed ); ?>
		</h3>
	<?php endif; ?>

				<?php if ( $ambrygen_has_title && $ambrygen_has_description ) : ?>
	<div class="is-style-gl-s8" aria-hidden="true"></div>
	<?php endif; ?>

				<?php if ( $ambrygen_has_description ) : ?>
		<div class="icon-grid__item-description text-md-reg">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
		</div>
	<?php endif; ?>

				<?php if ( ( $ambrygen_has_title || $ambrygen_has_description ) && $ambrygen_has_links ) : ?>
	<div class="is-style-gl-s20" aria-hidden="true"></div>
	<?php endif; ?>

				<?php
				if ( ! empty( $ambrygen_links[0]['label'] ) && ! empty( $ambrygen_links[0]['url'] ) ) :

					$ambrygen_link_label  = sanitize_text_field( $ambrygen_links[0]['label'] );
					$ambrygen_link_url    = esc_url( $ambrygen_links[0]['url'] );
					$ambrygen_link_target = ! empty( $ambrygen_links[0]['target'] ) ? sanitize_text_field( $ambrygen_links[0]['target'] ) : '';
					$ambrygen_rel         = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';
					?>

		<a
			class="site-btn is-style-site-text-btn has-right-arrow"
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

		<?php elseif ( 'variation-5' === $ambrygen_icon_variation ) : ?>
			<?php
			$ambrygen_count = $ambrygen_attributes['count'] ?? '';
			?>
			<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
				<div class="info-list__image">
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
					echo Helper::image_from_source(
						$ambrygen_icon_id,
						$ambrygen_icon_url,
						'medium_large',
						array(
							'class'    => 'card-image ss',
							'loading'  => 'lazy',
							'decoding' => 'async',
							'alt'      => $ambrygen_icon_id ? $ambrygen_icon_alt ?: $ambrygen_title : '',
						),
						false
					);
					?>
				</div>
			<?php endif; ?>

			<div class="info-list__content">

				<?php if ( $ambrygen_title ) : ?>
					<div class="subtitle1-sbold info-list__title">
						<?php echo wp_kses_post( $ambrygen_title_raw ); ?>
					</div>
				<?php endif; ?>

				<?php if ( $ambrygen_has_count ) : ?>
					<div class="info-list__count subtitle2-sbold">
						<?php echo esc_html( $ambrygen_count ); ?> Tests
					</div>
				<?php endif; ?>

				<?php if ( ( $ambrygen_has_title || $ambrygen_has_count ) && $ambrygen_has_description ) : ?>
					<div class="is-style-gl-s8" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( $ambrygen_has_description ) : ?>
					<div class="info-list__description subtitle2-sbold">
						<?php echo wp_kses_post( $ambrygen_description ); ?>
					</div>
				<?php endif; ?>

				<?php if ( ( $ambrygen_has_title || $ambrygen_has_count || $ambrygen_has_description ) && $ambrygen_has_links ) : ?>
					<div class="is-style-gl-s16" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( $ambrygen_has_links ) : ?>
					<div class="info-list__links">
						<?php
						foreach ( $ambrygen_visible_links as $ambrygen_link ) :

							$ambrygen_link_label  = isset( $ambrygen_link['label'] ) ? sanitize_text_field( $ambrygen_link['label'] ) : '';
							$ambrygen_link_url    = isset( $ambrygen_link['url'] ) ? esc_url( $ambrygen_link['url'] ) : '';
							$ambrygen_link_target = isset( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '';

							$ambrygen_rel = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';

							if ( $ambrygen_link_label && $ambrygen_link_url ) :
								?>
							<div class="info-list__link-col">
								<a
									href="<?php echo esc_url( $ambrygen_link_url ); ?>"
									class="info-list__link site-btn is-style-site-text-btn has-right-arrow text-14"
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

		<?php else : ?>


			<div class="info-list__content">

				<?php if ( $ambrygen_title ) : ?>
					<div class="subtitle1-sbold info-list__title">
						<?php echo wp_kses_post( $ambrygen_title_raw ); ?>
					</div>
				<?php endif; ?>

				<?php if ( $ambrygen_has_title && $ambrygen_has_description ) : ?>
					<div class="is-style-gl-s8" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( $ambrygen_has_description ) : ?>
					<div class="info-list__description text-md-reg">
						<?php echo wp_kses_post( $ambrygen_description ); ?>
					</div>
				<?php endif; ?>

				<?php if ( ( $ambrygen_has_title || $ambrygen_has_description ) && $ambrygen_has_links ) : ?>
					<div class="is-style-gl-s16" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( $ambrygen_has_links ) : ?>
					<div class="info-list__links">
						<?php
						foreach ( $ambrygen_visible_links as $ambrygen_link ) :

							$ambrygen_link_label  = isset( $ambrygen_link['label'] ) ? sanitize_text_field( $ambrygen_link['label'] ) : '';
							$ambrygen_link_url    = isset( $ambrygen_link['url'] ) ? esc_url( $ambrygen_link['url'] ) : '';
							$ambrygen_link_target = isset( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '';

							$ambrygen_rel = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';

							if ( $ambrygen_link_label && $ambrygen_link_url ) :
								?>
							<div class="info-list__link-col">
								<div class="is-style-gl-s16" aria-hidden="true"></div>
								<a
									href="<?php echo esc_url( $ambrygen_link_url ); ?>"
									class="info-list__link site-btn is-style-site-text-btn has-right-arrow text-14"
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
