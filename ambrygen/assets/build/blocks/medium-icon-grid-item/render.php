<?php
/**
 * Render: Medium Icon Grid Item Block
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
$ambrygen_icon_alt    = isset( $attributes['iconAlt'] ) ? sanitize_text_field( $attributes['iconAlt'] ) : '';
$ambrygen_icon_size   = 70;
$ambrygen_icon_url    = esc_url( get_theme_file_uri( 'assets/src/images/logo.png' ) );
$ambrygen_title       = $attributes['title'] ?? '';
$ambrygen_description = $attributes['description'] ?? '';


$ambrygen_has_title       = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_description = '' !== trim( wp_strip_all_tags( $ambrygen_description ) );
$ambrygen_resolved_alt    = $ambrygen_icon_alt;
$ambrygen_has_content     = $ambrygen_icon_id || $ambrygen_has_title || $ambrygen_has_description;

if ( ! $ambrygen_has_content ) {
	return;
}
?>

<div class="icon-card-grid__card js-gsap-fade">
	<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
		<div class="icon-card-grid__icon-wrap">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
			echo Helper::image_from_source(
				$ambrygen_icon_id,
				$ambrygen_icon_url,
				'full',
				array(
					'alt'      => $ambrygen_icon_id ? $ambrygen_resolved_alt : '',
					'class'    => 'icon-card-grid__icon',
					'width'    => (string) $ambrygen_icon_size,
					'height'   => (string) $ambrygen_icon_size,
					'style'    => sprintf( 'width:%1$dpx;height:%1$dpx;', $ambrygen_icon_size ),
					'loading'  => 'lazy',
					'decoding' => 'async',
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
