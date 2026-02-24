<?php
/**
 * Render template for the Genetic Testing Card block.
 *
 * @package Ambrygen
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

$ambrygen_link_array   = $ambrygen_attributes['link'];

$ambrygen_link_text   = $ambrygen_link_array['text'] ?? __( 'Learn more', 'ambrygen-web' );
$ambrygen_link_url    = $ambrygen_link_array['url'] ?? '';
$ambrygen_link_target    = $ambrygen_link_array['target'] ?? '';

$ambrygen_type        = $ambrygen_attributes['type'] ?? 'small';
$ambrygen_button_target_attr = ! empty( $ambrygen_link_target ) ? ' target="' . esc_attr( $ambrygen_link_target ) . '" rel="noopener noreferrer"': '';

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
			<div
				class="genetic-cards__title heading-6 mb-0 card-title"
				role="heading"
				aria-level="3"
			>
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s8"></div>

		<?php if ( $ambrygen_description ) : ?>
			<div class="genetic-cards__description body1">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s20"></div>

		<?php if ( $ambrygen_link_text ) : ?>
			<div class="genetic-cards__link">
				<a
					href="<?php echo esc_url( $ambrygen_link_url ); ?>"
					class="site-btn is-style-site-text-btn has-icon"
					<?php if ( $ambrygen_title ) : ?>
						aria-label="<?php echo esc_attr( $ambrygen_link_text . ' – ' . wp_strip_all_tags( $ambrygen_title ) ); ?>"
					<?php endif; ?>
					<?php echo $ambrygen_button_target_attr; ?>
				>
					<?php echo esc_html( $ambrygen_link_text ); ?>
				</a>
			</div>
		<?php endif; ?>

	</div>
</div>
