<?php
/**
 * Render: Quiz Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id      = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( (string) $ambrygen_attributes['blockId'] ) : '';
$ambrygen_eyebrow_text  = isset( $ambrygen_attributes['eyebrowText'] ) ? $ambrygen_attributes['eyebrowText'] : '';
$ambrygen_heading       = isset( $ambrygen_attributes['heading'] ) ? $ambrygen_attributes['heading'] : '';
$ambrygen_heading_tag   = isset( $ambrygen_attributes['headingTag'] ) ? $ambrygen_attributes['headingTag'] : 'h2';
$ambrygen_card_title    = isset( $ambrygen_attributes['cardTitle'] ) ? $ambrygen_attributes['cardTitle'] : '';
$ambrygen_card_subtitle = isset( $ambrygen_attributes['cardSubtitle'] ) ? $ambrygen_attributes['cardSubtitle'] : '';
$ambrygen_no_risk_text  = isset( $ambrygen_attributes['noRiskText'] ) ? $ambrygen_attributes['noRiskText'] : '';
$ambrygen_at_risk_text  = isset( $ambrygen_attributes['atRiskText'] ) ? $ambrygen_attributes['atRiskText'] : '';
$ambrygen_checklist     = isset( $ambrygen_attributes['checklistItems'] ) && is_array( $ambrygen_attributes['checklistItems'] )
	? $ambrygen_attributes['checklistItems']
	: array();
$ambrygen_buttons       = isset( $ambrygen_attributes['buttons'] ) && is_array( $ambrygen_attributes['buttons'] )
	? $ambrygen_attributes['buttons']
	: array();

$ambrygen_heading_tag      = Helper::get_heading_tag( $ambrygen_heading_tag, 'h2' );
$ambrygen_has_no_risk_text = '' !== trim( wp_strip_all_tags( $ambrygen_no_risk_text ) );
$ambrygen_has_at_risk_text = '' !== trim( wp_strip_all_tags( $ambrygen_at_risk_text ) );
$ambrygen_valid_checklist  = array_values(
	array_filter(
		$ambrygen_checklist,
		static function ( $ambrygen_item ) {
			if ( ! is_array( $ambrygen_item ) ) {
				return false;
			}

			$ambrygen_item_text = isset( $ambrygen_item['text'] ) ? $ambrygen_item['text'] : '';

			return '' !== trim( wp_strip_all_tags( $ambrygen_item_text ) );
		}
	)
);
$ambrygen_valid_buttons    = array_values(
	array_filter(
		$ambrygen_buttons,
		static function ( $ambrygen_button ) {
			if ( ! is_array( $ambrygen_button ) ) {
				return false;
			}

			$ambrygen_button_text = isset( $ambrygen_button['text'] ) ? sanitize_text_field( (string) $ambrygen_button['text'] ) : '';
			$ambrygen_button_url  = isset( $ambrygen_button['url'] ) ? (string) $ambrygen_button['url'] : '';
			$ambrygen_button_href = esc_url( $ambrygen_button_url );

			return '' !== $ambrygen_button_text && '' !== $ambrygen_button_href;
		}
	)
);

$ambrygen_wrapper_attributes_array = array(
	'class' => 'block-layout risk-checklist',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
$ambrygen_id_base            = $ambrygen_block_id ? $ambrygen_block_id : wp_unique_id( 'risk-checklist-' );
$ambrygen_heading_id         = '' !== trim( wp_strip_all_tags( $ambrygen_heading ) ) ? $ambrygen_id_base . '-title' : '';
$ambrygen_card_title_id      = '' !== trim( wp_strip_all_tags( $ambrygen_card_title ) ) ? $ambrygen_id_base . '-card-title' : '';
$ambrygen_checklist_help_id  = $ambrygen_id_base . '-instructions';
$ambrygen_has_header_content = '' !== $ambrygen_eyebrow_text || '' !== $ambrygen_heading;
$ambrygen_has_card_header    = '' !== $ambrygen_card_title || '' !== $ambrygen_card_subtitle;
$ambrygen_card_labelledby    = $ambrygen_heading_id ? $ambrygen_heading_id : $ambrygen_card_title_id;
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<div class="risk-checklist__header">
		<?php if ( '' !== $ambrygen_eyebrow_text ) : ?>
			<div class="overline-text risk-checklist__eyebrow hero-kicker js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_eyebrow_text ); ?>
			</div>
		<?php endif; ?>

		<?php if ( '' !== $ambrygen_eyebrow_text && '' !== $ambrygen_heading ) : ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
		<?php endif; ?>

		<?php if ( '' !== $ambrygen_heading ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="heading-4 block-title mb-0 risk-checklist__heading js-gsap-fade">
				<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>
	</div>

	<?php if ( $ambrygen_has_header_content ) : ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div
		class="risk-checklist__card"
		role="region"
		<?php if ( $ambrygen_card_labelledby ) : ?>
			aria-labelledby="<?php echo esc_attr( $ambrygen_card_labelledby ); ?>"
		<?php elseif ( '' !== trim( wp_strip_all_tags( $ambrygen_card_title ) ) ) : ?>
			aria-label="<?php echo esc_attr( wp_strip_all_tags( $ambrygen_card_title ) ); ?>"
		<?php else : ?>
			aria-label="<?php echo esc_attr__( 'Risk checklist card', 'ambrygen-web' ); ?>"
		<?php endif; ?>
	>
		<div class="risk-checklist__card-header">
			<?php if ( '' !== $ambrygen_card_title ) : ?>
				<h3
					<?php if ( $ambrygen_card_title_id ) : ?>
						id="<?php echo esc_attr( $ambrygen_card_title_id ); ?>"
					<?php endif; ?>
					class="heading-5 risk-checklist__card-title mb-0 js-gsap-fade block-inside-title"
				>
					<?php echo wp_kses_post( $ambrygen_card_title ); ?>
				</h3>
			<?php endif; ?>

			<?php if ( '' !== $ambrygen_card_title && '' !== $ambrygen_card_subtitle ) : ?>
				<div class="is-style-gl-s8" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ( '' !== $ambrygen_card_subtitle ) : ?>
				<div class="subtitle2-sbold risk-checklist__card-subtitle js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_card_subtitle ); ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="risk-checklist__card-body">
			<div class="screen-reader-text js-gsap-fade">
				<?php esc_html_e( 'Select any items that apply to you. Results will update automatically as you make selections.', 'ambrygen-web' ); ?>
			</div>

				<?php if ( empty( $ambrygen_checklist ) ) : ?>
				<div class="risk-checklist__empty-message js-gsap-fade">
					<?php esc_html_e( 'No checklist items have been added yet.', 'ambrygen-web' ); ?>
				</div>
				<?php else : ?>
			<div class="risk-checklist__items" role="group" aria-label="<?php esc_attr_e( 'Risk factors checklist', 'ambrygen-web' ); ?>">
					<?php foreach ( $ambrygen_checklist as $ambrygen_item ) : ?>
						<?php
						if ( ! is_array( $ambrygen_item ) ) {
							continue;
						}

						$ambrygen_item_text = isset( $ambrygen_item['text'] ) ? $ambrygen_item['text'] : '';

						if ( '' === trim( wp_strip_all_tags( $ambrygen_item_text ) ) ) {
							continue;
						}

						$ambrygen_item_id = ! empty( $ambrygen_item['id'] )
						? sanitize_html_class( $ambrygen_id_base . '-' . (string) $ambrygen_item['id'] )
						: wp_unique_id( 'risk-checklist-item-' );
						?>
					<div class="risk-checklist__item js-gsap-fade">
						<label class="risk-checklist__item-label" for="<?php echo esc_attr( $ambrygen_item_id ); ?>">
							<input
								id="<?php echo esc_attr( $ambrygen_item_id ); ?>"
								type="checkbox"
								class="risk-checklist__checkbox js-risk-checkbox"
							/>
							<span class="risk-checklist__checkbox-custom" aria-hidden="true"></span>
							<span class="body1 risk-checklist__item-text">
								<?php echo wp_kses_post( $ambrygen_item_text ); ?>
							</span>
						</label>
					</div>
				<?php endforeach; ?>
			</div>
				<?php endif; ?>

			<?php if ( $ambrygen_has_no_risk_text || $ambrygen_has_at_risk_text ) : ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_no_risk_text ) : ?>
				<div
					class="risk-checklist__result risk-checklist__result--no-risk js-gsap-fade"
					role="status"
					aria-live="polite"
					aria-atomic="true"
				>
					<p class="body1 risk-checklist__result-text">
						<?php echo wp_kses_post( $ambrygen_no_risk_text ); ?>
					</p>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_at_risk_text ) : ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div
					class="risk-checklist__result js-gsap-fade risk-checklist__result--at-risk<?php echo $ambrygen_has_no_risk_text ? ' risk-checklist__result--hidden' : ''; ?>"
					role="status"
					aria-live="polite"
					aria-atomic="true"
				>
					<p class="body1 risk-checklist__result-text">
						<?php echo wp_kses_post( $ambrygen_at_risk_text ); ?>
					</p>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<?php if ( ! empty( $ambrygen_valid_buttons ) ) : ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
		<div class="risk-checklist__cta js-gsap-fade">
			<?php foreach ( $ambrygen_valid_buttons as $ambrygen_button ) : ?>
				<?php
				$ambrygen_button_text      = sanitize_text_field( (string) $ambrygen_button['text'] );
				$ambrygen_button_url       = (string) $ambrygen_button['url'];
				$ambrygen_button_href      = esc_url( $ambrygen_button_url );
				$ambrygen_button_target    = ! empty( $ambrygen_button['target'] ) && '_blank' === $ambrygen_button['target'] ? '_blank' : '';
				$ambrygen_button_rel       = isset( $ambrygen_button['rel'] ) ? sanitize_text_field( (string) $ambrygen_button['rel'] ) : '';
				$ambrygen_button_variant   = isset( $ambrygen_button['variant'] ) ? sanitize_text_field( (string) $ambrygen_button['variant'] ) : 'site-btn has-right-arrow';
				$ambrygen_button_variant   = in_array(
					$ambrygen_button_variant,
					array(
						'site-btn',
						'site-btn has-right-arrow',
						'site-btn is-style-site-tertiary-btn has-right-arrow',
					),
					true
				) ? $ambrygen_button_variant : 'site-btn has-right-arrow';
				$ambrygen_button_rel_parts = preg_split( '/\s+/', trim( (string) $ambrygen_button_rel ) );
				$ambrygen_button_rel_parts = is_array( $ambrygen_button_rel_parts ) ? array_filter( $ambrygen_button_rel_parts ) : array();

				if ( '_blank' === $ambrygen_button_target ) {
					if ( ! in_array( 'noopener', $ambrygen_button_rel_parts, true ) ) {
						$ambrygen_button_rel_parts[] = 'noopener';
					}

					if ( ! in_array( 'noreferrer', $ambrygen_button_rel_parts, true ) ) {
						$ambrygen_button_rel_parts[] = 'noreferrer';
					}
				}

				$ambrygen_button_rel = implode( ' ', $ambrygen_button_rel_parts );
				?>
				<a
					href="<?php echo $ambrygen_button_href; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped with esc_url() above. ?>"
					class="<?php echo esc_attr( $ambrygen_button_variant ); ?>"
					<?php if ( '' !== $ambrygen_button_target ) : ?>
						target="<?php echo esc_attr( $ambrygen_button_target ); ?>"
					<?php endif; ?>
					<?php if ( '' !== $ambrygen_button_rel ) : ?>
						rel="<?php echo esc_attr( $ambrygen_button_rel ); ?>"
					<?php endif; ?>
				>
					<?php echo esc_html( $ambrygen_button_text ); ?>
					<?php if ( '_blank' === $ambrygen_button_target ) : ?>
						<span class="screen-reader-text"><?php esc_html_e( ' (opens in a new tab)', 'ambrygen-web' ); ?></span>
					<?php endif; ?>
				</a>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
