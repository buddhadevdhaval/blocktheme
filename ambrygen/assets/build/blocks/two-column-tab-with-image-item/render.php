<?php
/**
 * Vertical Tabs Item Template.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ambrygen_section_title     = isset( $attributes['sectiontitle'] ) ? $attributes['sectiontitle'] : '';
$ambrygen_description       = isset( $attributes['description'] ) ? $attributes['description'] : '';
$ambrygen_image_url         = isset( $attributes['imageUrl'] ) ? $attributes['imageUrl'] : '';
$ambrygen_image_alt         = isset( $attributes['imageAlt'] ) ? $attributes['imageAlt'] : '';
$ambrygen_custom_step_label = isset( $attributes['customStepLabel'] ) ? $attributes['customStepLabel'] : '';

?>

<div class="vertical-tabs__item">

	<div class="vertical-tabs__header">

		<?php if ( ! empty( $ambrygen_custom_step_label ) ) : ?>
		<div class="caption-semi-bold vertical-tabs__step-label">
			<?php echo esc_html( $ambrygen_custom_step_label ); ?>
		</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_section_title ) ) : ?>
			<div class="subtitle1-sbold vertical-tabs__title">
				<?php echo esc_html( $ambrygen_section_title ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_description ) ) : ?>
			<div class="body1-regular vertical-tabs__desc">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

	</div>

	<?php if ( ! empty( $ambrygen_image_url ) ) : ?>
		<div class="vertical-tabs__content">
			<div class="vertical-tabs__image-wrapper">
				<img
					class="vertical-tabs__image"
					src="<?php echo esc_url( $ambrygen_image_url ); ?>"
					alt="<?php echo esc_attr( $ambrygen_image_alt ); ?>"
				/>
			</div>
		</div>
	<?php endif; ?>

</div>