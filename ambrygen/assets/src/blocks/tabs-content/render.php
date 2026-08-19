<?php
/**
 * Render: Tabs Content Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

if ( empty( $block->inner_blocks ) ) {
	return;
}

// Prefer the first item explicitly marked as default active; otherwise fall back to first item.
$ambrygen_has_explicit_default = false;
foreach ( $block->inner_blocks as $ambrygen_inner_block ) {
	if ( 'ambrygen/tabs-content-item' !== $ambrygen_inner_block->name ) {
		continue;
	}
	$ambrygen_attrs = is_array( $ambrygen_inner_block->attributes ?? null ) ? $ambrygen_inner_block->attributes : array();
	if ( ! empty( $ambrygen_attrs['isDefaultActive'] ) ) {
		$ambrygen_has_explicit_default = true;
		break;
	}
}

$ambrygen_found_item = false;
?>

<div class="tabs-table-content block-layout">
	<?php foreach ( $block->inner_blocks as $ambrygen_inner_block ) : ?>
		<?php
		$ambrygen_html = $ambrygen_inner_block->render();

		if (
			! $ambrygen_found_item
			&& 'ambrygen/tabs-content-item' === $ambrygen_inner_block->name
			&& '' !== trim( $ambrygen_html )
		) {
			$ambrygen_attrs             = is_array( $ambrygen_inner_block->attributes ?? null ) ? $ambrygen_inner_block->attributes : array();
			$ambrygen_is_default_active = (bool) ( $ambrygen_attrs['isDefaultActive'] ?? false );

			// When any tab is explicitly marked, only the marked one gets is-active.
			if ( $ambrygen_has_explicit_default && ! $ambrygen_is_default_active ) {
				echo $ambrygen_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				continue;
			}

			if ( class_exists( 'WP_HTML_Tag_Processor' ) ) {
				$ambrygen_processor = new WP_HTML_Tag_Processor( $ambrygen_html );
				if ( $ambrygen_processor->next_tag( array( 'class_name' => 'tabs-table-content__item' ) ) ) {
					$ambrygen_processor->add_class( 'is-active' );
					if ( $ambrygen_processor->next_tag( array( 'class_name' => 'tabs-table-content__header' ) ) ) {
						$ambrygen_processor->set_attribute( 'aria-expanded', 'true' );
					}
					$ambrygen_html       = $ambrygen_processor->get_updated_html();
					$ambrygen_found_item = true;
				}
			} else {
				$ambrygen_updated_html = preg_replace(
					'/(class=(["\'])[^"\']*\\btabs-table-content__item\\b)([^"\']*\\2)/',
					'$1 is-active$3',
					$ambrygen_html,
					1
				);

				if ( is_string( $ambrygen_updated_html ) && $ambrygen_updated_html !== $ambrygen_html ) {
					$ambrygen_expanded_html = preg_replace(
						'/(class=(["\'])[^"\']*\\btabs-table-content__header\\b[^"\']*\\2[^>]*aria-expanded=)(["\'])false\\3/',
						'$1$3true$3',
						$ambrygen_updated_html,
						1
					);
					$ambrygen_html          = is_string( $ambrygen_expanded_html ) ? $ambrygen_expanded_html : $ambrygen_updated_html;
					$ambrygen_found_item    = true;
				}
			}
		}

		echo $ambrygen_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	<?php endforeach; ?>
</div>
