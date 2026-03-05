<?php
/**
 * Render: Banner Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
// Prefix all variables with theme/plugin name
$ambrygen_attributes = $attributes ?? array();

/* ---------------------------------
 * Text content
 * --------------------------------- */
$ambrygen_heading = isset( $ambrygen_attributes['heading'] )
	? wp_kses(
		$ambrygen_attributes['heading'],
		array(
			'mark' => array(
				'class' => true,
				'style' => true,
			),
		)
	)
	: '';



$ambrygen_heading_level = in_array(
	$ambrygen_attributes['headingLevel'] ?? 'h2',
	array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ),
	true
)
	? $ambrygen_attributes['headingLevel']
	: 'h2';

$ambrygen_content = $ambrygen_attributes['content'] ?? '';

$ambrygen_eyebrow    = $ambrygen_attributes['eyebrow'] ?? '';
$ambrygen_breadcrumb = $ambrygen_attributes['breadcrumb'] ?? '';

/* ---------------------------------
 * Button
 * --------------------------------- */
$ambrygen_button_text = $ambrygen_attributes['buttonText'] ?? '';
$ambrygen_button_url  = $ambrygen_attributes['buttonUrl'] ?? '';

/* ---------------------------------
 * Media
 * --------------------------------- */
$ambrygen_image_url = $ambrygen_attributes['imageUrl'] ?? '';
$ambrygen_image_alt = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_shape_url = $ambrygen_attributes['shapeUrl'] ?? '';
?>

<section class="hero hero--alongside container-1340">
	<div class="wrapper">
		<div class="hero__row">

			<div class="hero__content">

				<?php if ( ! empty( $ambrygen_breadcrumb ) ) : ?>
					<div class="hero__breadcrumb">
						<?php echo wp_kses_post( $ambrygen_breadcrumb ); ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $ambrygen_eyebrow ) ) : ?>
					<div class="hero__eyebrow hero-kicker">
						<?php echo esc_html( $ambrygen_eyebrow ); ?>
					</div>
				<?php endif; ?>

				<div class="is-style-gl-s24"></div>

				<<?php echo esc_html( $ambrygen_heading_level ); ?> class="hero__title heading-2 mb-0">
					<?php echo  $ambrygen_heading; ?>
				</<?php echo esc_html( $ambrygen_heading_level ); ?>>

				<div class="is-style-gl-s24"></div>

				<?php if ( ! empty( $ambrygen_content ) ) : ?>
					<div class="hero__text subtitle1">
						<?php echo wp_kses_post( wpautop( $ambrygen_content ) ); ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $ambrygen_button_text ) && ! empty( $ambrygen_button_url ) ) : ?>
					<div class="is-style-gl-s24"></div>

					<div class="hero__actions">
						<a
							href="<?php echo esc_url( $ambrygen_button_url ); ?>"
							class="site-btn is-style-site-tertiary-btn is-style-site-trailing-icon"
						>
							<?php echo esc_html( $ambrygen_button_text ); ?>
						</a>
					</div>
				<?php endif; ?>

			</div><!-- /.hero__content -->

			<div class="hero__media">
				<div class="hero__image">

					<?php if ( ! empty( $ambrygen_image_url ) ) : ?>
						<img
							src="<?php echo esc_url( $ambrygen_image_url ); ?>"
							alt="<?php echo esc_attr( $ambrygen_image_alt ); ?>"
							loading="lazy"
						/>
					<?php endif; ?>

					<?php if ( ! empty( $ambrygen_shape_url ) ) : ?>
						<div class="hero__shape">
							<img
								src="<?php echo esc_url( $ambrygen_shape_url ); ?>"
								alt=""
								aria-hidden="true"
								loading="lazy"
							/>
						</div>
					<?php endif; ?>

				</div>
			</div><!-- /.hero__media -->

		</div>
	</div>
</section>
