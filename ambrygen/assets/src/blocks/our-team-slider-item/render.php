<?php
$attributes = $attributes ?? [];
$post_id = $attributes['postId'] ?? 0;
if (!$post_id) {
    return; // nothing to render
}

$post = get_post($post_id);
if (!$post) {
    return;
}

$image = get_the_post_thumbnail_url($post->ID, 'full');
if ( ! $image ) {
	$image = '/wp-content/themes/ambrygen/assets/src/images/our-team/out-team.png';
}
$designation = get_post_meta($post->ID, 'designation', true);
?>

<div class="swiper-slide">
    <div class="our-leadership__card">
        <div class="our-leadership__image-wrapper">
            <?php if ($image) : ?>
                <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($post->post_title); ?>" class="our-leadership__image">
            <?php else : ?>
                <div class="our-leadership__image-placeholder">No Image</div>
            <?php endif; ?>
        </div>
        <div class="our-leadership__info">
            <div class="our-leadership__name subtitle1-sbold">
                <?php echo esc_html($post->post_title); ?>
                <div class="our-leadership__link" aria-label="Profile link"></div>
            </div>
            <span class="our-leadership__role subtitle2"><?php echo esc_html($designation); ?></span>
        </div>
    </div>
</div>
