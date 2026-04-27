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

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_content = isset( $ambrygen_attributes['content'] ) ? wp_kses_post( $ambrygen_attributes['content'] ) : '';
$ambrygen_image_id = isset( $ambrygen_attributes['imageId'] ) ? absint( $ambrygen_attributes['imageId'] ) : 0;
$ambrygen_image_url = isset( $ambrygen_attributes['imageUrl'] ) ? esc_url( $ambrygen_attributes['imageUrl'] ) : '';
$ambrygen_image_alt = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';
$ambrygen_author_name = isset( $ambrygen_attributes['authorName'] ) ? $ambrygen_attributes['authorName'] : '';
$ambrygen_author_role = isset( $ambrygen_attributes['authorRole'] ) ? $ambrygen_attributes['authorRole'] : '';
$ambrygen_has_author_details = '' !== trim( wp_strip_all_tags( $ambrygen_author_name ) ) || '' !== trim( wp_strip_all_tags( $ambrygen_author_role ) );

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'swiper-slide',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="testimonial-slider__card">
		<?php if ( $ambrygen_content ) : ?>
			<div class="testimonial-slider__quote heading-5 mb-0">
				<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s24"></div>

		<?php if ( ! $ambrygen_has_author_details && ( $ambrygen_image_id || $ambrygen_image_url ) ) : ?>
			<div class="testimonial-slider__logo">
				<?php if ( $ambrygen_image_id ) : ?>
					<?php
					echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						$ambrygen_image_id,
						'full',
						array(
							'alt' => $ambrygen_image_alt,
							'loading' => 'lazy',
						)
					);
					?>
				<?php else : ?>
					<img src="<?php echo esc_url( $ambrygen_image_url ); ?>" alt="<?php echo esc_attr( $ambrygen_image_alt ); ?>" loading="lazy" />
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_author_details ) : ?>
			<div class="author">
				<?php if ( $ambrygen_image_id || $ambrygen_image_url ) : ?>
					<div class="author__image">
						<?php if ( $ambrygen_image_id ) : ?>
							<?php
							echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
								$ambrygen_image_id,
								'full',
								array(
									'alt' => $ambrygen_image_alt,
									'loading' => 'lazy',
								)
							);
							?>
						<?php else : ?>
							<img src="<?php echo esc_url( $ambrygen_image_url ); ?>" alt="<?php echo esc_attr( $ambrygen_image_alt ); ?>" loading="lazy" />
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<div class="author__content">
					<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_author_name ) ) ) : ?>
						<div class="author__name"><?php echo esc_html( $ambrygen_author_name ); ?></div>
					<?php endif; ?>
					<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_author_role ) ) ) : ?>
						<div class="author__role"><?php echo esc_html( $ambrygen_author_role ); ?></div>
					<?php endif; ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</div>
