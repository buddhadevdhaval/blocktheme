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
?>

<div class="our-team__card">

	<div class="our-team__image-wrapper">
		<?php
		echo Helper::image_with_placeholder(
			$ambrygen_image_id,
			'medium',
			array(
				'loading' => 'lazy',
				'class'   => 'our-team__image',
				'alt'     => esc_attr( $ambrygen_name ),
			)
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

</div>