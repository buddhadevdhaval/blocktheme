<?php
/**
 * Render: Awards Block
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

$ambrygen_block_id           = $attributes['blockId'] ?? '';
$ambrygen_title              = $attributes['title'] ?? 'Awards';
$ambrygen_description        = $attributes['description'] ?? '';
$ambrygen_awards             = is_array( $attributes['awards'] ?? null ) ? $attributes['awards'] : array();
$ambrygen_awards_with_images = array_filter(
	$ambrygen_awards,
	static function ( $ambrygen_award ) {
		$ambrygen_image_id  = isset( $ambrygen_award['imageId'] ) ? absint( $ambrygen_award['imageId'] ) : 0;
		$ambrygen_image_url = isset( $ambrygen_award['imageUrl'] ) ? $ambrygen_award['imageUrl'] : '';

		return $ambrygen_image_id || $ambrygen_image_url;
	}
);
$ambrygen_is_header_vertical = $attributes['isHeaderVertical'] ?? false;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_block_id
		? array(
			'id' => $ambrygen_block_id,
		)
		: array()
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns escaped attributes. ?>>
	<div class="awards-slider">
		<div
			class="awards-slider__header block__rowflex is-<?php echo esc_attr( $ambrygen_is_header_vertical ? 'vertical' : 'horizontal' ); ?>">
			<?php if ( $ambrygen_title ) : ?>
				<h2 class="awards-block__title block__rowflex--heading-title heading-3 mb-0 js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</h2>
			<?php endif; ?>
			<?php if ( $ambrygen_description ) : ?>
				<div class="awards-slider__description block__rowflex--block-content subtitle1-reg js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
			<?php endif; ?>
		</div>


		<?php if ( ! empty( $ambrygen_awards_with_images ) ) : ?>
			<div class="is-style-gl-s50" aria-hidden="true"></div>


			<div class="marquee-slide">
				<div class="marquee-slide__track">
					<div class="marquee-slide__slider">
						<div class="marquee-slide__wrapper">
							<?php foreach ( $ambrygen_awards_with_images as $ambrygen_award ) : ?>
								<?php
								$ambrygen_image_id  = isset( $ambrygen_award['imageId'] ) ? absint( $ambrygen_award['imageId'] ) : 0;
								$ambrygen_image_url = isset( $ambrygen_award['imageUrl'] ) ? $ambrygen_award['imageUrl'] : '';
								$ambrygen_image_alt = isset( $ambrygen_award['imageAlt'] ) ? sanitize_text_field( $ambrygen_award['imageAlt'] ) : '';
								?>
								<div class="marquee-slide__item is-visible">
									<?php
									// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
									echo Helper::image_from_source(
										$ambrygen_image_id,
										$ambrygen_image_url,
										'full',
										array(
											'alt'     => $ambrygen_image_alt,
											'loading' => 'lazy',
										)
									);
									// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
									?>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				</div>
			</div>
		<?php endif; ?>
	</div>
</div>
