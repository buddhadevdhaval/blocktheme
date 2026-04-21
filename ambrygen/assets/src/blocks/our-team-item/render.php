<?php
/**
 * Render: Our Team Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Theme_Options;

$ambrygen_post_id = isset( $attributes['postId'] )
	? absint( $attributes['postId'] )
	: 0;

if ( ! $ambrygen_post_id ) {
	return;
}

$ambrygen_post = get_post( $ambrygen_post_id );

if ( ! $ambrygen_post || 'publish' !== $ambrygen_post->post_status ) {
	return;
}

$ambrygen_name        = get_the_title( $ambrygen_post_id );
$ambrygen_designation = get_post_meta( $ambrygen_post_id, 'designation', true );
$ambrygen_image_id    = get_post_thumbnail_id( $ambrygen_post_id );
$ambrygen_bio         = apply_filters( 'the_content', $ambrygen_post->post_content );
$ambrygen_display_id  = $ambrygen_image_id
	? $ambrygen_image_id
	: Theme_Options::get_placeholder_image_id();
$ambrygen_image_url   = wp_get_attachment_image_url( $ambrygen_display_id, 'medium' );
$ambrygen_image_url   = $ambrygen_image_url ? $ambrygen_image_url : '';
?>

<div
	class="our-team__card js-gsap-fade"
	data-team-name="<?php echo esc_attr( $ambrygen_name ); ?>"
	data-team-designation="<?php echo esc_attr( $ambrygen_designation ); ?>"
	data-team-image="<?php echo esc_url( $ambrygen_image_url ); ?>"
	role="button"
	tabindex="0"
	aria-haspopup="dialog"
	aria-label="<?php /* translators: %s: Team member name. */ echo esc_attr( sprintf( __( 'View details for %s', 'ambrygen-web' ), $ambrygen_name ) ); ?>"
>

	<div class="our-team__image-wrapper">
		<?php
		echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper escapes attributes and returns sanitized image HTML.
			$ambrygen_image_id,
			'',
			'medium',
			array(
				'loading' => 'lazy',
				'class'   => 'our-team__image',
				'alt'     => esc_attr( $ambrygen_name ),
			),
			true
		);
		?>
	</div>

	<div class="our-team__info">

		<div class="our-team__name subtitle1-sbold">
			<?php echo esc_html( $ambrygen_name ); ?>
			<span
				class="our-team__link"
				aria-hidden="true"
			></span>
		</div>

		<?php if ( ! empty( $ambrygen_designation ) ) : ?>
			<div class="our-team__role body1">
				<?php echo esc_html( $ambrygen_designation ); ?>
			</div>
		<?php endif; ?>

	</div>

	<template class="our-team__bio-template">
		<?php echo wp_kses_post( $ambrygen_bio ); ?>
	</template>

</div>
