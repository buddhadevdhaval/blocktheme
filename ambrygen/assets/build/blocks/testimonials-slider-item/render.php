<?php
/**
 * Render: Testimonials Slider Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes         = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_content            = isset( $ambrygen_attributes['content'] ) ? wp_kses_post( $ambrygen_attributes['content'] ) : '';
$ambrygen_image_id           = isset( $ambrygen_attributes['imageId'] ) ? absint( $ambrygen_attributes['imageId'] ) : 0;
$ambrygen_image_url          = isset( $ambrygen_attributes['imageUrl'] ) ? esc_url_raw( $ambrygen_attributes['imageUrl'] ) : '';
$ambrygen_image_alt          = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';
$ambrygen_author_name        = isset( $ambrygen_attributes['authorName'] ) ? sanitize_text_field( $ambrygen_attributes['authorName'] ) : '';
$ambrygen_author_role        = isset( $ambrygen_attributes['authorRole'] ) ? sanitize_text_field( $ambrygen_attributes['authorRole'] ) : '';
$ambrygen_author_name_text   = trim( wp_strip_all_tags( $ambrygen_author_name ) );
$ambrygen_author_role_text   = trim( wp_strip_all_tags( $ambrygen_author_role ) );
$ambrygen_has_author_details = '' !== $ambrygen_author_name_text || '' !== $ambrygen_author_role_text;
$ambrygen_has_image          = $ambrygen_image_id || '' !== $ambrygen_image_url;
$ambrygen_has_content        = '' !== trim( wp_strip_all_tags( $ambrygen_content ) );

if ( ! $ambrygen_has_content && ! $ambrygen_has_image && ! $ambrygen_has_author_details ) {
	return;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'swiper-slide',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="testimonial-slider__card">
		<?php if ( $ambrygen_has_content ) : ?>
			<div class="testimonial-slider__quote heading-5 mb-0">
				<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_image || $ambrygen_has_author_details ) : ?>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
		<?php endif; ?>

		<?php if ( ! $ambrygen_has_author_details && $ambrygen_has_image ) : ?>
			<div class="testimonial-slider__logo">
				<?php
				echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					$ambrygen_image_id,
					$ambrygen_image_url,
					'full',
					array(
						'alt'      => $ambrygen_image_alt,
						'loading'  => 'lazy',
						'decoding' => 'async',
					)
				);
				?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_author_details ) : ?>
			<div class="testimonial-slider__author">
				<?php if ( $ambrygen_has_image ) : ?>
					<div class="testimonial-slider__author--image">
						<?php
						echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							$ambrygen_image_id,
							$ambrygen_image_url,
							'full',
							array(
								'alt'      => $ambrygen_image_alt,
								'loading'  => 'lazy',
								'decoding' => 'async',
							)
						);
						?>
					</div>
				<?php endif; ?>

				<div class="testimonial-slider__author--content">
					<?php if ( '' !== $ambrygen_author_name_text ) : ?>
						<div class="testimonial-slider__author--name"><?php echo esc_html( $ambrygen_author_name_text ); ?></div>
					<?php endif; ?>
					<?php if ( '' !== $ambrygen_author_role_text ) : ?>
						<div class="testimonial-slider__author--role"><?php echo esc_html( $ambrygen_author_role_text ); ?></div>
					<?php endif; ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</div>
