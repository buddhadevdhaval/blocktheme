<?php
/**
 * Render: Multiple Image Alongside Text Block
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

/*
---------------------------------
 * Heading
 * ---------------------------------
 */
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_heading_tag   = Helper::get_heading_tag( $ambrygen_heading_level, 'h2' );

$ambrygen_heading              = $ambrygen_attributes['heading'] ?? '';
$ambrygen_content              = $ambrygen_attributes['content'] ?? '';
$ambrygen_block_id             = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_variation            = $ambrygen_attributes['variation'] ?? 'stats-view';
$ambrygen_class_name           = $ambrygen_attributes['className'] ?? '';
$ambrygen_image_position       = $ambrygen_attributes['imagePosition'] ?? 'left';
$ambrygen_content_top_align    = ! empty( $ambrygen_attributes['contentTopAlign'] );
$ambrygen_enable_counters      = ! isset( $ambrygen_attributes['enableCounters'] ) || $ambrygen_attributes['enableCounters'];
$ambrygen_is_normal_view       =
	'normal-view' === $ambrygen_variation ||
	'variation-history-block' === $ambrygen_variation ||
	( is_string( $ambrygen_class_name ) && preg_match( '/(?:^|\s)variation-history-block(?:\s|$)/', $ambrygen_class_name ) );
$ambrygen_heading_class        = $ambrygen_is_normal_view ? 'heading-3' : 'heading-1';
$ambrygen_image_position_class = 'right' === $ambrygen_image_position ? ' block-rtl' : '';
$ambrygen_variation_class      = $ambrygen_is_normal_view ? ' variation-history-block' : '';

// Unique ID per render to avoid duplicate IDs when the block appears multiple times.
$ambrygen_heading_id = wp_unique_id( 'multiple-image-alongside-text-heading-' );

/*
---------------------------------
 * Counters
 * ---------------------------------
 */
$ambrygen_counters = isset( $ambrygen_attributes['counters'] ) && is_array( $ambrygen_attributes['counters'] )
	? $ambrygen_attributes['counters']
	: array();

/*
---------------------------------
 * Images (IDs are source of truth)
 * ---------------------------------
 */
$ambrygen_logo_image_id   = (int) ( $ambrygen_attributes['logoImageId'] ?? 0 );
$ambrygen_image_top_id    = (int) ( $ambrygen_attributes['imageTopId'] ?? 0 );
$ambrygen_image_bottom_id = (int) ( $ambrygen_attributes['imageBottomId'] ?? 0 );
$ambrygen_image_extra_id  = (int) ( $ambrygen_attributes['imageExtraId'] ?? 0 );

/*
---------------------------------
 * Wrapper attributes
 * ---------------------------------
 */
$ambrygen_wrapper_args = array(
	'class' => 'ai-hero ' .
		( $ambrygen_content_top_align ? ' has-top-align' : '' ) .
		$ambrygen_image_position_class .
		$ambrygen_variation_class,
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?> <?php if ( $ambrygen_heading ) : ?>
		role="region" aria-labelledby="<?php echo esc_attr( $ambrygen_heading_id ); ?>" <?php endif; ?>>
	<div class="ai-hero__grid">
		<div class="ai-hero__col ai-hero__col--images">
			<div class="ai-hero__images">
				<div class="ai-hero__image-wrapper js-gsap-fade">
					<div class="ai-hero__image">
						<div class="ai-hero__image-container">
							<?php
							echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image() returns sanitized HTML.
								$ambrygen_logo_image_id,
								'large',
								array(
									'class'       => 'ai-hero__image-img',
									'aria-hidden' => 'true',
								)
							);
							?>
						</div>
					</div>
				</div>

				<div class="ai-hero__image-wrapper js-gsap-fade">
					<div class="ai-hero__image">
						<div class="ai-hero__image-container">
							<?php
							echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image() returns sanitized HTML.
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

				<div class="ai-hero__image-wrapper<?php echo $ambrygen_is_normal_view ? '' : ' ai-hero__image-wrapper--full'; ?> js-gsap-fade">
					<div class="ai-hero__image ai-hero__image--bottom">
						<div class="ai-hero__image-container">
							<?php
							echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image() returns sanitized HTML.
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
				<?php if ( $ambrygen_is_normal_view ) : ?>
					<div class="ai-hero__image-wrapper js-gsap-fade">
						<div class="ai-hero__image">
							<div class="ai-hero__image-container">
								<?php
								echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image() returns sanitized HTML.
									$ambrygen_image_extra_id,
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
			</div>
		</div>

		<div class="ai-hero__col ai-hero__col--content">
			<div class="ai-hero__content">

				<?php if ( $ambrygen_heading ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
						class="ai-hero__heading <?php echo esc_attr( $ambrygen_heading_class ); ?> mb-0 js-gsap-fade"
						id="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
						>
						<?php
						echo wp_kses(
							$ambrygen_heading,
							Helper::allowed_heading_html()
						);
						?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php if ( $ambrygen_content ) : ?>
					<div class="is-style-gl-s24" aria-hidden="true"></div>
					<div class="ai-hero__description-text body1 block-description js-gsap-fade">
						<?php echo wp_kses_post( $ambrygen_content ); ?>
					</div>
				<?php endif; ?>



				<?php if ( $ambrygen_enable_counters && $ambrygen_counters ) : ?>
					<div class="is-style-gl-s24" aria-hidden="true"></div>
					<div class="ai-hero__counters" role="list">
						<?php foreach ( $ambrygen_counters as $ambrygen_counter ) : ?>
							<?php
							$ambrygen_number = isset( $ambrygen_counter['number'] ) ? (string) $ambrygen_counter['number'] : '';
							$ambrygen_label  = isset( $ambrygen_counter['label'] ) ? (string) $ambrygen_counter['label'] : '';
							$ambrygen_prefix = isset( $ambrygen_counter['prefix'] ) ? (string) $ambrygen_counter['prefix'] : '';
							$ambrygen_suffix = isset( $ambrygen_counter['suffix'] ) ? (string) $ambrygen_counter['suffix'] : '';

							if ( '' === $ambrygen_number && '' === $ambrygen_label ) {
								continue;
							}

							// Full accessible label: "100k+ Publications".
							$ambrygen_aria_label = trim( $ambrygen_prefix . $ambrygen_number . $ambrygen_suffix . ( $ambrygen_label ? ' ' . $ambrygen_label : '' ) );
							?>
							<div class="ai-hero__counters--counter-item js-gsap-fade" role="listitem">

								<?php if ( '' !== $ambrygen_number ) : ?>
									<div class="ai-hero__counters--counter-number heading-3 mb-0"
										aria-label="<?php echo esc_attr( $ambrygen_aria_label ); ?>">
										<div class="ai-hero__counters--count">
											<?php echo esc_html( $ambrygen_number ); ?>
											<?php if ( $ambrygen_suffix ) : ?>
												<?php echo esc_html( $ambrygen_suffix ); ?>
											<?php endif; ?>
										</div>
									</div>
								<?php endif; ?>

								<?php if ( $ambrygen_label ) : ?>
									<div class="ai-hero__counters--counter-title body1">
										<?php
										echo wp_kses_post( $ambrygen_label );
										?>
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
