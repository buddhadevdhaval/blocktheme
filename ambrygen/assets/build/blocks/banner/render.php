<?php
/**
 * Render: Hero Alongside Block
 *
 * @package ambrygen
 */

// Prefix all variables with theme/plugin name
$ambrygen_attributes    = $attributes ?? array();

$ambrygen_heading        = $ambrygen_attributes['heading'] ?? 'Contact';
$ambrygen_highlight      = $ambrygen_attributes['highlight'] ?? 'Us';
$ambrygen_heading_level  = in_array( $ambrygen_attributes['headingLevel'] ?? 'h2', array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) 
	? $ambrygen_attributes['headingLevel'] 
	: 'h2';
$ambrygen_content        = $ambrygen_attributes['content'] ?? '';
$ambrygen_image_url      = $ambrygen_attributes['imageUrl'] ?? '';
$ambrygen_image_alt      = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_shape_url      = $ambrygen_attributes['shapeUrl'] ?? '';
?>

<section class="hero hero--alongside container-1340">
	<div class="wrapper">
		<div class="hero__row">
			<div class="hero__content">
				<<?php echo esc_html( $ambrygen_heading_level ); ?> class="hero__title heading-2 mb-0">
					<span><?php echo esc_html( $ambrygen_heading ); ?></span>
					<span><?php echo esc_html( $ambrygen_highlight ); ?></span>
				</<?php echo esc_html( $ambrygen_heading_level ); ?>>

				<div class="is-style-gl-s24"></div>

				<div class="hero__text subtitle1">
					<?php echo wp_kses_post( wpautop( $ambrygen_content ) ); ?>
				</div>
			</div>

			<div class="hero__media">
				<div class="hero__image">
					<?php if ( $ambrygen_image_url ) : ?>
						<img src="<?php echo esc_url( $ambrygen_image_url ); ?>" alt="<?php echo esc_attr( $ambrygen_image_alt ); ?>" loading="lazy">
					<?php endif; ?>

					<?php if ( $ambrygen_shape_url ) : ?>
						<div class="hero__shape">
							<img src="<?php echo esc_url( $ambrygen_shape_url ); ?>" alt="" aria-hidden="true">
						</div>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</section>