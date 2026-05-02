<?php
/**
 * Render: Large Icon Grid
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

$ambrygen_heading_tag = $attributes['headingTag'] ?? 'h2';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_heading_tag, 'h2' );

$ambrygen_is_large    = $attributes['isLargeIcon'] ?? false;
$ambrygen_large_class = $ambrygen_is_large ? ' style-large-icons' : '';
$ambrygen_block_id    = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';

$ambrygen_main_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'block-layout icon-grid variation-grid-post' . $ambrygen_large_class,
		'id'    => $ambrygen_block_id,
	)
);

$ambrygen_bg_image = $attributes['backgroundImage'] ?? array();
$ambrygen_bg_url   = $ambrygen_bg_image['url'] ?? '';

?>

<div <?php echo $ambrygen_main_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_bg_url ) : ?>
		<div class="block-bg-image">
			<img src="<?php echo esc_url( $ambrygen_bg_url ); ?>"
				alt="<?php echo esc_attr( $ambrygen_bg_image['alt'] ?? '' ); ?>" />
		</div>
	<?php endif; ?>
	<div class="icon-grid-block">
		<div class="info-list-block__header">
			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-4 block-title mb-0 js-gsap-fade">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<div class="is-style-gl-s20" aria-hidden="true"></div>

			<?php if ( ! empty( $attributes['description'] ) ) : ?>
				<div class="info-list-block__intro subtitle-1-regular js-gsap-fade">
					<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
				</div>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s64" aria-hidden="true"></div>

		<div class="info-list__list info-list__row">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	</div>
</div>
