<?php
/**
 * Render: FAQ Accordion Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

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

$ambrygen_attributes   = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_question     = $ambrygen_attributes['question'] ?? '';
$ambrygen_sub_heading  = $ambrygen_attributes['subHeading'] ?? '';
$ambrygen_answer_id    = wp_unique_id( 'faq-answer-' );
$ambrygen_answer_html  = trim( $content );
$ambrygen_answer_text  = trim(
	wp_strip_all_tags(
		html_entity_decode( $ambrygen_answer_html, ENT_QUOTES | ENT_HTML5, 'UTF-8' )
	)
);
$ambrygen_answer_text  = trim( str_replace( "\xc2\xa0", ' ', $ambrygen_answer_text ) );
$ambrygen_variant      = $block->context['ambrygen/faqAccordionVariant'] ?? 'default';
$ambrygen_has_question = '' !== trim( wp_strip_all_tags( $ambrygen_question ) );

if ( 'without-image' !== $ambrygen_variant ) {
	$ambrygen_sub_heading = '';
}

if ( ! $ambrygen_has_question && ! $ambrygen_answer_text && '' === trim( wp_strip_all_tags( $ambrygen_sub_heading ) ) ) {
	return;
}

if ( $ambrygen_answer_text ) {
	$ambrygen_answer_processor = new WP_HTML_Tag_Processor( $ambrygen_answer_html );
	$ambrygen_has_answer_list  = false;

	while ( $ambrygen_answer_processor->next_tag() ) {
		$ambrygen_tag_name = $ambrygen_answer_processor->get_tag();

		if ( 'UL' === $ambrygen_tag_name || 'OL' === $ambrygen_tag_name ) {
			$ambrygen_answer_processor->add_class( 'faq__answer-list' );
			$ambrygen_has_answer_list = true;
		}
	}

	if ( $ambrygen_has_answer_list ) {
		$ambrygen_answer_html = $ambrygen_answer_processor->get_updated_html();
	}
}

?>

<details <?php echo get_block_wrapper_attributes( array( 'class' => 'faq__item js-gsap-fade' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<summary class="faq__header text-lg-medium" aria-expanded="false"<?php echo $ambrygen_answer_text ? ' aria-controls="' . esc_attr( $ambrygen_answer_id ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<span class="faq__question">
			<?php echo wp_kses( $ambrygen_question, $ambrygen_richtext_allowed ); ?>
		</span>

		<span class="faq__icon" aria-hidden="true"></span>

		<?php if ( $ambrygen_sub_heading ) : ?>
			<span class="faq__sub-heading body2-semibold">
				<?php // Question and subheading are intentionally rendered as plain text. ?>
				<?php echo esc_html( wp_strip_all_tags( $ambrygen_sub_heading ) ); ?>
			</span>
		<?php endif; ?>
	</summary>

	<?php if ( $ambrygen_answer_text ) : ?>
		<div id="<?php echo esc_attr( $ambrygen_answer_id ); ?>" class="faq__answer text-md-regular">
			<div class="faq__answer-content">
				<?php echo $ambrygen_answer_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		</div>
	<?php endif; ?>
</details>
