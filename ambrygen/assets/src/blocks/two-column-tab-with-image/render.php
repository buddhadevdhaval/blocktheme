<?php
/**
 * Vertical Tabs Block Template.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
use Ambrygen\Theme\Core\Helper;

$ambrygen_heading     = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$ambrygen_description = isset( $attributes['description'] ) ? $attributes['description'] : '';
$ambrygen_heading_tag = isset( $attributes['headingTag'] ) ? $attributes['headingTag'] : 'h2';
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'vertical-tabs-block order-testing-block',
	)
);
?>

<section <?php echo wp_kses_data( $ambrygen_wrapper_attributes ); ?>>

	<div class="vertical-tabs-block__header block__rowflex">

		<?php if ( ! empty( $ambrygen_heading ) ) : ?>
			<<?php echo esc_html( $ambrygen_heading_tag ); ?>
				class="heading-3 block-title mb-0 block__rowflex--heading-title">
				<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
			</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_description ) ) : ?>
			<div class="block__rowflex--block-content subtitle-1-regular">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

	</div>

	<div class="is-style-gl-s50" aria-hidden="true"></div>

	<div class="vertical-tabs">
		<?php echo wp_kses_post( $content ); ?>
	</div>

</section>