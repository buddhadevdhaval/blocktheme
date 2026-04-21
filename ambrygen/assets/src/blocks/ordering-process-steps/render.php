<?php
/**
 * Render: Ordering Process Steps Block.
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

$ambrygen_attributes = is_array( $attributes ) ? $attributes : array();
$ambrygen_block_id   = isset( $ambrygen_attributes['blockId'] ) ? $ambrygen_attributes['blockId'] : '';


$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_heading     = isset( $ambrygen_attributes['headingText'] ) ? $ambrygen_attributes['headingText'] : '';
$ambrygen_subtitle    = isset( $ambrygen_attributes['subtitle'] ) ? $ambrygen_attributes['subtitle'] : '';
$ambrygen_steps       = isset( $ambrygen_attributes['steps'] ) && is_array( $ambrygen_attributes['steps'] ) ? $ambrygen_attributes['steps'] : array();




$ambrygen_has_heading  = '' !== trim( wp_strip_all_tags( $ambrygen_heading ) );
$ambrygen_has_subtitle = '' !== trim( wp_strip_all_tags( $ambrygen_subtitle ) );
$ambrygen_has_steps    = ! empty( array_filter( $ambrygen_steps, 'is_array' ) );
$ambrygen_heading_id   = $ambrygen_has_heading ? wp_unique_id( 'ordering-process-steps-heading-' ) : '';




$ambrygen_wrapper_args = array(
	'class' => 'block-layout ordering-process-steps',
	'id'    => $ambrygen_block_id,
);

if ( $ambrygen_heading_id ) {
	$ambrygen_wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );



?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns escaped, safe attributes. ?>>
	<div class="ordering-process-steps__header">
		<?php if ( $ambrygen_has_heading ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="heading-4 block-title mb-0">
				<?php
				echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() );
				?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_has_subtitle ) : ?>
			<?php if ( $ambrygen_has_heading ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>
			<p class="body1 ordering-process-steps__subtitle">
				<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
			</p>
		<?php endif; ?>
	</div>

	<?php if ( ( $ambrygen_has_heading || $ambrygen_has_subtitle ) && $ambrygen_has_steps ) : ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="ordering-process-steps__steps" role="list">
		<?php foreach ( $ambrygen_steps as $ambrygen_step ) : ?>
			<?php
			if ( ! is_array( $ambrygen_step ) ) {
				continue;
			}

			$ambrygen_step_number = isset( $ambrygen_step['stepNumber'] ) ? $ambrygen_step['stepNumber'] : '';
			$ambrygen_step_title  = isset( $ambrygen_step['title'] ) ? $ambrygen_step['title'] : '';
			$ambrygen_step_desc   = isset( $ambrygen_step['description'] ) ? $ambrygen_step['description'] : '';
			$ambrygen_icon_id     = isset( $ambrygen_step['iconId'] ) ? absint( $ambrygen_step['iconId'] ) : 0;
			$ambrygen_icon_url    = isset( $ambrygen_step['iconUrl'] ) ? $ambrygen_step['iconUrl'] : '';
			$ambrygen_icon_alt    = isset( $ambrygen_step['iconAlt'] ) ? $ambrygen_step['iconAlt'] : '';



			?>
			<div class="ordering-process-steps__step" role="listitem">
				<div class="ordering-process-steps__step-icon">
					<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
						<?php

						// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
						echo Helper::image_from_source(
							$ambrygen_icon_id,
							$ambrygen_icon_url,
							'full',
							array(
								'alt'     => $ambrygen_icon_alt,
								'loading' => 'lazy',
							)
						);
						// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped

						?>
					<?php endif; ?>
					</div>			
				<div class="ordering-process-steps__step-content">
					<div class="body2-semibold ordering-process-steps__step-number">
						<?php echo esc_html( $ambrygen_step_number ); ?>
					</div>
					<div class="subtitle2-sbold ordering-process-steps__step-title mb-0">
						<?php echo wp_kses_post( $ambrygen_step_title ); ?>
					</div>
					<div class="body1 ordering-process-steps__step-desc">
						<?php echo wp_kses_post( $ambrygen_step_desc ); ?>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</div>
