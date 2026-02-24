<?php
/**
 * FAQ Accordion Render
 *
 * @package AmbryGen
 */
use Ambrygen\Theme\Core\Helper;
// Prefix all variables
$ambrygen_attributes = $attributes ?? array();

$ambrygen_image_url  = $ambrygen_attributes['imageUrl'] ?? '';
$ambrygen_image_id   = $ambrygen_attributes['imageId'] ?? 0;
$ambrygen_image_alt  = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_faqs       = $ambrygen_attributes['faqs'] ?? array();
$ambrygen_title  = $ambrygen_attributes['title'] ?? '';
$ambrygen_heading   = $attributes['headingTag'] ?? 'h5';


// Default alt if not provided
if ( ! $ambrygen_image_alt ) {
	$ambrygen_image_alt = __( 'FAQ illustration', 'ambrygen-web' );
}

// Generate srcset and sizes if image ID is provided
$ambrygen_srcset = '';
$ambrygen_sizes  = '';
if ( $ambrygen_image_id ) {
	$ambrygen_srcset = wp_get_attachment_image_srcset( $ambrygen_image_id );
	$ambrygen_sizes  = wp_get_attachment_image_sizes( $ambrygen_image_id );
}
?>

<div class="alongside-faq">
	<div class="alongside-faq__row">

			<div class="alongside-faq__col alongside-faq__col--left">
				<div class="alongside-faq__media">
					<?php 
						echo Helper::image_with_placeholder (
							$ambrygen_image_id,
								'full',
							array(
								'loading' => 'lazy',
								'alt'     => $ambrygen_title
									? wp_strip_all_tags( $ambrygen_title )
									: '',
							)
						);
					?>
				</div>
			</div>


		<div class="alongside-faq__col alongside-faq__col--right">
			<div class="alongside-faq__content">


				<?php if ( $ambrygen_title ) : ?>
			<<?php echo esc_html( $ambrygen_heading ); ?> id="faq-heading"  class="heading-4 alongside-faq__title mb-0">
				<?php 
						echo wp_kses(
								$ambrygen_title,
								Helper::allowed_heading_html()
							);
					 ?>
			</<?php echo esc_html( $ambrygen_heading ); ?>>
		<?php endif; ?>


				<div class="is-style-gl-s64"></div>

				<?php if ( ! empty( $ambrygen_faqs ) ) : ?>
					<div class="faq">
						<?php foreach ( $ambrygen_faqs as $ambrygen_faq ) : ?>
							<details class="faq__item">
								<summary class="faq__header text-lg-medium">
									<span class="faq__question">
										<?php echo esc_html( $ambrygen_faq['question'] ?? '' ); ?>
									</span>
									<span class="faq__icon"></span>
								</summary>

								<div class="faq__answer text-md-regular">
									<?php echo wp_kses_post( wpautop( $ambrygen_faq['answer'] ?? '' ) ); ?>
								</div>
							</details>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>

			</div>
		</div>

	</div>
</div>
