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

// Prefix all variables.
$ambrygen_attributes = $attributes ?? array();

$ambrygen_block_id    = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_image_id    = $ambrygen_attributes['imageId'] ?? 0;
$ambrygen_faqs        = $ambrygen_attributes['faqs'] ?? array();
$ambrygen_title       = $ambrygen_attributes['title'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_variant     = $ambrygen_attributes['variant'] ?? 'default';

$ambrygen_heading          = $ambrygen_attributes['headingTag'] ?? 'h5';
$ambrygen_allowed_headings = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_heading          = in_array( $ambrygen_heading, $ambrygen_allowed_headings, true ) ? $ambrygen_heading : 'h5';

$ambrygen_heading_id = wp_unique_id( 'faq-heading-' );


// Generate wrapper attributes.
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_block_id
		? array(
			'class' => 'alongside-faq variation-' . $ambrygen_variant,
			'id'    => $ambrygen_block_id,
		)
		: array(
			'class' => 'alongside-faq variation-' . $ambrygen_variant,
		)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="alongside-faq__row">

		<?php if ( 'default' === $ambrygen_variant ) : ?>
		<div class="alongside-faq__col alongside-faq__col--left">
			<div class="alongside-faq__media">
				<?php
				echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					$ambrygen_image_id,
					'full',
					array(
						'loading' => 'lazy',
					)
				);
				?>
			</div>
		</div>
		<?php endif; ?>

		<div class="alongside-faq__col alongside-faq__col--right">
			<div class="alongside-faq__content">
				<?php if ( $ambrygen_title ) : ?>
					<<?php echo tag_escape( $ambrygen_heading ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="heading-4 alongside-faq__title mb-0">
						<?php
						echo wp_kses(
							$ambrygen_title,
							Helper::allowed_heading_html()
						);
						?>
					</<?php echo tag_escape( $ambrygen_heading ); ?>>
				<?php endif; ?>

				<?php if ( $ambrygen_description ) : ?>
					<div class="is-style-gl-s24" aria-hidden="true"></div>
					<div class="alongside-faq__description">
						<?php echo wp_kses_post( wpautop( $ambrygen_description ) ); ?>
					</div>
				<?php endif; ?>

				<div class="is-style-gl-s64" aria-hidden="true"></div>

				<?php
				if ( ! empty( $ambrygen_faqs ) ) :
					?>
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
						<?php
						foreach ( $ambrygen_faqs as $ambrygen_faq ) :
							$ambrygen_faq_answer_id = wp_unique_id( 'faq-answer-' );
							?>
							<details class="faq__item">
								<summary class="faq__header text-lg-medium" aria-expanded="false" aria-controls="<?php echo esc_attr( $ambrygen_faq_answer_id ); ?>">
									<span class="faq__question">
										<?php echo esc_html( $ambrygen_faq['question'] ?? '' ); ?>
									</span>
									<span class="faq__icon" aria-hidden="true"></span>
								</summary>

								<div id="<?php echo esc_attr( $ambrygen_faq_answer_id ); ?>" class="faq__answer text-md-regular">
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
