<?php
/**
 * Render: Our Team Slider Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : array();
$ambrygen_post_id    = isset( $ambrygen_attributes['postId'] ) ? (int) $ambrygen_attributes['postId'] : 0;

if ( 0 === $ambrygen_post_id ) {
	return;
}

$ambrygen_post = get_post( $ambrygen_post_id );

if ( ! $ambrygen_post || 'publish' !== $ambrygen_post->post_status ) {
	return;
}

$ambrygen_image_id    = get_post_thumbnail_id( $ambrygen_post_id );
$ambrygen_title       = get_the_title( $ambrygen_post_id );
$ambrygen_designation = get_post_meta( $ambrygen_post_id, 'designation', true );
$ambrygen_bio         = apply_filters( 'the_content', $ambrygen_post->post_content );
$ambrygen_image_url   = '';

if ( $ambrygen_image_id ) {
	$ambrygen_image_src = wp_get_attachment_image_src( $ambrygen_image_id, 'medium' );
	if ( $ambrygen_image_src ) {
		$ambrygen_image_url = $ambrygen_image_src[0];
	}
}

?>

<div class="swiper-slide">
	<div
		class="our-leadership__card js-gsap-fade"
		data-team-name="<?php echo esc_attr( $ambrygen_title ); ?>"
		data-team-designation="<?php echo esc_attr( $ambrygen_designation ); ?>"
		data-team-image="<?php echo esc_url( $ambrygen_image_url ); ?>"
		role="button"
		tabindex="0"
		aria-haspopup="dialog"
	>

		<div class="our-leadership__image-wrapper">
			<?php
			echo Helper::image_with_placeholder(
				$ambrygen_image_id,
				'medium',
				array(
					'loading' => 'lazy',
					'class'   => 'our-leadership__image',
					'alt'     => esc_attr( $ambrygen_title ),
				)
			);
			?>
		</div>

		<div class="our-leadership__info">

			<div class="our-leadership__name subtitle1-sbold">
				<?php echo esc_html( $ambrygen_title ); ?>
				<div class="our-leadership__link" aria-hidden="true">
				
				</div>
			</div>

			<?php if ( ! empty( $ambrygen_designation ) ) : ?>
				<span class="our-leadership__role subtitle2">
					<?php echo esc_html( $ambrygen_designation ); ?>
				</span>
			<?php endif; ?>

		</div>

		<template class="our-team__bio-template">
			<?php echo wp_kses_post( $ambrygen_bio ); ?>
		</template>
	</div>
</div>
