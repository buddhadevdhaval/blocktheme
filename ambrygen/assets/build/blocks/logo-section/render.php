<?php
/**
 * Render: Logo Section Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes     = $attributes ?? array();
$ambrygen_section        = $ambrygen_attributes['sectionTitle'] ?? '';
$ambrygen_section_tag    = $ambrygen_attributes['sectionTitleTag'] ?? 'h2';
$ambrygen_logo_id        = absint( $ambrygen_attributes['logoImageId'] ?? 0 );
$ambrygen_logo_alt       = $ambrygen_attributes['logoImageAlt'] ?? '';
$ambrygen_downloads      = $ambrygen_attributes['downloads'] ?? array();
$ambrygen_left_items     = $ambrygen_attributes['leftItems'] ?? array();
$ambrygen_right_title    = $ambrygen_attributes['rightTitle'] ?? '';
$ambrygen_right_text     = $ambrygen_attributes['rightContent'] ?? '';
$ambrygen_right_sections = $ambrygen_attributes['rightSections'] ?? array();

if ( ! is_array( $ambrygen_downloads ) ) {
	$ambrygen_downloads = array();
}

if ( ! is_array( $ambrygen_left_items ) ) {
	$ambrygen_left_items = array();
}

if ( ! is_array( $ambrygen_right_sections ) ) {
	$ambrygen_right_sections = array();
}

$ambrygen_downloads = array_values(
	array_filter(
		$ambrygen_downloads,
		static function ( $item ) {
			return ! empty( $item['fileUrl'] );
		}
	)
);

$ambrygen_downloads_web = array_values(
	array_filter(
		$ambrygen_downloads,
		static function ( $item ) {
			return ( $item['group'] ?? '' ) === 'web';
		}
	)
);

$ambrygen_downloads_print = array_values(
	array_filter(
		$ambrygen_downloads,
		static function ( $item ) {
			return ( $item['group'] ?? '' ) === 'print';
		}
	)
);

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'logo-section',
	)
);

$ambrygen_allowed_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_section_tag  = in_array( $ambrygen_section_tag, $ambrygen_allowed_tags, true )
	? $ambrygen_section_tag
	: 'h2';
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_section ) : ?>
		<div class="logo-section__header">
			<<?php echo esc_attr( $ambrygen_section_tag ); ?> class="logo-section__title heading-3 mb-0">
				<?php echo esc_html( $ambrygen_section ); ?>
			</<?php echo esc_attr( $ambrygen_section_tag ); ?>>
		</div>
	<?php endif; ?>
	<div class="is-style-gl-s50" aria-hidden="true"></div>
	<div class="logo-section__top">
		<div class="logo-section__logo">
			<?php
			echo wp_kses_post(
				Helper::image_with_placeholder(
					$ambrygen_logo_id,
					'full',
					array(
						'loading' => 'lazy',
						'alt'     => $ambrygen_logo_alt,
					)
				)
			);
			?>
		</div>

		<div class="logo-section__downloads">
			<div class="logo-section__downloads-group">
				<div class="logo-section__downloads-title subtitle2-sbold">
					<?php esc_html_e( 'For Web', 'ambrygen-web' ); ?>
				</div>
				<div class="logo-section__downloads-list">
					<?php foreach ( $ambrygen_downloads_web as $item ) : ?>
						<?php
						$file_url = $item['fileUrl'] ?? '';
						$label    = $item['label'] ?? '';
						?>
						<?php if ( $file_url ) : ?>
							<div class="logo-section__downloads-item with-icon">
								<a
									class="logo-section__downloads-link text-small"
									href="<?php echo esc_url( $file_url ); ?>"
									download
								>
									<?php echo esc_html( $label ); ?>
								</a>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="logo-section__downloads-group">
				<div class="logo-section__downloads-title subtitle2-sbold">
					<?php esc_html_e( 'For Print', 'ambrygen-web' ); ?>
				</div>
				<div class="logo-section__downloads-list">
					<?php foreach ( $ambrygen_downloads_print as $item ) : ?>
						<?php
						$file_url = $item['fileUrl'] ?? '';
						$label    = $item['label'] ?? '';
						?>
						<?php if ( $file_url ) : ?>
							<div class="logo-section__downloads-item with-icon">
								<a
									class="logo-section__downloads-link text-small"
									href="<?php echo esc_url( $file_url ); ?>"
									download
								>
									<?php echo esc_html( $label ); ?>
								</a>
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
			<?php foreach ( $ambrygen_left_items as $item ) : ?>
				<?php
				$item_title       = $item['title'] ?? '';
				$item_description = $item['description'] ?? '';
				$item_image_id    = absint( $item['imageId'] ?? 0 );
				$item_image_alt   = $item['imageAlt'] ?? '';
				$secondary_id     = absint( $item['secondaryImageId'] ?? 0 );
				$secondary_url    = $item['secondaryImageUrl'] ?? '';
				$secondary_alt    = $item['secondaryImageAlt'] ?? '';
				?>
				<div class="logo-section__guideline-item">
					<?php if ( $item_title ) : ?>
						<h4 class="logo-section__guideline-title heading-6 mb-0">
							<?php echo esc_html( $item_title ); ?>
						</h4>
					<?php endif; ?>
					<div class="logo-section__guideline-images">
						<?php
						echo wp_kses_post(
							Helper::image_with_placeholder(
								$item_image_id,
								'full',
								array(
									'loading' => 'lazy',
									'alt'     => $item_image_alt,
								)
							)
						);
						?>

						<?php
						if ( $secondary_id ) {
							echo wp_kses_post(
								Helper::image_with_placeholder(
									$secondary_id,
									'full',
									array(
										'loading' => 'lazy',
										'alt'     => $secondary_alt,
									)
								)
							);
						} elseif ( $secondary_url ) {
							?>
							<img
								src="<?php echo esc_url( $secondary_url ); ?>"
								alt="<?php echo esc_attr( $secondary_alt ); ?>"
								loading="lazy"
							/>
							<?php
						}
						?>
					</div>

					<?php if ( $item_description ) : ?>
						<p class="logo-section__guideline-description">
							<?php echo wp_kses_post( $item_description ); ?>
						</p>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="logo-section__right">
			<div class="logo-section__right-content">
				<?php if ( ! empty( $ambrygen_right_sections ) ) : ?>
					<?php foreach ( $ambrygen_right_sections as $section ) : ?>
						<?php
						$section_title   = $section['title'] ?? '';
						$section_content = $section['content'] ?? '';
						$section_list    = $section['listItems'] ?? array();
						?>
						<div class="logo-section__right-content__section subtitle2">
							<?php if ( $section_title ) : ?>
								<div class="logo-section__right-content__section-title subtitle2-sbold">
									<?php echo wp_kses_post( $section_title ); ?>
								</div>
							<?php endif; ?>
							<?php if ( $section_content ) : ?>
								<?php echo wp_kses_post( $section_content ); ?>
							<?php endif; ?>
							<?php if ( ! empty( $section_list ) && is_array( $section_list ) ) : ?>
								<ul class="logo-section__right-content__section-list">
									<?php foreach ( $section_list as $list_item ) : ?>
										<?php if ( $list_item ) : ?>
											<li><?php echo wp_kses_post( $list_item ); ?></li>
										<?php endif; ?>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				<?php elseif ( $ambrygen_right_title || $ambrygen_right_text ) : ?>
					<div class="logo-section__right-content__section subtitle2">
						<?php if ( $ambrygen_right_title ) : ?>
							<div class="logo-section__right-content__section-title subtitle2-sbold">
								<?php echo wp_kses_post( $ambrygen_right_title ); ?>
							</div>
						<?php endif; ?>
						<?php if ( $ambrygen_right_text ) : ?>
							<?php echo wp_kses_post( $ambrygen_right_text ); ?>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
