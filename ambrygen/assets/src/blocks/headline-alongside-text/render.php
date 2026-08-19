<?php
/**
 * Render: heading Content Section Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = $attributes ?? array();

$ambrygen_block_id             = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_headline             = $ambrygen_attributes['headline'] ?? ( $ambrygen_attributes['title'] ?? '' );
$ambrygen_headline_tag         = Helper::get_heading_tag( $ambrygen_attributes['headlineTag'] ?? ( $ambrygen_attributes['titleTag'] ?? 'h2' ), 'h2' );
$ambrygen_description          = $ambrygen_attributes['description'] ?? '';
$ambrygen_is_medium            = $ambrygen_attributes['isMediumText'] ?? false;
$ambrygen_background_image_id  = isset( $ambrygen_attributes['backgroundImageId'] ) ? absint( $ambrygen_attributes['backgroundImageId'] ) : 0;
$ambrygen_background_image_url = isset( $ambrygen_attributes['backgroundImage'] ) ? esc_url_raw( $ambrygen_attributes['backgroundImage'] ) : '';
$ambrygen_background_image_alt = isset( $ambrygen_attributes['backgroundImageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['backgroundImageAlt'] ) : '';
$ambrygen_headline_id          = ! empty( $ambrygen_headline ) ? wp_unique_id( 'headline-alongside-text-heading-' ) : '';

$ambrygen_wrapper_attributes_array = array(
	'class' => 'heading-content-section block-layout wp-block-ambrygen-split-content-section' . ( $ambrygen_is_medium ? ' variation-medium-text' : '' ),
	'role'  => 'region',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

if ( $ambrygen_headline_id ) {
	$ambrygen_wrapper_attributes_array['aria-labelledby'] = $ambrygen_headline_id;
} else {
	$ambrygen_wrapper_attributes_array['aria-label'] = esc_attr__( 'Headline alongside text', 'ambrygen-web' );
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );

$ambrygen_richtext_allowed = array(
	'span'   => array(
		'class'              => true,
		'data-tooltip'       => true,
		'data-tooltip-title' => true,
	),
	'div'    => array(
		'class' => true,
	),
	'mark'   => array(
		'class' => true,
		'style' => true,
	),
	'br'     => array(),
	'strong' => array(),
	'em'     => array(),
	'a'      => array(
		'href'   => true,
		'title'  => true,
		'target' => true,
		'rel'    => true,
		'class'  => true,
	),
);
?>

<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>
	<?php if ( $ambrygen_background_image_id || $ambrygen_background_image_url ) : ?>
		<div class="block-bg-image">
			<?php
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns sanitized image markup.
			echo Helper::image_from_source(
				$ambrygen_background_image_id,
				$ambrygen_background_image_url,
				'medium',
				array(
					'alt' => $ambrygen_background_image_alt,
				)
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
	<?php endif; ?>
	<div class="heading-content-section__inner block__rowflex is-horizontal">
		<?php if ( ! empty( $ambrygen_headline ) ) : ?>
			<div class="block__rowflex--col-left">
			<<?php echo esc_attr( $ambrygen_headline_tag ); ?> id="<?php echo esc_attr( $ambrygen_headline_id ); ?>" class="heading-content-section__title heading-3 block-title mb-0
				block__rowflex--heading-title js-gsap-fade">
				<?php
				echo wp_kses( $ambrygen_headline, $ambrygen_richtext_allowed );
				?>
			</<?php echo esc_attr( $ambrygen_headline_tag ); ?>>
			</div>
		<?php endif; ?>

		<div class="heading-content-wrapper block__rowflex--block-content js-gsap-fade block-description">
			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<div
					class="heading-content-section__description block__rowflex--block-content">
					<?php echo wp_kses( $ambrygen_description, $ambrygen_richtext_allowed ); ?>
				</div>
			<?php endif; ?>

			<?php if ( trim( $content ) ) : ?>

				<div class="heading-content-section__content">
					<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
