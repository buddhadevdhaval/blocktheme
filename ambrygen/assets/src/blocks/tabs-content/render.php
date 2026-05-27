<?php
/**
 * Render: Tabs Content Block
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block content.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

$ambrygen_content = trim( (string) ( $content ?? '' ) );

if ( ! $ambrygen_content ) {
	return;
}

$ambrygen_blocks = parse_blocks( $ambrygen_content );

// Prefer the first item explicitly marked as default active; otherwise fall back to first item.
$ambrygen_has_explicit_default = false;
foreach ( $ambrygen_blocks as $ambrygen_block ) {
	if ( ! is_array( $ambrygen_block ) ) {
		continue;
	}
	if ( 'ambrygen/tabs-content-item' !== ( $ambrygen_block['blockName'] ?? '' ) ) {
		continue;
	}
	$ambrygen_attrs = is_array( $ambrygen_block['attrs'] ?? null ) ? $ambrygen_block['attrs'] : array();
	if ( ! empty( $ambrygen_attrs['isDefaultActive'] ) ) {
		$ambrygen_has_explicit_default = true;
		break;
	}
}

$ambrygen_found_item = false;
?>

<div class="tabs-table-content">
	<?php foreach ( $ambrygen_blocks as $ambrygen_block ) : ?>
		<?php
		$ambrygen_html = render_block( $ambrygen_block );

		if (
			! $ambrygen_found_item
			&& is_array( $ambrygen_block )
			&& 'ambrygen/tabs-content-item' === ( $ambrygen_block['blockName'] ?? '' )
			&& '' !== trim( $ambrygen_html )
		) {
			$ambrygen_attrs = is_array( $ambrygen_block['attrs'] ?? null ) ? $ambrygen_block['attrs'] : array();
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
					$ambrygen_html = $ambrygen_processor->get_updated_html();
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
					$ambrygen_html = is_string( $ambrygen_expanded_html ) ? $ambrygen_expanded_html : $ambrygen_updated_html;
					$ambrygen_found_item = true;
				}
			}
		}

		echo $ambrygen_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	<?php endforeach; ?>
</div>
