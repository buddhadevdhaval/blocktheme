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

$ambrygen_block_id = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_counters = isset( $ambrygen_attributes['counters'] ) && is_array( $ambrygen_attributes['counters'] )
	? $ambrygen_attributes['counters']
	: array();

$ambrygen_valid_counters = array();

foreach ( $ambrygen_counters as $ambrygen_counter ) {
	if ( ! is_array( $ambrygen_counter ) ) {
		continue;
	}

	$ambrygen_prefix      = isset( $ambrygen_counter['prefix'] ) ? (string) $ambrygen_counter['prefix'] : '';
	$ambrygen_number      = isset( $ambrygen_counter['number'] ) ? (string) $ambrygen_counter['number'] : '';
	$ambrygen_postfix     = isset( $ambrygen_counter['postfix'] ) ? (string) $ambrygen_counter['postfix'] : ( isset( $ambrygen_counter['suffix'] ) ? (string) $ambrygen_counter['suffix'] : '' );
	$ambrygen_label       = isset( $ambrygen_counter['label'] ) ? (string) $ambrygen_counter['label'] : ( isset( $ambrygen_counter['title'] ) ? (string) $ambrygen_counter['title'] : '' );
	$ambrygen_description = isset( $ambrygen_counter['description'] ) ? (string) $ambrygen_counter['description'] : '';

	if ( '' === $ambrygen_number && '' === $ambrygen_label && '' === $ambrygen_description ) {
		continue;
	}

	$ambrygen_valid_counters[] = array(
		'prefix'      => $ambrygen_prefix,
		'number'      => $ambrygen_number,
		'postfix'     => $ambrygen_postfix,
		'label'       => $ambrygen_label,
		'description' => $ambrygen_description,
	);
}

if ( empty( $ambrygen_valid_counters ) ) {
	return;
}

$ambrygen_section_label = $ambrygen_block_id
	? $ambrygen_block_id . '-label'
	: wp_unique_id( 'counter-block-label-' );

$ambrygen_wrapper_args = array(
	'class'           => 'counter-block',
	'role'            => 'region',
	'aria-labelledby' => $ambrygen_section_label,
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<h2 id="<?php echo esc_attr( $ambrygen_section_label ); ?>" class="screen-reader-text">
		<?php esc_html_e( 'Counter statistics', 'ambrygen-web' ); ?>
	</h2>

	<div class="stats-counter" role="list">
		<?php foreach ( $ambrygen_valid_counters as $ambrygen_counter ) : ?>
			<?php
			$ambrygen_prefix      = $ambrygen_counter['prefix'];
			$ambrygen_number      = $ambrygen_counter['number'];
			$ambrygen_postfix     = $ambrygen_counter['postfix'];
			$ambrygen_label       = $ambrygen_counter['label'];
			$ambrygen_description = $ambrygen_counter['description'];
			$ambrygen_aria_label = trim(
				$ambrygen_prefix .
				$ambrygen_number .
				$ambrygen_postfix .
				( $ambrygen_label ? ' ' . wp_strip_all_tags( $ambrygen_label ) : '' )
			);
			?>
			<div class="stats-counter__item js-gsap-fade" role="listitem">
				<?php if ( '' !== $ambrygen_prefix || '' !== $ambrygen_number || '' !== $ambrygen_postfix ) : ?>
					<div
						class="stats-counter__number heading-3 mb-0"
						aria-label="<?php echo esc_attr( $ambrygen_aria_label ); ?>"
					>
						<?php
						if ( '' !== $ambrygen_prefix ) {
							echo '<span class="stats-counter__number-prefix">' . esc_html( $ambrygen_prefix ) . '</span>';
						}
						
						$ambrygen_clean_number = preg_replace( '/[^0-9]/', '', $ambrygen_number );
						echo '<span class="stats-counter__number-value">' . esc_html( $ambrygen_clean_number ? number_format( (int) $ambrygen_clean_number ) : '0' ) . '</span>';
						
						if ( '' !== $ambrygen_postfix ) {
							echo '<span class="stats-counter__number-suffix">' . esc_html( $ambrygen_postfix ) . '</span>';
						}
						?>
					</div>
				<?php endif; ?>

				<?php if ( '' !== $ambrygen_label ) : ?>
					<div class="stats-counter__label subtitle1-sbold">
						<?php echo wp_kses_post( $ambrygen_label ); ?>
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
</div>
