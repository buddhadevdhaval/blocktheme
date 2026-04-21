<?php
	/**
	 * Render: Newsletter Form Block
	 *
	 * @param array    $attributes The block attributes.
	 * @param string   $content    The block content.
	 * @param WP_Block $block      The block instance.
	 *
	 * @package ambrygen
	 */

	defined( 'ABSPATH' ) || exit;

	use Ambrygen\Theme\Core\Helper;

	/**
	 * Block attributes passed to the block render callback.
	 *
	 * @var array<string, mixed> $ambrygen_attributes
	 */
	$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
	/**
	 * Serialized inner block content.
	 *
	 * @var string $ambrygen_content
	 */
	$ambrygen_content = $content ?? '';

	// Text content.
	$ambrygen_block_id      = $ambrygen_attributes['blockId'] ?? '';
	$ambrygen_is_top_aligned = ! empty( $ambrygen_attributes['isTopAligned'] );
	$ambrygen_eyebrow       = $ambrygen_attributes['eyebrow'] ?? '';
	$ambrygen_heading       = $ambrygen_attributes['heading'] ?? '';
	$ambrygen_heading_tag   = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
	$ambrygen_description   = $ambrygen_attributes['description'] ?? '';
	$ambrygen_phone         = isset( $ambrygen_attributes['phoneNumber'] ) ? wp_strip_all_tags( (string) $ambrygen_attributes['phoneNumber'] ) : '';
	$ambrygen_email         = isset( $ambrygen_attributes['emailAddress'] ) ? sanitize_email( (string) $ambrygen_attributes['emailAddress'] ) : '';
	$ambrygen_phone_href    = preg_replace( '/[^0-9+]/', '', $ambrygen_phone );
	$ambrygen_cta           = isset( $ambrygen_attributes['cta'] ) && is_array( $ambrygen_attributes['cta'] ) ? $ambrygen_attributes['cta'] : array();
	$ambrygen_button_text   = isset( $ambrygen_attributes['buttonText'] ) ? wp_strip_all_tags( (string) $ambrygen_attributes['buttonText'] ) : '';
	$ambrygen_button_url    = isset( $ambrygen_attributes['buttonUrl'] ) ? esc_url_raw( (string) $ambrygen_attributes['buttonUrl'] ) : '';
	$ambrygen_button_text   = isset( $ambrygen_cta['text'] ) && '' !== trim( (string) $ambrygen_cta['text'] )
		? wp_strip_all_tags( (string) $ambrygen_cta['text'] )
		: $ambrygen_button_text;
	$ambrygen_button_url    = isset( $ambrygen_cta['url'] ) && '' !== trim( (string) $ambrygen_cta['url'] )
		? esc_url_raw( (string) $ambrygen_cta['url'] )
		: $ambrygen_button_url;
	$ambrygen_button_target = isset( $ambrygen_cta['target'] ) ? sanitize_text_field( (string) $ambrygen_cta['target'] ) : '';
	$ambrygen_button_rel    = isset( $ambrygen_cta['rel'] ) ? sanitize_text_field( (string) $ambrygen_cta['rel'] ) : '';
	if ( '_blank' === $ambrygen_button_target ) {
		$ambrygen_button_rel = trim( $ambrygen_button_rel . ' noopener noreferrer' );
	}

	// Main image handling.
	$ambrygen_image_id  = absint( $ambrygen_attributes['imageId'] ?? 0 );
	$ambrygen_image_url = isset( $ambrygen_attributes['image'] ) ? esc_url_raw( (string) $ambrygen_attributes['image'] ) : '';
	$ambrygen_image_alt = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( (string) $ambrygen_attributes['imageAlt'] ) : '';

	// Overlay images.
	$ambrygen_overlay_top_id    = absint( $ambrygen_attributes['overlayTopImageId'] ?? 0 );
	$ambrygen_overlay_bottom_id = absint( $ambrygen_attributes['overlayBottomImageId'] ?? 0 );

	$ambrygen_overlay_top_url      = isset( $ambrygen_attributes['overlayTopImage'] ) ? esc_url_raw( (string) $ambrygen_attributes['overlayTopImage'] ) : '';
	$ambrygen_overlay_bottom_url   = isset( $ambrygen_attributes['overlayBottomImage'] ) ? esc_url_raw( (string) $ambrygen_attributes['overlayBottomImage'] ) : '';
	$ambrygen_background_image_id  = absint( $ambrygen_attributes['backgroundImageId'] ?? 0 );
	$ambrygen_background_image_url = isset( $ambrygen_attributes['backgroundImage'] ) ? esc_url_raw( (string) $ambrygen_attributes['backgroundImage'] ) : '';
	$ambrygen_background_image_alt = isset( $ambrygen_attributes['backgroundImageAlt'] ) ? sanitize_text_field( (string) $ambrygen_attributes['backgroundImageAlt'] ) : '';
	$ambrygen_heading_id          = wp_unique_id( 'ambrygen-newsletter-heading-' );
	$ambrygen_phone_icon_src      = get_theme_file_uri( 'assets/src/images/phone-icon.svg' );
	$ambrygen_mail_icon_src       = get_theme_file_uri( 'assets/src/images/mail-icon.svg' );

	$ambrygen_wrapper_args = array(
		'class' => 'newsletter newsletter-signup' . ( $ambrygen_is_top_aligned ? ' is-top-aligned' : '' ),
		'role'  => 'region',
	);

	if ( $ambrygen_block_id ) {
		$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
	}

	if ( $ambrygen_heading ) {
		$ambrygen_wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
	} else {
		$ambrygen_wrapper_args['aria-label'] = __( 'Newsletter Form', 'ambrygen-web' );
	}

	$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
	?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_background_image_id || $ambrygen_background_image_url ) : ?>
		<div class="block-bg-image">
			<?php
			echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
				$ambrygen_background_image_id,
				$ambrygen_background_image_url,
				'medium',
				array(
					'alt' => $ambrygen_background_image_alt,
				)
			);
			?>
		</div>
	<?php endif; ?>

	<!-- Image Section -->
	<div class="newsletter__image-block">

		<?php
									// Main image or placeholder.
			echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
				$ambrygen_image_id,
				$ambrygen_image_url,
				'large',
				array(
					'class'   => 'newsletter__img js-gsap-fade',
					'loading' => 'lazy',
					'alt'     => $ambrygen_image_alt,
				),
				true
			);
			?>

		<!-- Top overlay -->
		<?php if ( $ambrygen_overlay_top_id || $ambrygen_overlay_top_url ) : ?>
			<div class="newsletter__image-block__overlay newsletter__image-block__overlay-top js-gsap-fade" aria-hidden="true">
				<?php
				echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
					$ambrygen_overlay_top_id,
					$ambrygen_overlay_top_url,
					'full',
					array(
						'class'   => 'overlay__img',
						'loading' => 'lazy',
						'alt'     => '',
					)
				);
				?>
			</div>
		<?php endif; ?>

		<!-- Bottom overlay -->
		<?php if ( $ambrygen_overlay_bottom_id || $ambrygen_overlay_bottom_url ) : ?>
			<div class="newsletter__image-block__overlay newsletter__image-block__overlay-bottom js-gsap-fade" aria-hidden="true">
				<?php
				echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
					$ambrygen_overlay_bottom_id,
					$ambrygen_overlay_bottom_url,
					'full',
					array(
						'class'    => 'overlay__img',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => '',
					)
				);
				?>
			</div>
		<?php endif; ?>

	</div>

	<!-- Content Section -->
	<div class="newsletter__content-block js-gsap-fade">

		<?php if ( $ambrygen_eyebrow ) : ?>
			<div class="newsletter__content-block__eyebrow-text hero-kicker">
				<?php echo wp_kses_post( $ambrygen_eyebrow ); ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_heading ) : ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
				id="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
				class="newsletter__content-block__heading heading-3 mb-0"
			>
				<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
				?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_description ) : ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
			<div class="newsletter__content-block__description-text text-medium block-description">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_phone || $ambrygen_email ) : ?>
			<div class="is-style-gl-s36" aria-hidden="true"></div>
			<div class="newsletter__info-listing">
				<?php if ( ! empty( $ambrygen_phone ) && ! empty( $ambrygen_phone_href ) ) : ?>
					<div class="newsletter__info-listing__item">
						<div class="newsletter__info-listing__item__icon" aria-hidden="true">
							<img src="<?php echo esc_url( $ambrygen_phone_icon_src ); ?>" alt="" />
						</div>
						<div class="newsletter__info-listing__item__text text-medium">
							<a href="<?php echo esc_url( 'tel:' . $ambrygen_phone_href ); ?>"><?php echo esc_html( $ambrygen_phone ); ?></a>
						</div>
					</div>
				<?php endif; ?>
				<?php if ( ! empty( $ambrygen_email ) ) : ?>
					<div class="newsletter__info-listing__item">
						<div class="newsletter__info-listing__item__icon" aria-hidden="true">
							<img src="<?php echo esc_url( $ambrygen_mail_icon_src ); ?>" alt="" />
						</div>
						<div class="newsletter__info-listing__item__text text-medium">
							<a href="<?php echo esc_url( 'mailto:' . $ambrygen_email ); ?>"><?php echo esc_html( $ambrygen_email ); ?></a>
						</div>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_button_text ) ) : ?>
			<div class="is-style-gl-s36" aria-hidden="true"></div>
			<div class="newsletter__block__button-wrapper">
				<a
					class="site-btn is-style-site-secondary-btn"
					href="<?php echo esc_url( ! empty( $ambrygen_button_url ) ? $ambrygen_button_url : '#' ); ?>"
					role="button"
					aria-label="<?php echo esc_attr( $ambrygen_button_text ); ?>"
					<?php if ( '_blank' === $ambrygen_button_target ) : ?>
						target="_blank"
					<?php endif; ?>
					<?php if ( ! empty( $ambrygen_button_rel ) ) : ?>
						rel="<?php echo esc_attr( $ambrygen_button_rel ); ?>"
					<?php endif; ?>
				>
					<?php echo esc_html( $ambrygen_button_text ); ?>
				</a>
			</div>
		<?php endif; ?>


		<?php if ( $ambrygen_content ) : ?>
		<div class="newsletter-form-placeholder">
			<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php endif; ?>
	</div>
</div>
