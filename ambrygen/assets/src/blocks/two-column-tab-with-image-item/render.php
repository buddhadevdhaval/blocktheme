<?php
/**
 * Render: Two Column Tab With Image Item Block
 *
 * @param array $attributes The block attributes.
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
$ambrygen_show_full_image    = isset( $attributes['showFullImage'] ) ? (bool) $attributes['showFullImage'] : false;

$ambrygen_normalize_link_attributes = static function ( $ambrygen_link ) {
	$ambrygen_target = isset( $ambrygen_link['target'] ) ? (string) $ambrygen_link['target'] : '';
	$ambrygen_rel    = isset( $ambrygen_link['rel'] ) ? (string) $ambrygen_link['rel'] : '';
	$ambrygen_parts  = $ambrygen_rel
		? array_filter( array_unique( explode( ' ', $ambrygen_rel ) ) )
		: array();

	if ( '_blank' === $ambrygen_target ) {
		$ambrygen_parts = array_unique(
			array_merge( $ambrygen_parts, array( 'noopener', 'noreferrer' ) )
		);
	}

	return array(
		$ambrygen_target,
		implode( ' ', $ambrygen_parts ),
	);
};

list( $ambrygen_cta_target, $ambrygen_cta_rel ) = $ambrygen_normalize_link_attributes( $ambrygen_cta );
?>

<div class="vertical-tabs__item<?php echo $ambrygen_show_full_image ? ' show-full-image' : ''; ?>">

	<div class="vertical-tabs__header">

		<?php if ( ! empty( $ambrygen_custom_step_label ) ) : ?>
		<div class="caption-semi-bold vertical-tabs__step-label js-gsap-fade">
			<?php echo esc_html( $ambrygen_custom_step_label ); ?>
		</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_section_title ) ) : ?>
			<div class="subtitle1-sbold vertical-tabs__title js-gsap-fade">
				<?php echo wp_kses_post( html_entity_decode( $ambrygen_section_title ) ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_description ) ) : ?>
			<div class="body1-regular vertical-tabs__desc js-gsap-fade">
				<?php echo wp_kses_post( html_entity_decode( $ambrygen_description ) ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_cta_url ) ) : ?>
			<div class='is-style-gl-s20'></div>
			<a
				class="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up js-gsap-fade"
				href="<?php echo esc_url( $ambrygen_cta_url ); ?>"
				<?php echo ! empty( $ambrygen_cta_target ) ? 'target="' . esc_attr( $ambrygen_cta_target ) . '"' : ''; ?>
				<?php echo ! empty( $ambrygen_cta_rel ) ? 'rel="' . esc_attr( $ambrygen_cta_rel ) . '"' : ''; ?>
			>
				<?php echo esc_html( ! empty( $ambrygen_cta_text ) ? $ambrygen_cta_text : $ambrygen_cta_url ); ?>
				<?php if ( '_blank' === $ambrygen_cta_target ) : ?>
					<span class="screen-reader-text">
						<?php esc_html_e( '(opens in new tab)', 'ambrygen-web' ); ?>
					</span>
				<?php endif; ?>
			</a>
		<?php endif; ?>

	</div>

	<?php if ( ! empty( $ambrygen_image_url ) ) : ?>
		<div class="vertical-tabs__content">
			<div class="vertical-tabs__image-wrapper js-gsap-fade">
				<img
					class="vertical-tabs__image"
					src="<?php echo esc_url( $ambrygen_image_url ); ?>"
					alt="<?php echo esc_attr( $ambrygen_image_alt ); ?>"
				/>
			</div>
		</div>
	<?php endif; ?>

</div>
