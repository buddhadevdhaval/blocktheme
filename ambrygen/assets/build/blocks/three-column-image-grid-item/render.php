<?php
/**
 * Three Column Image Grid Item Block Render
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes  = $attributes ?? array();
$ambrygen_title       = $ambrygen_attributes['sectiontitle'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_image_id    = absint( $ambrygen_attributes['imageId'] ?? 0 );
$ambrygen_image_alt   = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_cta         = $ambrygen_attributes['cta'] ?? array();

$ambrygen_cta_text    = $ambrygen_cta['text'] ?? '';
$ambrygen_cta_url     = $ambrygen_cta['url'] ?? '';
$ambrygen_cta_target  = $ambrygen_cta['target'] ?? '';
$ambrygen_cta_rel     = $ambrygen_cta['rel'] ?? '';
$ambrygen_cta_variant = $ambrygen_cta['variant'] ?? 'dark';
/*
|--------------------------------------------------------------------------
| Ensure rel attribute is secure if target=_blank
|--------------------------------------------------------------------------
*/
if ( '_blank' === $ambrygen_cta_target && empty( $ambrygen_cta_rel ) ) {
	$ambrygen_cta_rel = 'noopener noreferrer';
}

$ambrygen_wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'approach-card' ) );
?>

<div <?php echo $ambrygen_wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="approach-card__inner">

		<div class="approach-card__image-wrapper">
			<div class="approach-card__image">
				<?php
				echo wp_kses_post(
					Helper::image_with_placeholder(
						$ambrygen_image_id,
						'medium_large',
						array(
							'class'   => 'card-image',
							'loading' => 'lazy',
							'alt'     => $ambrygen_image_alt ? $ambrygen_image_alt : wp_strip_all_tags( $ambrygen_title ),
						)
					)
				);
				?>
			</div>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div class="approach-card__text-content">
					<?php if ( ! empty( $ambrygen_title ) ) : ?>
						<h3 class="approach-card__title heading-5 mb-0">
							<?php
							echo wp_kses(
								$ambrygen_title,
								Helper::allowed_heading_html()
							);
							?>
						</h3>
					<?php endif; ?>

					<?php if ( ! empty( $ambrygen_description ) ) : ?>
						<div class="approach-card__description body2-reg">
							<?php echo wp_kses_post( $ambrygen_description ); ?>
						</div>
					<?php endif; ?>
			</div>
		</div>



		<div class="is-style-gl-s32" aria-hidden="true"></div>

		<?php if ( $ambrygen_cta_text && $ambrygen_cta_url ) : ?>
			<div class="approach-card__cta-wrapper">
				<a
					href="<?php echo esc_url( $ambrygen_cta_url ); ?>"
					class="approach-card__cta <?php echo esc_attr( $ambrygen_cta_variant ); ?>"
					<?php echo $ambrygen_cta_target ? ' target="' . esc_attr( $ambrygen_cta_target ) . '"' : ''; ?>
					<?php echo $ambrygen_cta_rel ? ' rel="' . esc_attr( $ambrygen_cta_rel ) . '"' : ''; ?>
				>
					<?php echo esc_html( $ambrygen_cta_text ); ?>
					<?php if ( '_blank' === $ambrygen_cta_target ) : ?>
						<span class="screen-reader-text"><?php esc_html_e( '(opens in new tab)', 'ambrygen-web' ); ?></span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>

	</div>
</div>
