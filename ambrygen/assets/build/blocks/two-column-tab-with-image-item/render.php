<?php
/**
 * Render: Two Column Tab With Image Item Block
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

$ambrygen_section_title     = isset( $attributes['sectiontitle'] ) ? $attributes['sectiontitle'] : '';
$ambrygen_description       = isset( $attributes['description'] ) ? $attributes['description'] : '';
$ambrygen_image_url         = isset( $attributes['imageUrl'] ) ? $attributes['imageUrl'] : '';
$ambrygen_image_alt         = isset( $attributes['imageAlt'] ) ? $attributes['imageAlt'] : '';
$ambrygen_custom_step_label = isset( $attributes['customStepLabel'] ) ? $attributes['customStepLabel'] : '';
$ambrygen_cta               = isset( $attributes['cta'] ) && is_array( $attributes['cta'] ) ? $attributes['cta'] : array();
$ambrygen_cta_text          = isset( $ambrygen_cta['text'] ) ? $ambrygen_cta['text'] : '';
$ambrygen_cta_url           = isset( $ambrygen_cta['url'] ) ? $ambrygen_cta['url'] : '';
$ambrygen_cta_target        = isset( $ambrygen_cta['target'] ) ? $ambrygen_cta['target'] : '';
$ambrygen_cta_rel           = isset( $ambrygen_cta['rel'] ) ? $ambrygen_cta['rel'] : '';

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
				<?php echo wp_kses_post( html_entity_decode( $ambrygen_section_title ) ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_description ) ) : ?>
			<div class="body1-regular vertical-tabs__desc">
				<?php echo wp_kses_post( html_entity_decode($ambrygen_description )); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_cta_url ) ) : ?>
			<div class='is-style-gl-s20'></div>
			<a
				class="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up"
				href="<?php echo esc_url( $ambrygen_cta_url ); ?>"
				<?php echo ! empty( $ambrygen_cta_target ) ? 'target="' . esc_attr( $ambrygen_cta_target ) . '"' : ''; ?>
				<?php echo ! empty( $ambrygen_cta_rel ) ? 'rel="' . esc_attr( $ambrygen_cta_rel ) . '"' : ''; ?>
			>
				<?php echo esc_html( ! empty( $ambrygen_cta_text ) ? $ambrygen_cta_text : $ambrygen_cta_url ); ?>
			</a>
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
