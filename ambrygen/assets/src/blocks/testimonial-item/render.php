<?php
/**
 * Render template for the Testimonial Item block.
 *
 * @package Ambrygen
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

/**
 * Safely access attributes.
 *
 * @var array $attributes Block attributes.
 */
$ambrygen_attributes = ( isset( $attributes ) && is_array( $attributes ) ) ? $attributes : array();

/**
 * Retrieve attributes with defaults.
 */
$ambrygen_logo_id = ! empty( $ambrygen_attributes['logoId'] )
	? absint( $ambrygen_attributes['logoId'] )
	: 0;

$ambrygen_quote = ! empty( $ambrygen_attributes['quote'] )
	? $ambrygen_attributes['quote']
	: __( 'The Ambry Care Program has been a game changer for our healthcare management. Their dedicated team and innovative solutions streamlined our patient care processes, allowing us to spend more time on what truly matters—our patients’ well-being.', 'ambrygen-web' );

$ambrygen_author = ! empty( $ambrygen_attributes['author'] )
	? $ambrygen_attributes['author']
	: __( 'Sarah Mitchell', 'ambrygen-web' );

$ambrygen_role = ! empty( $ambrygen_attributes['role'] )
	? $ambrygen_attributes['role']
	: __( 'CEO of TechSpark', 'ambrygen-web' );

/**
 * Block context.
 */
$ambrygen_context = ( isset( $block ) && $block instanceof WP_Block )
	? $block->context
	: array();

$ambrygen_main_image_id = ! empty( $ambrygen_context['ambrygen/mainImageId'] )
	? absint( $ambrygen_context['ambrygen/mainImageId'] )
	: 0;

$ambrygen_main_image = ! empty( $ambrygen_context['ambrygen/mainImage'] )
	? $ambrygen_context['ambrygen/mainImage']
	: array();

$ambrygen_main_image_alt = ! empty( $ambrygen_main_image['alt'] )
	? $ambrygen_main_image['alt']
	: '';

/**
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'ambry-testimonials__grid__item swiper-slide',
	)
);
?>

<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>

	<div class="ambry-testimonials__grid__item__thumb">
		<?php
		if ( $ambrygen_main_image_id ) {
			echo Helper::image_with_placeholder(
				$ambrygen_main_image_id,
				'medium_large',
				array(
					'loading' => 'lazy',
					'alt'     => esc_attr( $ambrygen_main_image_alt ),
				)
			);
		}
		?>
	</div>

	<div class="ambry-testimonials__grid__item__content">

		<?php if ( $ambrygen_logo_id ) : ?>
			<?php
			echo Helper::image(
				$ambrygen_logo_id,
				'medium_large',
				array(
					'class'   => 'ambry-testimonials__grid__logo',
					'loading' => 'lazy',
				)
			);
			?>
			<div class="is-style-gl-s32" aria-hidden="true"></div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_quote ) ) : ?>
		<div class="ambry-testimonials__grid__item__quote body2-reg">
			<p>
				<?php echo wp_kses_post( $ambrygen_quote ); ?>
			</p>
		</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_author ) || ! empty( $ambrygen_role ) ) : ?>
		<div class="ambry-testimonials__layout__author-details">
			<?php if ( ! empty( $ambrygen_author ) ) : ?>

			<div class="ambry-testimonials__layout__author-details__author body2-medium">
				<?php echo esc_html( $ambrygen_author ); ?>
			</div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_role ) ) : ?>
				<div class="ambry-testimonials__layout__author-details__role body2-medium">
					<?php echo esc_html( $ambrygen_role ); ?>
				</div>
			<?php endif; ?>
		</div>
		<?php endif; ?>
	</div>

</div>