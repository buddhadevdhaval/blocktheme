<?php
/**
 * Render: Icon Grid with Count
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

$ambrygen_link     = $attributes['link'] ?? array();
$ambrygen_block_id = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';

$ambrygen_main_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'block-layout our-testing-menu',
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
		<div class="our-testing-menu__header block__rowflex">
			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="block-title block__rowflex--heading-title heading-3 mb-0 js-gsap-fade">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['description'] ) || ( ! empty( $ambrygen_link['url'] ) && ! empty( $ambrygen_link['text'] ) ) ) : ?>
				<div class="block__rowflex--block-content subtitle1-reg js-gsap-fade">
					<?php if ( ! empty( $attributes['description'] ) ) : ?>
						<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
					<?php endif; ?>

					<?php
					if ( is_array( $ambrygen_link ) && ! empty( $ambrygen_link['url'] ) && ! empty( $ambrygen_link['text'] ) ) :
						$ambrygen_target = ! empty( $ambrygen_link['target'] ) ? $ambrygen_link['target'] : '';
						$ambrygen_rel    = ! empty( $ambrygen_link['rel'] ) ? $ambrygen_link['rel'] : '';

						if ( '_blank' === $ambrygen_target && empty( $ambrygen_rel ) ) {
							$ambrygen_rel = 'noopener noreferrer';
						}
						?>
						<div class="block_rowflex-link js-gsap-fade">
							<a class="site-btn is-style-site-text-btn has-right-arrow text-14"
								href="<?php echo esc_url( $ambrygen_link['url'] ); ?>" 
								<?php echo $ambrygen_target ? ' target="' . esc_attr( $ambrygen_target ) . '"' : ''; ?>
								<?php echo $ambrygen_rel ? ' rel="' . esc_attr( $ambrygen_rel ) . '"' : ''; ?>>
								<?php echo esc_html( $ambrygen_link['text'] ); ?>
							</a>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s64" aria-hidden="true"></div>

		<div class="our-testing-menu__grid">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	</div>
</div>
