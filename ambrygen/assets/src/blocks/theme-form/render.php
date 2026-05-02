<?php
/**
 * Render: Theme Form Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

// Prefix all variables with theme/plugin name.
$ambrygen_theme_form_attributes      = $attributes ?? array();
$ambrygen_theme_form_content         = $content ?? '';

$ambrygen_theme_form_block_id      = isset( $ambrygen_theme_form_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_theme_form_attributes['blockId'] ) : '';
$ambrygen_theme_form_title         = $ambrygen_theme_form_attributes['title'] ?? '';
$ambrygen_theme_form_content_text  = $ambrygen_theme_form_attributes['content'] ?? '';
$ambrygen_theme_form_heading_level = Helper::get_heading_tag( $ambrygen_theme_form_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_theme_form_mode          = isset( $ambrygen_theme_form_attributes['formMode'] ) ? sanitize_text_field( $ambrygen_theme_form_attributes['formMode'] ) : 'shortcode';
$ambrygen_theme_form_url           = isset( $ambrygen_theme_form_attributes['formUrl'] ) ? esc_url_raw( $ambrygen_theme_form_attributes['formUrl'] ) : 'https://forms.ambrygenetics.com/261105646833052';
$ambrygen_theme_form_html          = <<<'HTML'
<form class="jotform-form" action="https://forms.ambrygenetics.com/submit/261105646833052" method="post" name="form_261105646833052" id="261105646833052" accept-charset="utf-8" autocomplete="on" novalidate="true">
	<input type="hidden" name="formID" value="261105646833052">
	<input type="hidden" id="JWTContainer" value="">
	<input type="hidden" id="cardinalOrderNumber" value="">
	<input type="hidden" id="jsExecutionTracker" name="jsExecutionTracker" value="build-date-1777325564461">
	<input type="hidden" id="submitSource" name="submitSource" value="form">
	<input type="hidden" id="submitDate" name="submitDate" value="undefined">
	<input type="hidden" id="buildDate" name="buildDate" value="1777325564461">
	<input type="hidden" name="uploadServerUrl" value="https://upload.jotform.com/upload">
	<input type="hidden" name="eventObserver" value="1">
	<div role="main" class="form-all">
		<ul class="form-section page-section" role="presentation">
			<li class="form-line" data-type="control_text" id="id_13">
				<div id="cid_13" class="form-input-wide" data-layout="full">
					<div id="text_13" class="form-html" data-component="text" tabindex="-1">
						<p>Please complete the below form if you are a&nbsp;provider,&nbsp;pharma or business development partner, or&nbsp;payor.</p>
						<p>All others, including&nbsp;patients&nbsp;who have received or are seeking genetic testing services, should reach out to the appropriate Ambry team at the email or phone number listed&nbsp;to your left.</p>
					</div>
				</div>
			</li>
			<li class="form-line jf-required" data-type="control_radio" id="id_3">
				<span class="form-label form-label-left form-label-auto" id="label_3">How can we help you?</span>
				<div id="cid_3" class="form-input jf-required" data-layout="full">
					<div class="form-single-column" role="radiogroup" aria-labelledby="label_3" data-component="radio">
						<span class="form-radio-item" style="clear:left"><span class="dragger-item"></span><input type="radio" class="form-radio validate[required]" id="input_3_0" name="q3_howCan" required value="Health Plan Contracting"><label id="label_input_3_0" for="input_3_0">Health Plan Contracting</label></span>
						<span class="form-radio-item" style="clear:left"><span class="dragger-item"></span><input type="radio" class="form-radio validate[required]" id="input_3_1" name="q3_howCan" required value="Sales Representative Contact/Questions"><label id="label_input_3_1" for="input_3_1">Sales Representative Contact/Questions</label></span>
						<span class="form-radio-item" style="clear:left"><span class="dragger-item"></span><input type="radio" class="form-radio validate[required]" id="input_3_2" name="q3_howCan" required value="Pharma Partnership or Business Development Inquiry"><label id="label_input_3_2" for="input_3_2">Pharma Partnership or Business Development Inquiry</label></span>
					</div>
				</div>
			</li>
			<li class="form-line jf-required" data-type="control_textbox" id="id_16">
				<label class="form-label form-label-left form-label-auto" id="label_16" for="input_16">First Name</label>
				<div id="cid_16" class="form-input jf-required" data-layout="half"><input type="text" id="input_16" name="q16_FirstName" data-type="input-textbox" class="form-textbox validate[required]" style="width:310px" size="310" data-component="textbox" aria-labelledby="label_16" required value=""></div>
			</li>
			<li class="form-line jf-required" data-type="control_textbox" id="id_17">
				<label class="form-label form-label-left form-label-auto" id="label_17" for="input_17">Last Name</label>
				<div id="cid_17" class="form-input jf-required" data-layout="half"><input type="text" id="input_17" name="q17_LastName" data-type="input-textbox" class="form-textbox validate[required]" style="width:310px" size="310" data-component="textbox" aria-labelledby="label_17" required value=""></div>
			</li>
			<li class="form-line jf-required" data-type="control_email" id="id_7">
				<label class="form-label form-label-left form-label-auto" id="label_7" for="input_7">Email</label>
				<div id="cid_7" class="form-input jf-required" data-layout="half"><span class="form-sub-label-container" style="vertical-align:top"><input type="email" id="input_7" name="q7_email7" class="form-textbox validate[required, Email]" autocomplete="section-input_7 email" style="width:310px" size="310" data-component="email" aria-labelledby="label_7 sublabel_input_7" required value=""><label class="form-sub-label" for="input_7" id="sublabel_input_7" style="min-height:13px">example@example.com</label></span></div>
			</li>
			<li class="form-line jf-required" data-type="control_phone" id="id_8">
				<label class="form-label form-label-left form-label-auto" id="label_8" for="input_8_full">Phone</label>
				<div id="cid_8" class="form-input jf-required" data-layout="half"><span class="form-sub-label-container" style="vertical-align:top"><input type="tel" id="input_8_full" name="q8_phone[full]" data-type="mask-number" class="mask-phone-number form-textbox validate[required, Fill Mask]" autocomplete="section-input_8 tel-national" style="width:310px" data-masked="true" placeholder="(000) 000-0000" data-component="phone" aria-label="Phone" aria-labelledby="label_8 sublabel_8_masked input_8_full_label" required value=""><label class="form-sub-label" for="input_8_full" id="sublabel_8_masked" style="min-height:13px">Please enter a valid phone number.</label></span><span id="input_8_full_label" style="border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap">Format: (000) 000-0000.</span></div>
			</li>
			<li class="form-line jf-required" data-type="control_radio" id="id_9">
				<span class="form-label form-label-left form-label-auto" id="label_9">Are you already an Ambry customer?</span>
				<div id="cid_9" class="form-input jf-required" data-layout="full">
					<div class="form-single-column" role="radiogroup" aria-labelledby="label_9" data-component="radio">
						<span class="form-radio-item" style="clear:left"><span class="dragger-item"></span><input type="radio" class="form-radio validate[required]" id="input_9_0" name="q9_areYou" required value="Yes"><label id="label_input_9_0" for="input_9_0">Yes</label></span>
						<span class="form-radio-item" style="clear:left"><span class="dragger-item"></span><input type="radio" class="form-radio validate[required]" id="input_9_1" name="q9_areYou" required value="No"><label id="label_input_9_1" for="input_9_1">No</label></span>
					</div>
				</div>
			</li>
			<li class="form-line jf-required" data-type="control_textarea" id="id_12">
				<label class="form-label form-label-left form-label-auto" id="label_12" for="input_12">Notes</label>
				<div id="cid_12" class="form-input jf-required" data-layout="full"><textarea id="input_12" class="form-textarea validate[required]" name="q12_notes" style="width:648px;height:163px" data-component="textarea" required aria-labelledby="label_12"></textarea></div>
			</li>
			<li class="form-line" data-type="control_text" id="id_14">
				<div id="cid_14" class="form-input-wide" data-layout="full">
					<div id="text_14" class="form-html" data-component="text" tabindex="-1">
						<p><span style="font-size: 10pt;"><em>Please note: Do not submit any patient health information, such as notes regarding a patient’s condition or treatment, or any other sensitive personal information, such as dates of birth, address, or social security numbers, in this form.</em></span></p>
					</div>
				</div>
			</li>
			<li class="form-line" data-type="control_button" id="id_2">
				<div id="cid_2" class="form-input-wide" data-layout="full">
					<div data-align="auto" class="form-buttons-wrapper form-buttons-auto jsTest-button-wrapperField"><button id="input_2" type="submit" class="form-submit-button form-submit-button-blue-400 submit-button jf-form-buttons jsTest-submitField legacy-submit" data-component="button" data-content="">Submit</button></div>
				</div>
			</li>
			<li style="display:none">Should be Empty: <input type="text" name="website" value=""></li>
		</ul>
	</div>
	<input type="hidden" class="simple_spc" id="simple_spc" name="simple_spc" value="261105646833052-261105646833052">
	<input type="hidden" name="enterprise_server" value="forms.ambrygenetics.com" id="enterprise_server">
	<input type="hidden" name="file_server" value="hipaa-app1" id="file_server">
	<input type="hidden" name="target_env" value="hipaa" id="target_env">
</form>
<div id="sr-status-message" class="sr-only" role="status" aria-live="polite" style="font-size:0;"></div>
HTML;
$ambrygen_theme_form_has_form_output = (
	( 'shortcode' === $ambrygen_theme_form_mode && '' !== trim( wp_strip_all_tags( $ambrygen_theme_form_content ) ) ) ||
	in_array( $ambrygen_theme_form_mode, array( 'iframe', 'html' ), true )
);

$ambrygen_theme_form_heading_id = wp_unique_id( 'theme-form-heading-' );
$ambrygen_wrapper_attributes    = get_block_wrapper_attributes(
	$ambrygen_theme_form_block_id
		? array(
			'class' => 'theme-form-block test',
			'id'    => $ambrygen_theme_form_block_id,
		)
		: array( 'class' => 'theme-form-block test' )
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Generated by get_block_wrapper_attributes(). ?>>

	<div class="heading-center center-align">
		<?php if ( $ambrygen_theme_form_title ) : ?>
			<<?php echo tag_escape( $ambrygen_theme_form_heading_level ); ?> id="<?php echo esc_attr( $ambrygen_theme_form_heading_id ); ?>" class="heading-3 block-title mb-0 js-gsap-fade">
				<?php echo wp_kses( $ambrygen_theme_form_title, Helper::allowed_heading_html() ); ?>
			</<?php echo tag_escape( $ambrygen_theme_form_heading_level ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_theme_form_content_text ) : ?>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<div class="heading-content text-md-regular js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_theme_form_content_text ); ?>
			</div>
		<?php endif; ?>
	</div>

	<?php if ( $ambrygen_theme_form_has_form_output ) : ?>
		<div class="theme-form-block__form js-gsap-fade"
			<?php if ( $ambrygen_theme_form_title ) : ?>
				aria-labelledby="<?php echo esc_attr( $ambrygen_theme_form_heading_id ); ?>"
			<?php else : ?>
				aria-label="<?php echo esc_attr__( 'Contact form', 'ambrygen-web' ); ?>"
			<?php endif; ?>
		>
			<?php if ( 'html' === $ambrygen_theme_form_mode ) : ?>
				<?php echo $ambrygen_theme_form_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Trusted admin-configured third-party HTML form markup. ?>
			<?php elseif ( 'iframe' === $ambrygen_theme_form_mode ) : ?>
				<iframe
					src="<?php echo esc_url( $ambrygen_theme_form_url ); ?>"
					title="<?php esc_attr_e( 'Website Contact Us Form', 'ambrygen-web' ); ?>"
					class="theme-form-block__iframe"
					loading="lazy"
				></iframe>
			<?php else : ?>
				<?php echo $ambrygen_theme_form_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks content is rendered by WordPress. ?>
			<?php endif; ?>
			</div>
	<?php endif; ?>

</div>
