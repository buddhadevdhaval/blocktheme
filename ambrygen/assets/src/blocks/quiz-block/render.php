<?php
/**
 * Render: Quize Block
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

$ambrygen_block_id      = isset( $ambrygen_attributes['blockId'] ) ? $ambrygen_attributes['blockId'] : '';
$ambrygen_eyebrow_text  = isset( $ambrygen_attributes['eyebrowText'] ) ? $ambrygen_attributes['eyebrowText'] : '';
$ambrygen_heading       = isset( $ambrygen_attributes['heading'] ) ? $ambrygen_attributes['heading'] : '';
$ambrygen_heading_tag   = isset( $ambrygen_attributes['headingTag'] ) ? $ambrygen_attributes['headingTag'] : 'h2';
$ambrygen_card_title    = isset( $ambrygen_attributes['cardTitle'] ) ? $ambrygen_attributes['cardTitle'] : '';
$ambrygen_card_subtitle = isset( $ambrygen_attributes['cardSubtitle'] ) ? $ambrygen_attributes['cardSubtitle'] : '';
$ambrygen_no_risk_title = isset( $ambrygen_attributes['noRiskTitle'] ) ? $ambrygen_attributes['noRiskTitle'] : '';
$ambrygen_no_risk_text  = isset( $ambrygen_attributes['noRiskText'] ) ? $ambrygen_attributes['noRiskText'] : '';
$ambrygen_at_risk_title = isset( $ambrygen_attributes['atRiskTitle'] ) ? $ambrygen_attributes['atRiskTitle'] : '';
$ambrygen_at_risk_intro = isset( $ambrygen_attributes['atRiskIntro'] ) ? $ambrygen_attributes['atRiskIntro'] : '';
$ambrygen_at_risk_text  = isset( $ambrygen_attributes['atRiskText'] ) ? $ambrygen_attributes['atRiskText'] : '';
$ambrygen_at_risk_note  = isset( $ambrygen_attributes['atRiskFootnote'] ) ? $ambrygen_attributes['atRiskFootnote'] : '';
$ambrygen_checklist     = isset( $ambrygen_attributes['checklistItems'] ) && is_array( $ambrygen_attributes['checklistItems'] )
	? $ambrygen_attributes['checklistItems']
	: array();
$ambrygen_buttons       = isset( $ambrygen_attributes['buttons'] ) && is_array( $ambrygen_attributes['buttons'] )
	? $ambrygen_attributes['buttons']
	: array();

$ambrygen_heading_tag = in_array( $ambrygen_heading_tag, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ? $ambrygen_heading_tag : 'h2';

$ambrygen_wrapper_attributes_array = array(
	'class' => 'block-layout risk-checklist',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
$ambrygen_section_label      = wp_unique_id( 'risk-checklist-title-' );
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<div class="risk-checklist__header">
		<?php if ( '' !== $ambrygen_eyebrow_text ) : ?>
			<div class="overline-text risk-checklist__eyebrow hero-kicker">
				<?php echo wp_kses_post( $ambrygen_eyebrow_text ); ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s12" aria-hidden="true"></div>

		<?php if ( '' !== $ambrygen_heading ) : ?>
			<<?php echo esc_html( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_section_label ); ?>" class="heading-4 block-title mb-0">
				<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
			</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>
	</div>

	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<div class="risk-checklist__card" aria-labelledby="<?php echo esc_attr( $ambrygen_section_label ); ?>">
		<div class="risk-checklist__card-header">
			<?php if ( '' !== $ambrygen_card_title ) : ?>
				<h3 class="heading-5 risk-checklist__card-title mb-0">
					<?php echo wp_kses_post( $ambrygen_card_title ); ?>
				</h3>
			<?php endif; ?>

			<div class="is-style-gl-s8" aria-hidden="true"></div>

			<?php if ( '' !== $ambrygen_card_subtitle ) : ?>
				<div class="subtitle2-sbold risk-checklist__card-subtitle">
					<?php echo wp_kses_post( $ambrygen_card_subtitle ); ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="risk-checklist__card-body">
			<div class="risk-checklist__items" role="group">
				<?php foreach ( $ambrygen_checklist as $ambrygen_index => $ambrygen_item ) : ?>
					<?php
					if ( ! is_array( $ambrygen_item ) ) {
						continue;
					}

					$ambrygen_item_text = isset( $ambrygen_item['text'] ) ? $ambrygen_item['text'] : '';

					if ( '' === trim( wp_strip_all_tags( $ambrygen_item_text ) ) ) {
						continue;
					}

					$ambrygen_item_id = ! empty( $ambrygen_item['id'] )
						? sanitize_html_class( $ambrygen_item['id'] )
						: 'risk-checklist-item-' . ( $ambrygen_index + 1 );
					?>
					<div class="risk-checklist__item">
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

			<div class="is-style-gl-s24" aria-hidden="true"></div>

			<div class="risk-checklist__result risk-checklist__result--no-risk">
				<?php if ( '' !== $ambrygen_no_risk_title ) : ?>
					<div class="body1-sbold risk-checklist__result-title">
						<?php echo wp_kses_post( $ambrygen_no_risk_title ); ?>
					</div>
				<?php endif; ?>

				<?php if ( '' !== $ambrygen_no_risk_text ) : ?>
					<div class="is-style-gl-s8" aria-hidden="true"></div>
					<p class="body1 risk-checklist__result-text">
						<?php echo wp_kses_post( $ambrygen_no_risk_text ); ?>
					</p>
				<?php endif; ?>
			</div>

			<div class="risk-checklist__result risk-checklist__result--at-risk risk-checklist__result--hidden">
				<?php if ( '' !== $ambrygen_at_risk_title ) : ?>
					<div class="body1-sbold risk-checklist__result-title">
						<?php echo wp_kses_post( $ambrygen_at_risk_title ); ?>
					</div>
				<?php endif; ?>

				<div class="is-style-gl-s24" aria-hidden="true"></div>

				<?php if ( '' !== $ambrygen_at_risk_intro ) : ?>
					<p><?php echo wp_kses_post( $ambrygen_at_risk_intro ); ?></p>
				<?php endif; ?>

				<?php if ( '' !== $ambrygen_at_risk_text ) : ?>
					<p><?php echo wp_kses_post( $ambrygen_at_risk_text ); ?></p>
				<?php endif; ?>

				<?php if ( '' !== $ambrygen_at_risk_note ) : ?>
					<p><?php echo wp_kses_post( $ambrygen_at_risk_note ); ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<?php if ( ! empty( $ambrygen_buttons ) ) : ?>
		<div class="risk-checklist__cta">
			<?php foreach ( $ambrygen_buttons as $ambrygen_button ) : ?>
				<?php
				if ( ! is_array( $ambrygen_button ) ) {
					continue;
				}

				$ambrygen_button_text       = isset( $ambrygen_button['text'] ) ? $ambrygen_button['text'] : '';
				$ambrygen_button_url        = isset( $ambrygen_button['url'] ) ? $ambrygen_button['url'] : '';
				$ambrygen_button_variant    = isset( $ambrygen_button['variant'] ) ? $ambrygen_button['variant'] : 'site-btn is-style-site-trailing-icon';
				$ambrygen_button_aria_label = isset( $ambrygen_button['ariaLabel'] ) ? $ambrygen_button['ariaLabel'] : '';

				if ( '' === $ambrygen_button_text || '' === $ambrygen_button_url ) {
					continue;
				}
				?>
				<a
					href="<?php echo esc_url( $ambrygen_button_url ); ?>"
					class="<?php echo esc_attr( $ambrygen_button_variant ); ?>"
					role="button"
					<?php if ( '' !== $ambrygen_button_aria_label ) : ?>
						aria-label="<?php echo esc_attr( $ambrygen_button_aria_label ); ?>"
					<?php endif; ?>
				>
					<?php echo esc_html( $ambrygen_button_text ); ?>
				</a>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
