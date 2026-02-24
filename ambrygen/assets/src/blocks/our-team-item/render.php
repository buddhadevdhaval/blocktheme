<?php

use Ambrygen\Theme\Core\Helper;

$post_id = $attributes['postId'] ?? 0;
if ( ! $post_id ) {
	return;
}

$post = get_post( $post_id );
if ( ! $post ) {
	return;
}

$name = get_the_title( $post_id );
$designation = get_post_meta( $post_id, 'designation', true );

$image_id = get_post_thumbnail_id( $post_id );


?>

<div class="our-team__card">
	<div class="our-team__image-wrapper">
	
		<?php 
		echo Helper::image_with_placeholder (
					$image_id,
					'medium',
					array(
						'loading' => 'lazy',
						'class'=>"our-team__image",
						'alt'     => $name
							? wp_strip_all_tags( $name )
							: '',
					)
				);
		?>
	</div>

	<div class="our-team__info">
		<div class="our-team__name subtitle1-sbold">
			<?php echo esc_html( $name ); ?>
			<div class="our-team__link" aria-label="Profile link"></div>
		</div>

		<?php if ( $designation ) : ?>
			<div class="our-team__role body1">
				<?php echo esc_html( $designation ); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
