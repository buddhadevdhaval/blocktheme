<?php
defined( 'ABSPATH' ) || exit;
$post_id = get_the_ID();
if ( ! $post_id ) {
	return;
}
$content = get_post_meta( $post_id, 'pr_description', true );
if ( empty( trim( $content ) ) ) {
	return;
}
echo '<div class="event-details__intro-text subtitle1-reg">' . wpautop( wp_kses_post( $content ) ) . '</div>';
