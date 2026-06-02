<?php
/**
 * Render: Mid Page CTA Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'mid-page-cta text-center block-layout',
	)
);

$ambrygen_title         = $attributes['title'] ?? '';
$ambrygen_tag           = $attributes['headingTag'] ?? 'h2';
$ambrygen_buttons       = $attributes['buttons'] ?? array();
$ambrygen_inner_content = trim( (string) $content );

?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! empty( $ambrygen_title ) ) : ?>
		<<?php echo esc_attr( $ambrygen_tag ); ?> class="block-title mb-0 heading-3 js-gsap-fade">
			<?php echo esc_html( $ambrygen_title ); ?>
		</<?php echo esc_attr( $ambrygen_tag ); ?>>
	<?php endif; ?>

	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<?php if ( $ambrygen_inner_content ) : ?>
		<?php echo wp_kses_post( $ambrygen_inner_content ); ?>
	<?php else : ?>
		<div class="blocks-btn two-btn-row js-gsap-fade">
			<?php
			foreach ( $ambrygen_buttons as $ambrygen_button ) :
				if ( empty( $ambrygen_button['text'] ) || empty( $ambrygen_button['url'] ) ) {
					continue;
				}
				?>
				<a
					class="<?php echo esc_attr( $ambrygen_button['variant'] ?? 'site-btn' ); ?>"
					href="<?php echo esc_url( $ambrygen_button['url'] ); ?>"
					role="button"
				>
					<?php echo esc_html( $ambrygen_button['text'] ); ?>
				</a>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
