<?php
/**
 * Render: Additional Links Item Block.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes = is_array( $attributes ) ? $attributes : array();
$ambrygen_icon       = isset( $ambrygen_attributes['icon'] ) && is_array( $ambrygen_attributes['icon'] ) ? $ambrygen_attributes['icon'] : array();
$ambrygen_cta        = isset( $ambrygen_attributes['cta'] ) && is_array( $ambrygen_attributes['cta'] ) ? $ambrygen_attributes['cta'] : array();

$ambrygen_title      = isset( $ambrygen_cta['text'] ) ? sanitize_text_field( $ambrygen_cta['text'] ) : '';
$ambrygen_url_raw    = isset( $ambrygen_cta['url'] ) ? trim( (string) $ambrygen_cta['url'] ) : '';
$ambrygen_url        = $ambrygen_url_raw ? esc_url_raw( $ambrygen_url_raw ) : '';
$ambrygen_target     = isset( $ambrygen_cta['target'] ) && '_blank' === $ambrygen_cta['target'] ? '_blank' : '';
$ambrygen_rel        = isset( $ambrygen_cta['rel'] ) ? sanitize_text_field( $ambrygen_cta['rel'] ) : '';
$ambrygen_rel_parts  = $ambrygen_rel ? preg_split( '/\s+/', $ambrygen_rel, -1, PREG_SPLIT_NO_EMPTY ) : array();
$ambrygen_icon_id    = isset( $ambrygen_icon['id'] ) ? absint( $ambrygen_icon['id'] ) : 0;
$ambrygen_icon_url   = isset( $ambrygen_icon['url'] ) ? esc_url_raw( $ambrygen_icon['url'] ) : '';
$ambrygen_icon_alt   = isset( $ambrygen_icon['alt'] ) ? sanitize_text_field( $ambrygen_icon['alt'] ) : '';
$ambrygen_wrapper_tag = $ambrygen_url ? 'a' : 'div';

if ( '_blank' === $ambrygen_target ) {
	$ambrygen_rel_parts = array_merge( $ambrygen_rel_parts, array( 'noopener', 'noreferrer' ) );
}

$ambrygen_rel = implode( ' ', array_unique( array_filter( $ambrygen_rel_parts ) ) );

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'additional-link__card js-gsap-fade',
	)
);
?>

<<?php echo tag_escape( $ambrygen_wrapper_tag ); ?>
	<?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns escaped attributes. ?>
	<?php echo $ambrygen_url ? ' href="' . esc_url( $ambrygen_url ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- URL is escaped with esc_url(). ?>
	<?php echo $ambrygen_target ? ' target="' . esc_attr( $ambrygen_target ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Target is allowlisted above. ?>
	<?php echo $ambrygen_rel ? ' rel="' . esc_attr( $ambrygen_rel ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rel parts are sanitized above. ?>
>
	<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
		<div class="additional-link__card-image">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
			echo Helper::image_from_source(
				$ambrygen_icon_id,
				$ambrygen_icon_url,
				'full',
				array(
					'class'    => 'additional-link__logo',
					'alt'      => $ambrygen_icon_alt,
					'loading'  => 'lazy',
					'decoding' => 'async',
				),
				true
			);
			?>
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_title ) : ?>
		<div class="additional-link__card-content">
			<div class="additional-link__card-link">
				<?php echo esc_html( $ambrygen_title ); ?>
				<?php if ( $ambrygen_url && '_blank' === $ambrygen_target ) : ?>
					<span class="screen-reader-text">
						<?php esc_html_e( '(opens in new tab)', 'ambrygen-web' ); ?>
					</span>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>
</<?php echo tag_escape( $ambrygen_wrapper_tag ); ?>>
