<?php
/**
 * Render: Blog Disclaimer Block
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

$ambrygen_heading = $attributes['heading'] ?? '';
$ambrygen_content = $attributes['content'] ?? '';

if (
	'' === trim( wp_strip_all_tags( $ambrygen_heading ) )
	&& '' === trim( wp_strip_all_tags( $ambrygen_content ) )
) {
	return;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'blog-disclaimer',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<div class="blog-disclaimer__icon" aria-hidden="true">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10 1.667A8.333 8.333 0 1 0 10 18.334 8.333 8.333 0 0 0 10 1.667zm0 3.75a.833.833 0 1 1 0 1.667.833.833 0 0 1 0-1.667zm1.25 8.75h-2.5v-5h2.5v5z" fill="currentColor"></path>
		</svg>
	</div>
	<div class="blog-disclaimer__body">
		<?php if ( ! empty( $ambrygen_heading ) ) : ?>
			<div class="blog-disclaimer__heading text-small-semibold">
				<?php echo wp_kses_post( $ambrygen_heading ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_content ) ) : ?>
			<div class="blog-disclaimer__text text-small">
				<?php echo wp_kses_post( $ambrygen_content ); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
