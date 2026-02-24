<?php
/**
 * Gallery Item Block render.
 *
 * WCAG 2.1 AA compliant
 * No HTML structure changes
 *
 * @package Ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

if ( empty( $attributes['imageID'] ) ) {
	return;
}

$ambrygen_image_id  = isset( $attributes['imageID'] ) ? (int) $attributes['imageID'] : 0;
$ambrygen_title     = $attributes['title'] ?? '';
$ambrygen_heading   = $attributes['headingTag'] ?? 'h5';
$ambrygen_desc      = $attributes['description'] ?? '';

$ambrygen_link_array      = $attributes['link'] ?? '';
$ambrygen_link      = $ambrygen_link_array['url'] ?? '';
$ambrygen_link_text = $ambrygen_link_array['text'] ?? '';
$ambrygen_link_target = $ambrygen_link_array['target'] ?? '';
$ambrygen_link_target_attr = ! empty( $ambrygen_link_target )
			? ' target="' . esc_attr( $ambrygen_link_target ) . '" rel="noopener noreferrer"'
			: '';



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
		$ambrygen_wrapper_attrs['aria-label'] = esc_attr(
			$ambrygen_link_text ? $ambrygen_link_text : wp_strip_all_tags( $ambrygen_title )
		);
	}
	$ambrygen_wrapper_attrs['target'] =  esc_attr( $ambrygen_link_target );

}
?>
<<?php echo esc_html( $ambrygen_wrapper_tag ); ?>
	<?php foreach ( $ambrygen_wrapper_attrs as $ambrygen_attr => $ambrygen_value ) : ?>
		<?php echo esc_attr( $ambrygen_attr ); ?>="<?php echo esc_attr( $ambrygen_value ); ?>"
	<?php endforeach; ?>
>

	<?php if ( $ambrygen_image_id ) : ?>
		<div class="image-block">
			<?php
			/**
			 * WCAG 1.1.1: Always provide alt text
			 */
			echo Helper::image(
				$ambrygen_image_id,
				'medium_large',
				array(
					'class'   => 'card-image',
					'loading' => 'lazy',
					'alt'     => $ambrygen_title
						? wp_strip_all_tags( $ambrygen_title )
						: '',
				)
			);
			?>
		</div>
	<?php endif; ?>

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


		

		<?php if( ('variation-features' === $ambrygen_gallery_variation && $ambrygen_link) || ('image-content-grid' === $ambrygen_gallery_variation && $ambrygen_link) ) : ?>
			<div class="card-cta-wrapper">
				<a href="<?php echo esc_url( $ambrygen_link ); ?>" <?php echo $ambrygen_link_target_attr; ?>  class="site-btn is-style-site-text-btn has-icon">
					<?php echo esc_html( $ambrygen_link_text ? $ambrygen_link_text : $ambrygen_title ); ?>
				</a>
			</div>

		<?php elseif ( 'two-column' !== $ambrygen_gallery_variation && $ambrygen_link ) : ?>
			<div class="link_text">
				<a href="<?php echo esc_url( $ambrygen_link ); ?>" <?php echo $ambrygen_link_target_attr; ?>  class="link-btn">
					<?php echo esc_html( $ambrygen_link_text ? $ambrygen_link_text : $ambrygen_title ); ?>
				</a>
			</div>
		<?php endif; ?>
	</div>
</<?php echo esc_html( $ambrygen_wrapper_tag ); ?>>
