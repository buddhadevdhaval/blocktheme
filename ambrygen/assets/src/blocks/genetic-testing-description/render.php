<?php
/**
 * Genetic Testing Description Block Template.
 *
 * @var array $attributes Block attributes.
 * @var string $content Block content.
 * @var WP_Block $block Block instance.
 */

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined( 'ABSPATH' ) || exit;

try {
	$post_id = 0;

	if ( ! empty( $attributes['previewPostId'] ) ) {
		$post_id = (int) $attributes['previewPostId'];
	}

	if ( ! $post_id && isset( $block ) && isset( $block->context['postId'] ) ) {
		$post_id = (int) $block->context['postId'];
	}

	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	$block_id           = $attributes['blockId'] ?? '';
	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'id'    => $block_id,
			'class' => 'genetic-testing-description-section',
		)
	);

	echo '<div ' . $wrapper_attributes . '>';
	echo BlockRenderService::instance()->render_genetic_testing_description( $post_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo '</div>';
} catch ( Exception $e ) {
	echo '<!-- Error: ' . $e->getMessage() . ' -->';
}
