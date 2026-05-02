<?php
/**
 * Render: Webinar Item
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

$ambrygen_post_id = isset( $attributes['postId'] ) ? absint( $attributes['postId'] ) : 0;

if ( ! $ambrygen_post_id ) {
	return;
}

$ambrygen_post = get_post( $ambrygen_post_id );
if ( ! $ambrygen_post || 'publish' !== $ambrygen_post->post_status ) {
	return;
}

$ambrygen_classes = implode( ' ', get_post_class( '', $ambrygen_post_id ) );

?>
<div class="wp-block-post <?php echo esc_attr( $ambrygen_classes ); ?>">
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pre-escaped content from service.
	echo BlockRenderService::instance()->render_webinar_grid_card( (int) $ambrygen_post_id );
	?>
</div>
