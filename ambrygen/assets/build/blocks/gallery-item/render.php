<?php
/**
 * Render: Gallery Item Block
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


$ambrygen_image_id  = isset( $attributes['imageID'] ) ? (int) $attributes['imageID'] : 0;
$ambrygen_title     = $attributes['title'] ?? '';
$ambrygen_heading   = $attributes['headingTag'] ?? 'h5';
$ambrygen_desc      = $attributes['description'] ?? '';

$ambrygen_link_array      = $attributes['link'] ?? '';
$ambrygen_link      = $ambrygen_link_array['url'] ?? '';
$ambrygen_link_text = $ambrygen_link_array['text'] ?? '';
$ambrygen_link_target = $ambrygen_link_array['target'] ?? '';
$ambrygen_link_target_attr = '';
$ambrygen_new_tab_text = '';

if ( ! empty( $ambrygen_link_target ) ) {
	$ambrygen_link_target_attr = ' target="' . esc_attr( $ambrygen_link_target ) . '" rel="noopener noreferrer"';
	if ( '_blank' === $ambrygen_link_target ) {
		$ambrygen_new_tab_text = '<span class="screen-reader-text">' . esc_html__( '(opens in a new tab)', 'ambrygen' ) . '</span>';
	}
}

$ambrygen_gallery_variation = $block->context['ambrygen/galleryVariation'] ?? 'two-column';

/**
 * WCAG 1.3.1: Validate heading tag
 */
$ambrygen_allowed_heading_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_heading     = in_array( $ambrygen_heading, $ambrygen_allowed_heading_tags, true )
	? $ambrygen_heading
	: 'h5';

/**
 * WCAG: Prevent empty headings
 */
if ( empty( trim( wp_strip_all_tags( $ambrygen_title ) ) ) ) {
	$ambrygen_title = '';
}

/**
 * Wrapper tag logic (unchanged)
 */
$ambrygen_wrapper_tag = ( 'two-column' === $ambrygen_gallery_variation && ! empty( $ambrygen_link ) )
	? 'a'
	: 'div';

/**
 * Wrapper attributes
 */
$ambrygen_wrapper_attrs = array(
	'class' => 'card-col',
);

/**
 * WCAG 2.4.4: Accessible link name for wrapper anchor
 */
if ( 'a' === $ambrygen_wrapper_tag ) {
	$ambrygen_wrapper_attrs['href'] = esc_url( $ambrygen_link );

	if ( $ambrygen_link_text || $ambrygen_title ) {
		$accessible_name = $ambrygen_link_text ? $ambrygen_link_text . ' ' . wp_strip_all_tags( $ambrygen_title ) : wp_strip_all_tags( $ambrygen_title );
		$ambrygen_wrapper_attrs['aria-label'] = esc_attr( trim( $accessible_name ) );
	}
	$ambrygen_wrapper_attrs['target'] =  esc_attr( $ambrygen_link_target );

}
?>
<<?php echo esc_html( $ambrygen_wrapper_tag ); ?>
	<?php foreach ( $ambrygen_wrapper_attrs as $ambrygen_attr => $ambrygen_value ) : ?>
		<?php echo esc_attr( $ambrygen_attr ); ?>="<?php echo esc_attr( $ambrygen_value ); ?>"
	<?php endforeach; ?>
>

		<div class="image-block">
			<?php
			/**
			 * WCAG 1.1.1: Always provide alt text
			 */
			echo Helper::image_with_placeholder(
				$ambrygen_image_id,
				'full',
				array(
					'class'   => 'card-image',
					'loading' => 'lazy',
				)
			);
			?>
		</div>

	<div class="card-info">
		<?php if ( $ambrygen_title ) : ?>
			<<?php echo esc_html( $ambrygen_heading ); ?> class="link-btn mb-0  heading-5">
				<?php
						echo wp_kses(
								$ambrygen_title,
								Helper::allowed_heading_html()
							);
					 ?>
			</<?php echo esc_html( $ambrygen_heading ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_desc ) : ?>
			<div class="card-description <?php echo ( 'variation-features' === $ambrygen_gallery_variation || 'image-content-grid' === $ambrygen_gallery_variation ) ? 'body2-reg' : 'text-small'; ?> ">
				<?php echo wp_kses_post( $ambrygen_desc ); ?>
			</div>
		<?php endif; ?>




		<?php if( ('variation-features' === $ambrygen_gallery_variation && $ambrygen_link) || ('image-content-grid' === $ambrygen_gallery_variation && $ambrygen_link) ) :
			$cta_aria_label = $ambrygen_link_text ? $ambrygen_link_text . ' ' . wp_strip_all_tags( $ambrygen_title ) : wp_strip_all_tags( $ambrygen_title );
			?>
			<div class="card-cta-wrapper">
				<a href="<?php echo esc_url( $ambrygen_link ); ?>" <?php echo $ambrygen_link_target_attr; ?> aria-label="<?php echo esc_attr( trim( $cta_aria_label ) ); ?>" class="site-btn is-style-site-text-btn has-icon">
					<?php echo esc_html( $ambrygen_link_text ? $ambrygen_link_text : $ambrygen_title ); ?>
					<?php echo $ambrygen_new_tab_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>

		<?php elseif ( 'two-column' !== $ambrygen_gallery_variation && $ambrygen_link ) :
			$cta_aria_label = $ambrygen_link_text ? $ambrygen_link_text . ' ' . wp_strip_all_tags( $ambrygen_title ) : wp_strip_all_tags( $ambrygen_title );
			?>
			<div class="link_text">
				<a href="<?php echo esc_url( $ambrygen_link ); ?>" <?php echo $ambrygen_link_target_attr; ?> aria-label="<?php echo esc_attr( trim( $cta_aria_label ) ); ?>" class="link-btn">
					<?php echo esc_html( $ambrygen_link_text ? $ambrygen_link_text : $ambrygen_title ); ?>
					<?php echo $ambrygen_new_tab_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>
		<?php endif; ?>
	</div>
</<?php echo esc_html( $ambrygen_wrapper_tag ); ?>>
