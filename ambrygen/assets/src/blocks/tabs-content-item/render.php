<?php
/**
 * Render: Tabs Content Item Block
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block content.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes  = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_item_id     = sanitize_title( wp_strip_all_tags( $ambrygen_heading ) );

$ambrygen_content_html = trim( (string) ( $content ?? '' ) );
$ambrygen_is_default_active = isset( $ambrygen_attributes['isDefaultActive'] ) ? (bool) $ambrygen_attributes['isDefaultActive'] : false;
$ambrygen_class_name = 'tabs-table-content__item' . ( $ambrygen_is_default_active ? ' is-active' : '' );
?>

<div
	class="<?php echo esc_attr( $ambrygen_class_name ); ?>"
	<?php if ( $ambrygen_item_id ) : ?>
		id="<?php echo esc_attr( $ambrygen_item_id ); ?>"
	<?php endif; ?>
>
	<div class="tabs-table-content__header">
		<div class="subtitle1-sbold tabs-table-content__title">
			<?php echo esc_html( wp_strip_all_tags( $ambrygen_heading ) ); ?>
		</div>
	</div>

	<div class="tabs-table-content__content">
		<div class="tabs-table-content__image-wrapper">
			<?php echo $ambrygen_content_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	</div>
</div>
