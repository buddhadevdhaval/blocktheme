<?php
/**
 * Render: AI Hero Section Block
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

/**
 * Safely access block attributes.
 *
 * @var array $attributes Block attributes.
 */
$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

/* ---------------------------------
 * Heading
 * --------------------------------- */
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';

$ambrygen_heading_tag = in_array(
	$ambrygen_heading_level,
	array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ),
	true
) ? $ambrygen_heading_level : 'h2';

$ambrygen_heading = $ambrygen_attributes['heading'] ?? '';
$ambrygen_content = $ambrygen_attributes['content'] ?? '';

/* ---------------------------------
 * Counters
 * --------------------------------- */
$ambrygen_counters = isset( $ambrygen_attributes['counters'] ) && is_array( $ambrygen_attributes['counters'] )
	? $ambrygen_attributes['counters']
	: array();

/* ---------------------------------
 * Images (IDs are source of truth)
 * --------------------------------- */
$ambrygen_logo_image_id    = (int) ( $ambrygen_attributes['logoImageId'] ?? 0 );
$ambrygen_image_top_id    = (int) ( $ambrygen_attributes['imageTopId'] ?? 0 );
$ambrygen_image_bottom_id = (int) ( $ambrygen_attributes['imageBottomId'] ?? 0 );




/* ---------------------------------
 * Wrapper attributes
 * --------------------------------- */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'ai-hero',
	)
);
?>
<div
	<?php echo wp_kses_post($ambrygen_wrapper_attributes); ?>
	role="region"
	<?php if ( $ambrygen_heading ) : ?>
		aria-labelledby="hero-heading"
	<?php endif; ?>
>
	<div class="ai-hero__grid">
		<div class="ai-hero__col ai-hero__col--images">
			<div class="ai-hero__images">

				<?php if ( $ambrygen_logo_image_id ) : ?>
					<div class="ai-hero__image-wrapper">
						<div class="ai-hero__logo">
							<div class="ai-hero__logo-inner">
								<?php
								echo Helper::image(
										$ambrygen_logo_image_id,
										'full',
										array(
											'class'       => 'ai-hero__logo-img',
											'aria-hidden' => 'true', // decorative
										)
									);
								?>
							</div>
						</div>
					</div>
				<?php endif; ?>

				<?php if ( $ambrygen_image_top_id ) : ?>
					<div class="ai-hero__image-wrapper">
						<div class="ai-hero__image">
							<div class="ai-hero__image-container">
								<?php
							echo Helper::image(
									$ambrygen_image_top_id,
									'large',
									array(
										'class' => 'ai-hero__image-img',
									)
								);
								?>
							</div>
						</div>
					</div>
				<?php endif; ?>

				<?php if ( $ambrygen_image_bottom_id ) : ?>
					<div class="ai-hero__image-wrapper ai-hero__image-wrapper--full">
						<div class="ai-hero__image ai-hero__image--bottom">
							<div class="ai-hero__image-container">
								<?php
								echo Helper::image(
									$ambrygen_image_bottom_id,
									'full',
									array(
										'class' => 'ai-hero__image-img',
									)
								);
								?>
							</div>
						</div>
					</div>
				<?php endif; ?>

			</div>
		</div>

		<div class="ai-hero__col ai-hero__col--content">
			<div class="ai-hero__content">

				<?php if ( $ambrygen_heading ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
						class="ai-hero__heading heading-1 mb-0"
						id="hero-heading"
					>
						<?php echo wp_kses(
										$ambrygen_heading,
										Helper::allowed_heading_html()
									);?>

					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<div class="is-style-gl-s24" aria-hidden="true"></div>

				<?php if ( $ambrygen_content ) : ?>
					<div
						class="ai-hero__description-text body1 block-description"
						aria-describedby="hero-heading"
					>
						<?php echo wp_kses_post( $ambrygen_content ); ?>
					</div>
				<?php endif; ?>

				<div class="is-style-gl-s24" aria-hidden="true"></div>

				<?php if ( $ambrygen_counters ) : ?>
					
    <div class="ai-hero__counters" role="list">
        <?php foreach ( $ambrygen_counters as $ambrygen_counter ) : ?>
            <?php
            $number = isset( $ambrygen_counter['number'] ) ? (string) $ambrygen_counter['number'] : '';
            $label  = isset( $ambrygen_counter['label'] ) ? (string) $ambrygen_counter['label'] : '';
            $prefix = isset( $ambrygen_counter['prefix'] ) ? (string) $ambrygen_counter['prefix'] : '';
            $suffix = isset( $ambrygen_counter['suffix'] ) ? (string) $ambrygen_counter['suffix'] : '';

            if ( '' === $number && '' === $label ) {
                continue;
            }

            // Build accessible label for screen readers
            $aria_label = trim( $prefix . ' ' . $number . ' ' . $suffix );
            ?>
            <div class="ai-hero__counters--counter-item" role="listitem">
				<?php if ( '' !== $number ) : ?>
                <div
                    class="ai-hero__counters--counter-number heading-3 mb-0"
                    aria-label="<?php echo esc_attr( $aria_label ); ?>"
                >
                    <?php if ( $prefix ) : ?>
                        <div class="ai-hero__counters--counter-prefix">
                            <?php echo esc_html( $prefix ); ?>
                        </div>
                    <?php endif; ?>

					<?php if ( '' !== $number ) : ?>
                        <div class="ai-hero__counters--count">
                            <?php echo esc_html( $number ); ?>
                            <?php if ( $suffix ) : ?>
                                <?php echo esc_html( $suffix ); ?>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                </div>
				   <?php endif; ?>

                <?php if ( $label ) : ?>
                    <div class="ai-hero__counters--counter-title body1">
                        <?php echo wp_kses_post( $label ); ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>


			</div>
		</div>
	</div>
</div>
