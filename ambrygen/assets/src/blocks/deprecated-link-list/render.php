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
$ambrygen_variation        = isset( $attributes['variation'] ) ? sanitize_text_field( (string) $attributes['variation'] ) : 'split-view';
$ambrygen_variation        = in_array( $ambrygen_variation, array( 'split-view', 'grid-view' ), true ) ? $ambrygen_variation : 'split-view';
$ambrygen_select_all       = isset( $attributes['selectAllCollaborators'] ) ? (bool) $attributes['selectAllCollaborators'] : true;
$ambrygen_collaborator_ids = isset( $attributes['collaboratorIds'] ) && is_array( $attributes['collaboratorIds'] ) ? array_map( 'absint', $attributes['collaboratorIds'] ) : array();
$ambrygen_title            = $attributes['title'] ?? '';
$ambrygen_heading_tag      = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_inner_content    = trim( (string) $content );

$ambrygen_slot_blocks = array(
	'content' => array(),
	'items'   => array(),
);

$ambrygen_has_slots = false;

if ( isset( $block ) && $block instanceof WP_Block && ! empty( $block->parsed_block['innerBlocks'] ) ) {
	foreach ( $block->parsed_block['innerBlocks'] as $inner_block ) {
		$slot = $inner_block['attrs']['__experimentalSlotName'] ?? '';
		$block_name = $inner_block['blockName'] ?? '';

		if ( ! $slot ) {
			if ( in_array( $block_name, array( 'core/paragraph', 'core/buttons', 'core/button' ), true ) ) {
				$slot = 'content';
			} else {
				$slot = 'items';
			}
		}

		if ( $slot ) {
			$ambrygen_has_slots = true;
		}

		if ( $slot && isset( $ambrygen_slot_blocks[ $slot ] ) ) {
			$ambrygen_slot_blocks[ $slot ][] = $inner_block;
		} else {
			$ambrygen_slot_blocks['items'][] = $inner_block;
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

$wrapper_attributes = get_block_wrapper_attributes(
	( $ambrygen_anchor || $ambrygen_block_id )
	? array(
		'class' => 'download-list' . ( 'grid-view' === $ambrygen_variation ? ' variation-grid-view' : '' ),
		'id'    => $ambrygen_anchor ?: $ambrygen_block_id,
	)
	: array(
		'class' => 'download-list' . ( 'grid-view' === $ambrygen_variation ? ' variation-grid-view' : '' ),
	)
);

$ambrygen_collaborator_terms = array();

if ( 'grid-view' === $ambrygen_variation ) {
	if ( $ambrygen_select_all || ! empty( $ambrygen_collaborator_ids ) ) {
		$ambrygen_term_query = array(
			'taxonomy'   => 'collaborator',
			'hide_empty' => false,
			'orderby'    => 'name',
			'order'      => 'ASC',
		);

		if ( $ambrygen_select_all ) {
			if ( ! empty( $ambrygen_collaborator_ids ) ) {
				$ambrygen_term_query['exclude'] = $ambrygen_collaborator_ids;
			}
		} else {
			$ambrygen_term_query['include'] = $ambrygen_collaborator_ids;
		}

		$ambrygen_terms = get_terms( $ambrygen_term_query );

		if ( ! is_wp_error( $ambrygen_terms ) ) {
			$ambrygen_collaborator_terms = $ambrygen_terms;
		}
	}
}
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="download-list__inner">
		<div class="download-list__header-area mb-24">
			<div class="download-list__content">
				<?php if ( $ambrygen_title ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="download-list__title heading-3 block-title mb-0">
						<?php echo wp_kses_post( $ambrygen_title ); ?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php
				$ambrygen_content_html = $ambrygen_has_slots ? $ambrygen_render_blocks( $ambrygen_slot_blocks['content'] ) : '';
				if ( $ambrygen_content_html ) {
					echo $ambrygen_content_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
			</div>
		</div>
		<div class="download-list__items">
			<?php
			if ( 'grid-view' === $ambrygen_variation ) {
				if ( ! empty( $ambrygen_collaborator_terms ) ) {
					foreach ( $ambrygen_collaborator_terms as $ambrygen_term ) {
						$ambrygen_term_link = (string) get_term_meta( $ambrygen_term->term_id, 'link', true );

						if ( empty( $ambrygen_term_link ) ) {
							continue;
						}
						?>
						<div class="download-list__grid-item">
							<a href="<?php echo esc_url( $ambrygen_term_link ); ?>" class="download-list__grid-link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( sprintf( __( '%s (opens in a new tab)', 'ambrygen-web' ), $ambrygen_term->name ) ); ?>">
								<span class="download-list__item-text">
									<?php echo esc_html( $ambrygen_term->name ); ?>
								</span>
							</a>
						</div>
						<?php
					}
				}
			} elseif ( $ambrygen_has_slots ) {
				$ambrygen_items_html = $ambrygen_render_blocks( $ambrygen_slot_blocks['items'] );
				if ( $ambrygen_items_html ) {
					echo $ambrygen_items_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
			} elseif ( $ambrygen_inner_content ) {
				// Back-compat: before slots existed, everything rendered as items.
				echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			?>
		</div>
	</div>
</div>
