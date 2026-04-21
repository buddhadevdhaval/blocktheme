<?php
/**
 * Render: Genetic Testing Card Block
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
use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_title       = $ambrygen_attributes['title'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';

$ambrygen_link_array = $ambrygen_attributes['link'] ?? array();
$ambrygen_link_array = is_array( $ambrygen_link_array ) ? $ambrygen_link_array : array();

$ambrygen_link_text   = ! empty( $ambrygen_link_array['text'] ) ? $ambrygen_link_array['text'] : __( 'Learn more', 'ambrygen-web' );
$ambrygen_link_url    = $ambrygen_link_array['url'] ?? '';
$ambrygen_link_target = $ambrygen_link_array['target'] ?? '';

$ambrygen_type = $ambrygen_attributes['type'] ?? 'small';

$ambrygen_link_rel = $ambrygen_link_array['rel'] ?? '';

// Build rel: start from editor-saved value, then layer in security tokens.
$ambrygen_rel_parts = $ambrygen_link_rel
	? array_filter( array_unique( explode( ' ', $ambrygen_link_rel ) ) )
	: array();

$ambrygen_new_tab_text = '';

if ( '_blank' === $ambrygen_link_target ) {
	// noopener + noreferrer are only meaningful for new-tab links.
	$ambrygen_rel_parts    = array_unique( array_merge( $ambrygen_rel_parts, array( 'noopener', 'noreferrer' ) ) );
	$ambrygen_new_tab_text = '<span class="screen-reader-text">' . esc_html__( '(opens in a new tab)', 'ambrygen-web' ) . '</span>';
}

/**
 * Validate card type.
 */
$ambrygen_type = in_array( $ambrygen_type, array( 'small', 'main' ), true )
	? $ambrygen_type
	: 'small';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'js-gsap-fade genetic-cards__card genetic-cards__card--' . $ambrygen_type,
		'role'  => 'listitem',
	)
);
$ambrygen_image_id           = absint( $ambrygen_attributes['imageId'] ?? 0 );
$ambrygen_image_url          = $ambrygen_attributes['image'] ?? '';
$ambrygen_image_alt          = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_image_attrs        = array(
	'alt'      => $ambrygen_image_alt,
	'loading'  => 'lazy',
	'decoding' => 'async',
);

?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<div class="genetic-cards__image-wrapper genetic-cards__image-wrapper--<?php echo esc_attr( $ambrygen_type ); ?>">
		<?php
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
		echo Helper::image_from_source(
			$ambrygen_image_id,
			$ambrygen_image_url,
			'large',
			$ambrygen_image_attrs,
			true
		);
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>


	<?php
	$ambrygen_content_class = 'genetic-cards__content';
	if ( 'main' === $ambrygen_type ) {
		$ambrygen_content_class .= ' genetic-cards__content--main';
	}
	?>

	<div class="<?php echo esc_attr( $ambrygen_content_class ); ?>">

		<?php if ( $ambrygen_title ) : ?>
			<h3 class="genetic-cards__title heading-6 mb-0 card-title">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</h3>
		<?php endif; ?>

		<?php if ( $ambrygen_description ) : ?>
			<div class="is-style-gl-s8" aria-hidden="true"></div>
			<div class="genetic-cards__description body1">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_link_url ) : ?>
			<div class="is-style-gl-s20" aria-hidden="true"></div>
			<div class="genetic-cards__link">
				<a
					href="<?php echo esc_url( $ambrygen_link_url ); ?>"
					class="site-btn is-style-site-text-btn has-icon"
					<?php if ( $ambrygen_title ) : ?>
						aria-label="<?php echo esc_attr( $ambrygen_link_text . ' - ' . wp_strip_all_tags( html_entity_decode( $ambrygen_title, ENT_QUOTES, 'UTF-8' ) ) ); ?>"
					<?php endif; ?>
					<?php if ( $ambrygen_link_target ) : ?>
						target="<?php echo esc_attr( $ambrygen_link_target ); ?>"
					<?php endif; ?>
					<?php if ( $ambrygen_rel_parts ) : ?>
						rel="<?php echo esc_attr( implode( ' ', $ambrygen_rel_parts ) ); ?>"
					<?php endif; ?>
				>
					<?php echo esc_html( $ambrygen_link_text ); ?>
					<?php echo $ambrygen_new_tab_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>
		<?php endif; ?>

	</div>
</div>
