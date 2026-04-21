<?php
/**
 * Render: Icon Card Grid Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_icon_id     = isset( $attributes['iconId'] ) ? absint( $attributes['iconId'] ) : 0;
$ambrygen_title       = $attributes['title'] ?? '';
$ambrygen_description = $attributes['description'] ?? '';

$ambrygen_has_title       = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_description = '' !== trim( wp_strip_all_tags( $ambrygen_description ) );

if ( ! $ambrygen_icon_id && ! $ambrygen_has_title && ! $ambrygen_has_description ) {
	return;
}
?>

<div class="icon-card-grid__card">
	<?php if ( $ambrygen_icon_id ) : ?>
		<div class="icon-card-grid__icon-wrap">
			<?php
			echo wp_kses_post(
				Helper::image(
					$ambrygen_icon_id,
					'full',
					array(
						'alt'    => $ambrygen_has_title ? esc_attr( wp_strip_all_tags( $ambrygen_title ) ) : '',
						'class'  => 'icon-card-grid__icon',
						'width'  => '70',
						'height' => '70',
					)
				)
			);
			?>
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_has_title || $ambrygen_has_description ) : ?>
		<div class="icon-card-grid__content">
			<?php if ( $ambrygen_has_title ) : ?>
				<div class="subtitle1-sbold icon-card-grid__card-title"><?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
				</div>
			<?php endif; ?>
			<?php if ( $ambrygen_has_description ) : ?>
				<div class="body1 icon-card-grid__card-desc"><?php echo wp_kses_post( $ambrygen_description ); ?></div>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</div>
