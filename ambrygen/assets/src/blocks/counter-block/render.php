<?php
/**
 * Render: Counter Block
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

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id = isset( $ambrygen_attributes['blockId'] ) ? $ambrygen_attributes['blockId'] : '';
$ambrygen_counters = isset( $ambrygen_attributes['counters'] ) && is_array( $ambrygen_attributes['counters'] )
	? $ambrygen_attributes['counters']
	: array();

$ambrygen_variation = isset( $ambrygen_attributes['variation'] ) ? $ambrygen_attributes['variation'] : 'variation-1';

$ambrygen_section_label = wp_unique_id( 'counter-block-label-' );

$ambrygen_wrapper_attributes_array = array(
	'class'           => 'counter-block',
	'aria-labelledby' => $ambrygen_section_label,
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<h2 id="<?php echo esc_attr( $ambrygen_section_label ); ?>" class="screen-reader-text">
		<?php esc_html_e( 'Counter statistics', 'ambrygen-web' ); ?>
	</h2>

<?php if ( 'variation-2' === $ambrygen_variation ) : ?>
	<div class="intro__stats-wrapper" role="list">
		<?php foreach ( $ambrygen_counters as $ambrygen_counter ) : ?>
			<?php
			if ( ! is_array( $ambrygen_counter ) ) {
				continue;
			}

			$ambrygen_number      = isset( $ambrygen_counter['number'] ) ? (string) $ambrygen_counter['number'] : '';
			$ambrygen_number_sm   = isset( $ambrygen_counter['numberSm'] ) ? (string) $ambrygen_counter['numberSm'] : '';
			$ambrygen_number_lg2  = isset( $ambrygen_counter['numberLg2'] ) ? (string) $ambrygen_counter['numberLg2'] : '';
			$ambrygen_suffix      = isset( $ambrygen_counter['suffix'] ) ? (string) $ambrygen_counter['suffix'] : '';
			$ambrygen_title       = isset( $ambrygen_counter['title'] ) ? (string) $ambrygen_counter['title'] : '';
			$ambrygen_description = isset( $ambrygen_counter['description'] ) ? (string) $ambrygen_counter['description'] : '';

			if ( '' === $ambrygen_number && '' === $ambrygen_title && '' === $ambrygen_description ) {
				continue;
			}
			?>
			<div class="intro__stat js-gsap-fade" role="listitem">
				<div class="intro__stat-value">
					<?php if ( '' !== $ambrygen_title ) : ?>
						<div class="intro__stat-value-lg"><?php echo wp_kses_post( $ambrygen_title ); ?></div>
					<?php endif; ?>
				</div>
				<?php if ( '' !== $ambrygen_description ) : ?>
					<div class="intro__stat-desc"><?php echo wp_kses_post( $ambrygen_description ); ?></div>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
<?php else : ?>
	<div class="stats-counter" role="list">
		<?php foreach ( $ambrygen_counters as $ambrygen_counter ) : ?>
			<?php
			if ( ! is_array( $ambrygen_counter ) ) {
				continue;
			}

			$ambrygen_number      = isset( $ambrygen_counter['number'] ) ? (string) $ambrygen_counter['number'] : '';
			$ambrygen_suffix      = isset( $ambrygen_counter['suffix'] ) ? (string) $ambrygen_counter['suffix'] : '';
			$ambrygen_title       = isset( $ambrygen_counter['title'] ) ? (string) $ambrygen_counter['title'] : '';
			$ambrygen_description = isset( $ambrygen_counter['description'] ) ? (string) $ambrygen_counter['description'] : '';

			if ( '' === $ambrygen_number && '' === $ambrygen_title && '' === $ambrygen_description ) {
				continue;
			}

			$ambrygen_aria_label = trim(
				$ambrygen_number .
				$ambrygen_suffix .
				( $ambrygen_title ? ' ' . wp_strip_all_tags( $ambrygen_title ) : '' )
			);
			?>
			<div class="stats-counter__item js-gsap-fade" role="listitem">
				<?php if ( '' !== $ambrygen_number || '' !== $ambrygen_suffix ) : ?>
					<div
						class="stats-counter__number heading-3 mb-0"
						aria-label="<?php echo esc_attr( $ambrygen_aria_label ); ?>"
					>
						<?php echo esc_html( $ambrygen_number . $ambrygen_suffix ); ?>
					</div>
				<?php endif; ?>

				<?php if ( '' !== $ambrygen_title ) : ?>
					<div class="stats-counter__label subtitle1-sbold">
						<?php echo wp_kses_post( $ambrygen_title ); ?>
					</div>
				<?php endif; ?>

				<?php if ( '' !== $ambrygen_description ) : ?>
					<div class="is-style-gl-s8" aria-hidden="true"></div>
					<div class="stats-counter__description">
						<?php echo wp_kses_post( $ambrygen_description ); ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
<?php endif; ?>
</div>
