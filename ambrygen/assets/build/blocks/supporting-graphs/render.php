<?php
/**
 * Render: Supporting Graphs Block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = $attributes ?? array();

$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_image_id    = isset( $ambrygen_attributes['imageId'] ) ? absint( $ambrygen_attributes['imageId'] ) : 0;
$ambrygen_image_url   = isset( $ambrygen_attributes['imageUrl'] ) ? esc_url_raw( $ambrygen_attributes['imageUrl'] ) : '';
$ambrygen_image_alt   = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';
$ambrygen_variation   = $ambrygen_attributes['variation'] ?? 'default';

$ambrygen_steps            = ! empty( $ambrygen_attributes['steps'] ) && is_array( $ambrygen_attributes['steps'] ) ? $ambrygen_attributes['steps'] : array();
$ambrygen_turnaround_label = $ambrygen_attributes['turnaroundLabel'] ?? '';
$ambrygen_turnaround_value = $ambrygen_attributes['turnaroundValue'] ?? '';
$ambrygen_steps_desc       = $ambrygen_attributes['turnaroundDescription'] ?? '';
$ambrygen_social_cards     = ! empty( $ambrygen_attributes['socialCards'] ) && is_array( $ambrygen_attributes['socialCards'] ) ? $ambrygen_attributes['socialCards'] : array();
$ambrygen_is_steps         = 'variation-style-steps' === $ambrygen_variation;

// Heading tag already validated via Helper::get_heading_tag() above.
$ambrygen_has_image    = $ambrygen_image_id || $ambrygen_image_url;
$ambrygen_has_content  = $ambrygen_heading || $ambrygen_description;

$ambrygen_steps = array_values(
	array_filter(
		$ambrygen_steps,
		static function ( $ambrygen_step ) {
			$ambrygen_step_icon_id = isset( $ambrygen_step['iconId'] ) ? absint( $ambrygen_step['iconId'] ) : 0;
			$ambrygen_step_label   = $ambrygen_step['label'] ?? '';

			return $ambrygen_step_icon_id || $ambrygen_step_label;
		}
	)
);

$ambrygen_social_cards = array_values(
	array_filter(
		$ambrygen_social_cards,
		static function ( $ambrygen_social_card ) {
			$ambrygen_card_title = $ambrygen_social_card['title'] ?? '';
			$ambrygen_card_value = $ambrygen_social_card['value'] ?? '';
			$ambrygen_card_unit  = $ambrygen_social_card['unit'] ?? '';

			return $ambrygen_card_title || $ambrygen_card_value || $ambrygen_card_unit;
		}
	)
);

$ambrygen_has_step_content = $ambrygen_turnaround_label || $ambrygen_turnaround_value || $ambrygen_steps_desc || ! empty( $ambrygen_social_cards );

$ambrygen_wrapper_attributes = array(
	'class' => $ambrygen_is_steps ? 'supporting-graphs variation-style-steps' : 'supporting-graphs',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes['id'] = $ambrygen_block_id;
}
?>

<div <?php echo wp_kses_post( get_block_wrapper_attributes( $ambrygen_wrapper_attributes ) ); ?>>
	<?php if ( $ambrygen_is_steps ) : ?>

		<?php if ( ! empty( $ambrygen_steps ) ) : ?>
			<div class="supporting-graphs__steps">
				<?php foreach ( $ambrygen_steps as $ambrygen_step ) : ?>
					<?php
					$ambrygen_step_icon_id = isset( $ambrygen_step['iconId'] ) ? absint( $ambrygen_step['iconId'] ) : 0;
					$ambrygen_step_label   = $ambrygen_step['label'] ?? '';
					$ambrygen_has_label    = '' !== trim( wp_strip_all_tags( $ambrygen_step_label ) );
					?>
					<div class="supporting-graphs__step-card">
						<?php if ( $ambrygen_step_icon_id ) : ?>
							<div class="supporting-graphs__step-icon">
								<?php
								echo wp_kses_post(
									Helper::image(
										$ambrygen_step_icon_id,
										'full',
										array(
											'alt'     => $ambrygen_has_label ? esc_attr( wp_strip_all_tags( $ambrygen_step_label ) ) : '',
											'loading' => 'lazy',
											'width'   => 100,
											'height'  => 100,
										)
									)
								);
								?>
							</div>
						<?php endif; ?>

						<?php if ( $ambrygen_step_label ) : ?>
							<div class="subtitle2-sbold supporting-graphs__step-label"><?php echo wp_kses_post( $ambrygen_step_label ); ?></div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_step_content ) : ?>
			<div class="supporting-graphs__content">
				<?php if ( $ambrygen_turnaround_label ) : ?>
					<div class="supporting-graphs__turnaround-label">
						<?php echo wp_kses_post( $ambrygen_turnaround_label ); ?>
					</div>
				<?php endif; ?>
				<?php if ( $ambrygen_turnaround_value ) : ?>
					<div class="supporting-graphs__turnaround-value">
						<?php echo wp_kses_post( $ambrygen_turnaround_value ); ?>
					</div>
				<?php endif; ?>
				<?php if ( $ambrygen_description ) : ?>
					<div class="subtitle1-regular supporting-graphs__description">
						<?php echo wp_kses_post( $ambrygen_description ); ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $ambrygen_social_cards ) ) : ?>
					<div class="social-cards">
						<?php foreach ( $ambrygen_social_cards as $ambrygen_social_card ) : ?>
							<?php
							$ambrygen_card_title = $ambrygen_social_card['title'] ?? '';
							$ambrygen_card_value = $ambrygen_social_card['value'] ?? '';
							$ambrygen_card_unit  = $ambrygen_social_card['unit'] ?? '';
							?>
							<div class="social-cards__item">
								<?php if ( $ambrygen_card_title ) : ?>
									<div class="social-cards__title subtitle1-sbold"><?php echo wp_kses_post( $ambrygen_card_title ); ?></div>
								<?php endif; ?>

								<?php if ( $ambrygen_card_value ) : ?>
									<div class="social-cards__value">
										<?php echo wp_kses_post( $ambrygen_card_value ); ?>
										<?php if ( $ambrygen_card_unit ) : ?>
											&nbsp;<span class="social-cards__unit"><?php echo esc_html( $ambrygen_card_unit ); ?></span>
										<?php endif; ?>
									</div>
								<?php endif; ?>
							</div>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

	<?php else : ?>

		<?php if ( $ambrygen_has_image ) : ?>
			<div class="supporting-graphs__chart-card">
				<div class="supporting-graphs__chart-image">
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
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_content ) : ?>
			<div class="supporting-graphs__content">
				<?php if ( $ambrygen_heading ) : ?>
					<<?php echo esc_attr( $ambrygen_heading_tag ); ?> class="heading-4 block-title mb-0 supporting-graphs__heading">
						<?php
						echo wp_kses(
							$ambrygen_heading,
							Helper::allowed_heading_html()
						);
						?>
					</<?php echo esc_attr( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php if ( $ambrygen_description ) : ?>
					<div class="is-style-gl-s24"></div>
					<div class="subtitle1-regular supporting-graphs__description">
						<?php echo wp_kses_post( $ambrygen_description ); ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

	<?php endif; ?>
</div>
