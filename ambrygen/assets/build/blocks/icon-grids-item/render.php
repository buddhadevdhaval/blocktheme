<?php
/**
 * Server-side rendering for icon-grids-item child block
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'info-list__col',
	)
);

$ambrygen_attributes     = $attributes ?? array();
$ambrygen_icon_variation = $block->context['ambrygen/variation'] ?? '';
$ambrygen_title          =  strip_tags( $ambrygen_attributes['title'] ?? '' );

$ambrygen_links          = is_array( $ambrygen_attributes['links'] ?? null )
	? $ambrygen_attributes['links']
	: array();

$ambrygen_count     = 0;
$ambrygen_img_id    = 0;
$ambrygen_icon_id   = 0;
$ambrygen_icon_url  = '';
$ambrygen_term_url  = '#';
$ambrygen_termlinktext = "";
if ( 'our-testing-menu' === $ambrygen_icon_variation ) {

$ambrygen_termlinktext = ! empty( $ambrygen_attributes['termlinktext'] )
	? $ambrygen_attributes['termlinktext']
	: 'View Test';
	
	$selected_term_id = isset( $ambrygen_attributes['selectedTerm'] )
		? absint( $ambrygen_attributes['selectedTerm'] )
		: 0;

	if ( $selected_term_id ) {
		$term = get_term( $selected_term_id, 'test_type' );

		if ( $term && ! is_wp_error( $term ) ) {
			$ambrygen_count    = isset( $term->count ) ? absint( $term->count ) : 0;
			$ambrygen_img_id   = absint( get_term_meta( $term->term_id, 'term_image', true ) );
			$ambrygen_term_url = esc_url( get_term_link( $term ) );
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

if ( 'our-testing-menu' === $ambrygen_icon_variation ) {
	$card_class = 'item-card';
} elseif ( 'variation-4' === $ambrygen_icon_variation ) {
	$card_class = 'icon-grid__item';
} else {
	$card_class = 'info-list__card';
}

?>

<?php if ( 'our-testing-menu' !== $ambrygen_icon_variation &&  'variation-4' !== $ambrygen_icon_variation) : ?>
<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>
<?php endif; ?>

		<div class="<?php echo esc_attr( $card_class ); ?>">
		<?php if ( $ambrygen_icon_id && 'our-testing-menu' !== $ambrygen_icon_variation && 'variation-4' !== $ambrygen_icon_variation ) : ?>
			<div class="info-list__image">
				<?php
				echo Helper::image(
					$ambrygen_icon_id,
					'medium_large',
					array(
						'class'   => 'card-image',
						'loading' => 'lazy',
						'alt'     => $ambrygen_title
							? wp_strip_all_tags( $ambrygen_title )
							: '',
					)
				);
				?>
			</div>

		<?php elseif ( 'our-testing-menu' === $ambrygen_icon_variation && $ambrygen_img_id ) : ?>
			<div class="item-card__icon">
				<?php
				echo Helper::image(
					$ambrygen_img_id,
					'medium_large',
					array(
						'class'   => 'card-image',
						'loading' => 'lazy',
						'alt'     => $ambrygen_title
							? wp_strip_all_tags( $ambrygen_title )
							: '',
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

					<div class="item-card__title subtitle2-sbold">
						<?php echo esc_html( $ambrygen_count ); ?>
					</div>

					<div class="is-style-gl-s8"></div>

				</div>

				<a
					class="site-btn is-style-site-text-btn has-icon icon-arrow-up text-14"
					href="<?php echo esc_url( $ambrygen_term_url ); ?>"
					aria-label="<?php echo esc_attr( 'View tests for ' . wp_strip_all_tags( $ambrygen_title ) ); ?>"
				>
					<?php esc_html_e( $ambrygen_termlinktext, 'ambrygen' ); ?>
				</a>

			</div>

			<?php elseif ( 'variation-4' === $ambrygen_icon_variation ) : ?>

				<div class="icon-grid__item">

	<?php if ( $ambrygen_icon_id ) : ?>
		<div class="icon-grid__icon">
			<?php
			echo Helper::image(
				$ambrygen_icon_id,
				'medium_large',
				array(
					'class'   => '',
					'loading' => 'lazy',
					'alt'     => $ambrygen_title
						? wp_strip_all_tags( $ambrygen_title )
						: '',
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

		$link_label  = sanitize_text_field( $ambrygen_links[0]['label'] );
		$link_url    = esc_url( $ambrygen_links[0]['url'] );
		$link_target = ! empty( $ambrygen_links[0]['target'] ) ? sanitize_text_field( $ambrygen_links[0]['target'] ) : '_self';
		$rel         = '_blank' === $link_target ? 'noopener noreferrer' : '';
	?>

		<a
			class="site-btn is-style-site-text-btn has-icon"
			href="<?php echo esc_url( $link_url ); ?>"
			target="<?php echo esc_attr( $link_target ); ?>"
			<?php if ( $rel ) : ?>
				rel="<?php echo esc_attr( $rel ); ?>"
			<?php endif; ?>
			aria-label="<?php echo esc_attr( $link_label ); ?>"
		>
			<?php echo esc_html( $link_label ); ?>
		</a>

	<?php endif; ?>

</div>
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
						<?php foreach ( $ambrygen_links as $ambrygen_link ) :

							$ambrygen_link_label  = isset( $ambrygen_link['label'] ) ? sanitize_text_field( $ambrygen_link['label'] ) : '';
							$ambrygen_link_url    = isset( $ambrygen_link['url'] ) ? esc_url( $ambrygen_link['url'] ) : '';
							$ambrygen_link_target = isset( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '_self';

							$rel = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';

							if ( $ambrygen_link_label && $ambrygen_link_url ) :
						?>
							<div class="info-list__link-col text-md-Semibold">
								<a
									href="<?php echo esc_url( $ambrygen_link_url ); ?>"
									class="info-list__link"
									aria-label="<?php echo esc_attr( $ambrygen_link_label ); ?>"
									target="<?php echo esc_attr( $ambrygen_link_target ); ?>"
									<?php if ( $rel ) : ?>
										rel="<?php echo esc_attr( $rel ); ?>"
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

	</div>

<?php if ( 'our-testing-menu' !== $ambrygen_icon_variation && 'variation-4' !== $ambrygen_icon_variation) : ?>
</div>
<?php endif; ?>
