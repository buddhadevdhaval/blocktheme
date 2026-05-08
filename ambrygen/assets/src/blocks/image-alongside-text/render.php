<?php
	/**
	 * Render: Image Alongside Text
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

	/*
 * Block attributes.
 */
	$ambrygen_block_id             = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';
	$ambrygen_heading              = $attributes['heading'] ?? '';
	$ambrygen_eyebrow_text         = $attributes['eyebrowText'] ?? '';
	$ambrygen_subheading           = $attributes['subheading'] ?? '';
	$ambrygen_heading_tag          = $attributes['headingTag'] ?? 'h2';
	$ambrygen_content              = $attributes['content'] ?? '';
	$ambrygen_inner_content        = trim( (string) $content );
	$ambrygen_image_id             = (int) ( $attributes['imageId'] ?? 0 );
	$ambrygen_image_url            = $attributes['imageUrl'] ?? '';
	$ambrygen_image_alt            = $attributes['imageAlt'] ?? '';
	$ambrygen_background_image_id  = (int) ( $attributes['backgroundImageId'] ?? 0 );
	$ambrygen_background_image_url = $attributes['backgroundImageUrl'] ?? '';
	$ambrygen_background_image_alt = $attributes['backgroundImageAlt'] ?? '';
	$ambrygen_top_icon_id          = (int) ( $attributes['topIconId'] ?? 0 );
	$ambrygen_top_icon_url         = $attributes['topIconUrl'] ?? '';
	$ambrygen_top_icon_alt         = $attributes['topIconAlt'] ?? '';
	$ambrygen_image_position       = $attributes['imagePosition'] ?? 'right';
	$ambrygen_content_alignment    = $attributes['contentAlignment'] ?? 'left';
	$ambrygen_content_top_align    = ! empty( $attributes['contentTopAlign'] );
	$ambrygen_variation            = $attributes['variation'] ?? 'simple-content-with-image';
	$ambrygen_border_required      = $attributes['borderRequired'] ?? false;
	$ambrygen_heading_tag          = Helper::get_heading_tag( $ambrygen_heading_tag, 'h2' );
	$ambrygen_is_original_image    = $attributes['isOriginalImage'] ?? false;
	$ambrygen_has_buttons          = false;

if ( ! empty( $attributes['buttons'] ) && is_array( $attributes['buttons'] ) ) {
	foreach ( $attributes['buttons'] as $ambrygen_button ) {
		if ( ! empty( $ambrygen_button['text'] ) && ! empty( $ambrygen_button['url'] ) ) {
			$ambrygen_has_buttons = true;
			break;
		}
	}
}

	$ambrygen_original_class       = $ambrygen_is_original_image ? ' orignal-image' : '';
	$ambrygen_image_position_class =
	( 'simple-content-with-image' === $ambrygen_variation && ( 'right' === $ambrygen_image_position || 'iot-block__rtl' === $ambrygen_image_position ) ) || 'title-content-with-image' === $ambrygen_variation
	? 'iot-block__rtl'
	: '';

	/*
	* Wrapper attributes.
	*/
	$ambrygen_border_class       = ( 'title-content-with-image' === $ambrygen_variation && $ambrygen_border_required ) ? 'iot-block--border' : '';
	$ambrygen_top_align_class    = $ambrygen_content_top_align ? 'has-top-align' : '';
	
	$ambrygen_image_size_class = '';
	$ambrygen_heading_class    = 'heading-2';
	if ( 'title-content-with-image' === $ambrygen_variation ) {
		$ambrygen_image_size_class = 'size-578x564';
	} elseif ( 'profile-content-with-image' === $ambrygen_variation ) {
		$ambrygen_image_size_class = 'size-311x311';
		$ambrygen_heading_class    = 'heading-4';
	}
	$ambrygen_image_size_class   = $ambrygen_image_size_class ? sanitize_html_class( $ambrygen_image_size_class ) : '';
	$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
		$ambrygen_block_id
		? array(
			'class' => trim(
				'block-layout iot-block  ' .
				$ambrygen_image_position_class . ' ' .
				$ambrygen_border_class . ' ' .
				$ambrygen_top_align_class . ' ' .
				$ambrygen_image_size_class . ' ' .
				$ambrygen_original_class
			),
			'id'    => $ambrygen_block_id,
		)
		: array(
			'class' => trim(
				'iot-block ' .
				$ambrygen_image_position_class . ' ' .
				$ambrygen_border_class . ' ' .
				$ambrygen_top_align_class . ' ' .
				$ambrygen_image_size_class . ' ' .
				$ambrygen_original_class
			),
		)
	);
	?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns escaped attributes. ?>>
	<?php if ( $ambrygen_background_image_id || $ambrygen_background_image_url ) : ?>
		<div class="iot-block__bg-image has-right-align">
			<?php
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
			echo Helper::image_from_source(
				$ambrygen_background_image_id,
				$ambrygen_background_image_url,
				'full',
				array(
					'class'   => 'iot-block__bg-img',
					'alt'     => $ambrygen_background_image_alt,
					'loading' => 'lazy',
				)
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
	<?php endif; ?>
	<div class="iot-block__image">
		<?php
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
		echo Helper::image_from_source(
			$ambrygen_image_id,
			$ambrygen_image_url,
			'full',
			array(
				'class' => 'iot-block__img  js-gsap-fade',
				'alt'   => $ambrygen_image_alt,
			),
			true
		);
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>

	<div class="iot-block__content">
		<div class="iot-block__text">
			<?php if ( $ambrygen_top_icon_id || $ambrygen_top_icon_url ) : ?>
				<div class="iot-block__icon js-gsap-fade">
					<div class="iot-block__icon--wrapper">
						<?php
						// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
						echo Helper::image_from_source(
							$ambrygen_top_icon_id,
							$ambrygen_top_icon_url,
							'full',
							array(
								'class'   => 'iot-block__top-icon-image',
								'alt'     => $ambrygen_top_icon_alt,
								'loading' => 'lazy',
							)
						);
						// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
						?>
					</div>
				</div>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ( 'profile-content-with-image' === $ambrygen_variation && ! empty( $ambrygen_eyebrow_text ) ) : ?>
				<div class="iot-block__tagline js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_eyebrow_text ); ?>
				</div>
				<div class="is-style-gl-s8" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ( $ambrygen_heading ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="<?php echo esc_attr( $ambrygen_heading_class ); ?> block-title mb-0 js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_heading ); ?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>
			<?php if ( 'title-content-with-image' === $ambrygen_variation && $ambrygen_subheading ) : ?>
				<div class="is-style-gl-s4" aria-hidden="true"></div>
				<div class="block-sub-heading iot-block__sub-heading subtitle2-sbold js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_subheading ); ?>
				</div>
				<div class="is-style-gl-s20" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ( $ambrygen_content ) : ?>
				<?php if ( ! ( 'title-content-with-image' === $ambrygen_variation && $ambrygen_subheading ) ) : ?>
					<div class="is-style-gl-s24" aria-hidden="true"></div>
				<?php endif; ?>
				<div class="block-description body1 iot-block__description js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_content ); ?>
				</div>
			<?php endif; ?>
			<?php if ( $ambrygen_inner_content ) : ?>
				<div class="iot-block__extra-content js-gsap-fade">
					<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php endif; ?>
	</div>

<?php if ( $ambrygen_has_buttons ) : ?>
	<div class="is-style-gl-s24" aria-hidden="true"></div>
			<div class="iot-block__button two-btn-row js-gsap-fade">
				<?php foreach ( $attributes['buttons'] as $button ) : ?>
					<?php if ( ! empty( $button['text'] ) && ! empty( $button['url'] ) ) : ?>
						<?php
						$ambrygen_button_target = '_blank' === ( $button['target'] ?? '' ) ? '_blank' : '';
						$ambrygen_button_rel    = $button['rel'] ?? '';

						if ( '_blank' === $ambrygen_button_target && empty( $ambrygen_button_rel ) ) {
							$ambrygen_button_rel = 'noopener noreferrer';
						}
						?>
						<a
							class="site-btn has-right-arrow <?php echo esc_attr( $button['variant'] ?? '' ); ?>"
							href="<?php echo esc_url( $button['url'] ); ?>"
							<?php echo $ambrygen_button_target ? 'target="' . esc_attr( $ambrygen_button_target ) . '"' : ''; ?>
							<?php echo $ambrygen_button_rel ? 'rel="' . esc_attr( $ambrygen_button_rel ) . '"' : ''; ?>
						>
							<?php echo esc_html( $button['text'] ); ?>
						</a>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		</div>



</div>
