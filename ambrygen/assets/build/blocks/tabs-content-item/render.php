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

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_heading    = isset( $ambrygen_attributes['heading'] ) ? sanitize_text_field( $ambrygen_attributes['heading'] ) : '';
$ambrygen_item_id    = isset( $ambrygen_attributes['itemId'] ) ? sanitize_html_class( $ambrygen_attributes['itemId'] ) : '';

$ambrygen_content_html      = trim( (string) ( $content ?? '' ) );
$ambrygen_is_default_active = isset( $ambrygen_attributes['isDefaultActive'] ) ? (bool) $ambrygen_attributes['isDefaultActive'] : false;
$ambrygen_class_name        = 'tabs-table-content__item' . ( $ambrygen_is_default_active ? ' is-active' : '' );
$ambrygen_content_id        = $ambrygen_item_id ? $ambrygen_item_id . '-content' : '';
?>

<div
	class="<?php echo esc_attr( $ambrygen_class_name ); ?>"
	<?php if ( $ambrygen_item_id ) : ?>
		id="<?php echo esc_attr( $ambrygen_item_id ); ?>"
	<?php endif; ?>
>
	<div
		class="tabs-table-content__header"
		role="button"
		tabindex="0"
		aria-expanded="<?php echo $ambrygen_is_default_active ? 'true' : 'false'; ?>"
		<?php if ( $ambrygen_content_id ) : ?>
			aria-controls="<?php echo esc_attr( $ambrygen_content_id ); ?>"
		<?php endif; ?>
	>
		<div class="subtitle1-sbold tabs-table-content__title">
			<?php echo esc_html( $ambrygen_heading ); ?>
		</div>
	</div>

	<div
		class="tabs-table-content__content js-gsap-fade"
		<?php if ( $ambrygen_content_id ) : ?>
			id="<?php echo esc_attr( $ambrygen_content_id ); ?>"
		<?php endif; ?>
	>
		<div class="tabs-table-content__image-wrapper js-gsap-fade">
			<?php echo $ambrygen_content_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	</div>
</div>
