<?php
/**
 * Render: Additional Links Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'additional-link__card',
	)
);

$ambrygen_icon = $attributes['icon'] ?? array();
$ambrygen_cta  = $attributes['cta'] ?? array();

$ambrygen_title  = $ambrygen_cta['text'] ?? '';
$ambrygen_url    = isset( $ambrygen_cta['url'] ) && preg_match( '#^https?://#i', $ambrygen_cta['url'] ) ? $ambrygen_cta['url'] : '';
$ambrygen_target = isset( $ambrygen_cta['target'] ) ? (string) $ambrygen_cta['target'] : '';
$ambrygen_rel    = isset( $ambrygen_cta['rel'] ) ? (string) $ambrygen_cta['rel'] : '';

$ambrygen_rel_parts = $ambrygen_rel
	? array_filter( array_unique( explode( ' ', $ambrygen_rel ) ) )
	: array();

if ( '_blank' === $ambrygen_target ) {
	$ambrygen_rel_parts = array_unique(
		array_merge( $ambrygen_rel_parts, array( 'noopener', 'noreferrer' ) )
	);
}

$ambrygen_rel = implode( ' ', $ambrygen_rel_parts );

$ambrygen_icon_id  = isset( $ambrygen_icon['id'] ) ? (int) $ambrygen_icon['id'] : 0;
$ambrygen_icon_url = isset( $ambrygen_icon['url'] ) ? (string) $ambrygen_icon['url'] : '';
$ambrygen_icon_alt = $ambrygen_icon['alt'] ?? '';
?>

<?php if ( $ambrygen_url ) : ?>
	<a
		href="<?php echo esc_url( $ambrygen_url ); ?>"
		class="additional-link__card wp-block-ambrygen-additional-links-item js-gsap-fade"
		<?php echo ! empty( $ambrygen_target ) ? 'target="' . esc_attr( $ambrygen_target ) . '"' : ''; ?>
		<?php echo ! empty( $ambrygen_rel ) ? 'rel="' . esc_attr( $ambrygen_rel ) . '"' : ''; ?>
	>
<?php endif; ?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns escaped attributes. ?>>

		<div class="additional-link__card-image">
			<?php
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
			echo Helper::image_from_source(
				$ambrygen_icon_id,
				$ambrygen_icon_url,
				'full',
				array(
					'class'   => 'additional-link__logo',
					'alt'     => $ambrygen_icon_alt,
					'loading' => 'lazy',
				),
				true
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>


	<?php if ( $ambrygen_title && $ambrygen_url ) : ?>
		<div class="additional-link__card-content">
			<div class="additional-link__card-link">
				<?php echo esc_html( $ambrygen_title ); ?>
				<?php if ( '_blank' === $ambrygen_target ) : ?>
					<span class="screen-reader-text">
						<?php esc_html_e( '(opens in new tab)', 'ambrygen-web' ); ?>
					</span>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>

</div>

<?php if ( $ambrygen_url ) : ?>
	</a>
<?php endif; ?>
