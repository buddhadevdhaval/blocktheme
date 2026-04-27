<?php
/**
 * Render: Steps Image Alongside Text Item Block
 *
 * @param array $attributes The block attributes.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes        = is_array( $attributes ) ? $attributes : array();
$ambrygen_step_title        = isset( $ambrygen_attributes['stepTitle'] ) && '' !== $ambrygen_attributes['stepTitle'] ? $ambrygen_attributes['stepTitle'] : ( $ambrygen_attributes['sectiontitle'] ?? '' );
$ambrygen_description       = isset( $ambrygen_attributes['description'] ) ? $ambrygen_attributes['description'] : '';
$ambrygen_image_id          = isset( $ambrygen_attributes['imageId'] ) ? absint( $ambrygen_attributes['imageId'] ) : 0;
$ambrygen_image_url         = isset( $ambrygen_attributes['imageUrl'] ) ? esc_url_raw( $ambrygen_attributes['imageUrl'] ) : '';
$ambrygen_image_alt         = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';
$ambrygen_step_label        = isset( $ambrygen_attributes['stepLabel'] ) && '' !== $ambrygen_attributes['stepLabel'] ? $ambrygen_attributes['stepLabel'] : ( $ambrygen_attributes['customStepLabel'] ?? '' );
$ambrygen_cta               = isset( $ambrygen_attributes['cta'] ) && is_array( $ambrygen_attributes['cta'] ) ? $ambrygen_attributes['cta'] : array();
$ambrygen_cta_text          = isset( $ambrygen_cta['text'] ) ? sanitize_text_field( $ambrygen_cta['text'] ) : '';
$ambrygen_cta_url           = isset( $ambrygen_cta['url'] ) ? esc_url_raw( $ambrygen_cta['url'] ) : '';
$ambrygen_show_full_image   = isset( $ambrygen_attributes['showFullImage'] ) ? (bool) $ambrygen_attributes['showFullImage'] : false;
$ambrygen_has_step_label    = '' !== trim( wp_strip_all_tags( $ambrygen_step_label ) );
$ambrygen_has_step_title    = '' !== trim( wp_strip_all_tags( $ambrygen_step_title ) );
$ambrygen_has_description   = '' !== trim( wp_strip_all_tags( $ambrygen_description ) );

$ambrygen_normalize_link_attributes = static function ( $ambrygen_link ) {
	$ambrygen_target = isset( $ambrygen_link['target'] ) && '_blank' === $ambrygen_link['target'] ? '_blank' : '';
	$ambrygen_rel    = isset( $ambrygen_link['rel'] ) ? sanitize_text_field( (string) $ambrygen_link['rel'] ) : '';
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

		<?php if ( $ambrygen_has_step_label ) : ?>
		<div class="caption-semi-bold vertical-tabs__step-label js-gsap-fade">
			<?php echo esc_html( $ambrygen_step_label ); ?>
		</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_step_title ) : ?>
			<div class="subtitle1-sbold vertical-tabs__title js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_step_title ); ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_description ) : ?>
			<div class="body1-regular vertical-tabs__desc js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_cta_url ) ) : ?>
			<div class="is-style-gl-s20" aria-hidden="true"></div>
			<a
				class="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow js-gsap-fade"
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

	<div class="vertical-tabs__content">
		<div class="vertical-tabs__image-wrapper js-gsap-fade">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
			echo Helper::image_from_source(
				$ambrygen_image_id,
				$ambrygen_image_url,
				'full',
				array(
					'class'    => 'vertical-tabs__image',
					'alt'      => $ambrygen_image_alt,
					'loading'  => 'lazy',
					'decoding' => 'async',
				),
				true
			);
			?>
		</div>
	</div>

</div>
