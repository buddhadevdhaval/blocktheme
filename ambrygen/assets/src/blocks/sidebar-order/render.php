<?php
/**
 * Render: Sidebar Order Block
 *
 * @param array $attributes Block attributes.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

$ambrygen_title = isset( $attributes['title'] ) ? (string) $attributes['title'] : 'Order TAADNext';
$ambrygen_tagline_line_one = isset( $attributes['taglineLineOne'] ) ? (string) $attributes['taglineLineOne'] : '14-21 day turnaround.';
$ambrygen_tagline_line_two = isset( $attributes['taglineLineTwo'] ) ? (string) $attributes['taglineLineTwo'] : 'Code 8789 or 8783 for FBN1 reflex.';
$ambrygen_box_title = isset( $attributes['boxTitle'] ) ? (string) $attributes['boxTitle'] : 'Order via AmbryPort';
$ambrygen_box_subtitle = isset( $attributes['boxSubtitle'] ) ? (string) $attributes['boxSubtitle'] : 'Our Secure Online Portal';
$ambrygen_background_image_url = isset( $attributes['backgroundImageUrl'] ) ? esc_url_raw( $attributes['backgroundImageUrl'] ) : '';
$ambrygen_primary_cta = isset( $attributes['primaryCta'] ) && is_array( $attributes['primaryCta'] ) ? $attributes['primaryCta'] : array();
$ambrygen_action_links = isset( $attributes['actionLinks'] ) && is_array( $attributes['actionLinks'] ) ? $attributes['actionLinks'] : array();

$ambrygen_default_action_links = array(
	array(
		'id'     => 'order-a-sample-kit',
		'text'   => 'Order A Sample Kit',
		'url'    => '',
		'target' => '',
		'rel'    => '',
	),
	array(
		'id'     => 'specimen-requirements',
		'text'   => 'Specimen Requirements',
		'url'    => '',
		'target' => '',
		'rel'    => '',
	),
	array(
		'id'     => 'download-test-forms',
		'text'   => 'Download Test Forms',
		'url'    => '',
		'target' => '',
		'rel'    => '',
	),
	array(
		'id'     => 'verify-insurance-coverage',
		'text'   => 'Verify Insurance Coverage',
		'url'    => '',
		'target' => '',
		'rel'    => '',
	),
);

$ambrygen_normalized_action_links = array();

foreach ( $ambrygen_default_action_links as $ambrygen_index => $ambrygen_default_action_link ) {
	$ambrygen_stored_link = isset( $ambrygen_action_links[ $ambrygen_index ] ) && is_array( $ambrygen_action_links[ $ambrygen_index ] ) ? $ambrygen_action_links[ $ambrygen_index ] : array();
	$ambrygen_normalized_action_links[] = wp_parse_args( $ambrygen_stored_link, $ambrygen_default_action_link );
}

$ambrygen_primary_cta_text = isset( $ambrygen_primary_cta['text'] ) ? (string) $ambrygen_primary_cta['text'] : '';
$ambrygen_primary_cta_url = isset( $ambrygen_primary_cta['url'] ) ? esc_url_raw( $ambrygen_primary_cta['url'] ) : '';
$ambrygen_primary_cta_target = isset( $ambrygen_primary_cta['target'] ) ? (string) $ambrygen_primary_cta['target'] : '';
$ambrygen_primary_cta_rel = isset( $ambrygen_primary_cta['rel'] ) ? (string) $ambrygen_primary_cta['rel'] : '';
$ambrygen_has_box_content = (
	'' !== trim( wp_strip_all_tags( $ambrygen_box_title ) ) ||
	'' !== trim( wp_strip_all_tags( $ambrygen_box_subtitle ) ) ||
	'' !== trim( wp_strip_all_tags( $ambrygen_primary_cta_text ) ) ||
	'' !== $ambrygen_primary_cta_url
);
?>

<div class="sidebar-widget order-widget">
	<?php if ( '' !== $ambrygen_background_image_url ) : ?>
		<div class="block-bg-image">
			<img src="<?php echo esc_url( $ambrygen_background_image_url ); ?>" alt="" />
		</div>
	<?php endif; ?>

	<div class="widget-content">
		<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_title ) ) ) : ?>
			<h3 class="heading-6 mb-0 order-widget__title"><?php echo wp_kses_post( $ambrygen_title ); ?></h3>
		<?php endif; ?>

		<div class="is-style-gl-s12" aria-hidden="true"></div>

		<div class="order-widget__tagline body1">
			<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_tagline_line_one ) ) ) : ?>
				<span><?php echo wp_kses_post( $ambrygen_tagline_line_one ); ?></span>
			<?php endif; ?>
			<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_tagline_line_two ) ) ) : ?>
				<?php echo wp_kses_post( $ambrygen_tagline_line_two ); ?>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s12" aria-hidden="true"></div>

		<?php if ( $ambrygen_has_box_content ) : ?>
			<div class="order-widget__box">
				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_box_title ) ) ) : ?>
					<div class="order-widget__box-title"><?php echo wp_kses_post( $ambrygen_box_title ); ?></div>
				<?php endif; ?>

				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_box_title ) ) && '' !== trim( wp_strip_all_tags( $ambrygen_box_subtitle ) ) ) : ?>
					<div class="is-style-gl-s4" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_box_subtitle ) ) ) : ?>
					<div class="body2-reg order-widget__box-subheading"><?php echo wp_kses_post( $ambrygen_box_subtitle ); ?></div>
				<?php endif; ?>

				<?php if (
					( '' !== trim( wp_strip_all_tags( $ambrygen_box_title ) ) || '' !== trim( wp_strip_all_tags( $ambrygen_box_subtitle ) ) ) &&
					( '' !== trim( wp_strip_all_tags( $ambrygen_primary_cta_text ) ) || '' !== $ambrygen_primary_cta_url )
				) : ?>
					<div class="is-style-gl-s24" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_primary_cta_text ) ) || '' !== $ambrygen_primary_cta_url ) : ?>
					<?php if ( '' !== $ambrygen_primary_cta_url ) : ?>
						<a
							href="<?php echo esc_url( $ambrygen_primary_cta_url ); ?>"
							class="site-btn has-right-arrow order-widget__btn user-icon-click"
							<?php echo '_blank' === $ambrygen_primary_cta_target ? ' target="_blank"' : ''; ?>
							<?php echo '_blank' === $ambrygen_primary_cta_target && '' !== $ambrygen_primary_cta_rel ? ' rel="' . esc_attr( $ambrygen_primary_cta_rel ) . '"' : ''; ?>
						>
							<?php echo esc_html( wp_strip_all_tags( $ambrygen_primary_cta_text ) ); ?>
						</a>
					<?php else : ?>
						<div class="site-btn has-right-arrow order-widget__btn user-icon-click">
							<?php echo esc_html( wp_strip_all_tags( $ambrygen_primary_cta_text ) ); ?>
						</div>
					<?php endif; ?>
				<?php endif; ?>
			</div>

			<div class="is-style-gl-s24" aria-hidden="true"></div>
		<?php endif; ?>

		<div class="order-widget__grid">
			<?php foreach ( $ambrygen_normalized_action_links as $ambrygen_action_link ) : ?>
				<?php
				$ambrygen_action_link_text = isset( $ambrygen_action_link['text'] ) ? (string) $ambrygen_action_link['text'] : '';
				$ambrygen_action_link_url = isset( $ambrygen_action_link['url'] ) ? esc_url_raw( $ambrygen_action_link['url'] ) : '';
				$ambrygen_action_link_target = isset( $ambrygen_action_link['target'] ) ? (string) $ambrygen_action_link['target'] : '';
				$ambrygen_action_link_rel = isset( $ambrygen_action_link['rel'] ) ? (string) $ambrygen_action_link['rel'] : '';

				if ( '' === trim( wp_strip_all_tags( $ambrygen_action_link_text ) ) ) {
					continue;
				}
				?>
				<?php if ( '' !== $ambrygen_action_link_url ) : ?>
					<a
						href="<?php echo esc_url( $ambrygen_action_link_url ); ?>"
						class="order-widget__action text-xs-bold"
						<?php echo '_blank' === $ambrygen_action_link_target ? ' target="_blank"' : ''; ?>
						<?php echo '_blank' === $ambrygen_action_link_target && '' !== $ambrygen_action_link_rel ? ' rel="' . esc_attr( $ambrygen_action_link_rel ) . '"' : ''; ?>
					>
						<?php echo esc_html( wp_strip_all_tags( $ambrygen_action_link_text ) ); ?>
					</a>
				<?php else : ?>
					<div class="order-widget__action text-xs-bold">
						<?php echo esc_html( wp_strip_all_tags( $ambrygen_action_link_text ) ); ?>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</div>
