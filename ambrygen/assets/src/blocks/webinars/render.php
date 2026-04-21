<?php
/**
 * Render: Webinars Block
 */

defined( 'ABSPATH' ) || exit;

$ambrygen_title    = $attributes['title'] ?? '';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'webinars-static-list',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="webinars__content event-carousel">
		
		<?php if ( $ambrygen_title ) : ?>
			<h2 class="heading-3 block-title mb-0"><?php echo esc_html( $ambrygen_title ); ?></h2>
			<div class="is-style-gl-s50" aria-hidden="true"></div>
		<?php endif; ?>

		<div class="wp-block-query">
			<div class="event-carousel__grid webinar__grid wp-block-post-template">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pre-escaped inner blocks content.
				echo $content;
				?>
			</div>			
		</div>
	</div>
</div>
