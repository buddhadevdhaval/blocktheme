<?php
/**
 * Render: Link List Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_anchor           = isset( $attributes['anchor'] ) ? sanitize_html_class( $attributes['anchor'] ) : '';
$ambrygen_block_id         = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';
$ambrygen_title            = isset( $attributes['title'] ) ? $attributes['title'] : '';
$ambrygen_links            = is_array( $attributes['links'] ?? null ) ? $attributes['links'] : array();
$ambrygen_heading_tag      = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_heading_id       = wp_unique_id( 'download-list-heading-' );

$ambrygen_slot_blocks = array(
	'content' => array(),
);

if ( isset( $block ) && $block instanceof WP_Block && ! empty( $block->parsed_block['innerBlocks'] ) ) {
	foreach ( $block->parsed_block['innerBlocks'] as $inner_block ) {
		$slot = $inner_block['attrs']['__experimentalSlotName'] ?? '';
		$block_name = $inner_block['blockName'] ?? '';

		if ( ! $slot ) {
			if ( in_array( $block_name, array( 'core/paragraph', 'core/buttons', 'core/button', 'core/spacer' ), true ) ) {
				$slot = 'content';
			} else {
				continue;
			}
		}

		if ( $slot && isset( $ambrygen_slot_blocks[ $slot ] ) ) {
			$ambrygen_slot_blocks[ $slot ][] = $inner_block;
		}
	}
}

/**
 * Render a list of parsed blocks.
 *
 * @param array $blocks Parsed blocks.
 * @return string
 */
$ambrygen_render_blocks = static function ( array $blocks ): string {
	if ( empty( $blocks ) ) {
		return '';
	}

	$output = '';
	foreach ( $blocks as $parsed ) {
		$output .= render_block( $parsed );
	}

	return $output;
};

$wrapper_args = array(
	'class' => 'download-list block-layout',
);

if ( $ambrygen_anchor || $ambrygen_block_id ) {
	$wrapper_args['id'] = $ambrygen_anchor ?: $ambrygen_block_id;
}

if ( $ambrygen_title ) {
	$wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
} else {
	$wrapper_args['aria-label'] = esc_attr__( 'Link list', 'ambrygen-web' );
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );


?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="download-list__inner">
		<div class="download-list__header-area mb-24 js-gsap-fade">
			<div class="download-list__content">
				<?php if ( $ambrygen_title ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="download-list__title heading-3 block-title mb-0">
						<?php echo wp_kses_post( $ambrygen_title ); ?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php
				$ambrygen_content_html = $ambrygen_render_blocks( $ambrygen_slot_blocks['content'] );
				if ( $ambrygen_content_html ) {
					echo $ambrygen_content_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
			</div>
		</div>
		<div class="download-list__items">
			<?php
			if ( ! empty( $ambrygen_links ) ) {
				foreach ( $ambrygen_links as $ambrygen_link ) {
					$ambrygen_text   = isset( $ambrygen_link['text'] ) ? sanitize_text_field( $ambrygen_link['text'] ) : '';
					$ambrygen_url    = isset( $ambrygen_link['url'] ) ? esc_url_raw( $ambrygen_link['url'] ) : '';
					$ambrygen_target = isset( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '';
					$ambrygen_rel    = isset( $ambrygen_link['rel'] ) ? sanitize_text_field( $ambrygen_link['rel'] ) : '';
					$ambrygen_label  = $ambrygen_text ? $ambrygen_text : __( 'Download link', 'ambrygen-web' );

					if ( $ambrygen_url && '_blank' === $ambrygen_target ) {
						$ambrygen_rel_parts = array_filter(
							preg_split( '/\s+/', $ambrygen_rel ) ?: array()
						);

						$ambrygen_rel_parts[] = 'noopener';
						$ambrygen_rel_parts[] = 'noreferrer';
						$ambrygen_rel = implode(
							' ',
							array_unique( $ambrygen_rel_parts )
						);
						$ambrygen_label = sprintf(
							/* translators: %s: link label. */
							__( '%s (opens in a new tab)', 'ambrygen-web' ),
							$ambrygen_label
						);
					}
					?>
					<div class="download-list__item js-gsap-fade">
						<a
							class="download-list__item-link"
							<?php if ( $ambrygen_url ) : ?>
								href="<?php echo esc_url( $ambrygen_url ); ?>"
							<?php endif; ?>
							<?php if ( $ambrygen_url && $ambrygen_target ) : ?>
								target="<?php echo esc_attr( $ambrygen_target ); ?>"
							<?php endif; ?>
							<?php if ( $ambrygen_url && $ambrygen_rel ) : ?>
								rel="<?php echo esc_attr( $ambrygen_rel ); ?>"
							<?php endif; ?>
							aria-label="<?php echo esc_attr( $ambrygen_label ); ?>"
						>
							<span class="download-list__item-text">
								<?php echo esc_html( $ambrygen_text ); ?>
							</span>
						</a>
					</div>
					<?php
				}
			}
			?>
		</div>
	</div>
							</div>
