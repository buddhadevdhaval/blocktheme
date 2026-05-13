<?php
/**
 * Render: Supporting Steps Block
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

$ambrygen_anchor      = isset( $ambrygen_attributes['anchor'] )
	? sanitize_html_class( $ambrygen_attributes['anchor'] )
	: '';
$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';
$ambrygen_variation   = isset( $ambrygen_attributes['variation'] ) ? sanitize_key( $ambrygen_attributes['variation'] ) : 'text-view';
$ambrygen_variation   = in_array( $ambrygen_variation, array( 'text-view', 'stats-view' ), true ) ? $ambrygen_variation : 'text-view';
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_heading2    = $ambrygen_attributes['heading2'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';

$ambrygen_steps = ! empty( $ambrygen_attributes['steps'] ) && is_array( $ambrygen_attributes['steps'] ) ? $ambrygen_attributes['steps'] : array();
$ambrygen_stats = ! empty( $ambrygen_attributes['stats'] ) && is_array( $ambrygen_attributes['stats'] ) ? $ambrygen_attributes['stats'] : array();

$ambrygen_is_stats_view = 'stats-view' === $ambrygen_variation;

$ambrygen_steps = array_values(
	array_filter(
		$ambrygen_steps,
		static function ( $ambrygen_step ) {
			$ambrygen_step_icon_id = isset( $ambrygen_step['iconId'] ) ? absint( $ambrygen_step['iconId'] ) : 0;
			$ambrygen_step_icon_url = isset( $ambrygen_step['iconUrl'] ) ? (string) $ambrygen_step['iconUrl'] : '';
			$ambrygen_step_label   = $ambrygen_step['label'] ?? '';

			return $ambrygen_step_icon_id || $ambrygen_step_icon_url || $ambrygen_step_label;
		}
	)
);

$ambrygen_stats = array_values(
	array_filter(
		$ambrygen_stats,
		static function ( $ambrygen_stat ) {
			$ambrygen_stat_label   = $ambrygen_stat['label'] ?? '';
			$ambrygen_stat_value   = $ambrygen_stat['stats'] ?? '';
			$ambrygen_stat_postfix = $ambrygen_stat['postfix'] ?? '';

			return $ambrygen_stat_label || $ambrygen_stat_value || $ambrygen_stat_postfix;
		}
	)
);

$ambrygen_steps = array_slice( $ambrygen_steps, 0, 3 );
$ambrygen_stats = array_slice( $ambrygen_stats, 0, 2 );

$ambrygen_has_text_content  = $ambrygen_heading || $ambrygen_heading2 || $ambrygen_description;
$ambrygen_has_stats_content = $ambrygen_heading || $ambrygen_heading2 || ! empty( $ambrygen_stats );

if ( empty( $ambrygen_steps ) && ( $ambrygen_is_stats_view ? ! $ambrygen_has_stats_content : ! $ambrygen_has_text_content ) ) {
	return;
}

$ambrygen_wrapper_args = array(
	'class' => $ambrygen_is_stats_view ? 'supporting-steps variation-stats-view' : 'supporting-steps',
);

if ( $ambrygen_anchor ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_anchor;
} elseif ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<?php if ( ! empty( $ambrygen_steps ) ) : ?>
		<div class="supporting-steps__steps">
			<?php foreach ( $ambrygen_steps as $ambrygen_step ) : ?>
				<?php
				$ambrygen_step_icon_id = isset( $ambrygen_step['iconId'] ) ? absint( $ambrygen_step['iconId'] ) : 0;
				$ambrygen_step_icon_url = isset( $ambrygen_step['iconUrl'] ) ? (string) $ambrygen_step['iconUrl'] : '';
				$ambrygen_step_icon_alt = isset( $ambrygen_step['iconAlt'] ) ? sanitize_text_field( $ambrygen_step['iconAlt'] ) : '';
				$ambrygen_step_label   = $ambrygen_step['label'] ?? '';
				?>
				<div class="supporting-steps__step-card">
					<?php if ( $ambrygen_step_icon_id || $ambrygen_step_icon_url ) : ?>
						<div class="supporting-steps__step-icon">
							<?php
							// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
							echo Helper::image_from_source(
								$ambrygen_step_icon_id,
								$ambrygen_step_icon_url,
								'full',
								array(
									'alt'     => $ambrygen_step_icon_alt,
									'loading' => 'lazy',
									'width'   => 100,
									'height'  => 100,
								)
							);
							// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
							?>
						</div>
					<?php endif; ?>

					<?php if ( $ambrygen_step_label ) : ?>
						<div class="subtitle2-sbold supporting-steps__step-label"><?php echo wp_kses_post( $ambrygen_step_label ); ?></div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_is_stats_view ) : ?>

		<?php if ( $ambrygen_has_stats_content ) : ?>
			<div class="supporting-steps__content">
				<?php if ( $ambrygen_heading ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="supporting-steps__turnaround-label">
						<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php if ( $ambrygen_heading2 ) : ?>
					<div class="supporting-steps__turnaround-value">
						<?php echo wp_kses_post( $ambrygen_heading2 ); ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $ambrygen_stats ) ) : ?>
					<div class="supporting-steps__stats">
						<?php foreach ( $ambrygen_stats as $ambrygen_stat ) : ?>
							<?php
							$ambrygen_stat_label   = $ambrygen_stat['label'] ?? '';
							$ambrygen_stat_value   = $ambrygen_stat['stats'] ?? '';
							$ambrygen_stat_postfix = $ambrygen_stat['postfix'] ?? '';
							?>
							<div class="supporting-steps__stats-item">
								<?php if ( $ambrygen_stat_label ) : ?>
									<div class="supporting-steps__stats-label subtitle1-sbold"><?php echo wp_kses_post( $ambrygen_stat_label ); ?></div>
								<?php endif; ?>

								<?php if ( $ambrygen_stat_value ) : ?>
									<div class="supporting-steps__stats-value">
										<?php echo wp_kses_post( $ambrygen_stat_value ); ?>
										<?php if ( $ambrygen_stat_postfix ) : ?>
											<span class="supporting-steps__stats-postfix"><?php echo wp_kses_post( $ambrygen_stat_postfix ); ?></span>
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

		<?php if ( $ambrygen_has_text_content ) : ?>
			<div class="supporting-steps__content">
				<?php if ( $ambrygen_heading ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="supporting-steps__turnaround-label">
						<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php if ( $ambrygen_heading2 ) : ?>
					<div class="supporting-steps__turnaround-value">
						<?php echo wp_kses_post( $ambrygen_heading2 ); ?>
					</div>
				<?php endif; ?>

				<?php if ( $ambrygen_description ) : ?>
					<div class="subtitle1-regular supporting-steps__description block-description">
						<?php echo wp_kses_post( $ambrygen_description ); ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

	<?php endif; ?>
</div>
