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

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : [];

$ambrygen_image        = $ambrygen_attributes['image'] ?? '';
$ambrygen_image_alt    = trim( $ambrygen_attributes['imageAlt'] ?? '' );
$ambrygen_image_srcset = $ambrygen_attributes['imageSrcSet'] ?? '';
$ambrygen_image_sizes  = $ambrygen_attributes['imageSizes'] ?? '';

$ambrygen_title       = $ambrygen_attributes['title'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';

$ambrygen_link_array   = $ambrygen_attributes['link'] ?? [];

$ambrygen_link_text   = $ambrygen_link_array['text'] ?? __( 'Learn more', 'ambrygen-web' );
$ambrygen_link_url    = $ambrygen_link_array['url'] ?? '';
$ambrygen_link_target = $ambrygen_link_array['target'] ?? '';

$ambrygen_type = $ambrygen_attributes['type'] ?? 'small';

$ambrygen_button_target_attr = '';
$ambrygen_new_tab_text = '';

if ( ! empty( $ambrygen_link_target ) ) {
	$ambrygen_button_target_attr = ' target="' . esc_attr( $ambrygen_link_target ) . '" rel="noopener noreferrer"';
	if ( '_blank' === $ambrygen_link_target ) {
		$ambrygen_new_tab_text = '<span class="screen-reader-text">' . esc_html__( '(opens in a new tab)', 'ambrygen-web' ) . '</span>';
	}
}

/**
 * Validate card type.
 */
$ambrygen_type = in_array( $ambrygen_type, [ 'small', 'main' ], true )
	? $ambrygen_type
	: 'small';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'genetic-cards__card genetic-cards__card--' . $ambrygen_type,
	]
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
<?php
$ambrygen_image_id = absint( $ambrygen_attributes['imageId'] ?? 0 );

// Resolve alt text properly
$ambrygen_resolved_alt = trim( $ambrygen_image_alt );

if ( ! $ambrygen_resolved_alt && $ambrygen_image_id ) {
	$ambrygen_resolved_alt = get_post_meta(
		$ambrygen_image_id,
		'_wp_attachment_image_alt',
		true
	);

	// Final fallback to attachment title
	if ( ! $ambrygen_resolved_alt ) {
		$ambrygen_resolved_alt = get_the_title( $ambrygen_image_id );
	}
}
?>
	<div class="genetic-cards__image-wrapper genetic-cards__image-wrapper--<?php echo esc_attr( $ambrygen_type ); ?>">
		<?php
				echo Helper::image_with_placeholder(
					$ambrygen_image_id,
					'large',
					array(
						'loading' => 'lazy',
						'alt'     => $ambrygen_resolved_alt,
					)
				);
	
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
						aria-label="<?php echo esc_attr( $ambrygen_link_text . ' – ' . wp_strip_all_tags( html_entity_decode( $ambrygen_title, ENT_QUOTES, 'UTF-8' ) ) ); ?>"
					<?php endif; ?>
					<?php echo $ambrygen_button_target_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				>
					<?php echo esc_html( $ambrygen_link_text ); ?>
					<?php echo $ambrygen_new_tab_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>
		<?php endif; ?>

	</div>
</div>
