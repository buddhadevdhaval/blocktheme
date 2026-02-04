<?php
/**
 * Render template for the AI Hero Section block.
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

$ambrygen_heading_level = isset( $ambrygen_attributes['headingLevel'] )
	? $ambrygen_attributes['headingLevel']
	: 'h2';

$ambrygen_heading_tag = in_array(
	$ambrygen_heading_level,
	array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ),
	true
) ? $ambrygen_heading_level : 'h2';

$ambrygen_heading  = isset( $ambrygen_attributes['heading'] ) ? $ambrygen_attributes['heading'] : '';
$ambrygen_content  = isset( $ambrygen_attributes['content'] ) ? $ambrygen_attributes['content'] : '';
$ambrygen_counters = isset( $ambrygen_attributes['counters'] ) && is_array( $ambrygen_attributes['counters'] )
	? $ambrygen_attributes['counters']
	: array();

$ambrygen_logo_image        = isset( $ambrygen_attributes['logoImage'] ) ? $ambrygen_attributes['logoImage'] : '';
$ambrygen_logo_image_alt    = isset( $ambrygen_attributes['logoImageAlt'] )
	? $ambrygen_attributes['logoImageAlt']
	: __( 'Company logo', 'ambrygen-web' );
$ambrygen_logo_image_srcset = isset( $ambrygen_attributes['logoImageSrcSet'] ) ? $ambrygen_attributes['logoImageSrcSet'] : '';
$ambrygen_logo_image_sizes  = isset( $ambrygen_attributes['logoImageSizes'] ) ? $ambrygen_attributes['logoImageSizes'] : '';

$ambrygen_image_top        = isset( $ambrygen_attributes['imageTop'] ) ? $ambrygen_attributes['imageTop'] : '';
$ambrygen_image_top_alt    = isset( $ambrygen_attributes['imageTopAlt'] ) ? $ambrygen_attributes['imageTopAlt'] : '';
$ambrygen_image_top_srcset = isset( $ambrygen_attributes['imageTopSrcSet'] ) ? $ambrygen_attributes['imageTopSrcSet'] : '';
$ambrygen_image_top_sizes  = isset( $ambrygen_attributes['imageTopSizes'] ) ? $ambrygen_attributes['imageTopSizes'] : '';

$ambrygen_image_bottom        = isset( $ambrygen_attributes['imageBottom'] ) ? $ambrygen_attributes['imageBottom'] : '';
$ambrygen_image_bottom_alt    = isset( $ambrygen_attributes['imageBottomAlt'] ) ? $ambrygen_attributes['imageBottomAlt'] : '';
$ambrygen_image_bottom_srcset = isset( $ambrygen_attributes['imageBottomSrcSet'] ) ? $ambrygen_attributes['imageBottomSrcSet'] : '';
$ambrygen_image_bottom_sizes  = isset( $ambrygen_attributes['imageBottomSizes'] ) ? $ambrygen_attributes['imageBottomSizes'] : '';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'ai-hero',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="is-style-gl-s50"></div>

	<div class="ai-hero__grid">
		<div class="ai-hero__col ai-hero__col--images">
			<div class="ai-hero__images">

				<?php if ( ! empty( $ambrygen_logo_image ) ) : ?>
					<div class="ai-hero__image-wrapper">
						<div class="ai-hero__logo">
							<div class="ai-hero__logo-inner">
								<img
									src="<?php echo esc_url( $ambrygen_logo_image ); ?>"
									<?php if ( ! empty( $ambrygen_logo_image_srcset ) ) : ?>
										srcset="<?php echo esc_attr( $ambrygen_logo_image_srcset ); ?>"
									<?php endif; ?>
									<?php if ( ! empty( $ambrygen_logo_image_sizes ) ) : ?>
										sizes="<?php echo esc_attr( $ambrygen_logo_image_sizes ); ?>"
									<?php endif; ?>
									alt="<?php echo esc_attr( $ambrygen_logo_image_alt ); ?>"
									loading="lazy"
								/>
							</div>
						</div>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $ambrygen_image_top ) ) : ?>
					<div class="ai-hero__image-wrapper">
						<div class="ai-hero__image">
							<div class="ai-hero__image-container">
								<img
									src="<?php echo esc_url( $ambrygen_image_top ); ?>"
									alt="<?php echo esc_attr( ! empty( $ambrygen_image_top_alt ) ? $ambrygen_image_top_alt : __( 'Hero top image', 'ambrygen-web' ) ); ?>"
									class="ai-hero__image-img"
									loading="lazy"
									<?php if ( ! empty( $ambrygen_image_top_srcset ) ) : ?>
										srcset="<?php echo esc_attr( $ambrygen_image_top_srcset ); ?>"
									<?php endif; ?>
									<?php if ( ! empty( $ambrygen_image_top_sizes ) ) : ?>
										sizes="<?php echo esc_attr( $ambrygen_image_top_sizes ); ?>"
									<?php endif; ?>
								/>
							</div>
						</div>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $ambrygen_image_bottom ) ) : ?>
					<div class="ai-hero__image-wrapper ai-hero__image-wrapper--full">
						<div class="ai-hero__image ai-hero__image--bottom">
							<div class="ai-hero__image-container">
								<img
									src="<?php echo esc_url( $ambrygen_image_bottom ); ?>"
									alt="<?php echo esc_attr( ! empty( $ambrygen_image_bottom_alt ) ? $ambrygen_image_bottom_alt : __( 'Hero bottom image', 'ambrygen-web' ) ); ?>"
									class="ai-hero__image-img"
									loading="lazy"
									<?php if ( ! empty( $ambrygen_image_bottom_srcset ) ) : ?>
										srcset="<?php echo esc_attr( $ambrygen_image_bottom_srcset ); ?>"
									<?php endif; ?>
									<?php if ( ! empty( $ambrygen_image_bottom_sizes ) ) : ?>
										sizes="<?php echo esc_attr( $ambrygen_image_bottom_sizes ); ?>"
									<?php endif; ?>
								/>
							</div>
						</div>
					</div>
				<?php endif; ?>

			</div>
		</div>

		<div class="ai-hero__col ai-hero__col--content">
			<div class="ai-hero__content">

				<?php if ( ! empty( $ambrygen_heading ) ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
						class="ai-hero__heading heading-2 mb-0"
						id="hero-heading"
					>
						<?php echo wp_kses_post( $ambrygen_heading ); ?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<div class="is-style-gl-s24"></div>

				<?php if ( ! empty( $ambrygen_content ) ) : ?>
					<p
						class="ai-hero__description-text body1"
						<?php if ( ! empty( $ambrygen_heading ) ) : ?>
							aria-labelledby="hero-heading"
						<?php endif; ?>
					>
						<?php echo wp_kses_post( $ambrygen_content ); ?>
					</p>
				<?php endif; ?>

				<div class="is-style-gl-s24"></div>

				<?php if ( ! empty( $ambrygen_counters ) ) : ?>
					<div class="ai-hero__counters">
						<?php foreach ( $ambrygen_counters as $ambrygen_counter ) : ?>
							<?php
							$ambrygen_number = isset( $ambrygen_counter['number'] ) ? (string) $ambrygen_counter['number'] : '';
							$ambrygen_label  = isset( $ambrygen_counter['label'] ) ? (string) $ambrygen_counter['label'] : '';
							$ambrygen_prefix = isset( $ambrygen_counter['prefix'] ) ? (string) $ambrygen_counter['prefix'] : '';
							$ambrygen_suffix = isset( $ambrygen_counter['suffix'] ) ? (string) $ambrygen_counter['suffix'] : '';

							if ( '' === $ambrygen_number && '' === $ambrygen_label ) {
								continue;
							}
							?>
							<div class="ai-hero__counters--counter-item">
								<div class="ai-hero__counters--counter-number heading-3 mb-0">
									<?php if ( '' !== $ambrygen_prefix ) : ?>
										<div class="ai-hero__counters--counter-prefix">
											<?php echo wp_kses_post( $ambrygen_prefix ); ?>
										</div>
									<?php endif; ?>

									<?php if ( '' !== $ambrygen_number ) : ?>
										<div class="ai-hero__counters--count">
											<?php echo esc_html( $ambrygen_number ); ?>
											<?php if ( '' !== $ambrygen_suffix ) : ?>
												<?php echo wp_kses_post( $ambrygen_suffix ); ?>
											<?php endif; ?>
										</div>
									<?php endif; ?>
								</div>

								<?php if ( '' !== $ambrygen_label ) : ?>
									<div class="ai-hero__counters--counter-title body1">
										<?php echo wp_kses_post( $ambrygen_label ); ?>
									</div>
								<?php endif; ?>
							</div>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>

			</div>
		</div>
	</div>

	<div class="is-style-gl-s50"></div>
</div>
