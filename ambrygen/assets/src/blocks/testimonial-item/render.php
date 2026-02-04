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

/**
 * Access attributes safely with default values.
 *
 * @var array $attributes Block attributes.
 */
$ambrygen_attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : array();

/**
 * Helper to build srcset string.
 *
 * @param array $sizes Image sizes.
 * @return string
 */
if ( ! function_exists( 'ambrygen_testimonial_build_srcset' ) ) {
	function ambrygen_testimonial_build_srcset( $sizes ) {
		if ( empty( $sizes ) || ! is_array( $sizes ) ) {
			return '';
		}

		$srcset = array();

		foreach ( $sizes as $size ) {
			if ( isset( $size['url'], $size['width'] ) ) {
				$srcset[] = esc_url( $size['url'] ) . ' ' . absint( $size['width'] ) . 'w';
			}
		}

		return implode( ', ', $srcset );
	}
}

/**
 * Retrieve attributes with defaults.
 */
$ambrygen_logo       = isset( $ambrygen_attributes['logo'] ) ? $ambrygen_attributes['logo'] : '';
$ambrygen_logo_sizes = isset( $ambrygen_attributes['logoSizes'] ) ? $ambrygen_attributes['logoSizes'] : array();
$ambrygen_logo_alt   = isset( $ambrygen_attributes['logoAlt'] ) ? $ambrygen_attributes['logoAlt'] : '';

$ambrygen_quote = isset( $ambrygen_attributes['quote'] )
	? $ambrygen_attributes['quote']
	: __( 'The Ambry Care Program has been a game changer for our healthcare management. Their dedicated team and innovative solutions streamlined our patient care processes, allowing us to spend more time on what truly matters—our patients’ well-being.', 'ambrygen-web' );

$ambrygen_author = isset( $ambrygen_attributes['author'] )
	? $ambrygen_attributes['author']
	: __( 'Sarah Mitchell', 'ambrygen-web' );

$ambrygen_role = isset( $ambrygen_attributes['role'] )
	? $ambrygen_attributes['role']
	: __( 'CEO of TechSpark', 'ambrygen-web' );

/**
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'ambry-testimonials__grid__item',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( ! empty( $ambrygen_logo ) ) : ?>
		<img
			src="<?php echo esc_url( $ambrygen_logo ); ?>"
			srcset="<?php echo esc_attr( ambrygen_testimonial_build_srcset( $ambrygen_logo_sizes ) ); ?>"
			sizes="(max-width: 600px) 100vw, 300px"
			loading="lazy"
			class="ambry-testimonials__grid__logo"
			alt="<?php echo esc_attr( $ambrygen_logo_alt ? $ambrygen_logo_alt : __( 'Company logo', 'ambrygen-web' ) ); ?>"
		/>
	<?php endif; ?>

	<div class="is-style-gl-s32"></div>

	<div class="ambry-testimonials__grid__item__quote body2">
		<p>
			<?php echo wp_kses_post( $ambrygen_quote ); ?>
		</p>
	</div>

	<div class="ambry-testimonials__layout__author-details">
		<div class="ambry-testimonials__layout__author-details__author body2-medium">
			<?php echo wp_kses_post( $ambrygen_author ); ?>
		</div>

		<div class="ambry-testimonials__layout__author-details__role body2-medium">
			<?php echo wp_kses_post( $ambrygen_role ); ?>
		</div>
	</div>

</div>
