<?php
/**
 * Render: CTA Tiles Item Block
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

$ambrygen_image_id            = isset( $attributes['imageID'] ) ? absint( $attributes['imageID'] ) : 0;
$ambrygen_image_url           = isset( $attributes['imageUrl'] ) ? esc_url_raw( $attributes['imageUrl'] ) : '';
$ambrygen_image_alt           = isset( $attributes['imageAlt'] ) ? sanitize_text_field( $attributes['imageAlt'] ) : '';
$ambrygen_title               = $attributes['title'] ?? '';
$ambrygen_heading_tag_default = isset( $block->block_type->attributes['headingTag']['default'] ) ? $block->block_type->attributes['headingTag']['default'] : 'h5';
$ambrygen_heading_tag         = $attributes['headingTag'] ?? $ambrygen_heading_tag_default;
$ambrygen_desc                = $attributes['description'] ?? '';

$ambrygen_link_array   = isset( $attributes['link'] ) && is_array( $attributes['link'] ) ? $attributes['link'] : array();
$ambrygen_link         = isset( $ambrygen_link_array['url'] ) ? esc_url_raw( $ambrygen_link_array['url'] ) : '';
$ambrygen_link_text    = isset( $ambrygen_link_array['text'] ) ? sanitize_text_field( $ambrygen_link_array['text'] ) : '';
$ambrygen_link_target  = isset( $ambrygen_link_array['target'] ) ? sanitize_text_field( $ambrygen_link_array['target'] ) : '';
$ambrygen_link_rel     = isset( $ambrygen_link_array['rel'] ) ? sanitize_text_field( $ambrygen_link_array['rel'] ) : '';
$ambrygen_new_tab_text = '';

if ( '_blank' !== $ambrygen_link_target ) {
	$ambrygen_link_target = '';
}

if ( ! empty( $ambrygen_link_target ) ) {
	if ( '_blank' === $ambrygen_link_target ) {
		$ambrygen_link_rel_parts = preg_split( '/\s+/', trim( $ambrygen_link_rel ) );
		$ambrygen_link_rel_parts = array_filter( is_array( $ambrygen_link_rel_parts ) ? $ambrygen_link_rel_parts : array() );
		$ambrygen_link_rel_parts = array_unique( array_merge( $ambrygen_link_rel_parts, array( 'noopener', 'noreferrer' ) ) );
		$ambrygen_link_rel       = implode( ' ', $ambrygen_link_rel_parts );
		$ambrygen_new_tab_text   = '<span class="screen-reader-text">' . esc_html__( '(opens in a new tab)', 'ambrygen-web' ) . '</span>';
	}
}

$ambrygen_cta_tiles_variation     = $block->context['ambrygen/ctaTilesVariation'] ?? 'image-only-title';
$ambrygen_cta_tiles_variation_map = array(
	'default'            => 'image-only-title',
	'image-content-grid' => 'image-title-description-icon',
	'variation-features' => 'image-title-description',
);
$ambrygen_cta_tiles_variation     = $ambrygen_cta_tiles_variation_map[ $ambrygen_cta_tiles_variation ] ?? $ambrygen_cta_tiles_variation;

$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_heading_tag, $ambrygen_heading_tag_default );

/**
 * WCAG: Prevent empty headings
 */
if ( empty( trim( wp_strip_all_tags( $ambrygen_title ) ) ) ) {
	$ambrygen_title = '';
}

$ambrygen_link_label = $ambrygen_link_text ? $ambrygen_link_text : wp_strip_all_tags( $ambrygen_title );
if ( ! $ambrygen_link_label ) {
	$ambrygen_link_label = __( 'Learn more', 'ambrygen-web' );
}

/**
 * Wrapper tag logic (unchanged)
 */
$ambrygen_wrapper_tag = ( 'image-only-title' === $ambrygen_cta_tiles_variation && ! empty( $ambrygen_link ) )
	? 'a'
	: 'div';

/**
 * Wrapper attributes
 */
$ambrygen_wrapper_attrs = array(
	'class' => 'card-col js-gsap-fade',
);

/**
 * WCAG 2.4.4: Accessible link name for wrapper anchor
 */
if ( 'a' === $ambrygen_wrapper_tag ) {
	$ambrygen_wrapper_attrs['href'] = $ambrygen_link;

	$accessible_name                      = $ambrygen_link_text && $ambrygen_title ? $ambrygen_link_text . ' ' . wp_strip_all_tags( $ambrygen_title ) : $ambrygen_link_label;
	$ambrygen_wrapper_attrs['aria-label'] = trim( $accessible_name );

	if ( $ambrygen_link_target ) {
		$ambrygen_wrapper_attrs['target'] = $ambrygen_link_target;
	}

	if ( $ambrygen_link_rel ) {
		$ambrygen_wrapper_attrs['rel'] = $ambrygen_link_rel;
	}
}
?>
<<?php echo tag_escape( $ambrygen_wrapper_tag ); ?>
	<?php foreach ( $ambrygen_wrapper_attrs as $ambrygen_attr => $ambrygen_value ) : ?>
		<?php if ( 'href' === $ambrygen_attr ) : ?>
			<?php echo esc_attr( $ambrygen_attr ); ?>="<?php echo esc_url( $ambrygen_value ); ?>"
		<?php else : ?>
			<?php echo esc_attr( $ambrygen_attr ); ?>="<?php echo esc_attr( $ambrygen_value ); ?>"
		<?php endif; ?>
	<?php endforeach; ?>
>

		<div class="image-block">
			<?php
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
			echo Helper::image_from_source(
				$ambrygen_image_id,
				$ambrygen_image_url,
				'full',
				array(
					'class'   => 'card-image',
					'loading' => 'lazy',
					'alt'     => $ambrygen_image_alt,
				),
				true
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>

	<div class="card-info">
		<?php if ( $ambrygen_title ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="link-btn mb-0  heading-5">
				<?php
						echo wp_kses(
							$ambrygen_title,
							Helper::allowed_heading_html()
						);
				?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_desc ) : ?>
			<div class="card-description <?php echo ( 'image-title-description' === $ambrygen_cta_tiles_variation || 'image-title-description-icon' === $ambrygen_cta_tiles_variation ) ? 'body2-reg' : 'text-small'; ?> ">
				<?php echo wp_kses_post( $ambrygen_desc ); ?>
			</div>
		<?php endif; ?>




		<?php
		if ( ( 'image-title-description' === $ambrygen_cta_tiles_variation && $ambrygen_link ) || ( 'image-title-description-icon' === $ambrygen_cta_tiles_variation && $ambrygen_link ) ) :
			$cta_aria_label = $ambrygen_link_text && $ambrygen_title ? $ambrygen_link_text . ' ' . wp_strip_all_tags( $ambrygen_title ) : $ambrygen_link_label;
			?>
			<?php if ( $ambrygen_desc ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>
			<div class="card-cta-wrapper">
				<a
					href="<?php echo esc_url( $ambrygen_link ); ?>"
					<?php if ( $ambrygen_link_target ) : ?>
						target="<?php echo esc_attr( $ambrygen_link_target ); ?>"
					<?php endif; ?>
					<?php if ( $ambrygen_link_rel ) : ?>
						rel="<?php echo esc_attr( $ambrygen_link_rel ); ?>"
					<?php endif; ?>
					aria-label="<?php echo esc_attr( trim( $cta_aria_label ) ); ?>"
					class="site-btn is-style-site-text-btn has-right-arrow"
				>
					<?php echo esc_html( $ambrygen_link_label ); ?>
					<?php echo $ambrygen_new_tab_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>

			<?php
		elseif ( 'image-only-title' !== $ambrygen_cta_tiles_variation && $ambrygen_link ) :
			$cta_aria_label = $ambrygen_link_text && $ambrygen_title ? $ambrygen_link_text . ' ' . wp_strip_all_tags( $ambrygen_title ) : $ambrygen_link_label;
			?>
			<div class="link_text">
				<a
					href="<?php echo esc_url( $ambrygen_link ); ?>"
					<?php if ( $ambrygen_link_target ) : ?>
						target="<?php echo esc_attr( $ambrygen_link_target ); ?>"
					<?php endif; ?>
					<?php if ( $ambrygen_link_rel ) : ?>
						rel="<?php echo esc_attr( $ambrygen_link_rel ); ?>"
					<?php endif; ?>
					aria-label="<?php echo esc_attr( trim( $cta_aria_label ) ); ?>"
					class="link-btn"
				>
					<?php echo esc_html( $ambrygen_link_label ); ?>
					<?php echo $ambrygen_new_tab_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>
		<?php endif; ?>
	</div>
</<?php echo tag_escape( $ambrygen_wrapper_tag ); ?>>
