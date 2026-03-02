<?php
/**
 * Our Team Block Template.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes = isset( $attributes ) && is_array( $attributes )
	? $attributes
	: array();

$ambrygen_title         = isset( $ambrygen_attributes['title'] )
	? $ambrygen_attributes['title']
	: '';

$ambrygen_intro         = isset( $ambrygen_attributes['intro'] )
	? $ambrygen_attributes['intro']
	: '';

$ambrygen_heading_level = isset( $ambrygen_attributes['headingLevel'] )
	? sanitize_key( $ambrygen_attributes['headingLevel'] )
	: 'h2';

$ambrygen_allowed_headings = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );

if ( ! in_array( $ambrygen_heading_level, $ambrygen_allowed_headings, true ) ) {
	$ambrygen_heading_level = 'h2';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'our-team',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( ! empty( $ambrygen_title ) ) : ?>

		<div class="our-team__header block__rowflex">

			<<?php echo esc_html( $ambrygen_heading_level ); ?> class="our-team__title block__rowflex--heading-title heading-3 mb-0">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</<?php echo esc_html( $ambrygen_heading_level ); ?>>

			<?php if ( ! empty( $ambrygen_intro ) ) : ?>
				<div class="our-team__intro block__rowflex--block-content subtitle1">
					<?php echo esc_html( $ambrygen_intro ); ?>
				</div>
			<?php endif; ?>

		</div>

		<div class="is-style-gl-s50" aria-hidden="true"></div>

	<?php endif; ?>

	<div class="our-team__grid">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is block-rendered content.
		echo $content;
		?>
	</div>

</div>