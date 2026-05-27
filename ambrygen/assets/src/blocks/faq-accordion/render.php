<?php
	/**
	 * Render: FAQ Accordion Block
	 *
	 * @param array    $attributes The block attributes.
	 * @param string   $content    The block content.
	 * @param WP_Block $block      The block instance.
	 *
	 * @package ambrygen
	 */

	defined( 'ABSPATH' ) || exit;

	use Ambrygen\Theme\Core\Helper;

	$ambrygen_richtext_allowed = array(
		'span'   => array(
			'class'              => true,
			'title'              => true,
			'data-tooltip'       => true,
			'data-tooltip-title' => true,
			'data-tooltip-b64'   => true,
			'data-tooltip-id'    => true,
		),
		'mark'   => array(
			'class' => true,
			'style' => true,
		),
		'br'     => array(),
		'strong' => array(),
		'em'     => array(),
		'a'      => array(
			'href'   => true,
			'title'  => true,
			'target' => true,
			'rel'    => true,
			'class'  => true,
		),
	);

	$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

	$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
	$ambrygen_anchor      = isset( $ambrygen_attributes['anchor'] ) ? sanitize_title( $ambrygen_attributes['anchor'] ) : '';
	$ambrygen_image_id    = absint( $ambrygen_attributes['imageId'] ?? 0 );
	$ambrygen_image_url   = isset( $ambrygen_attributes['imageUrl'] ) ? (string) $ambrygen_attributes['imageUrl'] : '';
	$ambrygen_image_alt   = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';
	$ambrygen_faqs        = is_array( $ambrygen_attributes['faqs'] ?? null ) ? $ambrygen_attributes['faqs'] : array();
	$ambrygen_title       = $ambrygen_attributes['title'] ?? '';
	$ambrygen_description = $ambrygen_attributes['description'] ?? '';
	$ambrygen_variant     = $ambrygen_attributes['variant'] ?? 'default';
	$ambrygen_section_id  = $ambrygen_anchor ? $ambrygen_anchor : $ambrygen_block_id;

	$ambrygen_allowed_variants = array( 'default', 'without-image' );
	if ( ! in_array( $ambrygen_variant, $ambrygen_allowed_variants, true ) ) {
		$ambrygen_variant = 'default';
	}

	$ambrygen_variant_class = 'variation-' . $ambrygen_variant;
	if ( 'without-image' === $ambrygen_variant ) {
		$ambrygen_variant_class .= ' variation-boxed';
	}

	$ambrygen_right_col_class = 'alongside-faq__col alongside-faq__col--right';
	if ( 'without-image' === $ambrygen_variant ) {
		$ambrygen_right_col_class .= ' full-width';
	}

	$ambrygen_hide_sub_heading = 'without-image' !== $ambrygen_variant;

	$ambrygen_heading = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h5', 'h5' );

	$ambrygen_heading_id    = $ambrygen_section_id ? $ambrygen_section_id . '-heading' : wp_unique_id( 'faq-heading-' );
	$ambrygen_inner_content = trim( $content );

	$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
		$ambrygen_section_id
		? array(
			'class' => 'block-layout alongside-faq ' . $ambrygen_variant_class,
			'id'    => $ambrygen_section_id,
		)
		: array(
			'class' => 'block-layout alongside-faq ' . $ambrygen_variant_class,
		)
	);
	?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="alongside-faq__row">

		<?php if ( 'without-image' !== $ambrygen_variant ) : ?>
		<div class="alongside-faq__col alongside-faq__col--left">
			<div class="alongside-faq__media js-gsap-fade">
				<?php
					// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
					echo Helper::image_from_source(
						$ambrygen_image_id,
						$ambrygen_image_url,
						'full',
						array(
							'alt'     => $ambrygen_image_alt,
							'loading' => 'lazy',
						),
						true
					);
					// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			</div>
		</div>
		<?php endif; ?>

		<div class="<?php echo esc_attr( $ambrygen_right_col_class ); ?>">
			<div class="alongside-faq__content">
				<?php if ( $ambrygen_title ) : ?>
					<<?php echo tag_escape( $ambrygen_heading ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="heading-4 alongside-faq__title mb-0 js-gsap-fade">
						<?php
							echo wp_kses(
								$ambrygen_title,
								Helper::allowed_heading_html()
							);
						?>
					</<?php echo tag_escape( $ambrygen_heading ); ?>>
				<?php endif; ?>

				<?php if ( $ambrygen_description ) : ?>
					<div class="is-style-gl-s12" aria-hidden="true"></div>
					<div class="block-description alongside-faq__description js-gsap-fade">
						<?php echo wp_kses_post( wpautop( $ambrygen_description ) ); ?>
					</div>
				<?php endif; ?>

				<?php if ( $ambrygen_inner_content || ! empty( $ambrygen_faqs ) ) : ?>
					<div class="is-style-gl-s64" aria-hidden="true"></div>
					<div
						class="faq"
						role="region"
						<?php
						if ( $ambrygen_title ) {
							echo 'aria-labelledby="' . esc_attr( $ambrygen_heading_id ) . '"';
						} else {
							echo 'aria-label="' . esc_attr__( 'Frequently Asked Questions', 'ambrygen-web' ) . '"';
						}
						?>
					>
						<?php if ( $ambrygen_inner_content ) : ?>
							<?php echo $ambrygen_inner_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<?php else : ?>
							<?php foreach ( $ambrygen_faqs as $ambrygen_faq ) : ?>
								<?php
								$ambrygen_faq_answer_id = wp_unique_id( 'faq-answer-' );
								$ambrygen_items         = is_array( $ambrygen_faq['items'] ?? null ) ? $ambrygen_faq['items'] : array();
								$ambrygen_sub_heading   = $ambrygen_hide_sub_heading ? '' : ( $ambrygen_faq['subHeading'] ?? '' );
								?>
							<details class="faq__item js-gsap-fade">
								<summary class="faq__header text-lg-medium" aria-expanded="false" aria-controls="<?php echo esc_attr( $ambrygen_faq_answer_id ); ?>">

										<span class="faq__question">
											<?php echo wp_kses( $ambrygen_faq['question'] ?? '', $ambrygen_richtext_allowed ); ?>
										</span>

									<span class="faq__icon" aria-hidden="true"></span>
									<?php if ( $ambrygen_sub_heading ) : ?>
											<span class="faq__sub-heading body2-semibold">
												<?php echo esc_html( wp_strip_all_tags( $ambrygen_sub_heading ) ); ?>
											</span>
										<?php endif; ?>
								</summary>

								<div id="<?php echo esc_attr( $ambrygen_faq_answer_id ); ?>" class="faq__answer text-md-regular">
									<?php if ( ! empty( $ambrygen_faq['answer'] ) ) : ?>
										<div class="faq__answer-content">
											<?php echo wp_kses_post( wpautop( $ambrygen_faq['answer'] ) ); ?>
										</div>
									<?php endif; ?>

									<?php if ( ! empty( $ambrygen_items ) ) : ?>
										<div class="is-style-gl-s20" aria-hidden="true"></div>
										<ul class="faq__answer-list">
											<?php foreach ( $ambrygen_items as $ambrygen_item ) : ?>
												<?php if ( ! empty( $ambrygen_item['text'] ) ) : ?>
													<li><?php echo wp_kses_post( $ambrygen_item['text'] ); ?></li>
												<?php endif; ?>
											<?php endforeach; ?>
										</ul>
									<?php endif; ?>
								</div>
							</details>
						<?php endforeach; ?>
						<?php endif; ?>
					</div>
				<?php endif; ?>

			</div>
		</div>

	</div>
</div>
