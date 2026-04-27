<?php
/**
 * Render: Multimedia Logo Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_block_id   = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_heading    = $ambrygen_attributes['heading'] ?? '';
$ambrygen_heading_tag = $ambrygen_attributes['headingTag'] ?? 'h2';
$ambrygen_image_1_id = absint( $ambrygen_attributes['image1Id'] ?? 0 );
$ambrygen_image_1_url = $ambrygen_attributes['image1Url'] ?? '';
$ambrygen_image_1_alt = $ambrygen_attributes['image1Alt'] ?? '';
$ambrygen_web_groups = $ambrygen_attributes['webGroups'] ?? array();
$ambrygen_print_groups = $ambrygen_attributes['printGroups'] ?? array();
$ambrygen_image_2_id = absint( $ambrygen_attributes['image2Id'] ?? 0 );
$ambrygen_image_2_url = $ambrygen_attributes['image2Url'] ?? '';
$ambrygen_image_2_alt = $ambrygen_attributes['image2Alt'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';

if ( ! is_array( $ambrygen_web_groups ) ) {
	$ambrygen_web_groups = array();
}

if ( ! is_array( $ambrygen_print_groups ) ) {
	$ambrygen_print_groups = array();
}

$ambrygen_heading_tag = in_array(
	$ambrygen_heading_tag,
	array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ),
	true
) ? $ambrygen_heading_tag : 'h2';

$ambrygen_wrapper_attributes_array = array(
	'class' => 'logo-section',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_wrapper_attributes_array
);
?>

<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>
	<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_heading ) ) ) : ?>
		<div class="logo-section__header">
			<<?php echo esc_attr( $ambrygen_heading_tag ); ?> class="logo-section__title heading-3 mb-0 js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_heading ); ?>
			</<?php echo esc_attr( $ambrygen_heading_tag ); ?>>
		</div>
	<?php endif; ?>

	<div class="is-style-gl-s50" aria-hidden="true"></div>

	<div class="logo-section__top">
		<div class="logo-section__logo js-gsap-fade">
			<?php if ( $ambrygen_image_1_id ) : ?>
				<?php
				echo wp_kses_post(
					Helper::image_with_placeholder(
						$ambrygen_image_1_id,
						'full',
						array(
							'loading' => 'lazy',
							'alt'     => $ambrygen_image_1_alt,
						)
					)
				);
				?>
			<?php elseif ( '' !== $ambrygen_image_1_url ) : ?>
				<img src="<?php echo esc_url( $ambrygen_image_1_url ); ?>" alt="<?php echo esc_attr( $ambrygen_image_1_alt ); ?>" loading="lazy" />
			<?php endif; ?>
		</div>

		<div class="logo-section__downloads">
			<div class="logo-section__downloads-group js-gsap-fade">
				<div class="logo-section__downloads-title subtitle2-sbold">
					<?php esc_html_e( 'Group For Web', 'ambrygen-web' ); ?>
				</div>
				<div class="logo-section__downloads-list">
					<?php foreach ( $ambrygen_web_groups as $ambrygen_item ) : ?>
						<?php
						$ambrygen_group_name = $ambrygen_item['groupName'] ?? '';
						$ambrygen_link_name  = $ambrygen_item['linkName'] ?? '';
						$ambrygen_file_url   = $ambrygen_item['fileUrl'] ?? '';
						?>
						<?php if ( $ambrygen_group_name || $ambrygen_link_name || $ambrygen_file_url ) : ?>
							<div class="logo-section__downloads-item with-icon">
								<?php if ( $ambrygen_group_name ) : ?>
									<div class="subtitle2-sbold">
										<?php echo esc_html( $ambrygen_group_name ); ?>
									</div>
								<?php endif; ?>
								<?php if ( $ambrygen_file_url && $ambrygen_link_name ) : ?>
									<a class="logo-section__downloads-link text-small" href="<?php echo esc_url( $ambrygen_file_url ); ?>" download>
										<?php echo esc_html( $ambrygen_link_name ); ?>
									</a>
								<?php elseif ( $ambrygen_link_name ) : ?>
									<span class="logo-section__downloads-link text-small">
										<?php echo esc_html( $ambrygen_link_name ); ?>
									</span>
								<?php endif; ?>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="logo-section__downloads-group js-gsap-fade">
				<div class="logo-section__downloads-title subtitle2-sbold">
					<?php esc_html_e( 'Group For Print', 'ambrygen-web' ); ?>
				</div>
				<div class="logo-section__downloads-list">
					<?php foreach ( $ambrygen_print_groups as $ambrygen_item ) : ?>
						<?php
						$ambrygen_group_name = $ambrygen_item['groupName'] ?? '';
						$ambrygen_link_name  = $ambrygen_item['linkName'] ?? '';
						$ambrygen_file_url   = $ambrygen_item['fileUrl'] ?? '';
						?>
						<?php if ( $ambrygen_group_name || $ambrygen_link_name || $ambrygen_file_url ) : ?>
							<div class="logo-section__downloads-item with-icon">
								<?php if ( $ambrygen_group_name ) : ?>
									<div class="subtitle2-sbold">
										<?php echo esc_html( $ambrygen_group_name ); ?>
									</div>
								<?php endif; ?>
								<?php if ( $ambrygen_file_url && $ambrygen_link_name ) : ?>
									<a class="logo-section__downloads-link text-small" href="<?php echo esc_url( $ambrygen_file_url ); ?>" download>
										<?php echo esc_html( $ambrygen_link_name ); ?>
									</a>
								<?php elseif ( $ambrygen_link_name ) : ?>
									<span class="logo-section__downloads-link text-small">
										<?php echo esc_html( $ambrygen_link_name ); ?>
									</span>
								<?php endif; ?>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</div>

	<div class="logo-section__divider" aria-hidden="true"></div>

	<div class="logo-section__bottom">
		<div class="logo-section__left">
			<?php if ( $ambrygen_image_2_id ) : ?>
				<?php
				echo wp_kses_post(
					Helper::image_with_placeholder(
						$ambrygen_image_2_id,
						'full',
						array(
							'loading' => 'lazy',
							'alt'     => $ambrygen_image_2_alt,
						)
					)
				);
				?>
			<?php elseif ( '' !== $ambrygen_image_2_url ) : ?>
				<img src="<?php echo esc_url( $ambrygen_image_2_url ); ?>" alt="<?php echo esc_attr( $ambrygen_image_2_alt ); ?>" loading="lazy" />
			<?php endif; ?>
		</div>

		<div class="logo-section__right">
			<div class="logo-section__right-content">
				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_description ) ) ) : ?>
					<div class="logo-section__right-content__section subtitle2 js-gsap-fade">
						<?php echo wp_kses_post( $ambrygen_description ); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
