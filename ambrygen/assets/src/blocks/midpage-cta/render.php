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

use Ambrygen\Theme\Core\Helper;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'mid-page-cta text-center block-layout',
	)
);

$ambrygen_title         = $attributes['title'] ?? '';
$ambrygen_tag           = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_buttons       = $attributes['buttons'] ?? array();
$ambrygen_inner_content = trim( (string) $content );
$ambrygen_cta_html      = '';

if ( $ambrygen_inner_content && preg_match( '/<a\b/i', $ambrygen_inner_content ) ) {
	$ambrygen_cta_html = $ambrygen_inner_content;
} else {
	ob_start();
	?>
	<div class="blocks-btn two-btn-row">
		<?php
		foreach ( $ambrygen_buttons as $ambrygen_button ) :
			$ambrygen_button_text    = isset( $ambrygen_button['text'] ) ? sanitize_text_field( $ambrygen_button['text'] ) : '';
			$ambrygen_button_url     = isset( $ambrygen_button['url'] ) ? esc_url_raw( $ambrygen_button['url'] ) : '';
			$ambrygen_button_variant = isset( $ambrygen_button['variant'] ) ? sanitize_text_field( $ambrygen_button['variant'] ) : 'site-btn';

			if ( ! $ambrygen_button_text || ! $ambrygen_button_url ) {
				continue;
			}
			?>
			<a
				class="<?php echo esc_attr( $ambrygen_button_variant ); ?>"
				href="<?php echo esc_url( $ambrygen_button_url ); ?>"
				role="button"
			>
				<?php echo esc_html( $ambrygen_button_text ); ?>
			</a>
		<?php endforeach; ?>
	</div>
	<?php
	$ambrygen_cta_html = ob_get_clean();

	if ( ! preg_match( '/<a\b/i', $ambrygen_cta_html ) ) {
		$ambrygen_cta_html = '';
	}
}

?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! empty( $ambrygen_title ) ) : ?>
		<<?php echo esc_attr( $ambrygen_tag ); ?> class="block-title mb-0 heading-3 js-gsap-fade">
			<?php echo wp_kses_post( $ambrygen_title ); ?>
		</<?php echo esc_attr( $ambrygen_tag ); ?>>

		<?php if ( $ambrygen_cta_html ) : ?>
			<div class="is-style-gl-s32" aria-hidden="true"></div>
		<?php endif; ?>
	<?php endif; ?>

	<?php if ( $ambrygen_cta_html ) : ?>
		<?php echo wp_kses_post( $ambrygen_cta_html ); ?>
	<?php endif; ?>
</div>
