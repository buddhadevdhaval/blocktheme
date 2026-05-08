<?php
/**
 * Render: Icon Grid With Count Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes     = $attributes ?? array();
$ambrygen_title_raw      = $ambrygen_attributes['title'] ?? '';
$ambrygen_title          = wp_strip_all_tags( $ambrygen_title_raw );
$ambrygen_count          = 0;
$ambrygen_img_id         = 0;
$ambrygen_term_url       = '';
$ambrygen_termlinktext   = '';

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

$ambrygen_has_content = ! empty( $ambrygen_title ) || ! empty( $ambrygen_count ) || ! empty( $ambrygen_img_id );

if ( ! $ambrygen_has_content ) {
	return;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'item-card js-gsap-fade',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_img_id ) : ?>
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
		</div>

		<?php if ( $ambrygen_term_url ) : ?>
			<div class="is-style-gl-s8" aria-hidden="true"></div>
			<a
				class="site-btn is-style-site-text-btn has-right-arrow text-14"
				href="<?php echo esc_url( $ambrygen_term_url ); ?>"
				aria-label="<?php echo esc_attr( 'View tests for ' . $ambrygen_title ); ?>"
			>
				<?php echo esc_html( $ambrygen_termlinktext ); ?>
			</a>
		<?php endif; ?>
	</div>
</div>
