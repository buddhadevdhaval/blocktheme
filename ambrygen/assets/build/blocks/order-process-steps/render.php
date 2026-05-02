<?php
/**
 * Render: Order Process Steps Block.
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
$ambrygen_block_id   = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_heading     = isset( $ambrygen_attributes['headingText'] ) ? $ambrygen_attributes['headingText'] : '';
$ambrygen_subtitle    = isset( $ambrygen_attributes['subtitle'] ) ? $ambrygen_attributes['subtitle'] : '';
$ambrygen_steps       = isset( $ambrygen_attributes['steps'] ) && is_array( $ambrygen_attributes['steps'] ) ? $ambrygen_attributes['steps'] : array();
$ambrygen_steps       = array_values(
	array_filter(
		$ambrygen_steps,
		static function ( $ambrygen_step ) {
			if ( ! is_array( $ambrygen_step ) ) {
				return false;
			}

			$ambrygen_step_title = isset( $ambrygen_step['title'] ) ? $ambrygen_step['title'] : '';
			$ambrygen_step_desc  = isset( $ambrygen_step['description'] ) ? $ambrygen_step['description'] : '';
			$ambrygen_icon_id    = isset( $ambrygen_step['iconId'] ) ? absint( $ambrygen_step['iconId'] ) : 0;
			$ambrygen_icon_url   = isset( $ambrygen_step['iconUrl'] ) ? esc_url_raw( $ambrygen_step['iconUrl'] ) : '';

			return '' !== trim( wp_strip_all_tags( $ambrygen_step_title ) )
				|| '' !== trim( wp_strip_all_tags( $ambrygen_step_desc ) )
				|| $ambrygen_icon_id
				|| $ambrygen_icon_url;
		}
	)
);
$ambrygen_has_heading  = '' !== trim( wp_strip_all_tags( $ambrygen_heading ) );
$ambrygen_has_subtitle = '' !== trim( wp_strip_all_tags( $ambrygen_subtitle ) );
$ambrygen_has_steps    = ! empty( $ambrygen_steps );
$ambrygen_heading_id   = $ambrygen_has_heading ? wp_unique_id( 'order-process-steps-heading-' ) : '';
$ambrygen_wrapper_args = array(
	'class' => 'block-layout order-process-steps',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

if ( $ambrygen_heading_id ) {
	$ambrygen_wrapper_args['role']            = 'region';
	$ambrygen_wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="order-process-steps__header">
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
			<p class="body1 order-process-steps__subtitle">
				<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
			</p>
		<?php endif; ?>
	</div>

	<?php if ( ( $ambrygen_has_heading || $ambrygen_has_subtitle ) && $ambrygen_has_steps ) : ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<?php if ( $ambrygen_has_steps ) : ?>
		<div class="order-process-steps__steps" role="list">
			<?php foreach ( $ambrygen_steps as $ambrygen_step_index => $ambrygen_step ) : ?>
				<?php
				$ambrygen_step_number = sprintf( esc_html__( 'STEP %d', 'ambrygen-web' ), (int) $ambrygen_step_index + 1 );
				$ambrygen_step_title  = isset( $ambrygen_step['title'] ) ? $ambrygen_step['title'] : '';
				$ambrygen_step_desc   = isset( $ambrygen_step['description'] ) ? $ambrygen_step['description'] : '';
				$ambrygen_icon_id     = isset( $ambrygen_step['iconId'] ) ? absint( $ambrygen_step['iconId'] ) : 0;
				$ambrygen_icon_url    = isset( $ambrygen_step['iconUrl'] ) ? esc_url_raw( $ambrygen_step['iconUrl'] ) : '';
				$ambrygen_icon_alt    = isset( $ambrygen_step['iconAlt'] ) ? sanitize_text_field( $ambrygen_step['iconAlt'] ) : '';
				$ambrygen_has_title   = '' !== trim( wp_strip_all_tags( $ambrygen_step_title ) );
				$ambrygen_has_desc    = '' !== trim( wp_strip_all_tags( $ambrygen_step_desc ) );
				?>
				<div class="order-process-steps__step" role="listitem">
					<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
						<div class="order-process-steps__step-icon">
							<?php
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
							echo Helper::image_from_source(
								$ambrygen_icon_id,
								$ambrygen_icon_url,
								'full',
								array(
									'alt'      => $ambrygen_icon_alt,
									'loading'  => 'lazy',
									'decoding' => 'async',
								)
							);
							?>
						</div>
					<?php endif; ?>
					<div class="order-process-steps__step-content">
						<div class="body2-semibold order-process-steps__step-number">
							<?php echo esc_html( $ambrygen_step_number ); ?>
						</div>
						<?php if ( $ambrygen_has_title ) : ?>
							<div class="subtitle2-sbold order-process-steps__step-title mb-0">
								<?php echo wp_kses_post( $ambrygen_step_title ); ?>
							</div>
						<?php endif; ?>
						<?php if ( $ambrygen_has_desc ) : ?>
							<div class="body1 order-process-steps__step-desc">
								<?php echo wp_kses_post( $ambrygen_step_desc ); ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
