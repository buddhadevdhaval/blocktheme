<?php
/**
 * Render: Webinars Block
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_block_id = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';
$ambrygen_title    = $attributes['title'] ?? '';
$ambrygen_heading_tag = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array_filter(
		array(
			'class' => 'webinars webinars-static-list',
			'id'    => $ambrygen_block_id ?: null,
		)
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="webinars__content event-carousel">
		
		<?php if ( $ambrygen_title ) : ?>
			<div class="webinars__header">
				<<?php echo esc_html( $ambrygen_heading_tag ); ?> class="webinars__title heading-3 js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
			</div>
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
