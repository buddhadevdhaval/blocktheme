<?php
$wrapper_attributes = get_block_wrapper_attributes([]);
$heading = $attributes['heading'] ?? '';
$heading_tag = $attributes['headingTag'] ?? 'h2';
$description = $attributes['description'] ?? '';
$ambrygen_content = $content ?? '';
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="careers-highlight__header block__rowflex">
        <?php if ( $heading ) : ?>
            <<?php echo esc_attr( $heading_tag ); ?> class="careers-highlight__title block__rowflex--heading-title heading-4 mb-0">
                <?php echo esc_html( $heading ); ?>
            </<?php echo esc_attr( $heading_tag ); ?>>
        <?php endif; ?>

        <?php if ( $description ) : ?>
            <div class="careers-highlight__intro block__rowflex--block-content subtitle1-reg">
                <?php echo esc_html( $description ); ?>
            </div>
        <?php endif; ?>
    </div>

    <div class="additional-link__cards">
        <?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
    </div>
</div>
