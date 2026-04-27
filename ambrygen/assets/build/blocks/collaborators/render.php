<?php
/**
 * Render: Collaborators Block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Inner block content.
 * @param WP_Block $block      Block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = isset( $attributes ) && is_array( $attributes )
	? $attributes
	: array();

$ambrygen_block_id = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';

$ambrygen_title = isset( $ambrygen_attributes['title'] )
	? $ambrygen_attributes['title']
	: '';

$ambrygen_intro = isset( $ambrygen_attributes['intro'] )
	? $ambrygen_attributes['intro']
	: '';

$ambrygen_heading_level = isset( $ambrygen_attributes['headingLevel'] )
	? sanitize_key( $ambrygen_attributes['headingLevel'] )
	: 'h2';

$ambrygen_allowed_headings = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
if ( ! in_array( $ambrygen_heading_level, $ambrygen_allowed_headings, true ) ) {
	$ambrygen_heading_level = 'h2';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array_filter(
		array(
			'id'    => $ambrygen_block_id,
			'class' => 'block-layout timeline-block collaborators',
		)
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! empty( $ambrygen_title ) || ! empty( $ambrygen_intro ) ) : ?>
		<div class="timeline-block__header collaborators__header">
			<?php if ( ! empty( $ambrygen_title ) ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="heading-3 block-title mb-0 collaborators__title js-gsap-fade">
					<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
				</<?php echo tag_escape( $ambrygen_heading_level ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_intro ) ) : ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div class="text-md-regular block-description collaborators__intro js-gsap-fade">
					<?php echo wp_kses_post( wpautop( $ambrygen_intro ) ); ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s24" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="timeline-block__items collaborators__list">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Inner block content is rendered by WordPress.
		echo $content;
		?>
	</div>
</div>
