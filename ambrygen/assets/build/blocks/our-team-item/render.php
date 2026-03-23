<?php
/**
 * Our Team Item block render template.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render: Our Team Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
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
$ambrygen_bio         = apply_filters( 'the_content', $ambrygen_post->post_content );
$ambrygen_image_url   = '';

if ( $ambrygen_image_id ) {
	$ambrygen_image_src = wp_get_attachment_image_src( $ambrygen_image_id, 'medium' );
	if ( $ambrygen_image_src ) {
		$ambrygen_image_url = $ambrygen_image_src[0];
	}
}

/* translators: %s: Team member name. */
$ambrygen_aria_label = sprintf( __( 'View details for %s', 'ambrygen-web' ), $ambrygen_name );
?>

<div
	class="our-team__card"
	data-team-name="<?php echo esc_attr( $ambrygen_name ); ?>"
	data-team-designation="<?php echo esc_attr( $ambrygen_designation ); ?>"
	data-team-image="<?php echo esc_url( $ambrygen_image_url ); ?>"
	data-team-bio="<?php echo esc_attr( $ambrygen_bio ); ?>"
	aria-label="<?php echo esc_attr( $ambrygen_aria_label ); ?>"
>

	<div class="our-team__image-wrapper">
		<?php
		echo wp_kses_post(
			Helper::image_with_placeholder(
				$ambrygen_image_id,
				'medium',
				array(

					'class' => 'our-team__image',
				)
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
